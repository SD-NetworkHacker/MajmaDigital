
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Activity, LayoutGrid, Vote, Siren, Radar, 
  Brain, FileText, Globe, Lock, Menu, X, ChevronRight, Zap
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [time, setTime] = useState(new Date());

  // Horloge temps réel pour l'effet "Live"
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = () => {
    switch (crisisLevel) {
      case CrisisLevel.CRITICAL: return 'text-red-500 border-red-500/50 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.3)]';
      case CrisisLevel.WARNING: return 'text-amber-500 border-amber-500/50 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.2)]';
      default: return 'text-emerald-500 border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]';
    }
  };

  const navItems = [
    { id: 'overview', label: 'Vue Globale', icon: Radar },
    { id: 'strategic', label: 'Stratégie', icon: Globe },
    { id: 'analytics', label: 'I.A. Prédictive', icon: Brain },
    { id: 'decisions', label: 'Arbitrage', icon: Vote },
    { id: 'commissions', label: 'Commissions', icon: LayoutGrid },
    { id: 'reports', label: 'Rapports', icon: FileText },
    { id: 'crisis', label: 'Urgence', icon: Siren, alert: crisisLevel === CrisisLevel.CRITICAL },
  ];

  return (
    <div className="h-full flex bg-[#030712] text-slate-200 overflow-hidden font-sans relative">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-[#030712] pointer-events-none z-0"></div>
      {crisisLevel === CrisisLevel.CRITICAL && (
         <div className="absolute inset-0 border-[4px] border-red-600/30 pointer-events-none z-50 animate-pulse"></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`relative z-20 flex flex-col bg-slate-950/80 backdrop-blur-xl border-r border-slate-800 transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
        
        {/* Brand */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          {isSidebarOpen ? (
             <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-900/30 rounded-lg border border-emerald-500/30 text-emerald-400">
                   <ShieldAlert size={20} />
                </div>
                <div>
                   <h1 className="font-black text-sm tracking-widest text-white uppercase leading-none">Majma<span className="text-emerald-500">.OS</span></h1>
                   <p className="text-[9px] text-slate-500 font-mono">BUREAU EXÉCUTIF</p>
                </div>
             </div>
          ) : (
             <div className="mx-auto text-emerald-500"><ShieldAlert size={24} /></div>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-500 hover:text-white transition-colors">
             {isSidebarOpen ? <ChevronRight className="rotate-180" size={16} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
           {navItems.map(item => (
             <button
               key={item.id}
               onClick={() => setActiveView(item.id)}
               className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all group relative overflow-hidden ${
                 activeView === item.id 
                   ? 'bg-gradient-to-r from-emerald-900/40 to-transparent border border-emerald-500/30 text-emerald-400' 
                   : 'text-slate-400 hover:bg-slate-900 hover:text-white'
               } ${item.alert ? 'animate-pulse bg-red-900/20 text-red-500 border-red-500/30' : ''}`}
             >
                {activeView === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>}
                
                <div className={`p-1.5 rounded-lg transition-colors ${activeView === item.id ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-900 text-slate-500 group-hover:text-white'}`}>
                   <item.icon size={18} />
                </div>
                
                {isSidebarOpen && (
                   <span className="text-xs font-bold uppercase tracking-wide flex-1 text-left">{item.label}</span>
                )}
                
                {isSidebarOpen && activeView === item.id && (
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]"></div>
                )}
             </button>
           ))}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-800">
           {isSidebarOpen ? (
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800/50 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                    <Lock size={14} />
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-300">Connexion Sécurisée</p>
                    <p className="text-[9px] text-slate-600 font-mono">ID: {Math.floor(Date.now() / 1000).toString(16).toUpperCase()}</p>
                 </div>
              </div>
           ) : (
              <div className="flex justify-center text-slate-600"><Lock size={16}/></div>
           )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
         {/* Top HUD Bar */}
         <header className="h-20 border-b border-slate-800/60 bg-[#030712]/80 backdrop-blur-md flex justify-between items-center px-8 shrink-0">
            <div className="flex items-center gap-6">
               <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                  {navItems.find(n => n.id === activeView)?.label}
               </h2>
               <div className="h-6 w-px bg-slate-800"></div>
               <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  LIVE SYSTEM
               </div>
            </div>

            <div className="flex items-center gap-6">
               <div className="hidden md:block text-right">
                  <p className="text-xl font-black font-mono text-slate-200 leading-none">{time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{time.toLocaleDateString()}</p>
               </div>
               
               <div className={`px-5 py-2 rounded-xl border flex items-center gap-3 transition-all ${getStatusColor()}`}>
                  <Activity size={16} />
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black uppercase opacity-70">Niveau de Menace</span>
                     <span className="text-xs font-black uppercase tracking-widest">{crisisLevel}</span>
                  </div>
               </div>
               
               <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold shadow-lg">
                  BE
               </div>
            </div>
         </header>

         {/* Content Scroll Area */}
         <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 relative">
            {/* Background Grid Pattern in Content */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
            
            <div className="relative z-10 max-w-[1920px] mx-auto">
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
