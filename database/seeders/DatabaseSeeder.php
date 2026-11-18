<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $password = config('monitor.demo_password');

        if (is_string($password) && $password !== '') {
            User::firstOrCreate(
                ['username' => 'Shimadzu'],
                [
                    'name' => 'Shimadzu',
                    'email' => 'operator@shimadzu.test',
                    'password' => $password,
                ],
            );
        }
    }
}
