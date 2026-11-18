<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SessionController extends Controller
{
    public function create(): View
    {
        $username = old('username');

        return view('monitor', [
            'title' => 'Sign in',
            'page' => [
                'kind' => 'login',
                'loginUrl' => route('login'),
                'username' => is_string($username) ? $username : '',
                'errors' => session('errors')?->getBag('default')->getMessages() ?? [],
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'username' => ['required', 'string', 'max:100'],
            'password' => ['required', 'string', 'max:255'],
        ]);
        if (! hash_equals(config('monitor.demo_username'), $credentials['username'])
            || ! hash_equals(config('monitor.demo_password'), $credentials['password'])) {
            throw ValidationException::withMessages([
                'credentials' => 'The username or password is incorrect.',
            ]);
        }

        $request->session()->regenerate();
        $request->session()->put('monitor.operator', $credentials['username']);
        $request->session()->forget('url.intended');

        return to_route('dashboard');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return to_route('login');
    }
}
