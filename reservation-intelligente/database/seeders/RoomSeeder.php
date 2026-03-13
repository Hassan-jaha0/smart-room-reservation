<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Room::create([
            'name' => 'Salle A (Conférence)',
            'capacity' => 20,
            'equipment' => ['projecteur', 'tableau blanc'],
        ]);

        Room::create([
            'name' => 'Salle B (Réunion)',
            'capacity' => 8,
            'equipment' => ['écran TV'],
        ]);

        Room::create([
            'name' => 'Salle C (Bureau)',
            'capacity' => 4,
            'equipment' => [],
        ]);
    }
}
