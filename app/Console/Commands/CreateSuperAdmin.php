<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class CreateSuperAdmin extends Command
{
    protected $signature = 'user:create-super-admin';

    protected $description = 'Create a super admin user interactively';

    public function handle()
    {
        $name = $this->ask('Enter the name of the super admin');
        $email = $this->ask('Enter the email of the super admin');

        // Check if user already exists
        if (User::where('email', $email)->exists()) {
            $this->error("User with email {$email} already exists!");

            return 1;
        }

        // Ask for password securely
        $password = $this->secret('Enter the password for the super admin');
        $passwordConfirm = $this->secret('Confirm the password');

        if ($password !== $passwordConfirm) {
            $this->error('Passwords do not match!');

            return 1;
        }

        // Create the user
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
        ]);

        // Ensure super_admin role exists
        $role = Role::firstOrCreate(['name' => 'super_admin']);

        // Assign role
        $user->assignRole($role);

        $this->info("Super admin user {$name} created successfully!");

        return 0;
    }
}
