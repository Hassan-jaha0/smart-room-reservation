import React, { useState, useEffect, useRef } from 'react';
import CalendarView from './components/CalendarView';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import MyBookings from './components/MyBookings';
import NotificationTray from './components/NotificationTray';
import RoomManagement from './components/RoomManagement';
import StatsView from './components/StatsView';
import UserManagement from './components/UserManagement';
import UserProfile from './components/UserProfile';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import { LogOut, Calendar, Building2, Bell, BarChart3, Users, ShieldCheck } from 'lucide-react';
import logo from './assets/logo.png';

function App() {
  const [user, setUser] = useState(null);
  const memoizedUser = React.useMemo(() => user, [user]);
  const [authView, setAuthView] = useState('login');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('calendar');
  const [refreshKey, setRefreshKey] = useState(0);
  const notifRef = useRef(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setRefreshKey(prev => prev + 1);
  };

  const handleBookingCreated = () => {
    setRefreshKey(prev => prev + 1);
    if (notifRef.current) notifRef.current.refresh();
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.role) parsedUser.role = parsedUser.role.toLowerCase();
      setUser(parsedUser);
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('token')) {
      setAuthView('reset-password');
    }

    setLoading(false);
  }, []);

  const handleLoginSuccess = (u) => {
    if (u.role) u.role = u.role.toLowerCase();
    setUser(u);
    setActiveTab('calendar');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setActiveTab('calendar');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return <CalendarView user={user} onBookingCreated={handleBookingCreated} />;
      case 'my-bookings':
        return <MyBookings key={refreshKey} user={user} />;
      case 'rooms':
        return <RoomManagement />;
      case 'users':
        return <UserManagement />;
      case 'stats':
        return <StatsView />;
      case 'profile':
        return <UserProfile user={user} setUser={setUser} />;
      default:
        return <CalendarView user={user} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen app-bg">
        <div className="glass-card px-8 py-4 rounded-2xl flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
          <span className="font-bold text-gray-700">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen app-bg p-4 md:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 header-glass rounded-2xl px-6 py-4 relative z-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm overflow-hidden">
              <img src={logo} alt="Smart Room Logo" className="w-full h-full object-contain p-1" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-600 tracking-tight">
              Smart Room Reservation
            </h1>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <NotificationTray ref={notifRef} />
              <div className="flex items-center gap-4 bg-white/60 p-2 px-4 rounded-2xl border border-white/50">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </header>

        {!user ? (
          /* ── AUTH PAGES ── */
          <div className="auth-hero-overlay min-h-[calc(100vh-140px)] rounded-3xl overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-140px)] p-6 gap-8 lg:gap-16">
              {/* Left panel - Features showcase */}
              <div className="hidden lg:flex flex-col gap-5 max-w-sm animate-in fade-in duration-700">
                <h2 className="text-4xl font-black text-white leading-tight mb-2">
                  Réservez vos salles<br />en toute simplicité
                </h2>
                <p className="text-indigo-100 text-lg mb-4">
                  Gérez vos espaces de travail intelligemment avec notre plateforme moderne.
                </p>
                <div className="feature-card rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Calendar size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Calendrier Intelligent</p>
                    <p className="text-xs text-indigo-200">Visualisez les créneaux en temps réel</p>
                  </div>
                </div>
                <div className="feature-card rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Building2 size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Gestion des Salles</p>
                    <p className="text-xs text-indigo-200">Contrôlez tous vos espaces facilement</p>
                  </div>
                </div>
                <div className="feature-card rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Bell size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Notifications</p>
                    <p className="text-xs text-indigo-200">Soyez alerté en temps réel</p>
                  </div>
                </div>
                <div className="feature-card rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <BarChart3 size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Statistiques</p>
                    <p className="text-xs text-indigo-200">Analysez l'occupation de vos salles</p>
                  </div>
                </div>
                <div className="feature-card rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Multi-Rôles</p>
                    <p className="text-xs text-indigo-200">Admin, Manager et Utilisateur</p>
                  </div>
                </div>
                <div className="feature-card rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <ShieldCheck size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Sécurisé</p>
                    <p className="text-xs text-indigo-200">Authentification et contrôle d'accès</p>
                  </div>
                </div>
              </div>

              {/* Right panel - Auth form */}
              <div className="w-full max-w-md animate-in fade-in slide-up duration-700">
                {authView === 'login' && (
                  <Login
                    onLoginSuccess={handleLoginSuccess}
                    onForgotPassword={() => setAuthView('forgot-password')}
                  />
                )}
                {authView === 'forgot-password' && (
                  <ForgotPassword onBackToLogin={() => setAuthView('login')} />
                )}
                {authView === 'reset-password' && (
                  <ResetPassword onResetSuccess={() => {
                    setAuthView('login');
                    window.history.replaceState({}, document.title, "/");
                  }} />
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ── DASHBOARD ── */
          <div className="flex flex-col md:flex-row gap-8">
            <Sidebar user={user} activeTab={activeTab} setActiveTab={handleTabChange} />
            <main className="flex-1">
              <div className="content-glass rounded-3xl p-6 animate-in fade-in duration-500">
                {renderContent()}
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
