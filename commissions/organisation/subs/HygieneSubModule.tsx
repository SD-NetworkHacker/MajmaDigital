
import React from 'react';
import { Sparkles, ShieldCheck, Clock, Trash2, Droplets, AlertTriangle, CheckSquare } from 'lucide-react';

const HygieneSubModule: React.FC = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { l: 'Dernière Ronde', v: '--:--', c: 'text-slate-400', icon: Clock },
          { l: 'Score Propreté', v: '--%', c: 'text-slate-400', icon: ShieldCheck },
          { l: 'Stock Détergent', v: '--', c: 'text-slate-400', icon: Droplets },
          { l: 'Zones Traitées', v: '0/0', c: 'text-slate-400', icon: Sparkles },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 group hover:border-blue-100 transition-all flex flex-col justify-between">
             <div className="flex justify-between items-start mb-6">
                <div className={`p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-all`}>
                  <stat.icon size={20} />
                </div>
                <span className="text-[8px] font-black uppercase opacity-40">Live Status</span>
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.l}</p>
                <h4 className={`text-3xl font-black ${stat.c}`}>{stat.v}</h4>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-card p-10 bg-white flex flex-col items-center justify-center text-center">
           <h4 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-10 w-full text-left">
              <CheckSquare size={24} className="text-emerald-500" /> Plan de Nettoyage Stratégique
           </h4>
           <div className="py-12 text-slate-400">
              <p className="text-xs font-bold uppercase">Aucune zone de nettoyage définie</p>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-rose-50/50 border-rose-100/50">
              <h4 className="text-[11px] font-black text-rose-800 uppercase tracking-widest mb-8 flex items-center gap-3">
                 <AlertTriangle size={22} className="text-rose-600" /> Gestion des Déchets
              </h4>
              <div className="space-y-6">
                 <div className="p-4 bg-white rounded-2xl shadow-sm space-y-2 border border-rose-100">
                    <p className="text-[10px] font-black text-rose-600 uppercase">Collecte Camion</p>
                    <p className="text-[12px] font-medium text-slate-700 leading-relaxed italic">Aucune collecte planifiée.</p>
                 </div>
                 <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3"><Trash2 size={16}/> Signaler Zone Saturée</button>
              </div>
           </div>

           <div className="glass-card p-10 bg-white">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Fournitures Hygiène</h4>
              <div className="space-y-6">
                 {[
                   { l: 'Savon liquide', p: 0, c: 'bg-rose-500' },
                   { l: 'Papier Hygiénique', p: 0, c: 'bg-emerald-500' },
                   { l: 'Sacs Poubelle', p: 0, c: 'bg-amber-500' },
                 ].map((pole, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase">
                         <span>{pole.l}</span>
                         <span className={pole.p < 20 ? 'text-rose-600 font-black' : ''}>{pole.p}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                         <div className={`h-full ${pole.c}`} style={{ width: `${pole.p}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HygieneSubModule;
