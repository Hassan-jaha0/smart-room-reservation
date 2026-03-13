import React, { useState } from 'react';
import api from '../api/axios';
import { AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';

const Login = ({ onLoginSuccess, onForgotPassword }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isRegister ? '/register' : '/login';
            const response = await api.post(endpoint, formData);
            const { access_token, user } = response.data;

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));

            onLoginSuccess(user);
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full animate-in fade-in slide-up duration-700">
            <div className="glass-card p-8 rounded-[2.5rem] w-full max-w-md mx-auto">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-white rounded-3xl p-3 shadow-sm">
                        <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                </div>
                <h2 className="text-3xl font-black text-center text-gray-800 mb-2">
                    {isRegister ? 'Créer un compte' : 'Connexion'}
                </h2>
                <p className="text-center text-gray-500 text-sm mb-8">
                    {isRegister ? 'Inscrivez-vous pour commencer à réserver' : 'Heureux de vous revoir !'}
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-6 border border-red-100 font-bold animate-pulse flex items-center gap-2">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegister && (
                        <div className="animate-in slide-in-bottom duration-300">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nom complet</label>
                            <input
                                type="text"
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-0 focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-medium"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-0 focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-medium"
                            placeholder="votre@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Mot de passe</label>
                        <input
                            type="password"
                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-0 focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-medium"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        {!isRegister && (
                            <div className="flex justify-end mt-1">
                                <button
                                    type="button"
                                    onClick={onForgotPassword}
                                    className="text-[10px] font-black text-indigo-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                                >
                                    Mot de passe oublié ?
                                </button>
                            </div>
                        )}
                    </div>
                    {isRegister && (
                        <div className="animate-in slide-in-bottom duration-300">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Confirmer mot de passe</label>
                            <input
                                type="password"
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-0 focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-medium"
                                placeholder="••••••••"
                                value={formData.password_confirmation}
                                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-5 rounded-2xl text-white font-black text-lg shadow-xl shadow-indigo-100 transform transition-all active:scale-95 mt-4 ${loading
                            ? 'bg-indigo-400 cursor-not-allowed text-indigo-100'
                            : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200'
                            }`}
                    >
                        {loading ? 'Traitement...' : (isRegister ? "S'inscrire" : 'Se connecter')}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => {
                            setIsRegister(!isRegister);
                            setError('');
                        }}
                        className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors text-sm"
                    >
                        {isRegister ? 'Déjà un compte ? Connectez-vous' : "Pas de compte ? Inscrivez-vous"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
