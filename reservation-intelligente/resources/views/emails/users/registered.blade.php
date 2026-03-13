<x-mail::message>
# Bienvenue, {{ $user->name }} ! 👋

Nous sommes ravis de vous compter parmi nous sur **Smart Room**, votre plateforme intelligente de réservation de salles.

Votre compte a été créé avec succès. Vous pouvez maintenant commencer à explorer le calendrier et réserver vos espaces de travail.

<x-mail::button :url="config('app.url')">
Accéder à mon espace
</x-mail::button>

Si vous avez des questions, n'hésitez pas à contacter notre équipe support.

À très bientôt,<br>
L'équipe {{ config('app.name') }}
</x-mail::message>
