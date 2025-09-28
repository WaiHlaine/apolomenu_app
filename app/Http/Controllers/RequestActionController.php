<?php

// app/Http/Controllers/RequestActionController.php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRequestActionRequest;
use App\Http\Requests\UpdateRequestActionRequest;
use App\Http\Resources\RequestActionResource;
use App\Models\RequestAction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RequestActionController extends Controller
{
    public function index(Request $request)
    {
        $query = RequestAction::query();
        $search = $request->query('search');

        if ($search) {
            $query->where('name', 'ILIKE', "%$search%");
        }

        $actions = RequestActionResource::collection($query->paginate(10));

        return Inertia::render('request_action/index', [
            'actions' => $actions,
        ]);
    }

    public function store(StoreRequestActionRequest $request)
    {
        RequestAction::create($request->validated());

        return back()->with('success', 'Request action created successfully.');
    }

    public function show(RequestAction $requestAction)
    {
        return new RequestActionResource($requestAction);
    }

    public function update(UpdateRequestActionRequest $request, RequestAction $requestAction)
    {
        $requestAction->update($request->validated());

        return back()->with('success', 'Request action updated successfully.');
    }

    public function destroy(RequestAction $requestAction)
    {
        $requestAction->delete();

        return back()->with('success', 'Request action deleted successfully.');
    }
}
