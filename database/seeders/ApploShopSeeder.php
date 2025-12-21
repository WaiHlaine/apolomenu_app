<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class ApploShopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tenant = Tenant::firstOrCreate(
            ['name' => 'applo'],
            ['description' => 'Default shop tenant']
        );

        $branch = Branch::firstOrCreate(
            [
                'tenant_id' => $tenant->id,
                'name' => 'applo',
            ],
            [
                'currency' => 'USD',
                'tax' => 0,
            ]
        );

        $users = [
            [
                'name' => 'Applo Admin',
                'email' => 'admin@applo.local',
                'role' => 'admin',
            ],
            [
                'name' => 'Applo Kitchen',
                'email' => 'kitchen@applo.local',
                'role' => 'kitchen',
            ],
            [
                'name' => 'Applo Cashier',
                'email' => 'cashier@applo.local',
                'role' => 'cashier',
            ],
        ];

        foreach ($users as $data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('admin1234'),
                ]
            );

            Role::firstOrCreate([
                'name' => $data['role'],
                'guard_name' => 'web',
            ]);

            $user->assignRole($data['role']);
            $tenant->users()->syncWithoutDetaching([$user->id]);
            $branch->users()->syncWithoutDetaching([$user->id]);
        }
    }
}
