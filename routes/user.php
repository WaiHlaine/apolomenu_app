<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin/user')
    ->group(function () {
        Route::get('', [UserController::class, 'index'])->name('users.index');
        Route::post('', [UserController::class, 'store'])->name('users.store');
        Route::post('{id}', [UserController::class, 'update'])->name('users.update');
        Route::delete('{id}', [UserController::class, 'destroy'])->name('users.destroy');
        Route::patch('{id}/reset-password', [UserController::class, 'resetPasswordToDefault'])->name('users.reset_password');
    });
