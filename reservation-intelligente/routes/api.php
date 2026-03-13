<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [\App\Http\Controllers\Api\PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [\App\Http\Controllers\Api\PasswordResetController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/password', [AuthController::class, 'updatePassword']);

    Route::get('/notifications', function (Request $request) {
        return response()->json([
            'data' => $request->user()->notifications()->latest()->take(10)->get()
        ]);
    });

    // Gestion des salles (Admin/Manager)
    Route::apiResource('/rooms', \App\Http\Controllers\Api\RoomController::class)->middleware('role:admin,manager');

    // Gestion des utilisateurs (Admin/Manager)
    Route::get('/users', [\App\Http\Controllers\Api\UserController::class, 'index'])->middleware('role:admin,manager');
    Route::put('/users/{user}/role', [\App\Http\Controllers\Api\UserController::class, 'updateRole'])->middleware('role:admin,manager');
    Route::delete('/users/{user}', [\App\Http\Controllers\Api\UserController::class, 'destroy'])->middleware('role:admin,manager');

    // Seul un admin/manager peut voir toutes les réservations
    Route::get('/admin/bookings', [BookingController::class, 'index'])->middleware('role:admin,manager');
    Route::put('/admin/bookings/{booking}/status', [BookingController::class, 'updateStatus'])->middleware('role:admin,manager');
    Route::get('/admin/stats', [\App\Http\Controllers\Api\StatsController::class, 'index'])->middleware('role:admin,manager');
    
    // Un utilisateur peut voir ses propres réservations
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::put('/bookings/{booking}', [BookingController::class, 'update']);
    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy']);
});

// Seul un utilisateur connecté peut créer une réservation
Route::post('/bookings', [BookingController::class, 'store'])->middleware('auth:sanctum');
