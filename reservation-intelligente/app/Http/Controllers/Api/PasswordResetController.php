<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;

class PasswordResetController extends Controller
{
    /**
     * Envoyer un lien de réinitialisation de mot de passe.
     */
    public function sendResetLink(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);

        // Le broker s'occupe de vérifier si l'utilisateur existe et d'envoyer la notification par défaut
        // Note: La notification par défaut de Laravel utilise une URL de type /password/reset/{token}
        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Lien de réinitialisation envoyé par e-mail.'])
            : response()->json(['message' => 'Impossible d\'envoyer le lien.', 'errors' => ['email' => [__($status)]]], 422);
    }

    /**
     * Réinitialiser le mot de passe.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', PasswordRule::defaults()],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();
            }
        );

        // Mappage manuel des erreurs car les fichiers de langue peuvent manquer
        $messages = [
            Password::RESET_LINK_SENT => 'Lien de réinitialisation envoyé par e-mail.',
            Password::PASSWORD_RESET => 'Votre mot de passe a été réinitialisé !',
            Password::INVALID_USER => "Nous ne trouvons aucun utilisateur avec cette adresse e-mail.",
            Password::INVALID_TOKEN => "Ce jeton de réinitialisation de mot de passe n'est pas valide.",
            Password::RESET_THROTTLED => "Veuillez patienter avant de réessayer.",
        ];

        $message = $messages[$status] ?? 'Impossible de réinitialiser le mot de passe.';

        \Illuminate\Support\Facades\Log::info('Password reset attempt', [
            'email' => $request->email,
            'status' => $status,
            'message' => $message
        ]);

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => $message])
            : response()->json([
                'message' => $message,
                'errors' => ['email' => [$message]]
            ], 422);
    }
}
