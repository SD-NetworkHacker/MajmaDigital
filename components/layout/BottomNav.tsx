import React from 'react';
import { LayoutDashboard, Wallet, Layers, User, Settings, Sparkles } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Accueil' },
    { id: 'finance_perso', icon: Wallet, label: 'Finances' },
    { id: 'commissions', icon: Layers, label: 'Pôles' },
    { id: 'profile', icon: User, label: 'Profil' },
    { id: 'settings', icon: Settings, label: 'Plus' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[1000] lg:hidden">
      {/* Background avec flou gaussien et bordure supérieure fine */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-2xl border-t border-slate-200/60 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"></div>
      
      <div className="relative flex items-center justify-around px-2 pt-3 pb-[calc(1.2rem+var(--sab,0px))]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'dashboard' && activeTab === 'admin_dashboard');
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all relative"
            >
              {/* Glow effect derrière l'icône active */}
              {isActive && (
                <div className="absolute -top-1 w-8 h-8 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
              )}
              
              <div className={`p-1.5 rounded-xl transition-all duration-500 ${
                isActive 
                ? 'text-emerald-600 scale-110 -translate-y-1' 
                : 'text-slate-400 active:scale-90'
              }`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              <span className={`text-[9px] font-black uppercase tracking-tighter transition-all duration-300 ${
                isActive ? 'text-emerald-700 opacity-100' : 'text-slate-400 opacity-70'
              }`}>
                {item.label}
              </span>

              {/* Petit indicateur de point émeraude */}
              {isActive && (
                <div className="absolute -top-2 w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;