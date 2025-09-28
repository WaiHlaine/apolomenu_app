<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/menu_item.php';
require __DIR__.'/menu_category.php';
require __DIR__.'/branch_select.php';
require __DIR__.'/restaurant.php';
require __DIR__.'/user.php';
require __DIR__.'/console.php';
require __DIR__.'/table.php';
require __DIR__.'/request_action.php';
require __DIR__.'/branch_menu.php';
require __DIR__.'/kitchen.php';
require __DIR__.'/order_cart.php';
require __DIR__.'/order.php';
require __DIR__.'/table_request_action.php';
