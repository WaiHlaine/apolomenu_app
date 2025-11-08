<?php

namespace App\Http\Controllers;

use App\Enums\SessionKeys;
use App\Http\Requests\User\CreateUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\RoleResource;
use App\Http\Resources\UserResource;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()->with(['roles']);

        $rolesFilter = $request->query('roles');
        $searchFilter = $request->query('search');
        $sortField = $request->query('sortField');
        $sortDirection = $request->query('sortDirection');

        if ($rolesFilter && ! empty($rolesFilter)) {
            $query->whereHas('roles', function ($rolesQuery) use ($rolesFilter) {
                $rolesQuery->whereIn('id', $rolesFilter);
            });

        }

        if ($searchFilter) {
            $query->where(function ($query) use ($searchFilter) {
                $query->where('name', 'like', "%{$searchFilter}%")
                    ->orWhere('email', 'like', "%{$searchFilter}%");
            });
        }

        // Sorting
        $sortField = $request->get('sortField', 'name');
        $sortDirection = $request->get('sortDirection', 'asc');
        if (in_array($sortField, ['name', 'role', 'email', 'updated_at']) && in_array($sortDirection, ['asc', 'desc'])) {
            $query->orderBy($sortField, $sortDirection);
        }

        $users = $query
            ->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('user/index', [
            'users' => UserResource::collection($users),
            'filters' => $request->only(['search', 'roles', 'sortField', 'sortDirection']),
            'roles' => RoleResource::collection(Role::all()),
        ]);
    }

    public function store(CreateUserRequest $request)
    {
        $validated = $request->validated();
        $branch = Branch::where('id', session(SessionKeys::CURRENT_BRANCH_ID))->first();

        return DB::transaction(function () use ($request, $validated, $branch) {
            // Step 1: Create user without image
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            // Step 2: Sync roles
            $user->roles()->sync($validated['roles']);
            $branch->users()->attach($user->id);

            // Step 3: If an image was uploaded, store and update user
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('users', 'public');
                $user->update([
                    'image' => Storage::url($path),
                ]);
            }

            return redirect()
                ->route('users.index')
                ->with('success', 'User created successfully.');
        });
    }

    public function resetPasswordToDefault(int $id)
    {
        $default_password = config('app.default_password');
        $user = User::findOrFail($id);
        $user->update([
            'password' => Hash::make($default_password),
        ]);

        return back()->with('success', 'Password reset successfully.');
    }

    public function update(UpdateUserRequest $request, int $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validated();

        return DB::transaction(function () use ($request, $validated, $user) {
            // Step 1: Create user without image
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);

            $user->roles()->sync($validated['roles']);

            // delete old image
            $imagePath = $user->image;

            if ($request->hasFile('image')) {
                // remove old image if exists
                if ($user->image && Storage::disk('public')->exists($user->image)) {
                    Storage::disk('public')->delete($user->image);
                }
                $savedPath = $request->file('image')->store('users', 'public');
                $imagePath = Storage::url($savedPath);
            }

            $user->update([
                'image' => $imagePath,
            ]);

            return redirect()
                ->route('users.index')
                ->with('success', 'User updated successfully.');
        });
    }

    // destroy method
    public function destroy(int $id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return back()->with('success', 'User deleted successfully.');
    }
}
