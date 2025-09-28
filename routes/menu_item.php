<?php

use App\Http\Controllers\MenuItemController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('menu_item', [MenuItemController::class, 'index'])->name('menu_item.index');
    Route::post('menu_item', [MenuItemController::class, 'store'])->name('menu_item.store');
    Route::delete('menu_item/{id}', [MenuItemController::class, 'destroy'])->name('menu_item.destroy');
    // used the 'post' method for update as sending form data for post method is more effiecient and easy to maint than 'patch method
    Route::post('menu_item_update/{id}', [MenuItemController::class, 'update'])->name('menu_item.update');
    Route::patch('/menu-items/{menuItem}/out-of-stock', [MenuItemController::class, 'updateOutOfStock'])
        ->name('menu-items.update-out-of-stock');

    Route::patch('/menu-item-variants/{variant}/out-of-stock', [MenuItemController::class, 'updateMenuItemOutOfStock'])
        ->name('menu-item-variants.update-out-of-stock');
});
