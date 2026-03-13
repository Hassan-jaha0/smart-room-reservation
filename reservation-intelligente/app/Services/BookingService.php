<?php

namespace App\Services;

use App\Models\Booking;
use Illuminate\Validation\ValidationException;

class BookingService
{
    /**
     * Vérifie s'il y a un conflit de créneau pour une salle donnée.
     */
    public function checkOverlap(int $roomId, string $startTime, string $endTime, ?int $excludeBookingId = null): bool
    {
        $query = Booking::where('room_id', $roomId)
            ->where('status', '!=', 'rejected')
            ->where(function ($q) use ($startTime, $endTime) {
                $q->where('start_time', '<', $endTime)
                  ->where('end_time', '>', $startTime);
            });

        if ($excludeBookingId) {
            $query->where('id', '!=', $excludeBookingId);
        }

        return $query->exists();
    }

    /**
     * Crée une nouvelle réservation après vérification des conflits.
     *
     * @param array $data
     * @return Booking
     * @throws ValidationException
     */
    public function createBooking(array $data): Booking
    {
        if ($this->checkOverlap($data['room_id'], $data['start_time'], $data['end_time'])) {
            throw ValidationException::withMessages([
                'room_id' => ['Cette salle est déjà réservée sur ce créneau horaire.']
            ]);
        }

        // 2. Création de la réservation
        return Booking::create([
            'room_id' => $data['room_id'],
            'user_id' => $data['user_id'],
            'start_time' => $data['start_time'],
            'end_time' => $data['end_time'],
            'status' => 'approved',
        ]);
    }
}
