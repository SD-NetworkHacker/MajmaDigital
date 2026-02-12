import React from 'react';
import { 
  LayoutDashboard, Users, Landmark, Wallet, 
  Layers, User, Map, LogOut, ShieldAlert 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { safeLower } from '../utils/string';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const commissions = Array.isArray(user.commissions) ? user.commissions : [];
  const isAdmin = commissions.some(c => safeLower(c) === 'administration');

  const navItem = (id: string, Icon: any, label: string) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`w-full group flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 ${
          isActive 
            ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/20' 
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'} />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        {isActive && <div className="ml-auto w-1 h-4 bg-white rounded-full"></div>}
      </button>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#030712] border-r border-white/5 p-5">
      <div className="p-4 mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-arabic text-xl pb-1 shadow-lg shadow-emerald-900/20">م</div>
        <h1 className="text-xl font-black text-white tracking-tighter">Majma<span className="text-emerald-500">Digital</span></h1>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
        <h3 className="px-5 text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Personnel</h3>
        {navItem('dashboard', LayoutDashboard, 'Dashboard')}
        {navItem('profile', User, 'Mon Profil')}
        {navItem('finance_perso', Wallet, 'Mes Finances')}

        {commissions.length > 0 && (
          <>
            <h3 className="px-5 pt-8 text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Mes Pôles</h3>
            {commissions.map(c => (
              <button
                key={c}
                onClick={() => setActiveTab(`comm_${safeLower(c)}`)}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                  activeTab === `comm_${safeLower(c)}` 
                    ? 'bg-slate-800 text-emerald-400' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers size={18} className={activeTab === `comm_${safeLower(c)}` ? 'text-emerald-400' : 'text-slate-600'} />
                <span className="text-[10px] font-black uppercase tracking-widest truncate">{c}</span>
              </button>
            ))}
          </>
        )}

        {isAdmin && (
          <>
            <h3 className="px-5 pt-8 text-[9px] font-black text-rose-500 uppercase tracking-widest mb-4">Gouvernance</h3>
            {navItem('admin_dashboard', Landmark, 'Cockpit Pilotage')}
            {navItem('members', Users, 'Registre Global')}
          </>
        )}
      </nav>

      <div className="pt-4 border-t border-white/5 mt-auto">
        <button 
          onClick={logout} 
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-rose-500 hover:bg-rose-500/10 transition-all font-black uppercase text-[10px] tracking-widest"
        >
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;