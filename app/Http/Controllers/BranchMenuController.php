<?php

namespace App\Http\Controllers;

use App\Enums\SessionKeys;
use App\Http\Resources\BranchResource;
use App\Http\Resources\MenuCategoryResource;
use App\Http\Resources\MenuItemResource;
use App\Http\Resources\RequestActionResource;
use App\Http\Resources\TableResource;
use App\Models\Branch;
use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\RequestAction;
use App\Models\Table;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BranchMenuController extends Controller
{
    public function branchMenus(string $tenant_id, string $branch_id, string $table_public_token, Request $request)
    {
        $branch = Branch::findOrFail($branch_id);
        $list_view = $request->query('list_view') ?? 'list'; // list or grid
        $table = Table::with('branch')
            ->where([
                'public_token' => $table_public_token,
                'branch_id' => $branch_id,
            ])
            ->whereHas('branch', function ($q) use ($tenant_id) {
                $q->where('tenant_id', $tenant_id);
            })
            ->firstOrFail();

        session([
            SessionKeys::CURRENT_BRANCH_ID => $branch_id,
            SessionKeys::CURRENT_TABLE_ID => $table->id,
        ]);

        // ✅ count of active orders for this table
        $activeOrderCount = Order::where('branch_id', $branch_id)
            ->where('table_id', $table->id)
            ->whereNull('paid_at') // adjust based on your statuses
            ->count();

        $categoryId = $request->query('category_id');
        $categories = MenuCategory::all();
        $category = $categoryId ? MenuCategory::findOrFail($categoryId) : MenuCategory::first();

        $menuItems = $category ? MenuItem::with(['translations', 'variants', 'badges'])
            ->where('category_id', $category?->id)
            ->get() : collect();

        return Inertia::render('branch/menu/index', [
            'categories' => MenuCategoryResource::collection($categories),
            'category' => $category ? MenuCategoryResource::make($category) : null,
            'list_view' => $list_view, // ✅ pass to frontend
            'menuItems' => MenuItemResource::collection($menuItems),
            'table' => TableResource::make($table),
            'branch' => BranchResource::make($branch),
            'activeOrderCount' => $activeOrderCount, // ✅ pass to frontend
            // deferred requestActions
            'requestActions' => Inertia::defer(fn () => RequestActionResource::collection(RequestAction::all())),
        ]);
    }

    public function showMenu(string $tenant_id, string $branch_id, string $table_public_token, string $id)
    {
        $menuItem = MenuItem::with(['translations', 'variants', 'badges', 'category.branch'])->findOrFail($id);
        $table = Table::where('public_token', $table_public_token)->firstOrFail();

        return Inertia::render('branch/menu/show', [
            'menuItem' => MenuItemResource::make($menuItem),
            'branch' => BranchResource::make($menuItem->category->branch),
            'table' => TableResource::make($table),
        ]);
    }

    public function filterMenuItems(string $tenant_id, string $branch_id, string $table_public_token, Request $request)
    {
        $search = $request->query('search');
        $menuItems = $search ? MenuItem::with(['translations', 'variants', 'badges', 'category.branch'])
            ->whereHas('category', function ($query) use ($branch_id) {
                $query->where('branch_id', $branch_id);
            })
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    // search in translations (name + description)
                    $q->whereHas('translations', function ($t) use ($search) {
                        $t->where('name', 'ilike', "%{$search}%")
                            ->orWhere('description', 'ilike', "%{$search}%");
                    })
                    // optional: also search in category name
                        ->orWhereHas('category', function ($c) use ($search) {
                            $c->where('name', 'ilike', "%{$search}%")
                                ->orWhere('description', 'iike', "%{$search}%");
                        });
                });
            })
            ->get() : collect();
        $table = Table::where('public_token', $table_public_token)->firstOrFail();

        return Inertia::render('branch/menu/filter', [
            'menuItems' => MenuItemResource::collection($menuItems),
            'branch' => BranchResource::make(Branch::findOrFail($branch_id)),
            'table' => TableResource::make($table),
        ]);

    }
}
