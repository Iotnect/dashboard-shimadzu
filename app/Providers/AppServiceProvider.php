<?php

namespace App\Providers;

use Illuminate\Auth\GenericUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Auth::viaRequest('monitor-session', function (Request $request): ?GenericUser {
            $username = config('monitor.demo_username');

            if (! $request->hasSession() || $request->session()->get('monitor.operator') !== $username) {
                return null;
            }

            return new GenericUser(['id' => $username, 'name' => $username]);
        });
    }
}
