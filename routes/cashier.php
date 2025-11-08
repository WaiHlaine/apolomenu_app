<?php

use App\Http\Controllers\CashierController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:cashier|admin'])
    ->prefix('/cashier')
    ->group(function () {
        Route::get('orders', [CashierController::class, 'orders'])->name('cashier.orders');
        Route::get('tables', [CashierController::class, 'tables'])->name('cashier.tables');
        Route::post('tables/{id}', [CashierController::class, 'payBill'])->name('cashier.tables.pay_bill');
        Route::get('menus', [CashierController::class, 'tables'])->name('cashier.menus');
        Route::post('menus/{id}/out-of-stock', [CashierController::class, 'updateMenuItemOutOfStock'])->name('cashier.menu_item.out_of_stock');
        Route::post('menus_item_variant/{id}/out-of-stock', [CashierController::class, 'updateMenuItemVariantOutOfStock'])->name('cashier.menu_item_variant.out_of_stock');
        Route::post('orders/item/{id}/complete', [CashierController::class, 'completeOrderItem'])->name('cashier.order_item.complete');
        Route::post('orders/item/{id}/cancel', [CashierController::class, 'cancelOrderItem'])->name('cashier.order_item.cancel');
        Route::post('notifications/{id}/read', [CashierController::class, 'readNotification'])->name('cashier.notification.read');
        Route::get('stock', [CashierController::class, 'stocks'])->name('cashier.stocks');
    });
