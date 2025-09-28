<?php

use App\Http\Controllers\BranchSelectionController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/select-branch', [BranchSelectionController::class, 'show'])->name('branch.select');
    Route::post('/select-branch', [BranchSelectionController::class, 'store'])->name('branch.store');
});
