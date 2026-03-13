import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, Trash2 } from 'lucide-react';
import { useToast } from './Toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const { showToast, ToastContainer } = useToast();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            console.log('Utilisateurs chargés:', response.data.data);
            setUsers(response.data.data);
        } catch (error) {
            console.error('Erreur chargement utilisateurs:', error);
            setError(error.response?.data?.message || 'Erreur lors du chargement des utilisateurs.');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/users/${userId}/role`, { role: newRole });
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            showToast('Rôle mis à jour avec succès !', 'success');
        } catch (error) {
            showToast(error.response?.data?.message || 'Erreur lors du changement de rôle.', 'error');
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await api.delete(`/users/${userId}`);
            setUsers(users.filter(u => u.id !== userId));
            setShowDeleteConfirm(null);
            showToast('Utilisateur supprimé avec succès !', 'success');
        } catch (error) {
            setShowDeleteConfirm(null);
            showToast(error.response?.data?.message || 'Erreur lors de la suppression.', 'error');
        }
    };

    if (loading) return <div className="text-center p-12 animate-pulse text-indigo-500 font-bold">Chargement des utilisateurs...</div>;
    if (error) return <div className="p-12 text-center text-red-500 font-bold bg-red-50 rounded-3xl border border-red-100 m-4">{error}</div>;

    return (
        <div className="p-4">
            <ToastContainer />
            <h2 className="text-2xl font-extrabold text-gray-800 mb-8 flex items-center gap-2">
                <Users className="text-indigo-600" size={28} />
                Gestion des Utilisateurs
            </h2>

            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Utilisateur</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Rôle Actuel</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-gray-400 font-medium">
                                    Aucun utilisateur trouvé.
                                </td>
                            </tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                                {u.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-gray-800">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            className="bg-gray-50 border-0 text-sm font-bold text-indigo-600 rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-500 capitalize"
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                        >
                                            <option value="user">User</option>
                                            <option value="manager">Manager</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => setShowDeleteConfirm(u.id)}
                                            className="text-red-500 hover:text-red-700 font-bold text-sm transition-colors"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-rose-100 rounded-full flex items-center justify-center">
                                <Trash2 size={28} className="text-rose-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Confirmer la suppression</h3>
                            <p className="text-gray-500 text-sm mb-6">Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="flex-1 px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(showDeleteConfirm)}
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

export default UserManagement;
