<?php

use App\Http\Controllers\RequestActionController;
use Illuminate\Support\Facades\Route; // routes/web.php or api.php

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin/request-action')->group(function () {
        Route::get('', [RequestActionController::class, 'index'])->name('request-actions.index');
        Route::post('', [RequestActionController::class, 'store'])->name('request-actions.store');
        Route::get('{requestAction}', [RequestActionController::class, 'show'])->name('request-actions.show');
        Route::post('{requestAction}/update', [RequestActionController::class, 'update'])->name('request-actions.update'); // POST update
        Route::delete('{requestAction}', [RequestActionController::class, 'destroy'])->name('request-actions.destroy');
    });
