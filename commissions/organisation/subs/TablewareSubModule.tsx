
import React from 'react';
import { GlassWater, List, CheckCircle, RefreshCcw, ShieldCheck, Box } from 'lucide-react';

const TablewareSubModule: React.FC = () => {
  return (
    <div className="space-y-8 animate-in zoom-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { l: 'Plateaux Servis', v: '84/120', c: 'text-purple-600', bg: 'bg-purple-50' },
          { l: 'Bols en Stock', v: '240', c: 'text-blue-600', bg: 'bg-blue-50' },
          { l: 'Verres Cristal', v: '150', c: 'text-emerald-600', bg: 'bg-emerald-50' },
          { l: 'Casses / Pertes', v: '03', c: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 group hover:border-purple-100 transition-all">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.l}</p>
             <h4 className={`text-3xl font-black ${stat.c}`}>{stat.v}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-card p-10 bg-white overflow-hidden relative">
           <div className="flex justify-between items-center mb-12">
              <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                 <RefreshCcw size={24} className="text-blue-500" /> Cycle de Nettoyage & Service
              </h4>
              <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl"><ShieldCheck size={14}/> Certifier Hygiène</button>
           </div>
           
           <div className="space-y-8">
              {[
                { title: 'Lot Marmites 1-6', status: 'En service', progress: 40, color: 'bg-purple-500' },
                { title: 'Plateaux Réception', status: 'Nettoyage en cours', progress: 85, color: 'bg-blue-500' },
                { title: 'Verres Salle d\'Attente', status: 'Prêt', progress: 100, color: 'bg-emerald-500' },
              ].map((lot, i) => (
                <div key={i} className="space-y-4">
                   <div className="flex justify-between items-center">
                      <div>
                         <p className="text-sm font-black text-slate-800">{lot.title}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{lot.status}</p>
                      </div>
                      <span className="text-xs font-black text-slate-900">{lot.progress}%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                      <div className={`h-full ${lot.color} transition-all duration-1000`} style={{ width: `${lot.progress}%` }}></div>
                   </div>
                </div>
              ))}
           </div>
           <div className="absolute -right-10 -bottom-10 opacity-[0.02] font-arabic text-[15rem] rotate-12 pointer-events-none">ص</div>
        </div>

        <div className="lg:col-span-4 glass-card p-10 bg-white">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-3">
              <Box size={18} /> Inventaire Critique Vaisselle
           </h4>
           <div className="space-y-6">
              {[
                { l: 'Cuillères de service', q: '12 U.', c: 'text-slate-800' },
                { l: 'Verres à thé', q: '48 U.', c: 'text-slate-800' },
                { l: 'Éponges / Savon', q: 'Stock Bas', c: 'text-rose-500 animate-pulse font-black' },
              ].map((inv, i) => (
                <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-4 last:border-none">
                   <span className="text-xs font-bold text-slate-600">{inv.l}</span>
                   <span className={`text-[11px] uppercase ${inv.c}`}>{inv.q}</span>
                </div>
              ))}
           </div>
           <button className="w-full mt-12 py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-purple-300 hover:text-purple-600 transition-all">Inventaire Complet</button>
        </div>
      </div>
    </div>
  );
};

export default TablewareSubModule;
