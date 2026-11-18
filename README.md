# Shimadzu Monitor

Laravel monitoring dashboard with React, TypeScript and shadcn/ui. The dashboard shows one camera, an inspection checklist and an event log.

## Run locally

With PHP 8.4.1+, Composer, and Node.js 22.12+ installed, run these commands in the project folder.

```powershell
composer setup
php artisan serve
```

Open [the local login page](http://127.0.0.1:8000/login). The demo username is `Shimadzu` and the demo password is `Shimadzu123`. The seeder reads the initial password from `MONITOR_DEMO_PASSWORD` and preserves an existing account.

Run `composer dev` for frontend hot reload.

## Add the demo replay

Save an MP4 video (H.264 recommended) at `storage/app/private/camera-01.mp4` and refresh the dashboard. The player appears automatically after sign-in. Laravel serves the video through the authenticated camera route.

Edit the example checklist and event log in `resources/js/demo-data.ts`. Both use sample data pending integration with the camera and edge inference device.

## Deploy to Vercel

1. Provision a PostgreSQL database, such as a Vercel Marketplace integration. Laravel uses it for users, sessions, and the login rate limiter.
2. Prepare the database from a machine with PHP and `pdo_pgsql`. Create a local `.env.production` with the provider's PostgreSQL connection string, including `sslmode=require`. Set the password you want for the deployed `Shimadzu` account. Keep this file local.

   ```dotenv
   APP_ENV=production
   DB_CONNECTION=pgsql
   DB_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
   MONITOR_DEMO_PASSWORD=your-deployed-account-password
   ```

   ```powershell
   composer install
   php artisan migrate --env=production --force --seed
   php artisan key:generate --env=production --show
   ```

   Save the generated key for the next step. Seeding is safe to rerun and preserves the existing password.
3. Import the GitHub repository in Vercel and choose `main` for production. Use the repository root. Vercel detects `Dockerfile.vercel` and builds the frontend and Laravel app as a Container. [Vercel's PHP deployment guide](https://vercel.com/kb/guide/deploy-php-on-vercel-with-docker)
4. Set these Vercel Production environment variables before deploying.

   | Variable | Value |
   | --- | --- |
   | `APP_KEY` | The generated Laravel key |
   | `APP_URL` | Your HTTPS production URL |
   | `DB_URL` | The same PostgreSQL connection string used for migrations |
   | `MONITOR_DEMO_VIDEO_URL` | Optional HTTPS URL of a browser-accessible demo MP4 in object storage |

5. Deploy and verify `/up`, then sign in at `/login`. For a preview deployment, use its own database and seed that database.

The deployment image uses PostgreSQL for persistent data. To change the remote demo replay, update `MONITOR_DEMO_VIDEO_URL` and redeploy.
