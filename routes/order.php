<?php

use App\Http\Controllers\BranchMenuController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

Route::get('/{tenant_id}/{branch_id}/{table_public_token}/menus', [BranchMenuController::class, 'branchMenus'])->name('branch_menu.index');
Route::post('/order', [OrderController::class, 'store'])->name('order.store');
Route::get('/order/{order_number}', [OrderController::class, 'show'])->name('order.show');
Route::get('/{tenant_id}/{branch_id}/{table_public_token}/orders', [OrderController::class, 'getActiveOrdersByTable'])->name('order.active');
Route::post('/cancel-order/{order_id}', [OrderController::class, 'cancel'])->name('order.cancel');
