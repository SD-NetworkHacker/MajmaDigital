
import React from 'react';
import { 
  LayoutDashboard, Users, Landmark, CalendarRange, MessageSquare, 
  ShieldCheck, Wallet2, Settings, BookOpen, 
  HeartPulse, Heart, MapPinned, ChevronRight, Lock, LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { group: 'Principal', items: [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de Bord' },
      { id: 'members', icon: Users, label: 'Annuaire' },
      { id: 'map', icon: MapPinned, label: 'Cartographie' },
    ]},
    { group: 'Organisation', items: [
      { id: 'commissions', icon: Landmark, label: 'Commissions' },
      { id: 'events', icon: CalendarRange, label: 'Agenda Dahira' },
      { id: 'messages', icon: MessageSquare, label: 'Messagerie' },
    ]},
    { group: 'Cellules', items: [
      { id: 'pedagogy', icon: BookOpen, label: 'Enseignement' },
      { id: 'social', icon: Heart, label: 'Action Sociale' },
      { id: 'health', icon: HeartPulse, label: 'Santé & Bien-être' },
    ]},
    { group: 'Gestion', items: [
      { id: 'finance', icon: Wallet2, label: 'Finance & Trésor' },
      { id: 'admin', icon: ShieldCheck, label: 'Administration' },
      { id: 'settings', icon: Settings, label: 'Paramètres' },
    ]}
  ];

  return (
    <div className="h-full flex flex-col py-8 bg-white/50">
      {/* Brand Section */}
      <div className="px-8 mb-10">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20 transition-all group-hover:rotate-6 group-hover:scale-110">
            <span className="text-white font-black text-xl font-arabic arabic-glow">م</span>
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">MajmaDigital</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Platform v3.0</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-8 overflow-y-auto no-scrollbar">
        {menuItems.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h3 className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 opacity-80">{section.group}</h3>
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 group relative overflow-hidden ${
                  activeTab === item.id 
                    ? 'bg-emerald-50 text-emerald-700 font-bold shadow-sm border border-emerald-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-3.5 relative z-10">
                  <item.icon 
                    size={18} 
                    strokeWidth={activeTab === item.id ? 2.5 : 2} 
                    className={activeTab === item.id ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600 transition-colors'} 
                  />
                  <span className="text-[13px] tracking-tight">
                    {item.label}
                  </span>
                </div>
                {activeTab === item.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                )}
              </button>
            ))}
          </div>
        ))}
        
        {/* Zone Bureau Exécutif */}
        <div className="pt-4 mt-4 border-t border-slate-100 px-4 pb-10">
           <button 
             onClick={() => setActiveTab('bureau')}
             className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all border group ${
               activeTab === 'bureau' 
                 ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                 : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 shadow-sm'
             }`}
           >
              <div className={`p-1.5 rounded-lg transition-colors ${activeTab === 'bureau' ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                <Lock size={14} />
              </div>
              <div className="text-left">
                 <p className="text-[10px] font-black uppercase tracking-widest">Bureau Exécutif</p>
                 <p className={`text-[9px] ${activeTab === 'bureau' ? 'opacity-60' : 'text-slate-400'}`}>Accès Restreint</p>
              </div>
           </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
