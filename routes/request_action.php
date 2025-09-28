<?php

use App\Http\Controllers\RequestActionController;
use Illuminate\Support\Facades\Route; // routes/web.php or api.php

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/request-action', [RequestActionController::class, 'index'])->name('request-actions.index');
    Route::post('/request-action', [RequestActionController::class, 'store'])->name('request-actions.store');
    Route::get('/request-action/{requestAction}', [RequestActionController::class, 'show'])->name('request-actions.show');
    Route::post('/request-action/{requestAction}/update', [RequestActionController::class, 'update'])->name('request-actions.update'); // POST update
    Route::delete('/request-action/{requestAction}', [RequestActionController::class, 'destroy'])->name('request-actions.destroy');
});
