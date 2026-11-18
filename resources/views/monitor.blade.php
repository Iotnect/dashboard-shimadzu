<!DOCTYPE html>
<html lang="en" data-theme="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ $title }} | Shimadzu Monitor</title>
        <link rel="icon" href="{{ asset('favicon.ico') }}" sizes="any">
        <script>
            try {
                if (localStorage.getItem('shimadzu-theme') === 'light') {
                    document.documentElement.dataset.theme = 'light';
                }
            } catch {}
        </script>
        @viteReactRefresh
        @vite('resources/js/app.tsx')
    </head>
    <body>
        <div id="app"></div>
        <script id="monitor-data" type="application/json">{!! Illuminate\Support\Js::encode([
            ...$page,
            'logoUrl' => asset('images/shimadzu-logo.png'),
            'csrfToken' => csrf_token(),
        ]) !!}</script>
    </body>
</html>
