import React from 'react';
import {
    Calendar,
    ClipboardList,
    Building2,
    Users,
    BarChart3,
    UserCircle
} from 'lucide-react';

const Sidebar = ({ user, activeTab, setActiveTab }) => {
    const normalizedRole = user?.role?.toLowerCase() || 'user';
    const isAdmin = normalizedRole === 'admin';
    const isManager = normalizedRole === 'manager' || isAdmin;

    const menuItems = [
        { id: 'calendar', label: 'Calendrier', icon: Calendar, roles: ['user', 'manager', 'admin'] },
        { id: 'my-bookings', label: 'Mes Réservations', icon: ClipboardList, roles: ['user', 'manager', 'admin'] },
        { id: 'rooms', label: 'Gérer les Salles', icon: Building2, roles: ['manager', 'admin'] },
        { id: 'users', label: 'Utilisateurs', icon: Users, roles: ['manager', 'admin'] },
        { id: 'stats', label: 'Statistiques', icon: BarChart3, roles: ['manager', 'admin'] },
        { id: 'profile', label: 'Mon Profil', icon: UserCircle, roles: ['user', 'manager', 'admin'] },
    ];

    const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

    return (
        <aside className="w-64 sidebar-glass rounded-3xl p-6 h-fit hidden md:block">
            <div className="mb-8 px-2">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Menu Principal</h2>
            </div>
            <nav className="space-y-2">
                {filteredItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 hover-lift ${activeTab === item.id
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                                }`}
                        >
                            <Icon size={20} className={activeTab === item.id ? 'text-white' : 'text-indigo-500'} strokeWidth={2.5} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
};

export default React.memo(Sidebar);
