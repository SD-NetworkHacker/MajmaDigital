
import React from 'react';
import { 
  LayoutDashboard, Users, FileText, Calendar, 
  Settings, FolderOpen, ArrowLeft, Activity, Shield 
} from 'lucide-react';
import { CommissionType } from '../../types';

interface SidebarCommissionProps {
  commission: CommissionType;
  isMember: boolean; // Si l'utilisateur est membre actif de cette commission
  activeTab: string;
  onTabChange: (tab: string) => void;
  onBack: () => void;
}

const SidebarCommission: React.FC<SidebarCommissionProps> = ({ 
  commission, 
  isMember, 
  activeTab, 
  onTabChange,
  onBack 
}) => {
  
  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { id: 'members', label: 'Effectif', icon: Users },
    { id: 'activities', label: 'Activités', icon: Calendar },
    { id: 'documents', label: 'Documents', icon: FolderOpen },
    ...(isMember ? [
      { id: 'admin', label: 'Gestion', icon: Settings, adminOnly: true } // Visible seulement si membre
    ] : [])
  ];

  return (
    <div className="w-full lg:w-72 flex flex-col h-full bg-white/50 backdrop-blur-md border-r border-slate-200/60 pt-6">
      
      {/* Header Sidebar */}
      <div className="px-6 mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-700 transition-colors mb-4 group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> 
          Retour Principal
        </button>
        
        <div>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded mb-2 inline-block">
            Commission
          </span>
          <h2 className="text-2xl font-black text-slate-900 leading-tight">{commission}</h2>
        </div>

        {/* Live Status Indicator */}
        <div className="mt-4 flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
          <div className="relative">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-800 uppercase">Statut : Actif</p>
            <p className="text-[9px] text-slate-400 font-medium">Réunion dans 2 jours</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                  : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm'
              }`}
            >
              <item.icon size={18} className={`${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-600'}`} />
              <span className="text-xs font-bold uppercase tracking-wide">{item.label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>}
            </button>
          );
        })}
      </nav>

      {/* Access Level Badge */}
      <div className="p-6 mt-auto">
        <div className={`p-4 rounded-2xl border ${isMember ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
          <div className="flex items-center gap-3 mb-2">
            <Shield size={16} className={isMember ? 'text-emerald-600' : 'text-slate-400'} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${isMember ? 'text-emerald-700' : 'text-slate-500'}`}>
              {isMember ? 'Accès Membre' : 'Accès Visiteur'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            {isMember 
              ? "Vous pouvez éditer les contenus et gérer les membres." 
              : "Mode lecture seule. Contactez le Dieuwrine pour rejoindre."}
          </p>
        </div>
      </div>

    </div>
  );
};

export default SidebarCommission;
