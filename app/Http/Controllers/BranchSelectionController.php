<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BranchSelectionController extends Controller
{
    public function show(Request $request)
    {
        $branches = $request->user()->branches;

        return inertia('Auth/SelectBranch', [
            'branches' => $branches,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'branch_id' => ['required', 'exists:branches,id'],
        ]);

        // Ensure branch belongs to user
        if (! $request->user()->branches->pluck('id')->contains($request->branch_id)) {
            abort(403, 'Unauthorized branch selection.');
        }

        session(['current_branch_id' => $request->branch_id]);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
