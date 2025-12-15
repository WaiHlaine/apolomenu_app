<?php

namespace App\Http\Controllers;

use App\Enums\OrderItemStatus;
use App\Enums\OrderStatus;
use App\Enums\SessionKeys;
use App\Events\TableCompletedEvent;
use App\Http\Resources\BranchResource;
use App\Http\Resources\MenuCategoryResource;
use App\Http\Resources\MenuItemResource;
use App\Http\Resources\OrderResource;
use App\Http\Resources\RequestActionTableRequestResource;
use App\Http\Resources\TableResource;
use App\Models\Branch;
use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Models\MenuItemVariant;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\RequestActionTableRequest;
use App\Models\Table;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CashierController extends Controller
{
    public function tables(Request $request)
    {
        $branchId = session(SessionKeys::CURRENT_BRANCH_ID);
        $branch = Branch::findOrFail($branchId);
        $tableId = $request->query('table');
        $categoryId = $request->query('category_id');
        $showNotifications = $request->query('notifications', false);
        $tables = Table::get()
            ->map(function ($table) {
                // Check if the table has an ongoing order
                $hasActiveOrder = Order::where('table_id', $table->id)
                    ->whereNull('paid_at')
                    ->exists();

                // Determine status
                if ($hasActiveOrder) {
                    $table->status = 'not_available';
                } else {
                    $table->status = 'available';
                }

                return $table;
            });

        $currentActiveTableOrders = $tableId ? Order::where('table_id', $tableId)
            ->whereNull('paid_at')
            ->get() : [];
        $isTableOrdersInProgress = $tableId ? Order::where('table_id', $tableId)
            ->whereNull('paid_at')
            ->whereNotIn('status', [OrderStatus::Completed->value])
            ->exists()
             : false;
        $tableOrders = $tableId ? Order::with([
            'items',
            'items.variant',
            'items.menuItem',
            'items.menuItem.translations',
        ])->where('table_id', $tableId)
            ->whereNull('paid_at')
            ->whereIn('id', $currentActiveTableOrders->pluck('id'))
            ->get() : [];

        return Inertia::render('cashier/tables', [
            'tableOrders' => OrderResource::collection($tableOrders),
            'table' => $tableId ? TableResource::make(Table::findOrFail($tableId)) : null,
            'isTableOrdersInProgress' => $isTableOrdersInProgress,
            'tables' => TableResource::collection($tables),
            'notifications' => Inertia::optional(fn () => $showNotifications == 'true' ?
            RequestActionTableRequestResource::collection(RequestActionTableRequest::with([
                'table',
                'requestAction',
            ])->where('status', 'pending')->get()) : []),
            'branch' => BranchResource::make($branch),
            'filters' => [
                'notifications' => $showNotifications,
                'table' => $tableId,
                'categoryId' => $categoryId,
            ],

            'categories' => MenuCategoryResource::collection(MenuCategory::orderBy('position', 'asc')->get()),
            'menuItems' => $categoryId ? MenuItemResource::collection(MenuItem::with([
                'translations',
                'variants',
                'badges',
            ])->where('category_id', $categoryId)->get()) : [],

            'category' => $categoryId ? MenuCategoryResource::make(MenuCategory::findOrFail($categoryId)) : null,
        ]);
    }

    public function menus(Request $request)
    {
        $branchId = session(SessionKeys::CURRENT_BRANCH_ID);
        $branch = Branch::findOrFail($branchId);
        $categoryId = $request->query('category_id');
        $category = $categoryId ? MenuCategory::findOrFail($categoryId) : MenuCategory::orderBy('position', 'asc')->first();
        $menuItems = MenuItem::with(['translations', 'variants', 'badges'])->where('category_id', $category->id)->get();
        $categories = MenuCategory::orderBy('position', 'asc')->get();
        $showNotifications = $request->query('notifications', false);

        return Inertia::render('cashier/menus', [
            'categories' => MenuCategoryResource::collection($categories),
            'category' => $category ? MenuCategoryResource::make($category) : null,
            'menuItems' => MenuItemResource::collection($menuItems),
            'branch' => BranchResource::make($branch),
            'tables' => TableResource::collection(Table::all()),
            'notifications' => Inertia::optional(fn () => $showNotifications == 'true' ?
            RequestActionTableRequestResource::collection(RequestActionTableRequest::with([
                'table',
                'requestAction',
            ])->where('status', 'pending')->get()) : []),
            'filters' => [
                'notifications' => $showNotifications,
            ],
        ]);

    }

    public function orders(Request $request)
    {

        $sortField = $request->query('sortField', 'created_at'); // default field
        $sortDirection = $request->query('sortDirection', 'desc'); // default direction
        $search = $request->query('search');
        $orderNumber = $request->query('order_number');
        $date = $request->query('date');
        $status = $request->query('status');
        $type = $request->query('type');
        $perPage = $request->query('per_page', 15);
        $showNotifications = $request->query('notifications', false);

        // Whitelist sortable fields to prevent SQL injection
        $sortableFields = [
            'order_number',
            'status',
            'order_type',
            'subtotal',
            'total',
            'created_at',
            'quantity',
        ];

        if (! in_array($sortField, $sortableFields)) {
            $sortField = 'created_at';
        }

        $sortDirection = strtolower($sortDirection) === 'asc' ? 'asc' : 'desc';

        $query = Order::with(['user', 'table'])
            ->when($search, function ($q) use ($search) {
                $q->where(function ($query) use ($search) {
                    $query->where('order_number', 'like', "%{$search}%")
                        ->orWhere('notes', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($uq) use ($search) {
                            $uq->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('branch', function ($bq) use ($search) {
                            $bq->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($date, fn ($q) => $q->whereDate('created_at', $date))
            ->when($status, fn ($q) => $q->whereIn('status', $status))
            ->when($type, fn ($q) => $q->where('order_type', $type))
            ->orderBy($sortField, $sortDirection);

        $orders = $query->paginate($perPage)->withQueryString();
        $branch = Branch::where('id', session(SessionKeys::CURRENT_BRANCH_ID))->first();

        return Inertia::render('admin/orders', [
            'orders' => OrderResource::collection($orders),
            'branch' => BranchResource::make($branch),
            'filters' => [
                'search' => $search,
                'date' => $date,
                'status' => $status,
                'type' => $type,
                'sortField' => $sortField,
                'sortDirection' => $sortDirection,
                'notifications' => $showNotifications,
            ],
            'order' => Inertia::optional(fn () => $orderNumber
                    ? OrderResource::make(
                        Order::with([
                            'user',
                            'table',
                            'items.menuItem.translations',
                            'items.variant',
                        ])->where('order_number', $orderNumber)->firstOrFail()
                    )
                    : null
            ),
            'notifications' => Inertia::optional(fn () => $showNotifications == 'true' ? RequestActionTableRequestResource::collection(RequestActionTableRequest::with(['table', 'requestAction'])->where('status', 'pending')->get()) : []),
        ]);
    }

    public function stocks(Request $request)
    {
        $branchId = session(SessionKeys::CURRENT_BRANCH_ID);
        $branch = Branch::findOrFail($branchId);
        $categoryId = $request->query('category_id');
        $categories = MenuCategory::orderBy('position', 'asc')->get();
        $menuItems = MenuItem::with([
            'translations',
            'variants',
            'badges',
        ])->where('category_id', $categoryId)->get();
        $showNotifications = $request->query('notifications', false);

        return Inertia::render('cashier/stock', [
            'categories' => MenuCategoryResource::collection($categories),
            'category' => $categoryId ? MenuCategoryResource::make(MenuCategory::findOrFail($categoryId)) : null,
            'menuItems' => MenuItemResource::collection($menuItems),

            'notifications' => Inertia::optional(fn () => $showNotifications == 'true' ?
            RequestActionTableRequestResource::collection(RequestActionTableRequest::with([
                'table',
                'requestAction',
            ])->where('status', 'pending')->get()) : []),
            'filters' => [
                'notifications' => $showNotifications,
                'categoryId' => $categoryId,
            ],
            'branch' => BranchResource::make($branch),

        ]);
    }

    public function updateMenuItemOutOfStock(string $id)
    {
        $menuItem = MenuItem::findOrFail($id);
        $menuItem->update([
            'out_of_stock' => ! $menuItem->out_of_stock,
        ]);

        return redirect()->back()->with('success', 'Menu item out of stock status updated successfully.');
    }

    public function updateMenuItemVariantOutOfStock(string $id)
    {
        $variant = MenuItemVariant::findOrFail($id);

        // Toggle variant's out_of_stock status
        $variant->update([
            'out_of_stock' => ! $variant->out_of_stock,
        ]);

        // Check if all variants of the same menu item are out of stock
        $menuItem = $variant->menuItem; // assuming relationship: MenuItemVariant belongsTo MenuItem

        $hasStock = $menuItem->variants()->where('out_of_stock', false)->exists();

        // If no variants in stock, mark menu item as out of stock
        $menuItem->update([
            'out_of_stock' => ! $hasStock,
        ]);

        return redirect()->back()->with('success', 'Menu item out of stock status updated successfully.');
    }

    public function completeOrderItem(string $id)
    {
        $orderItem = OrderItem::findOrFail($id);
        $orderItem->update([
            'status' => OrderItemStatus::Ready->value,
        ]);

        return redirect()->route('kitchen.orders')->with('success', 'Order item completed successfully.');
    }

    public function cancelOrderItem(string $id)
    {
        $orderItem = OrderItem::findOrFail($id);
        $orderItem->update([
            'status' => OrderStatus::Cancelled->value,
        ]);

        return redirect()->route('kitchen.orders')->with('success', 'Order item cancelled successfully.');
    }

    public function readNotification(string $id)
    {
        $request = RequestActionTableRequest::findOrFail($id);
        $request->update([
            'status' => 'seen',
        ]);

        return redirect()->back();
    }

    public function payBill(string $id)
    {

        DB::transaction(function () use ($id) {
            // Get all orders for this table
            $table = Table::findOrFail($id);
            $orders = Order::where('table_id', $id)->get();

            if ($orders->isEmpty()) {
                return;
            }

            // Update all order statuses to completed
            Order::whereIn('id', $orders->pluck('id'))
                ->update([
                    'status' => OrderStatus::Completed->value,
                    'paid_at' => now(),
                ]);

            // Update all related order items to completed
            OrderItem::whereIn('order_id', $orders->pluck('id'))
                ->update([
                    'status' => OrderItemStatus::Served->value,
                ]);

            TableCompletedEvent::dispatch($table);
        });

        return back()->with('success', 'Bill has been paid successfully.', [
            'table' => null,
        ]);
    }
}
