<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingConfirmed extends Notification
{
    use Queueable;

    public $booking;

    /**
     * Create a new notification instance.
     */
    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // On active le mail et la base de données
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $startTime = $this->booking->start_time->format('Ymd\THis');
        $endTime = $this->booking->end_time->format('Ymd\THis');
        $location = $this->booking->room->name;
        $summary = "Réservation : " . $location;
        
        $icsContent = "BEGIN:VCALENDAR\n" .
                      "VERSION:2.0\n" .
                      "PRODID:-//Smart Room//NONSGML v1.0//EN\n" .
                      "BEGIN:VEVENT\n" .
                      "UID:" . uniqid() . "@smartroom.com\n" .
                      "DTSTAMP:" . date('Ymd\THis\Z') . "\n" .
                      "DTSTART:{$startTime}\n" .
                      "DTEND:{$endTime}\n" .
                      "SUMMARY:{$summary}\n" .
                      "LOCATION:{$location}\n" .
                      "DESCRIPTION:Votre réservation pour la salle {$location}.\n" .
                      "END:VEVENT\n" .
                      "END:VCALENDAR";

        return (new MailMessage)
                    ->subject('📅 Réservation Confirmée - ' . $this->booking->room->name)
                    ->greeting('Bonjour ' . $notifiable->name . ',')
                    ->line('Bonne nouvelle ! Votre réservation pour la salle **' . $this->booking->room->name . '** est programmée.')
                    ->line('**Détails du créneau :**')
                    ->line('📅 Date : ' . $this->booking->start_time->format('d/m/Y'))
                    ->line('⏰ Horaire : ' . $this->booking->start_time->format('H:i') . ' à ' . $this->booking->end_time->format('H:i'))
                    ->action('Gérer mes réservations', url('/'))
                    ->attachData($icsContent, 'reservation.ics', [
                        'mime' => 'text/calendar',
                    ])
                    ->line('Un fichier calendrier (.ics) est joint à cet e-mail pour l\'ajouter à votre agenda personnel.')
                    ->line('Merci de faire confiance à ' . config('app.name') . ' !');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
            'room_id' => $this->booking->room_id,
            'start_time' => $this->booking->start_time,
            'end_time' => $this->booking->end_time,
        ];
    }

    /**
     * Structure pour futur SMS (ex: Twilio / Nexmo)
     */
    /*
    public function toSms(object $notifiable)
    {
        return (new SmsMessage)
            ->content("Réservation confirmée : Salle {$this->booking->room->name} le {$this->booking->start_time->format('d/m à H:i')}.");
    }
    */
}
