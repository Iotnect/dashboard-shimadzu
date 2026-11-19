<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DemoCameraController extends Controller
{
    private const CLIP = 'app/private/camera-01.mp4';

    public function dashboard(Request $request): View
    {
        $videoUrl = is_file(public_path('demo/camera-01.mp4'))
            ? asset('demo/camera-01.mp4')
            : (config('monitor.demo_video_url')
                ?: (is_file(storage_path(self::CLIP)) ? route('camera.demo') : null));

        return view('monitor', [
            'title' => 'Dashboard',
            'page' => [
                'kind' => 'dashboard',
                'dashboardUrl' => route('dashboard'),
                'logoutUrl' => route('logout'),
                'operator' => $request->user()->name,
                'videoUrl' => $videoUrl,
            ],
        ]);
    }

    public function show(): BinaryFileResponse
    {
        $path = storage_path(self::CLIP);
        abort_unless(is_file($path), 404);

        return response()->file($path, [
            'Content-Type' => 'video/mp4',
            'Cache-Control' => 'no-store',
        ])->setPrivate();
    }
}
