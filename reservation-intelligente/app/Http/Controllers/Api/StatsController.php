<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function index(): JsonResponse
    {
        $stats = \Illuminate\Support\Facades\Cache::remember('admin_stats', 300, function () {
            $totalRooms = Room::count();
            $totalUsers = User::count();
            $totalBookings = Booking::count();
            $approvedBookings = Booking::where('status', 'approved')->count();

            // bookings per day (last 7 days)
            $bookingsPerDay = Booking::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
                ->groupBy('date')
                ->orderBy('date', 'desc')
                ->take(7)
                ->get();

            // popular rooms
            $popularRooms = Room::withCount('bookings')
                ->orderBy('bookings_count', 'desc')
                ->take(5)
                ->get();

            return [
                'total_rooms' => $totalRooms,
                'total_users' => $totalUsers,
                'total_bookings' => $totalBookings,
                'approved_bookings' => $approvedBookings,
                'bookings_per_day' => $bookingsPerDay,
                'popular_rooms' => $popularRooms,
            ];
        });

        return response()->json($stats);
    }
}
