<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'username' => 'user1',
            'firstname' => 'Lucas',
            'lastname' => 'Williams',
            'password' => Hash::make('password')
        ]);
        User::factory()->create([
            'username' => 'user2',
            'firstname' => 'John',
            'lastname' => 'Doe',
            'password' => Hash::make('password')
        ]);
        Category::factory(10)->create();
        $this->call(VideoSeeder::class);
        $this->call(CategorySeeder::class);
    }
}
