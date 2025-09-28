<?php

use App\Http\Controllers\KitchenController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/kitchen/orders', [KitchenController::class, 'todayOrders'])->name('kitchen.orders');
});
