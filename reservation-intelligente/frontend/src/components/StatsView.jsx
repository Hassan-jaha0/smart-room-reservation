import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    Building2,
    Users,
    CalendarCheck2,
    CheckCircle2
} from 'lucide-react';

const StatsView = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Erreur chargement stats:', error);
            setError(error.response?.data?.message || 'Une erreur est survenue lors du chargement des statistiques.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-12 text-center animate-pulse text-indigo-500 font-bold">Chargement des statistiques...</div>;
    if (error) return <div className="p-12 text-center text-red-500 font-bold bg-red-50 rounded-3xl border border-red-100 m-4">{error}</div>;
    if (!stats) return <div className="p-12 text-center text-gray-500 font-bold">Aucune donnée disponible.</div>;

    const cards = [
        { label: 'Salles Totales', value: stats.total_rooms, icon: Building2, color: 'bg-blue-50 text-blue-600' },
        { label: 'Utilisateurs', value: stats.total_users, icon: Users, color: 'bg-purple-50 text-purple-600' },
        { label: 'Réservations', value: stats.total_bookings, icon: CalendarCheck2, color: 'bg-indigo-50 text-indigo-600' },
        { label: 'Confirmées', value: stats.approved_bookings, icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
    ];

    return (
        <div className="p-4 space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-extrabold text-gray-800">Tableau de Bord Statistiques</h2>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className={`p-4 rounded-2xl ${card.color} text-2xl`}>
                                <Icon size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{card.label}</p>
                                <p className="text-2xl font-black text-gray-800">{card.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Bookings Activity */}
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Activité des réservations</h3>
                        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full uppercase">7 derniers jours</span>
                    </div>
                    <div className="space-y-4">
                        {stats.bookings_per_day.length === 0 ? (
                            <p className="text-center py-8 text-gray-400 text-sm">Aucune activité récente.</p>
                        ) : (
                            stats.bookings_per_day.map((day, idx) => (
                                <div key={idx} className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-gray-500">
                                        <span>{new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                                        <span>{day.count} rés.</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min((day.count / (stats.total_bookings || 1)) * 100 * 5, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Popular Rooms */}
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Salles les plus demandées</h3>
                    <div className="space-y-6">
                        {stats.popular_rooms.length === 0 ? (
                            <p className="text-center py-8 text-gray-400 text-sm">Aucune donnée disponible.</p>
                        ) : (
                            stats.popular_rooms.map((room, idx) => (
                                <div key={idx} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center font-bold text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{room.name}</p>
                                            <p className="text-xs text-gray-500">Capacité: {room.capacity} pers.</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-indigo-600">{room.bookings_count}</p>
                                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">Réservations</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsView;
