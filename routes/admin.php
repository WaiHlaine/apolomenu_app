<?php

use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/admin/orders', [AdminController::class, 'orders'])->name('admin.orders')->middleware('role:admin');
});
