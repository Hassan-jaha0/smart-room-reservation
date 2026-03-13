<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => 'password',
            'role' => 'admin',
        ]);

        // Manager
        User::create([
            'name' => 'Manager User',
            'email' => 'manager@test.com',
            'password' => 'password',
            'role' => 'manager',
        ]);

        // User
        User::create([
            'name' => 'Simple User',
            'email' => 'user@test.com',
            'password' => 'password',
            'role' => 'user',
        ]);
    }
}
