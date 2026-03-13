import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import api from '../api/axios';
import { Bell } from 'lucide-react';

const NotificationTray = forwardRef((props, ref) => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useImperativeHandle(ref, () => ({
        refresh: fetchNotifications
    }));

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications');
            setNotifications(response.data.data);
            // On compte les notifications non lues (read_at === null)
            setUnreadCount(response.data.data.filter(n => !n.read_at).length);
        } catch (error) {
            console.error('Erreur notifications:', error);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => { setIsOpen(!isOpen); if (!isOpen) fetchNotifications(); }}
                className="relative p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
                <Bell size={22} className="text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-gray-800">Notifications</h3>
                        <button onClick={fetchNotifications} className="text-xs text-indigo-600 font-bold hover:underline">Actualiser</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                Aucune notification
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div key={notif.id} className={`p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.read_at ? 'bg-indigo-50/30' : ''}`}>
                                    <p className="text-sm font-semibold text-gray-800 mb-1">Réservation Confirmée</p>
                                    <p className="text-xs text-gray-600 line-clamp-2">
                                        Votre réservation pour la salle a été traitée avec succès.
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-2">
                                        {new Date(notif.created_at).toLocaleString('fr-FR')}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});

export default NotificationTray;
