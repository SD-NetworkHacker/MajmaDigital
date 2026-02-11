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
  
  if (!user) return null;

  const commissions = Array.isArray(user.commissions) ? user.commissions : [];
  const hasAdmin = commissions.some(c => safeLower(c) === 'administration');

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Accueil' },
    { id: 'commissions', icon: Layers, label: 'Pôles' },
    ...(hasAdmin ? [{ id: 'admin_dashboard', icon: ShieldCheck, label: 'Admin' }] : []),
    { id: 'profile', icon: User, label: 'Profil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[1000] lg:hidden">
      {/* Design Glassmorphism */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-2xl border-t border-slate-200/60 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"></div>
      
      <div className="relative flex justify-around items-center h-16 px-2 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'dashboard' && activeTab === 'admin_dashboard');
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 transition-all duration-300 ${
                isActive ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              <div className={`p-1 transition-transform duration-500 ${isActive ? 'scale-110 -translate-y-0.5' : ''}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          );
        })}
        
        <button 
          onClick={() => logout()} 
          className="flex flex-col items-center justify-center gap-1 flex-1 text-rose-400 active:scale-90 transition-transform"
        >
          <LogOut size={22} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Quitter</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileNav;