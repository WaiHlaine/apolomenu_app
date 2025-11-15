<?php

namespace App\Http\Controllers\Auth;

use App\Enums\SessionKeys;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = $request->user();

        // ✅ Super Admin bypasses branch logic
        if ($user->hasRole('super_admin')) {
            return redirect()->intended(route('pulse', absolute: false));
        }

        $branches = $user->branches;

        // ✅ Handle branch logic for other users
        if ($branches->count() === 1) {
            session([SessionKeys::CURRENT_BRANCH_ID => $branches->first()->id]);
        } elseif ($branches->count() > 1) {
            return redirect()->route('branch.select');
        } else {
            // No branches at all
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->withErrors([
                'email' => 'You are not assigned to any branch.',
            ]);
        }

        // ✅ Role-based redirection
        if ($user->hasRole('admin')) {
            return redirect()->intended(route('menu_category.index', absolute: false));
        }

        if ($user->hasRole('cashier')) {
            return redirect()->intended(route('cashier.menus', absolute: false));
        }

        if ($user->hasRole('kitchen')) {
            return redirect()->intended(route('kitchen.orders', absolute: false));
        }

        // ✅ Default redirect (optional)
        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
