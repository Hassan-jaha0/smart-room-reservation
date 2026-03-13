import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { ClipboardList, RefreshCw, Check, X, Pencil, Trash2, Calendar, Clock } from 'lucide-react';
import { useToast } from './Toast';

const MyBookings = ({ user }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [editFormData, setEditFormData] = useState({
        room_id: '',
        start_time: '',
        end_time: ''
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const { showToast, ToastContainer } = useToast();

    const normalizedRole = user?.role?.toLowerCase() || 'user';
    const isManager = normalizedRole === 'manager' || normalizedRole === 'admin';

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/bookings');
            setBookings(response.data.data);
        } catch (error) {
            console.error('Erreur lors du chargement des réservations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = React.useCallback(async (id, status) => {
        try {
            await api.put(`/admin/bookings/${id}/status`, { status });
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
            showToast(status === 'approved' ? 'Réservation approuvée avec succès !' : 'Réservation rejetée.', status === 'approved' ? 'success' : 'info');
        } catch (error) {
            showToast('Erreur lors de la mise à jour du statut.', 'error');
        }
    }, [showToast]);

    const handleDelete = React.useCallback(async (id) => {
        try {
            await api.delete(`/bookings/${id}`);
            setBookings(prev => prev.filter(b => b.id !== id));
            setShowDeleteConfirm(null);
            showToast('Réservation supprimée avec succès !', 'success');
        } catch (error) {
            setShowDeleteConfirm(null);
            showToast('Erreur lors de la suppression.', 'error');
        }
    }, [showToast]);

    const handleOpenEditModal = (booking) => {
        setEditingBooking(booking);
        setEditFormData({
            room_id: booking.room_id,
            start_time: booking.start_time.substring(0, 16), // Format YYYY-MM-DDTHH:mm
            end_time: booking.end_time.substring(0, 16)
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/bookings/${editingBooking.id}`, editFormData);
            setIsEditModalOpen(false);
            fetchBookings();
            showToast('Réservation mise à jour avec succès !', 'success');
        } catch (error) {
            const message = error.response?.data?.message || 'Erreur lors de la modification';
            showToast(message, 'error');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'approved':
                return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'rejected':
                return 'bg-rose-50 text-rose-600 border-rose-100';
            default:
                return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    if (loading && bookings.length === 0) {
        return (
            <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <ToastContainer />
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <ClipboardList className="text-indigo-600" size={28} />
                    {isManager ? 'Gestion des Réservations' : 'Mes Réservations'}
                </h2>
                <button
                    onClick={fetchBookings}
                    className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-4 py-2 rounded-xl"
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    Actualiser
                </button>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">Aucune réservation trouvée.</p>
                </div>
            ) : (
                <div className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Salle</th>
                                {isManager && <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Utilisateur</th>}
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Période</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.map((booking) => {
                                const canEdit = isManager || booking.user_id === user?.id;
                                return (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-800">{booking.room?.name || 'Salle Inconnue'}</p>
                                        </td>
                                        {isManager && (
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-gray-700">{booking.user?.name || 'Inconnu'}</p>
                                            </td>
                                        )}
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(booking.start_time).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(booking.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                            {' - '}
                                            {new Date(booking.end_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(booking.status)}`}>
                                                {booking.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                {isManager && booking.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(booking.id, 'approved')}
                                                            className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                            title="Approuver"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(booking.id, 'rejected')}
                                                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                            title="Rejeter"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                {canEdit && (
                                                    <>
                                                        <button
                                                            onClick={() => handleOpenEditModal(booking)}
                                                            className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => setShowDeleteConfirm(booking.id)}
                                                            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Pencil size={24} className="text-indigo-600" />
                                Modifier la réservation
                            </h3>
                            <form onSubmit={handleEditSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Début</label>
                                    <div className="relative">
                                        <input
                                            type="datetime-local"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                            value={editFormData.start_time}
                                            onChange={(e) => setEditFormData({ ...editFormData, start_time: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Fin</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                        value={editFormData.end_time}
                                        onChange={(e) => setEditFormData({ ...editFormData, end_time: e.target.value })}
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="flex-1 px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                                    >
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-rose-100 rounded-full flex items-center justify-center">
                                <Trash2 size={28} className="text-rose-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Confirmer la suppression</h3>
                            <p className="text-gray-500 text-sm mb-6">Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="flex-1 px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => handleDelete(showDeleteConfirm)}
                                    className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
