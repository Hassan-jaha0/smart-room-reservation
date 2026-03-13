import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Building2, Plus, Trash2 } from 'lucide-react';
import { useToast } from './Toast';

const RoomManagement = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const { showToast, ToastContainer } = useToast();
    const [formData, setFormData] = useState({
        name: '',
        capacity: '',
        equipment: ''
    });

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await api.get('/rooms');
            console.log('Salles chargées:', response.data.data);
            setRooms(response.data.data);
        } catch (error) {
            console.error('Erreur chargement salles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (room = null) => {
        if (room) {
            setEditingRoom(room);
            setFormData({
                name: room.name,
                capacity: room.capacity,
                equipment: room.equipment ? room.equipment.join(', ') : ''
            });
        } else {
            setEditingRoom(null);
            setFormData({ name: '', capacity: '', equipment: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            capacity: parseInt(formData.capacity),
            equipment: formData.equipment ? formData.equipment.split(',').map(item => item.trim()) : []
        };

        try {
            if (editingRoom) {
                await api.put(`/rooms/${editingRoom.id}`, payload);
                showToast('Salle modifiée avec succès !', 'success');
            } else {
                await api.post('/rooms', payload);
                showToast('Salle ajoutée avec succès !', 'success');
            }
            setIsModalOpen(false);
            fetchRooms();
        } catch (error) {
            let errorMsg = error.response?.data?.message || error.message;
            if (error.response?.data?.errors) {
                const details = Object.values(error.response.data.errors).flat().join(', ');
                errorMsg += ' - ' + details;
            }
            showToast('Erreur : ' + errorMsg, 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/rooms/${id}`);
            setShowDeleteConfirm(null);
            fetchRooms();
            showToast('Salle supprimée avec succès !', 'success');
        } catch (error) {
            setShowDeleteConfirm(null);
            showToast('Erreur lors de la suppression.', 'error');
        }
    };

    if (loading) return <div className="text-center p-12 animate-pulse">Chargement des salles...</div>;

    return (
        <div className="p-4">
            <ToastContainer />
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                    <Building2 className="text-indigo-600" size={28} />
                    Gestion des Salles
                </h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                    <Plus size={18} />
                    Ajouter une salle
                </button>
            </div>

            {rooms.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">Aucune salle trouvée.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div key={room.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{room.name}</h3>
                                    <p className="text-sm text-gray-500">Capacité : {room.capacity} pers.</p>
                                </div>
                                <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2 py-1 rounded-full border border-green-100">ACTIF</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6 h-12 overflow-hidden">
                                {room.equipment && room.equipment.map((item, idx) => (
                                    <span key={idx} className="bg-gray-50 text-gray-600 text-[10px] px-2 py-1 rounded-lg border border-gray-100">
                                        {item}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleOpenModal(room)}
                                    className="flex-1 px-4 py-2 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(room.id)}
                                    className="px-4 py-2 rounded-xl text-sm font-bold border border-red-100 text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">
                                {editingRoom ? 'Modifier la salle' : 'Ajouter une salle'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nom de la salle</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="ex: Salle de Conférence"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Capacité maximale</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                        placeholder="Nombre de personnes"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Équipements (séparés par virgule)</label>
                                    <textarea
                                        className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all h-24"
                                        value={formData.equipment}
                                        onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                                        placeholder="ex: Projecteur, Wifi, Tableau blanc"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
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
                            <p className="text-gray-500 text-sm mb-6">Êtes-vous sûr de vouloir supprimer cette salle ? Cette action est irréversible.</p>
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

export default RoomManagement;
