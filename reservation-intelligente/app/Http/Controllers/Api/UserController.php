<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(): JsonResponse
    {
        $users = User::all();
        return response()->json([
            'data' => $users
        ]);
    }

    /**
     * Update the user's role.
     */
    public function updateRole(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'role' => 'required|in:admin,manager,user'
        ]);

        if ($request->role === 'admin' && !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Seul un administrateur peut promouvoir au rang d\'admin.'], 403);
        }

        $user->update(['role' => $request->role]);

        return response()->json([
            'message' => 'Rôle de l’utilisateur mis à jour avec succès.',
            'data' => $user
        ]);
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user): JsonResponse
    {
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Vous ne pouvez pas supprimer votre propre compte.'], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'Utilisateur supprimé avec succès.'
        ]);
    }
}
