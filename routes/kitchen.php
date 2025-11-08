<?php

use App\Http\Controllers\KitchenController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin|kitchen|cashier'])->group(function () {
    Route::get('/kitchen/orders', [KitchenController::class, 'orders'])
        ->name('kitchen.orders');

    Route::post('/kitchen/orders/item/{id}/complete', [KitchenController::class, 'completeOrderItem'])
        ->name('kitchen.order_item.complete');

    Route::post('/kitchen/orders/{id}/complete', [KitchenController::class, 'completeOrder'])
        ->name('kitchen.orders.complete');

    Route::post('/kitchen/orders/item/{id}/cancel', [KitchenController::class, 'cancelOrderItem'])
        ->name('kitchen.order_item.cancel');

    Route::post('/kitchen/tables/{table}/orders/complete', [KitchenController::class, 'completeTableOrders'])
        ->name('kitchen.tables.orders.complete');
});
