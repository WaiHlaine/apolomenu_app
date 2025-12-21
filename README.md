# ApoloMenu App

## Overview
ApoloMenu App is a Laravel + React (Inertia) web application.

## Main Language / Stack
- Backend: PHP 8.2 (Laravel 12)
- Frontend: React 19 (Inertia.js) + Vite + Tailwind CSS
- Database: PostgreSQL (default)

## Local Development
1) Install dependencies

```bash
composer install
npm install
```

2) Configure environment

```bash
cp .env.example .env
```

Update the DB settings in `.env`.

3) Generate app key and run migrations/seeders

```bash
php artisan key:generate
php artisan migrate
php artisan db:seed
```

4) Start development servers

```bash
composer run dev
```

Or run separately:

```bash
php artisan serve --host=0.0.0.0 --port=8000
npm run dev
```

5) Storage symlink (for QR/public files)

```bash
php artisan storage:link
```

App URL:
`http://127.0.0.1:8000/login`

## Production Setup
1) Configure `.env` for production (APP_ENV=production, APP_DEBUG=false, DB settings, APP_URL).
2) Install dependencies

```bash
composer install --no-dev --optimize-autoloader
npm install
```

3) Build frontend assets

```bash
npm run build
```

4) Cache and migrate

```bash
php artisan key:generate
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force
```

5) Ensure storage symlink and queue worker (if used)

```bash
php artisan storage:link
php artisan queue:work --tries=1
```
