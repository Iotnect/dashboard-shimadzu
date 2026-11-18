# Shimadzu Monitor

Laravel monitoring dashboard with React, TypeScript and shadcn/ui. The dashboard shows one camera, an inspection checklist and an event log.

## Run locally

With PHP 8.4.1+, Composer, and Node.js 22.12+ installed, run these commands in the project folder.

```powershell
composer setup
php artisan serve
```

Open [the local login page](http://127.0.0.1:8000/login). The demo username is `Shimadzu` and the demo password is `Shimadzu123`. Laravel stores the demo session in an encrypted cookie.

Run `composer dev` for frontend hot reload.

## Add the demo replay

Save an MP4 video (H.264 recommended) at `storage/app/private/camera-01.mp4` and refresh the dashboard. The player appears automatically after sign-in. Laravel serves the video through the authenticated camera route.

Edit the example checklist and event log in `resources/js/demo-data.ts`. Both use sample data pending integration with the camera and edge inference device.

## Deploy to Vercel

1. Generate a Laravel application key locally.
   ```powershell
   composer install
   php artisan key:generate --show
   ```

2. Import the GitHub repository in Vercel with `main` as the production branch and the repository root as the root directory. Vercel detects `Dockerfile.vercel` and builds the frontend and Laravel app as a Container. [Vercel's PHP deployment guide](https://vercel.com/kb/guide/deploy-php-on-vercel-with-docker)
3. Set `APP_KEY` to the generated key in Vercel. To add a hosted demo replay, set `MONITOR_DEMO_VIDEO_URL` to a browser-accessible HTTPS MP4 URL.
4. Deploy and verify `/up`, then sign in at `/login` using the local demo credentials.

The demo runs without a database or migrations.
