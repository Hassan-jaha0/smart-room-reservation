<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = Room::all();
        $users = User::where('role', 'user')->get();
        $manager = User::where('role', 'manager')->first();

        if ($rooms->isEmpty() || $users->isEmpty()) {
            return;
        }

        // Future bookings
        Booking::create([
            'room_id' => $rooms[0]->id,
            'user_id' => $users[0]->id,
            'start_time' => Carbon::tomorrow()->setHour(10)->setMinute(0),
            'end_time' => Carbon::tomorrow()->setHour(12)->setMinute(0),
            'status' => 'approved',
        ]);

        Booking::create([
            'room_id' => $rooms[1]->id,
            'user_id' => $users[0]->id,
            'start_time' => Carbon::tomorrow()->addDay()->setHour(14)->setMinute(0),
            'end_time' => Carbon::tomorrow()->addDay()->setHour(16)->setMinute(0),
            'status' => 'pending',
        ]);

        // Past bookings for stats
        Booking::create([
            'room_id' => $rooms[2]->id,
            'user_id' => $users[0]->id,
            'start_time' => Carbon::yesterday()->setHour(9)->setMinute(0),
            'end_time' => Carbon::yesterday()->setHour(11)->setMinute(0),
            'status' => 'approved',
            'created_at' => Carbon::yesterday(),
        ]);
        
        if ($manager) {
            Booking::create([
                'room_id' => $rooms[0]->id,
                'user_id' => $manager->id,
                'start_time' => Carbon::today()->setHour(16)->setMinute(0),
                'end_time' => Carbon::today()->setHour(17)->setMinute(0),
                'status' => 'approved',
            ]);
        }
    }
}
