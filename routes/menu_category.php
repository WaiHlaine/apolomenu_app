<?php

use App\Http\Controllers\MenuCategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')->group(function () {
        Route::get('menu_category', [MenuCategoryController::class, 'index'])->name('menu_category.index');
        Route::get('menu_category/create', [MenuCategoryController::class, 'create'])->name('menu_category.create');
        Route::get('menu_category/{id}', [MenuCategoryController::class, 'show'])->name('menu_category.show');
        Route::post('menu_category', [MenuCategoryController::class, 'store'])->name('menu_category.store');

        Route::post('menu_category_update/{id}', [MenuCategoryController::class, 'update'])->name('menu_category.update');
        Route::put('menu_category/toggle_availability', [MenuCategoryController::class, 'toggleAvailablility'])->name('menu_category.toggle_availability');
        Route::delete('menu_category/{id}', [MenuCategoryController::class, 'destroy'])->name('menu_category.destroy');
    });
