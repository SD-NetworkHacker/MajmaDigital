
import React from 'react';
import { Users, AlertTriangle, Map, Wallet, Activity, ArrowUpRight, Signal, Zap, Globe, Shield } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const GlobalOverview: React.FC = () => {
  const { totalTreasury, activeMembersCount, members, contributions } = useData();

  // Mock data for graphs/visuals
  const onlineMembers = Math.floor(activeMembersCount * 0.15); // 15% online fake
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. TOP STATS ROW (BENTO GRID START) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         
         {/* EFFECTIF */}
         <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-blue-500"><Users size={64}/></div>
            <div className="flex justify-between items-start mb-8">
               <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20"><Users size={20}/></div>
               <span className="flex items-center gap-1 text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                  <ArrowUpRight size={10}/> +12%
               </span>
            </div>
            <div>
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Effectif Actif</p>
               <h3 className="text-4xl font-black text-white tracking-tighter">{activeMembersCount}</h3>
               <p className="text-[10px] text-blue-400 font-medium mt-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span> {onlineMembers} Connectés maintenant
               </p>
            </div>
         </div>

         {/* TRÉSORERIE */}
         <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="absolute -bottom-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-emerald-500"><Wallet size={100}/></div>
            <div className="flex justify-between items-start mb-8">
               <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20"><Wallet size={20}/></div>
               <span className="text-[9px] font-black uppercase text-slate-400">Solde Live</span>
            </div>
            <div>
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Trésorerie Globale</p>
               <h3 className="text-3xl font-black text-white tracking-tighter truncate">{(totalTreasury / 1000000).toFixed(2)}M <span className="text-sm opacity-50 text-slate-500">FCFA</span></h3>
               <div className="w-full h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[75%] shadow-[0_0_10px_#10b981]"></div>
               </div>
            </div>
         </div>

         {/* PERFORMANCE */}
         <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-purple-500/30 transition-all">
            <div className="flex justify-between items-start mb-6">
               <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20"><Activity size={20}/></div>
               <Zap size={16} className="text-amber-400 fill-current"/>
            </div>
            <div className="relative z-10">
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Performance Dahira</p>
               <h3 className="text-4xl font-black text-white tracking-tighter">98<span className="text-lg text-slate-600">%</span></h3>
               <div className="flex gap-1 mt-3">
                  {[1,2,3,4,5].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i < 5 ? 'bg-purple-500' : 'bg-slate-800'}`}></div>)}
               </div>
            </div>
         </div>

         {/* ALERTES */}
         <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-rose-500/30 transition-all">
            <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-8">
               <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-400 border border-rose-500/20"><AlertTriangle size={20}/></div>
               <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
               </span>
            </div>
            <div>
               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Signaux Faibles</p>
               <h3 className="text-3xl font-black text-white tracking-tighter">0</h3>
               <p className="text-[10px] text-slate-400 font-medium mt-2">Système nominal</p>
            </div>
         </div>
      </div>

      {/* 2. MAIN VISUALIZATION ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
         
         {/* TACTICAL MAP */}
         <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] relative overflow-hidden group">
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
            
            {/* Header Overlay */}
            <div className="absolute top-6 left-6 z-10 flex gap-4">
               <div className="px-4 py-2 bg-slate-950/80 backdrop-blur-md border border-slate-700 rounded-xl text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  <Globe size={14} className="text-emerald-500" />
                  Couverture Territoire
               </div>
               <div className="px-4 py-2 bg-slate-950/80 backdrop-blur-md border border-slate-700 rounded-xl text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  <Signal size={14} className="text-emerald-500 animate-pulse" />
                  Live GPS
               </div>
            </div>

            {/* Central Visual (Abstract Map) */}
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="relative">
                  <div className="w-64 h-64 border border-emerald-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                  <div className="w-48 h-48 border border-emerald-500/30 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_15s_linear_infinite_reverse]"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_20px_#10b981]"></div>
                  
                  {/* Mock Hotspots */}
                  <div className="absolute top-10 right-20 w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_15px_#3b82f6]"></div>
                  <div className="absolute bottom-20 left-10 w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-[0_0_15px_#f59e0b]"></div>
                  
                  <Map size={32} className="text-slate-700 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"/>
               </div>
            </div>
            
            {/* Footer Stats Overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between">
               <div className="p-4 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-800">
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Zones Actives</p>
                  <p className="text-lg font-black text-white">12 Quartiers</p>
               </div>
               <div className="p-4 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-800 text-right">
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Dernier Signal</p>
                  <p className="text-lg font-black text-emerald-500 font-mono">14:02:56</p>
               </div>
            </div>
         </div>

         {/* LIVE FEED & ALERTS */}
         <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col relative overflow-hidden">
            <h4 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2 z-10">
               <Shield size={16} className="text-slate-500"/> Journal Sécurité
            </h4>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 relative z-10 pr-2">
               {/* Mock Logs */}
               <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 border-l-4 border-l-emerald-500 flex gap-3">
                  <span className="text-[9px] font-mono text-slate-500 mt-1">10:45</span>
                  <div>
                     <p className="text-xs font-bold text-slate-200">Connexion Admin</p>
                     <p className="text-[10px] text-slate-500">IP: 192.168.1.1 (Dakar)</p>
                  </div>
               </div>
               <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 border-l-4 border-l-blue-500 flex gap-3">
                  <span className="text-[9px] font-mono text-slate-500 mt-1">09:30</span>
                  <div>
                     <p className="text-xs font-bold text-slate-200">Backup Système</p>
                     <p className="text-[10px] text-slate-500">Sauvegarde cloud effectuée.</p>
                  </div>
               </div>
               <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 border-l-4 border-l-amber-500 flex gap-3">
                  <span className="text-[9px] font-mono text-slate-500 mt-1">Hier</span>
                  <div>
                     <p className="text-xs font-bold text-slate-200">Tentative accès</p>
                     <p className="text-[10px] text-slate-500">Échec login (3 tentatives)</p>
                  </div>
               </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 z-10">
               <button className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                  Voir Historique Complet
               </button>
            </div>
         </div>

      </div>
    </div>
  );
};

export default GlobalOverview;
