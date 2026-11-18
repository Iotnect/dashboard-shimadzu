<?php

use App\Http\Controllers\DemoCameraController;
use App\Http\Controllers\SessionController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard');

Route::middleware('guest')->group(function () {
    Route::get('/login', [SessionController::class, 'create'])->name('login');
    Route::post('/login', [SessionController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DemoCameraController::class, 'dashboard'])->name('dashboard');
    Route::get('/camera/demo', [DemoCameraController::class, 'show'])->name('camera.demo');
    Route::post('/logout', [SessionController::class, 'destroy'])->name('logout');
});
