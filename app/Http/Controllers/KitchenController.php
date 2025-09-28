<?php

namespace App\Http\Controllers;

use App\Enums\SessionKeys;
use App\Http\Resources\BranchResource;
use App\Http\Resources\OrderResource;
use App\Models\Branch;
use App\Models\Order;
use Inertia\Inertia;

class KitchenController extends Controller
{
    public function todayOrders()
    {
        $orders = Order::whereDate('created_at', '>=', today())->get();
        $branch = Branch::findOrFail(session(SessionKeys::CURRENT_BRANCH_ID));

        return Inertia::render('kitchen/orders', [
            'orders' => OrderResource::collection($orders),
            'branch' => BranchResource::make($branch),
        ]);
    }
}
