
import React, { useState } from 'react';
import { 
  ShieldAlert, Activity, LayoutGrid, Vote, Siren, LogOut, Radar, Brain, FileText, Globe, Lock
} from 'lucide-react';
import GlobalOverview from './GlobalOverview';
import CommissionMatrix from './CommissionMatrix';
import CrisisManager from './CrisisManager';
import DecisionHub from './DecisionHub';
import PredictiveAnalytics from './PredictiveAnalytics';
import BureauReportDashboard from './BureauReportDashboard';
import StrategicOversight from './StrategicOversight';
import { CrisisLevel } from '../../types';

const WarRoomLayout: React.FC = () => {
  const [activeView, setActiveView] = useState('overview');
  const [crisisLevel, setCrisisLevel] = useState<CrisisLevel>(CrisisLevel.NORMAL);

  return (
    <div className={`h-full flex flex-col bg-slate-950 text-slate-200 overflow-hidden font-sans transition-colors duration-1000 ${
      crisisLevel === CrisisLevel.CRITICAL ? 'shadow-[inset_0_0_100px_rgba(220,38,38,0.2)]' : ''
    }`}>
      {/* Top Command Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 text-emerald-500">
               <ShieldAlert size={20} />
               <span className="font-black text-sm tracking-widest uppercase">Majma OS <span className="opacity-50">v3.0</span></span>
            </div>
            <div className="h-6 w-px bg-slate-800"></div>
            <div className="flex gap-1">
               {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>)}
            </div>
         </div>

         <div className="flex items-center gap-6">
            <div className={`px-4 py-1.5 rounded-lg border flex items-center gap-3 transition-all ${
               crisisLevel === CrisisLevel.CRITICAL 
                 ? 'bg-red-500/10 border-red-500/50 text-red-500 animate-pulse' 
                 : crisisLevel === CrisisLevel.WARNING 
                 ? 'bg-amber-500/10 border-amber-500/50 text-amber-500'
                 : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
            }`}>
               <Activity size={14} />
               <span className="text-[10px] font-black uppercase tracking-widest">DEFCON: {crisisLevel}</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
               <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
               <span className="text-[10px] font-bold text-slate-400 uppercase">Dieuwrines Connectés: 4/12</span>
            </div>
            {/* Le bouton logout ramène simplement à la vue dashboard via App.tsx si on voulait gérer la navigation, mais ici c'est géré par le parent */}
         </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
         {/* Sidebar Navigation */}
         <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
            <nav className="p-4 space-y-2">
               {[
                 { id: 'overview', label: 'Vue Globale', icon: Radar },
                 { id: 'strategic', label: 'Supervision Stratégique', icon: Globe },
                 { id: 'analytics', label: 'Analytics Prédictifs', icon: Brain },
                 { id: 'reports', label: 'Rapports & PV', icon: FileText },
                 { id: 'commissions', label: 'Matrice Commissions', icon: LayoutGrid },
                 { id: 'crisis', label: 'Gestion de Crise', icon: Siren, alert: crisisLevel === CrisisLevel.CRITICAL },
                 { id: 'decisions', label: 'Décisions & Votes', icon: Vote },
               ].map(item => (
                 <button
                   key={item.id}
                   onClick={() => setActiveView(item.id)}
                   className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all group ${
                     activeView === item.id 
                       ? 'bg-slate-800 text-white shadow-lg border border-slate-700' 
                       : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'
                   } ${item.alert ? 'animate-pulse text-red-500 border-red-900/30 bg-red-900/10' : ''}`}
                 >
                    <div className="flex items-center gap-3">
                       <item.icon size={18} />
                       <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                    </div>
                    {activeView === item.id && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div>}
                 </button>
               ))}
            </nav>
            
            <div className="mt-auto p-6 border-t border-slate-800">
               <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-mono mb-2">CRYPTAGE SSL 256-BIT</p>
                  <div className="flex items-center gap-2 text-emerald-600">
                     <Lock size={12} />
                     <span className="text-[9px] font-black uppercase">Connexion Sécurisée</span>
                  </div>
               </div>
            </div>
         </aside>

         {/* Main Content Area */}
         <main className="flex-1 overflow-y-auto custom-scrollbar bg-slate-950 p-8 relative">
            <div className="max-w-[1600px] mx-auto">
               {activeView === 'overview' && <GlobalOverview />}
               {activeView === 'strategic' && <StrategicOversight />}
               {activeView === 'analytics' && <PredictiveAnalytics />}
               {activeView === 'reports' && <BureauReportDashboard />}
               {activeView === 'commissions' && <CommissionMatrix />}
               {activeView === 'crisis' && <CrisisManager level={crisisLevel} setLevel={setCrisisLevel} />}
               {activeView === 'decisions' && <DecisionHub />}
            </div>
         </main>
      </div>
    </div>
  );
};

export default WarRoomLayout;
