<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $languages = [
            ['code' => 'en', 'name' => 'English'],
            // ['code' => 'my', 'name' => 'Myanmar (Burmese)'],
        ];

        foreach ($languages as $language) {
            Language::firstOrCreate($language);
        }

        $this->command->info('✅ Languages seeded successfully: ');
    }
}
