
import React from 'react';
import { Users, AlertTriangle, Map, Wallet, Activity } from 'lucide-react';

const GlobalOverview: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { l: 'Effectif Total', v: '0', icon: Users, c: 'text-blue-400', b: 'border-blue-500/20' },
           { l: 'Trésorerie', v: '0 F', icon: Wallet, c: 'text-emerald-400', b: 'border-emerald-500/20' },
           { l: 'Taux Actif', v: '0%', icon: Activity, c: 'text-purple-400', b: 'border-purple-500/20' },
           { l: 'Alertes', v: '0', icon: AlertTriangle, c: 'text-rose-400', b: 'border-rose-500/20' },
         ].map((k, i) => (
           <div key={i} className={`bg-slate-900/50 border ${k.b} p-6 rounded-2xl flex items-center justify-between`}>
              <div>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{k.l}</p>
                 <h3 className="text-3xl font-black text-slate-100 tracking-tighter">{k.v}</h3>
              </div>
              <div className={`p-3 bg-slate-950 rounded-xl ${k.c}`}><k.icon size={24} /></div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
         {/* Map Visualization (Mock) */}
         <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-8 relative overflow-hidden group flex items-center justify-center">
            <div className="text-center">
               <Map size={48} className="text-slate-700 mx-auto mb-4"/>
               <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Carte Tactique</p>
               <p className="text-[10px] text-slate-600 mt-2">Aucune donnée géographique disponible</p>
            </div>
         </div>

         {/* Alerts Feed */}
         <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col">
            <h4 className="text-sm font-black text-slate-300 uppercase tracking-widest mb-6 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-500"/> Flux d'Urgence</h4>
            <div className="flex-1 flex items-center justify-center">
               <p className="text-[10px] text-slate-600 uppercase font-mono">Aucune alerte signalée</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default GlobalOverview;
