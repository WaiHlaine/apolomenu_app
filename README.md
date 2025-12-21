cp .env.example .env
<!-- ENV -->
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=apolomenu_app
DB_USERNAME=XXXXXXX
DB_PASSWORD=XXXXXXX
<!-- FRONTEND -->
npm install
npm run dev
<!-- BACKEND -->
php artisan key:generate
php artisan serve --host=0.0.0.0 --port=8000
<!-- Run all seeders registered in DatabaseSeeder -->
php artisan db:seed
<!-- Run a single seeder -->
php artisan db:seed --class=RoleSeeder
php artisan db:seed --class=LanguageSeeder
<!-- QR public symlink-->
php artisan storage:link

<!-- URL -->
http://127.0.0.1:8000/login
