<?php

namespace App\Http\Controllers;

use App\Http\Requests\RequestActionTableRequestRequest;
use App\Http\Resources\RequestActionTableRequestResource;
use App\Models\RequestAction;
use App\Models\RequestActionTableRequest;
use App\Models\Table;

class TableRequestActionsController extends Controller
{
    public function index()
    {
        return RequestActionTableRequestResource::collection(
            RequestActionTableRequest::with(['table', 'requestAction'])->latest()->get()
        );
    }

    public function store(RequestActionTableRequestRequest $request)
    {
        $table = Table::with('branch')->where('id', $request->validated('table_id'))->firstOrFail();
        RequestActionTableRequest::create($request->validated());

        return redirect()->route('branch_menu.index', [
            'tenant_id' => $table->branch->tenant_id,
            'branch_id' => $table->branch->id,
            'table_public_token' => $table->public_token,
        ])->with('success', 'Request has been made successfully.');
    }

    public function show(RequestActionTableRequest $requestActionTableRequest)
    {
        return new RequestActionTableRequestResource(
            $requestActionTableRequest->load(['table', 'requestAction'])
        );
    }

    public function update(RequestActionTableRequestRequest $request, RequestActionTableRequest $requestActionTableRequest)
    {
        $requestActionTableRequest->update($request->validated());

        return new RequestActionTableRequestResource($requestActionTableRequest->load(['table', 'requestAction']));
    }

    public function destroy(RequestActionTableRequest $requestActionTableRequest)
    {
        $requestActionTableRequest->delete();

        return response()->noContent();
    }

    public function payBill(string $tenant_id, string $branch_id, string $table_public_token)
    {
        $table = Table::where('public_token', $table_public_token)->firstOrFail();
        $requestAction = RequestAction::firstOrCreate([
            'name' => 'Pay Bill',
            'branch_id' => $branch_id,
            'icon' => 'pay_bill',
        ]);

        RequestActionTableRequest::create([
            'table_id' => $table->id,
            'request_action_id' => $requestAction->id,
            'branch_id' => $branch_id,
            'status' => 'pending',
        ]);

        return redirect()->route('branch_menu.index', [
            'tenant_id' => $tenant_id,
            'branch_id' => $branch_id,
            'table_public_token' => $table_public_token,
        ]
        )->with('success', 'Request has been made successfully.');
    }
}
