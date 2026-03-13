<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class BookingController extends Controller
{
    protected $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookingRequest $request): JsonResponse
    {
        try {
            // Ajout de l'ID utilisateur connecté aux données validées
            $data = $request->validated();
            $data['user_id'] = $request->user()->id;

            // Vérifier si la salle existe car elle est codée en dur dans le front pour l'instant
            $room = \App\Models\Room::find($data['room_id']);
            if (!$room) {
                return response()->json(['message' => 'La salle spécifiée n\'existe pas.'], 404);
            }

            $booking = $this->bookingService->createBooking($data);

            // Charger explicitement la relation pour la notification
            $booking->load('room');
            
            $user = $request->user();
            try {
                $user->notify(new \App\Notifications\BookingConfirmed($booking));
            } catch (\Exception $e) {
                // On log l'erreur mail mais on ne bloque pas la réponse
                \Illuminate\Support\Facades\Log::error('Erreur notification mail: ' . $e->getMessage());
            }

            return response()->json([
                'message' => 'Réservation créée avec succès.',
                'data' => $booking,
            ], 201);

        } catch (ValidationException $e) {
            // Laravel gère déjà cela automatiquement, mais on peut personnaliser si besoin
            throw $e;
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur est survenue lors de la création de la réservation.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display a listing of the user's bookings.
     */
    public function index(\Illuminate\Http\Request $request): JsonResponse
    {
        $user = $request->user();
        $query = \App\Models\Booking::with(['room', 'user']);

        // Si l'utilisateur n'est pas admin ou manager, on filtre par son ID
        $userRole = strtolower(trim($user->role ?? ''));
        if ($userRole !== 'admin' && $userRole !== 'manager') {
            $query->where('user_id', $user->id);
        }

        $bookings = $query->orderBy('start_time', 'desc')->get();

        return response()->json([
            'data' => $bookings,
        ]);
    }

    /**
     * Update the status of a booking. (Admin/Manager only)
     */
    public function updateStatus(\Illuminate\Http\Request $request, \App\Models\Booking $booking): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected'
        ]);

        $booking->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Statut de la réservation mis à jour avec succès.',
            'data' => $booking->load(['room', 'user'])
        ]);
    }

    /**
     * Update a booking. (Owner or Admin/Manager)
     */
    public function update(\Illuminate\Http\Request $request, \App\Models\Booking $booking): JsonResponse
    {
        $user = $request->user();
        $isOwner = $booking->user_id === $user->id;
        $isManager = strtolower(trim($user->role ?? '')) === 'admin' || strtolower(trim($user->role ?? '')) === 'manager';

        if (!$isOwner && !$isManager) {
            return response()->json(['message' => 'Vous n\'êtes pas autorisé à modifier cette réservation.'], 403);
        }

        $request->validate([
            'room_id' => ['required', 'exists:rooms,id'],
            'start_time' => ['required', 'date'],
            'end_time' => ['required', 'date', 'after:start_time'],
        ]);

        // Vérification des conflits via le service
        if ($this->bookingService->checkOverlap(
            $request->room_id, 
            $request->start_time, 
            $request->end_time, 
            $booking->id
        )) {
            return response()->json([
                'message' => 'Cette salle est déjà réservée sur ce créneau horaire.',
                'errors' => ['room_id' => ['Conflit d\'horaire détecté.']]
            ], 422);
        }

        $booking->update($request->only(['room_id', 'start_time', 'end_time']));

        return response()->json([
            'message' => 'Réservation mise à jour avec succès.',
            'data' => $booking->load('room')
        ]);
    }

    /**
     * Delete a booking. (Owner or Admin/Manager)
     */
    public function destroy(\Illuminate\Http\Request $request, \App\Models\Booking $booking): JsonResponse
    {
        $user = $request->user();
        $isOwner = $booking->user_id === $user->id;
        $isManager = strtolower(trim($user->role ?? '')) === 'admin' || strtolower(trim($user->role ?? '')) === 'manager';

        if (!$isOwner && !$isManager) {
            return response()->json(['message' => 'Vous n\'êtes pas autorisé à supprimer cette réservation.'], 403);
        }

        $booking->delete();

        return response()->json([
            'message' => 'Réservation supprimée avec succès.'
        ]);
    }
}
