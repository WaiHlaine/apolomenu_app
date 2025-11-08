<?php

namespace App\Http\Controllers;

use App\Enums\SessionKeys;
use App\Http\Resources\BranchResource;
use App\Http\Resources\OrderResource;
use App\Models\Branch;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
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
        ]);
    }
}
