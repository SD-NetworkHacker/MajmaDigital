import React from 'react';
import { 
  LayoutDashboard, Users, Landmark, Settings, 
  BookOpen, Heart, Wallet, Layers, 
  Cpu, ShieldAlert, User, Map, Zap, ChevronRight, LogOut, Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CommissionType } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

// Fixed: Removed React.FC to avoid issues with required children in some TS environments
const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { user, logout } = useAuth();
  
  const isSystemAdmin = user?.role === 'ADMIN';
  const isSG = user?.role === 'SG' || user?.role === 'ADJOINT_SG';
  
  const memberNav = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
    { id: 'profile', icon: User, label: 'Identité digitale' },
    { id: 'pedagogy', icon: BookOpen, label: 'Vie Spirituelle' },
    { id: 'social', icon: Heart, label: 'Vie Sociale' },
    { id: 'finance_perso', icon: Wallet, label: 'Mes Finances' },
  ];

  const myCommissions = user?.commissions || [];
  const isInAdmin = myCommissions.some(c => c.type === CommissionType.ADMINISTRATION) || isSG;

  const renderNavButton = (item: { id: string, icon: any, label: string }, isActive: boolean) => {
    const Icon = item.icon;
    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        className={`w-full group flex items-center gap-3.5 px-5 py-4 rounded-2xl transition-all duration-500 relative overflow-hidden ${
          isActive 
            ? 'bg-emerald-600 text-white shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] scale-[1.02]' 
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <div className={`transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'}`}>
          <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        <span className={`text-[11px] font-black uppercase tracking-[0.1em] ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
          {item.label}
        </span>
        {isActive && (
          <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]"></div>
        )}
      </button>
    );
  };

  return (
    <div className="h-full hidden lg:flex flex-col bg-[#030712] border-r border-white/5 shadow-2xl">
      {/* Brand */}
      <div className="p-8 pb-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-arabic text-2xl pb-1 shadow-[0_0_20px_rgba(16,185,129,0.2)] bg-emerald-600 text-white transform -rotate-3">
          م
        </div>
        <div>
          <h1 className="text-xl font-black text-white tracking-tighter leading-none">Majma<span className="text-emerald-500">Digital</span></h1>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1.5 opacity-60">Platinum Edition</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-10 overflow-y-auto custom-scrollbar no-scrollbar">
        
        {/* --- SECTION 1: ESPACE MEMBRE --- */}
        {!isSystemAdmin && (
          <div className="space-y-2">
            <h3 className="px-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Personnel</h3>
            {memberNav.map(item => renderNavButton(item, activeTab === item.id))}
          </div>
        )}

        {/* --- SECTION 2: MÉTIER --- */}
        {!isSystemAdmin && myCommissions.length > 0 && (
          <div className="space-y-2">
            <h3 className="px-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Pôles d'Action</h3>
            {myCommissions.map((c, i) => 
              renderNavButton({ 
                id: `comm_${c.type.toLowerCase()}`, 
                icon: Briefcase, 
                label: `Pôle ${c.type}` 
              }, activeTab === `comm_${c.type.toLowerCase()}`)
            )}
          </div>
        )}

        {/* --- SECTION 3: DIRECTION --- */}
        {isInAdmin && !isSystemAdmin && (
          <div className="space-y-2">
            <h3 className="px-5 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Gouvernance</h3>
            {renderNavButton({ id: 'admin_dashboard', icon: Landmark, label: 'Cockpit Bureau' }, activeTab === 'admin_dashboard')}
            {renderNavButton({ id: 'members', icon: Users, label: 'Annuaire Global' }, activeTab === 'members')}
            {renderNavButton({ id: 'map', icon: Map, label: 'Cartographie' }, activeTab === 'map')}
          </div>
        )}

        {/* --- SECTION SYSTÈME --- */}
        {isSystemAdmin && (
          <div className="space-y-2">
            <h3 className="px-5 text-[9px] font-black text-rose-500 uppercase tracking-[0.3em] mb-4">Infrastructure</h3>
            {renderNavButton({ id: 'admin_system', icon: Cpu, label: 'Root Control' }, activeTab === 'admin_system')}
          </div>
        )}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-4 mt-auto border-t border-white/5 space-y-2">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl transition-all ${
            activeTab === 'settings' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings size={18} />
          <span className="text-[11px] font-black uppercase tracking-widest">Paramètres</span>
        </button>
        <button 
          onClick={() => logout()}
          className="w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-rose-500/70 hover:text-rose-500 hover:bg-rose-50 transition-all"
        >
          <LogOut size={18} />
          <span className="text-[11px] font-black uppercase tracking-widest">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;