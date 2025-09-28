<?php

use App\Http\Controllers\BranchController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('restaurant/settings/general', [BranchController::class, 'generalSetting'])->name('restaurant_setting.general');
    Route::get('restaurant/settings/location', [BranchController::class, 'locationSetting'])->name('restaurant_setting.location');
    Route::get('restaurant/settings/finance', [BranchController::class, 'financeSetting'])->name('restaurant_setting.finance');
    // post method for image upload
    Route::post('restaurant/settings/general/update', [BranchController::class, 'updateGeneral'])->name('restaurant_setting.general.update');
    Route::patch('restaurant/settings/location/update', [BranchController::class, 'updateLocation'])->name('restaurant_setting.location.update');
    Route::patch('restaurant/settings/finance/update', [BranchController::class, 'updateFinance'])->name('restaurant_setting.finance.update');
});
