import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { ShieldCheck } from 'lucide-react';

const ResetPassword = ({ onResetSuccess }) => {
    const [formData, setFormData] = useState({
        token: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Extraire le token et l'email de l'URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const email = params.get('email');

        if (token && email) {
            setFormData(prev => ({ ...prev, token, email }));
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await api.post('/reset-password', formData);
            setMessage(response.data.message);
            setTimeout(() => {
                onResetSuccess();
            }, 3000);
        } catch (err) {
            if (err.response?.status === 422 && err.response.data.errors) {
                // Joindre tous les messages d'erreur de validation
                const allErrors = Object.values(err.response.data.errors).flat().join(' ');
                setError(allErrors || err.response.data.message);
            } else {
                setError(err.response?.data?.message || 'Une erreur est survenue.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card max-w-md mx-auto p-8 rounded-[2.5rem]">
            <h2 className="text-3xl font-black text-gray-800 mb-2 flex items-center gap-2">
                <ShieldCheck className="text-indigo-600" size={32} />
                Nouveau mot de passe
            </h2>
            <p className="text-gray-500 mb-8">Veuillez choisir un nouveau mot de passe sécurisé.</p>

            {message && (
                <div className="bg-green-50 text-green-600 p-4 rounded-2xl border border-green-100 mb-6 text-sm font-bold">
                    {message} Redirection vers la connexion...
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 mb-6 text-sm font-bold">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="hidden" value={formData.token} />
                <input type="hidden" value={formData.email} />

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nouveau Mot de Passe</label>
                    <input
                        type="password"
                        required
                        className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Confirmer le Mot de Passe</label>
                    <input
                        type="password"
                        required
                        className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        value={formData.password_confirmation}
                        onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !formData.token}
                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50 mt-4"
                >
                    {loading ? 'Réinitialisation...' : 'Changer mon mot de passe'}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
