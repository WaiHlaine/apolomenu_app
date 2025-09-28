<?php

use App\Http\Controllers\TableController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/table/', [TableController::class, 'index'])->name('tables.index'); // list tables
    Route::get('/table/create', [TableController::class, 'create'])->name('tables.create'); // show form
    Route::post('/table', [TableController::class, 'store'])->name('tables.store'); // create table

    Route::get('/table/{table}', [TableController::class, 'show'])->name('tables.show'); // show details
    Route::get('/table/{table}/edit', [TableController::class, 'edit'])->name('tables.edit'); // edit form
    Route::post('/table/{table}/update', [TableController::class, 'update'])->name('tables.update'); // ✅ post instead of patch
    Route::delete('/table/{table}', [TableController::class, 'destroy'])->name('tables.destroy'); // delete
    // destroy many
    Route::delete('/table', [TableController::class, 'destroyMany'])->name('tables.destroyMultiple');

    Route::get('/tables/qrcodes/download', [TableController::class, 'downloadQRCodes'])
        ->name('tables.qrcodes.download');

});
