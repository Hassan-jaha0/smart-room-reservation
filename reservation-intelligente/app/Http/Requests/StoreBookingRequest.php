<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // L'authentification est gérée par le middleware Sanctum/Auth
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'room_id' => ['required', 'exists:rooms,id'],
            'start_time' => ['required', 'date', 'after:now'],
            'end_time' => ['required', 'date', 'after:start_time'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $start = Carbon::parse($this->start_time);
            $end = Carbon::parse($this->end_time);

            // Validation 1 : Réservation sur la même journée
            if (!$start->isSameDay($end)) {
                $validator->errors()->add('end_time', 'La réservation doit commencer et se terminer le même jour.');
                return;
            }

            // Validation 2 : Durée maximale de 4h
            if ($start->diffInMinutes($end) > 240) { // 4 heures * 60 minutes
                $validator->errors()->add('end_time', 'La durée de la réservation ne peut pas dépasser 4 heures.');
            }

            // Validation 3 : Créneau 08h - 20h
            $startLimit = $start->copy()->setTime(8, 0, 0);
            $endLimit = $start->copy()->setTime(20, 0, 0);

            if ($start->lt($startLimit) || $end->gt($endLimit)) {
                $validator->errors()->add('start_time', 'Les réservations sont autorisées uniquement entre 08:00 et 20:00.');
            }
        });
    }
}
