import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../api/axios';
import { Calendar, Clock, X } from 'lucide-react';
import { useToast } from './Toast';

const CalendarView = ({ user, onBookingCreated }) => {
    const [rawBookings, setRawBookings] = useState([]);
    const { showToast, ToastContainer } = useToast();
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [pendingBooking, setPendingBooking] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);

    // Load existing bookings from API on mount
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get('/bookings');
                setRawBookings(response.data.data || []);
            } catch (error) {
                console.error('Erreur chargement réservations:', error);
            }
        };
        fetchBookings();
    }, []);

    const events = React.useMemo(() => {
        return rawBookings.map(b => ({
            id: b.id,
            title: `Réservé (${b.user?.name || 'Utilisateur'})`,
            start: b.start_time,
            end: b.end_time,
            backgroundColor: b.status === 'approved' ? '#10B981' : b.status === 'rejected' ? '#EF4444' : '#F59E0B',
            borderColor: b.status === 'approved' ? '#059669' : b.status === 'rejected' ? '#DC2626' : '#D97706',
        }));
    }, [rawBookings]);

    const handleSelect = (selectInfo) => {
        let start = selectInfo.startStr;
        let end = selectInfo.endStr;

        if (selectInfo.allDay) {
            const startDate = new Date(selectInfo.start);
            const endDate = new Date(selectInfo.end);

            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 1) {
                showToast('Les réservations sur plusieurs jours ne sont pas autorisées.', 'error');
                return;
            }

            const dateStr = selectInfo.startStr;
            start = `${dateStr}T09:00:00`;
            end = `${dateStr}T10:00:00`;
        }

        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();

        // Show in-app confirmation modal instead of prompt/confirm
        setPendingBooking({ start, end });
        setShowBookingModal(true);
    };

    const handleConfirmBooking = async () => {
        if (!pendingBooking) return;
        setBookingLoading(true);

        try {
            const response = await api.post('/bookings', {
                room_id: 1,
                start_time: pendingBooking.start,
                end_time: pendingBooking.end,
            });

            if (response.status === 201) {
                const bookingData = response.data.data;
                setRawBookings(prev => [...prev, bookingData]);
                setShowBookingModal(false);
                setPendingBooking(null);
                showToast('Réservation réussie !', 'success');
                if (onBookingCreated) onBookingCreated();
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Erreur lors de la réservation.';
            const errorDetail = error.response?.data?.error;
            const validationErrors = error.response?.data?.errors;

            let fullMessage = message;
            if (errorDetail) fullMessage += ' - ' + errorDetail;
            if (validationErrors) fullMessage += ' ' + Object.values(validationErrors).flat().join(', ');

            setShowBookingModal(false);
            setPendingBooking(null);
            showToast(fullMessage, 'error');
        } finally {
            setBookingLoading(false);
        }
    };

    const formatDateTime = (dt) => {
        if (!dt) return '';
        const d = new Date(dt);
        return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
            + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="p-4 bg-white rounded shadow-lg">
            <ToastContainer />
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <Calendar className="text-indigo-600" size={28} />
                Calendrier des Salles
            </h2>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                locale="fr"
                selectable={true}
                selectMirror={true}
                select={handleSelect}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                allDaySlot={false}
                events={events}
                height="auto"
            />

            {/* Booking Confirmation Modal */}
            {showBookingModal && pendingBooking && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <Calendar size={24} className="text-indigo-600" />
                                    Confirmer la réservation
                                </h3>
                                <button
                                    onClick={() => { setShowBookingModal(false); setPendingBooking(null); }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="bg-indigo-50 rounded-2xl p-5 mb-6 space-y-3">
                                <div className="flex items-center gap-3">
                                    <Clock size={18} className="text-indigo-500" />
                                    <div>
                                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Début</p>
                                        <p className="text-sm font-semibold text-gray-800">{formatDateTime(pendingBooking.start)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock size={18} className="text-indigo-500" />
                                    <div>
                                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Fin</p>
                                        <p className="text-sm font-semibold text-gray-800">{formatDateTime(pendingBooking.end)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setShowBookingModal(false); setPendingBooking(null); }}
                                    className="flex-1 px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleConfirmBooking}
                                    disabled={bookingLoading}
                                    className={`flex-1 px-6 py-3 rounded-2xl font-bold shadow-lg transition-all ${bookingLoading
                                        ? 'bg-indigo-400 text-indigo-100 cursor-not-allowed'
                                        : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'
                                        }`}
                                >
                                    {bookingLoading ? 'Réservation...' : 'Confirmer'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarView;
