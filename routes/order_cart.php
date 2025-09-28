<?php

use App\Http\Controllers\OrderCartViewController;
use Illuminate\Support\Facades\Route;

Route::get('{tenant_id}/{branch_id}/{public_token}/order_cart', [OrderCartViewController::class, 'cart'])->name('order_cart.index');
