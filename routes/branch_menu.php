<?php

use App\Http\Controllers\BranchMenuController;
use Illuminate\Support\Facades\Route;

// Route::get('/{tenant_id}/{branch_id}/{table_public_token}/menu_items', [BranchMenuController::class, 'branchMenus'])->name('branch_menu.index');
Route::get('/{tenant_id}/{branch_id}/{table_public_token}/menu_items/filter', [BranchMenuController::class, 'filterMenuItems'])->name('menu_item.filter');
Route::get('/{tenant_id}/{branch_id}/{table_public_token}/menu_items/{id}', [BranchMenuController::class, 'showMenu'])->name('menu_item.show');
