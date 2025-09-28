<?php

namespace App\Http\Controllers;

use App\Http\Resources\BranchResource;
use App\Http\Resources\MenuItemResource;
use App\Http\Resources\TableResource;
use App\Models\MenuItem;
use App\Models\Table;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderCartViewController extends Controller
{
    public function cart(Request $request, int $tenant_id, int $branch_id, string $token)
    {
        $queryItems = $request->query('items');

        $table = Table::with('branch')->where([
            'branch_id' => $branch_id,
            'public_token' => $token,
        ])
            ->whereHas('branch', function ($query) use ($tenant_id) {
                $query->where('tenant_id', $tenant_id);
            }
            )
            ->firstOrFail();

        $items = MenuItem::with(['translations', 'variants', 'badges'])->whereIn('id', $queryItems)->get();

        return Inertia::render('order_cart/index', [
            'table' => TableResource::make($table),
            'branch' => BranchResource::make($table->branch),
            'items' => MenuItemResource::collection($items),
        ]);
    }
}
