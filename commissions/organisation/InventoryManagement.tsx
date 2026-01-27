
import React from 'react';
import { Package, Search, Filter, Plus, PenTool, ShieldAlert, ChevronRight, Activity } from 'lucide-react';

const InventoryManagement: React.FC = () => {
  const equipment = [
    { name: 'Marmite Taille 80', qty: 12, condition: 'Bon', sub: 'Cuisine', nextCheck: '15 Juin' },
    { name: 'Bâche 10x15m', qty: 4, condition: 'Réparation', sub: 'Déco', nextCheck: 'Demain' },
    { name: 'Machine Espresso Pro', qty: 2, condition: 'Excel.', sub: 'Café', nextCheck: '01 Juil.' },
    { name: 'Plateaux de service', qty: 50, condition: 'Bon', sub: 'Vaisselle', nextCheck: '-' },
  ];

  return (
    <div className="space-y-8 animate-in zoom-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Inventaire du Matériel</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Package size={14} className="text-purple-500" /> Gestion des actifs fixes et suivi de maintenance
          </p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-4 bg-white border border-slate-100 rounded-2xl text-slate-600 font-black uppercase text-[10px] tracking-widest shadow-sm">Audit Global</button>
           <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3">
              <Plus size={18} /> Ajouter Matériel
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
           <div className="glass-card p-6 flex items-center gap-4 border-slate-100 bg-white shadow-sm">
              <div className="relative flex-1 group">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-purple-500 transition-colors" size={20} />
                 <input type="text" placeholder="Rechercher un équipement..." className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold shadow-sm focus:ring-4 focus:ring-purple-500/5 transition-all outline-none" />
              </div>
              <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-purple-600 transition-all shadow-sm"><Filter size={20}/></button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
              {equipment.map((item, i) => (
                <div key={i} className="glass-card p-8 group hover:border-purple-100 transition-all flex flex-col justify-between">
                   <div className="flex justify-between items-start mb-6">
                      <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-purple-50 group-hover:text-purple-600 transition-all">
                        <Package size={28} />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                        item.condition === 'Réparation' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>{item.condition}</span>
                   </div>
                   <h4 className="text-base font-black text-slate-800 leading-none mb-1">{item.name}</h4>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10">Pôle : {item.sub} • Stock : {item.qty}</p>
                   
                   <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-300 text-[10px] font-black uppercase">
                        <Activity size={12} /> Maintenance: {item.nextCheck}
                      </div>
                      <button className="p-2 text-slate-200 hover:text-purple-600 transition-colors"><PenTool size={18}/></button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-indigo-900 text-white relative overflow-hidden group shadow-2xl">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 opacity-50">Alertes Logistiques</h4>
              <div className="space-y-6 relative z-10">
                 <div className="flex items-center gap-4 text-rose-300">
                    <ShieldAlert size={24} />
                    <div>
                       <p className="text-xs font-black">Contrôle Bâche Darou</p>
                       <p className="text-[9px] opacity-60">Déchirure signalée après le dernier Thiant.</p>
                    </div>
                 </div>
                 <button className="w-full py-4 bg-white/10 hover:bg-white text-white hover:text-indigo-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">Planifier Réparation</button>
              </div>
           </div>

           <div className="glass-card p-10">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Répartition par Pôle</h4>
              <div className="space-y-6">
                 {[
                   { l: 'Cuisine', p: 45, c: 'bg-purple-500' },
                   { l: 'Décoration', p: 30, c: 'bg-emerald-500' },
                   { l: 'Sonorisation', p: 15, c: 'bg-blue-500' },
                   { l: 'Autre', p: 10, c: 'bg-slate-300' },
                 ].map((stat, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase">
                         <span>{stat.l}</span>
                         <span>{stat.p}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                         <div className={`h-full ${stat.c}`} style={{ width: `${stat.p}%` }}></div>
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

export default InventoryManagement;
