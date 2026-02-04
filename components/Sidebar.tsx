
import React from 'react';
import { 
  LayoutDashboard, Users, Landmark, CalendarRange, MessageSquare, 
  ShieldCheck, Settings, Map, Lock, BookOpen, Heart, Activity, 
  Wallet, Layers, Globe, CreditCard, Book, Bus, Star, User, Library
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlobalRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  
  // Logique de permission basée sur le backend MongoDB
  // Les rôles autorisés à voir le menu d'administration
  const adminRoles = [GlobalRole.ADMIN, GlobalRole.SG, GlobalRole.ADJOINT_SG, GlobalRole.DIEUWRINE];
  
  const isAdminOrManager = user && (adminRoles.includes(user.role as GlobalRole) || user.role === 'admin' || user.role === 'Super Admin');

  // MENU ADMINISTRATEUR (STANDARD)
  const adminNavigation = [
    {
      group: 'Pilotage',
      items: [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de Bord' },
        { id: 'admin', icon: ShieldCheck, label: 'Administration' },
      ]
    },
    {
      group: 'Communauté',
      items: [
        { id: 'members', icon: Users, label: 'Annuaire Membres' },
        { id: 'map', icon: Map, label: 'Cartographie' },
        { id: 'messages', icon: MessageSquare, label: 'Messagerie' },
      ]
    },
    {
      group: 'Pôles de Vie',
      items: [
        { id: 'pedagogy', icon: BookOpen, label: 'Pédagogie & Savoir' },
        { id: 'social', icon: Heart, label: 'Social & Solidarité' },
        { id: 'health', icon: Activity, label: 'Santé & Bien-être' },
      ]
    },
    {
      group: 'Opérations',
      items: [
        { id: 'finance', icon: Wallet, label: 'Trésorerie' },
        { id: 'events', icon: CalendarRange, label: 'Agenda & Events' },
        { id: 'commissions', icon: Layers, label: 'Toutes Commissions' },
      ]
    }
  ];

  // MENU MEMBRE SIMPLE (ENRICHI)
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
          { id: 'transport', icon: Bus, label: 'Transport' },
       ]
    }
  ];

  const navigation = isAdminOrManager ? adminNavigation : memberNavigation;

  return (
    <div className="h-full flex flex-col sidebar-glass bg-white/95 backdrop-blur-xl border-r border-slate-200/60 overflow-hidden">
      {/* Brand Section */}
      <div className="px-8 py-8 shrink-0 flex items-center gap-3 border-b border-slate-100/50">
         <div 
           className="relative w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20 cursor-pointer hover:scale-105 transition-transform duration-300"
           onClick={() => setActiveTab('dashboard')}
         >
            <span className="text-emerald-400 font-black text-xl font-arabic arabic-glow pb-1">م</span>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl"></div>
         </div>
         <div className="flex flex-col cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">Majma<span className="text-emerald-600">Digital</span></h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
               {isAdminOrManager ? 'Console Admin' : 'Espace Membre'}
            </p>
         </div>
      </div>

      {/* Navigation - Main Scrollable Area */}
      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar min-h-0">
        {navigation.map((section, idx) => (
          <div key={idx} className="space-y-3 animate-in slide-in-from-left-4" style={{ animationDelay: `${idx * 100}ms` }}>
            <h3 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
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
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 translate-x-1' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <item.icon 
                        size={18} 
                        strokeWidth={isActive ? 2.5 : 2} 
                        className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'}`} 
                      />
                      <span className={`text-[13px] font-medium tracking-tight ${isActive ? 'font-bold' : ''}`}>
                        {item.label}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        
        {/* Call to Action for Members (Example) */}
        {!isAdminOrManager && (
           <div className="mx-4 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg relative overflow-hidden group cursor-pointer" onClick={() => setActiveTab('finance')}>
              <div className="relative z-10">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">Adiya en cours</p>
                 <p className="text-xs font-medium">Participez à la collecte mensuelle.</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform"><Heart size={64}/></div>
           </div>
        )}
      </nav>

      {/* Footer Area - Fixed at bottom */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0 space-y-2">
         {/* Settings Shortcut */}
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

         {/* Bureau Exécutif Special Button (Admin Only) */}
         {isAdminOrManager && (
           <button 
             onClick={() => setActiveTab('bureau')}
             className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all border group relative overflow-hidden ${
               activeTab === 'bureau' 
                 ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-[1.02]' 
                 : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
             }`}
           >
              {activeTab === 'bureau' && <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent animate-pulse"></div>}
              
              <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${activeTab === 'bureau' ? 'bg-white/10 text-emerald-400' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-900 group-hover:text-white'}`}>
                <Lock size={14} />
              </div>
              <div className="text-left relative z-10 flex-1">
                 <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-0.5">Bureau Exécutif</p>
                 <p className={`text-[9px] ${activeTab === 'bureau' ? 'text-slate-400' : 'text-slate-400 group-hover:text-slate-500'}`}>Zone Restreinte</p>
              </div>
           </button>
         )}
      </div>
    </div>
  );
};

export default Sidebar;
