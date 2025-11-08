<?php

use App\Http\Controllers\TableController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin/table')
    ->group(function () {
        Route::get('', [TableController::class, 'index'])->name('tables.index'); // list tables
        Route::get('create', [TableController::class, 'create'])->name('tables.create'); // show form
        Route::post('', [TableController::class, 'store'])->name('tables.store'); // create table

        Route::get('{table}', [TableController::class, 'show'])->name('tables.show'); // show details
        Route::get('{table}/edit', [TableController::class, 'edit'])->name('tables.edit'); // edit form
        Route::post('{table}/update', [TableController::class, 'update'])->name('tables.update'); // ✅ post instead of patch
        Route::delete('{table}', [TableController::class, 'destroy'])->name('tables.destroy'); // delete
        // destroy many
        Route::delete('', [TableController::class, 'destroyMany'])->name('tables.destroyMultiple');

        Route::get('/{id}/qrcode/download', [TableController::class, 'downloadSingleQRCode'])
            ->name('table.qrcode.download');

        Route::get('qrcodes/download', [TableController::class, 'downloadQRCodes'])
            ->name('tables.qrcodes.download');

    });
