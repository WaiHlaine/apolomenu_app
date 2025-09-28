<?php

use App\Http\Controllers\TableRequestActionsController;
use Illuminate\Support\Facades\Route;

Route::post('/table_request_actions', [TableRequestActionsController::class, 'store'])->name('table_request_actions.store');
Route::post('{tenant_id}/{branch_id}/{table_public_token}/pay_bill', [TableRequestActionsController::class, 'payBill'])->name('table_request_actions.pay_bill');
