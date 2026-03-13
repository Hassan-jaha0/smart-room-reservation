<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $role
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Permettre de passer les rôles soit en variadic (admin, manager) 
        // soit comme une chaîne séparée par des virgules
        if (count($roles) === 1 && str_contains($roles[0], ',')) {
            $roles = explode(',', $roles[0]);
        }

        $user = $request->user();
        $userRole = strtolower(trim($user?->role ?? ''));
        $allowedRoles = array_map(fn($r) => strtolower(trim($r)), $roles);

        if (!$user || !in_array($userRole, $allowedRoles)) {
            return response()->json([
                'message' => 'Unauthorized. Action réservée aux rôles : ' . implode(', ', $allowedRoles)
            ], 403);
        }

        return $next($request);
    }
}
