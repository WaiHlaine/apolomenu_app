<?php

namespace App\Http\Controllers;

use App\Enums\OrderItemStatus;
use App\Enums\OrderStatus;
use App\Enums\SessionKeys;
use App\Events\OrderCompletedEvent;
use App\Events\OrderItemStatusChangedEvent;
use App\Http\Resources\BranchResource;
use App\Models\Branch;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class KitchenController extends Controller
{
    public function orders(Request $request)
    {
        $order_type = $request->query('order_type');
        $show_image = $request->query('show_image', 'true');
        $show_summary = $request->query('show_summary', 'true');

        $branchId = session(SessionKeys::CURRENT_BRANCH_ID);

        $orders = Order::with([
            'items.menuItem.translations',
            'items.variant',
            'table',
            'user',
        ])
            ->where('branch_id', $branchId)
            ->when($order_type, fn ($q) => $q->where('order_type', $order_type))
            ->whereNotIn('status', ['completed', 'cancelled', 'ready'])
            ->orderBy('created_at', 'desc')
            ->get();

        $branch = Branch::findOrFail($branchId);

        // --- Helpers ---
        $getMenuItemName = function ($menuItem) {
            if (! $menuItem) {
                return null;
            }

            if (method_exists($menuItem, 'getTranslation')) {
                return $menuItem->getTranslation('name', app()->getLocale());
            }

            if (isset($menuItem->translations) && $menuItem->translations->count()) {
                return $menuItem->translations->first()->name;
            }

            return $menuItem->name ?? null;
        };

        $getImageUrl = function ($menuItem) {
            if (! $menuItem || ! $menuItem->image_url) {
                return null;
            }
            $path = ltrim(str_replace('/storage/', '', $menuItem->image_url), '/');

            return \Illuminate\Support\Facades\Storage::url($path);
        };

        // --- Summary grouped by menu_item_id + variant_id ---
        $summary = $orders->flatMap->items
            ->filter(fn ($item) => $item->menuItem)
            ->groupBy(fn ($item) => $item->menu_item_id.'-'.($item->variant_id ?? '0'))
            ->map(fn ($group) => [
                'menu_item_id' => $group->first()->menu_item_id,
                'variant_id' => $group->first()->variant_id,
                'menu_item_name' => $getMenuItemName($group->first()->menuItem),
                'variant_name' => $group->first()->variant?->name,
                'total_quantity' => $group->sum('quantity'),
                'image' => $getImageUrl($group->first()->menuItem),
            ])
            ->values();

        // --- Tables grouped by table ---
        $tables = $orders->groupBy('table_id')->map(function ($tableOrders) use ($getMenuItemName, $getImageUrl) {
            $table = $tableOrders->first()->table;

            $items = $tableOrders->flatMap->items->map(function ($item) use ($getMenuItemName, $getImageUrl) {
                return [
                    'id' => $item->id,
                    'menu_item_id' => $item->menu_item_id,
                    'variant_id' => $item->variant_id,
                    'menu_item_name' => $getMenuItemName($item->menuItem),
                    'variant_name' => $item->variant?->name,
                    'quantity' => $item->quantity,
                    'notes' => $item->notes,
                    'image' => $getImageUrl($item->menuItem),
                    'status' => $item->status,
                ];
            })->values();

            $firstOrder = $tableOrders->first();

            return [
                'table_id' => $table->id,
                'table_name' => $table->name,
                'order_type' => $firstOrder->order_type,
                'order_id' => $firstOrder->id,
                'order_number' => $firstOrder->order_number,
                'date' => $firstOrder->created_at,
                'items' => $items,
            ];
        })->values();

        return Inertia::render('kitchen/orders', [
            'branch' => BranchResource::make($branch),
            'summary' => $summary,
            'filters' => [
                'order_type' => $order_type,
                'show_image' => $show_image,
                'show_summary' => $show_summary,
            ],
            'tables' => $tables,
        ]);
    }

    public function completeOrder(string $id)
    {
        $order = Order::with(['items', 'table'])->findOrFail($id);
        dd($order->table);

        // Update all order items to "Ready" (if not cancelled)
        $order->items()
            ->whereNotIn('status', [OrderItemStatus::Ready->value, OrderItemStatus::Cancelled->value])
            ->update([
                'status' => OrderItemStatus::Ready->value,
            ]);

        // Mark order as completed
        $order->update([
            'status' => OrderStatus::Ready->value,
        ]);

        OrderCompletedEvent::dispatch($order->table);

        return redirect()
            ->route('kitchen.orders')
            ->with([
                'success' => 'Order completed successfully.',
            ]);
    }

    public function completeOrderItem(string $id)
    {
        $orderItem = OrderItem::with(['order', 'order.table'])
            ->findOrFail($id);

        $orderItem->update([
            'status' => OrderItemStatus::Ready->value,
        ]);

        $order = $orderItem->order;

        $hasPendingItems = $order->items()
            ->whereNotIn('status', [OrderItemStatus::Ready->value, OrderItemStatus::Cancelled->value])
            ->exists();

        if (! $hasPendingItems) {
            $order->update([
                'status' => OrderStatus::Ready->value,
            ]);
            OrderCompletedEvent::dispatch($order->table);
        }

        OrderItemStatusChangedEvent::dispatch($order->table);

        return redirect()
            ->route('kitchen.orders')
            ->with('success', 'Order item completed successfully.');
    }

    public function completeTableOrders(string $tableId)
    {

        $table = Table::findOrFail($tableId);
        OrderCompletedEvent::dispatch($table);
        DB::transaction(function () use ($tableId) {
            // Get all active (non-completed, non-cancelled) orders for the table
            $orders = Order::with(['items', 'table'])
                ->where('table_id', $tableId)
                ->whereNotIn('status', [OrderStatus::Ready->value, OrderStatus::Cancelled->value])
                ->lockForUpdate()
                ->get();

            foreach ($orders as $order) {
                // Mark all non-ready and non-cancelled items as ready
                $order->items()
                    ->whereNotIn('status', [OrderItemStatus::Ready->value, OrderItemStatus::Cancelled->value])
                    ->update(['status' => OrderItemStatus::Ready->value]);

                // Update order status to completed
                $order->update(['status' => OrderStatus::Ready->value]);
            }

        });

        return redirect()
            ->route('kitchen.orders')
            ->with('success', 'All orders for the table have been completed successfully.');
    }

    public function cancelOrderItem(string $id)
    {
        $orderItem = OrderItem::findOrFail($id);
        $orderItem->update([
            'status' => OrderItemStatus::Cancelled->value,
        ]);

        return redirect()
            ->route('kitchen.orders')
            ->with('success', 'Order item cancelled successfully.');
    }
}
