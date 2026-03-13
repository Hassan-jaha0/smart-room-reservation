<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoomController extends Controller
{
    /**
     * Display a listing of the rooms.
     */
    public function index(): JsonResponse
    {
        $rooms = Room::all();
        return response()->json([
            'data' => $rooms
        ]);
    }

    /**
     * Store a newly created room in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:rooms',
            'capacity' => 'required|integer|min:1',
            'equipment' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation échouée.',
                'errors' => $validator->errors()
            ], 422);
        }

        $room = Room::create($request->all());

        return response()->json([
            'message' => 'Salle créée avec succès.',
            'data' => $room
        ], 201);
    }

    /**
     * Display the specified room.
     */
    public function show(Room $room): JsonResponse
    {
        return response()->json([
            'data' => $room
        ]);
    }

    /**
     * Update the specified room in storage.
     */
    public function update(Request $request, Room $room): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:rooms,name,' . $room->id,
            'capacity' => 'sometimes|required|integer|min:1',
            'equipment' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation échouée.',
                'errors' => $validator->errors()
            ], 422);
        }

        $room->update($request->all());

        return response()->json([
            'message' => 'Salle mise à jour avec succès.',
            'data' => $room
        ]);
    }

    /**
     * Remove the specified room from storage.
     */
    public function destroy(Room $room): JsonResponse
    {
        // On pourrait vérifier ici s'il y a des réservations actives avant de supprimer
        $room->delete();

        return response()->json([
            'message' => 'Salle supprimée avec succès.'
        ]);
    }
}
