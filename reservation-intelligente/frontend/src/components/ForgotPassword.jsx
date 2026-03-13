import React, { useState } from 'react';
import api from '../api/axios';
import { KeyRound } from 'lucide-react';

const ForgotPassword = ({ onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await api.post('/forgot-password', { email });
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card max-w-md mx-auto p-8 rounded-[2.5rem]">
            <h2 className="text-3xl font-black text-gray-800 mb-2 flex items-center gap-2">
                <KeyRound className="text-indigo-600" size={32} />
                Mot de passe oublié ?
            </h2>
            <p className="text-gray-500 mb-8">Entrez votre e-mail pour recevoir un lien de réinitialisation.</p>

            {message && (
                <div className="bg-green-50 text-green-600 p-4 rounded-2xl border border-green-100 mb-6 text-sm font-bold">
                    {message}
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 mb-6 text-sm font-bold">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Adresse Email</label>
                    <input
                        type="email"
                        required
                        className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nom@exemple.com"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                    {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
                </button>

                <button
                    type="button"
                    onClick={onBackToLogin}
                    className="w-full text-gray-500 font-bold py-2 hover:text-indigo-600 transition-colors"
                >
                    Retour à la connexion
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;
