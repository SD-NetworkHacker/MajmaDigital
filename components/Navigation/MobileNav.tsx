import React from 'react';
import { Home, Layers, User, LogOut, ShieldCheck, Wallet } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { safeLower } from '../../utils/string';

interface Props {
  activeTab: string;
  onNavigate: (tabId: string) => void;
}

const MobileNav: React.FC<Props> = ({ activeTab, onNavigate }) => {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const commissions = Array.isArray(user.commissions) ? user.commissions : [];
  const hasAdmin = commissions.some(c => safeLower(c) === 'administration');

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Accueil' },
    { id: 'finance_perso', icon: Wallet, label: 'Finances' },
    { id: 'commissions', icon: Layers, label: 'Pôles' },
    ...(hasAdmin ? [{ id: 'admin_dashboard', icon: ShieldCheck, label: 'Admin' }] : []),
    { id: 'profile', icon: User, label: 'Profil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[1000] lg:hidden h-16 bg-white/90 backdrop-blur-xl border-t border-slate-200 flex justify-around items-center px-4 pb-[env(safe-area-inset-bottom)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id || (item.id === 'dashboard' && activeTab === 'admin_dashboard');
        
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300 ${
              isActive ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
            {isActive && <div className="absolute top-0 w-8 h-1 bg-emerald-500 rounded-b-full"></div>}
          </button>
        );
      })}
      
      <button 
        onClick={() => logout()} 
        className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-rose-400 active:scale-90 transition-transform"
      >
        <LogOut size={20} />
        <span className="text-[9px] font-black uppercase tracking-tighter">Sortie</span>
      </button>
    </nav>
  );
};

export default MobileNav;