import React from 'react';
import { Home, Layers, User, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { safeLower } from '../../utils/string';

interface Props {
  activeTab: string;
  onNavigate: (tabId: string) => void;
}

const MobileNav: React.FC<Props> = ({ activeTab, onNavigate }) => {
  const { user, logout } = useAuth();
  const hasAdmin = user?.commissions?.some(c => safeLower(c) === 'administration');

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Accueil' },
    { id: 'commissions', icon: Layers, label: 'Pôles' },
    ...(hasAdmin ? [{ id: 'admin_dashboard', icon: ShieldCheck, label: 'Admin' }] : []),
    { id: 'profile', icon: User, label: 'Profil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[1000] bg-white/80 backdrop-blur-2xl border-t border-slate-200/60 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 flex-1 ${
                isActive ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          );
        })}
        <button onClick={() => logout()} className="flex flex-col items-center justify-center gap-1 flex-1 text-rose-400">
          <LogOut size={22} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Sortie</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileNav;