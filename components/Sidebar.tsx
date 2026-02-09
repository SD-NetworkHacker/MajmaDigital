import React from 'react';
import { 
  LayoutDashboard, Users, Landmark, CalendarRange, MessageSquare, 
  ShieldCheck, Settings, Map, Lock, BookOpen, Heart, Activity, 
  Wallet, Layers, Globe, CreditCard, Book, Bus, Star, User, Library,
  Cpu, ShieldAlert, Terminal, Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlobalRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  
  // Fixed: Moved MegaphoneIcon definition above its usage in sgNavigation to avoid Temporal Dead Zone error
  const MegaphoneIcon = (props: any) => <MessageSquare {...props} />;

  const isSystemAdmin = user?.role === 'ADMIN';
  const isSG = user?.role === 'SG' || user?.role === 'ADJOINT_SG';
  const isAdminComm = user?.commissions?.some(c => c.type === 'Administration');

  // 1. MENU ADMIN SYSTÈME (Technique uniquement)
  const systemAdminNavigation = [
    {
      group: 'Infrastructure',
      items: [
        { id: 'dashboard', icon: Cpu, label: 'Santé Serveur' },
        { id: 'admin', icon: Terminal, label: 'Console Système' },
        { id: 'database', icon: Database, label: 'Atlas DB' },
      ]
    },
    {
      group: 'Audit',
      items: [
        { id: 'members', icon: Users, label: 'Comptes Users' },
        { id: 'security', icon: ShieldAlert, label: 'Sécurité Réseau' },
      ]
    }
  ];

  // 2. MENU PILOTAGE DAHIRA (SG & Commission Admin)
  const sgNavigation = [
    {
      group: 'Gouvernance',
      items: [
        { id: 'dashboard', icon: Landmark, label: 'Tableau de Bord' },
        { id: 'members', icon: Users, label: 'Gestion Membres' },
        { id: 'finance', icon: Wallet, label: 'Trésorerie Centrale' },
      ]
    },
    {
      group: 'Opérations',
      items: [
        { id: 'commissions', icon: Layers, label: 'Coord. Commissions' },
        { id: 'events', icon: CalendarRange, label: 'Calendrier National' },
        { id: 'messages', icon: MegaphoneIcon, label: 'Annonces Bureau' },
      ]
    }
  ];

  // 3. MENU MEMBRE SIMPLE
  const memberNavigation = [
    {
       group: 'Mon Espace',
       items: [
          { id: 'dashboard', icon: LayoutDashboard, label: 'Accueil' },
          { id: 'profile', icon: User, label: 'Mon Profil & Carte' },
          { id: 'finance', icon: Wallet, label: 'Mes Cotisations' },
       ]
    },
    {
       group: 'Vie Spirituelle',
       items: [
          { id: 'pedagogy', icon: BookOpen, label: 'Académie Khassaide' },
          { id: 'culturelle', icon: Library, label: 'Médiathèque' },
       ]
    },
    {
       group: 'Vie Sociale',
       items: [
          { id: 'events', icon: CalendarRange, label: 'Événements' },
          { id: 'social', icon: Heart, label: 'Solidarité' },
       ]
    }
  ];

  const getNavigation = () => {
    if (isSystemAdmin) return systemAdminNavigation;
    if (isSG || isAdminComm) return sgNavigation;
    return memberNavigation;
  };

  const navigation = getNavigation();

  return (
    <div className="h-full flex flex-col sidebar-glass bg-white/95 backdrop-blur-xl border-r border-slate-200/60 overflow-hidden">
      {/* Brand Section */}
      <div className="px-8 py-8 shrink-0 flex items-center gap-3 border-b border-slate-100/50">
         <div 
           className={`relative w-10 h-10 rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300 ${isSG || isAdminComm ? 'bg-[#059669]' : 'bg-slate-900'}`}
           onClick={() => setActiveTab('dashboard')}
         >
            <span className={`font-black text-xl font-arabic arabic-glow pb-1 ${isSG || isAdminComm ? 'text-[#D4AF37]' : 'text-emerald-400'}`}>م</span>
         </div>
         <div className="flex flex-col cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">Majma<span className="text-emerald-600">Digital</span></h1>
            <p className={`text-[9px] font-bold uppercase tracking-[0.2em] mt-1 ${isSG || isAdminComm ? 'text-[#D4AF37]' : 'text-slate-400'}`}>
               {isSystemAdmin ? 'System Root' : (isSG || isAdminComm ? 'PILOTAGE DAHIRA' : 'Espace Membre')}
            </p>
         </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar min-h-0">
        {navigation.map((section, idx) => (
          <div key={idx} className="space-y-3 animate-in slide-in-from-left-4" style={{ animationDelay: `${idx * 100}ms` }}>
            <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60 flex items-center gap-2">
              <span className={`w-1 h-1 rounded-full ${isSG || isAdminComm ? 'bg-[#D4AF37]' : 'bg-slate-300'}`}></span>
              {section.group}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                      isActive 
                        ? (isSG || isAdminComm ? 'bg-[#059669] text-white shadow-lg shadow-emerald-900/20 translate-x-1' : 'bg-slate-900 text-white shadow-lg translate-x-1')
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <item.icon 
                        size={18} 
                        className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'}`} 
                      />
                      <span className={`text-[13px] font-medium tracking-tight ${isActive ? 'font-bold' : ''}`}>
                        {item.label}
                      </span>
                    </div>
                    {isActive && (
                      <div className={`w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]`}></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Area */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0 space-y-2">
         <button 
           onClick={() => setActiveTab('settings')}
           className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
             activeTab === 'settings' 
               ? 'bg-white text-slate-900 font-bold shadow-sm border border-slate-200' 
               : 'text-slate-500 hover:bg-white hover:text-slate-800'
           }`}
         >
            <Settings size={18} className={`transition-colors ${activeTab === 'settings' ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
            <span className="text-xs font-bold">Paramètres</span>
         </button>
      </div>
    </div>
  );
};

export default Sidebar;