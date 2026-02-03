
import React from 'react';
import { Zap, Book, Box, LayoutGrid, Star, ChevronRight, Plus, Info, CheckCircle } from 'lucide-react';

const EventAnimator: React.FC = () => {
  // Liste vide
  const activityLibrary: any[] = [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Activity Repository */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                 <Book size={22} className="text-rose-600" /> Bibliothèque d'Animation
              </h3>
              <div className="flex gap-2">
                 <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Favoris</button>
                 <button className="px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-900/10"><Plus size={14} className="inline mr-2"/> Nouveau</button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
              {activityLibrary.length > 0 ? activityLibrary.map((act, i) => (
                <div key={i} className="glass-card p-8 group hover:border-rose-100 transition-all flex flex-col justify-between">
                   <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-all">
                        <Zap size={20} />
                      </div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{act.dur}</span>
                   </div>
                   <div>
                      <h4 className="text-lg font-black text-slate-800 leading-tight mb-2">{act.title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{act.category} • Impact : {act.impact}</p>
                   </div>
                   <div className="pt-6 mt-6 border-t border-slate-50 flex justify-between items-center">
                      <button className="text-[9px] font-black text-rose-600 uppercase flex items-center gap-2 hover:gap-4 transition-all">Fiche Technique <ChevronRight size={12}/></button>
                      <button className="p-2 text-slate-200 hover:text-amber-400 transition-colors"><Star size={16}/></button>
                   </div>
                </div>
              )) : (
                <div className="col-span-full flex flex-col items-center justify-center h-64 glass-card border-dashed border-2 border-slate-200 text-slate-400">
                   <Zap size={32} className="mb-4 opacity-20"/>
                   <p className="text-xs font-bold uppercase">Aucune activité référencée</p>
                </div>
              )}
           </div>
        </div>

        {/* Animation Gear Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-white border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-3">
                 <Box size={18} /> Inventaire Ludique
              </h4>
              <div className="space-y-6">
                 {[
                   { l: 'Sonorisation Mobile', s: 'Dispo', c: 'text-emerald-500' },
                   { l: 'Vidéoprojecteur HD', s: 'Dispo', c: 'text-emerald-500' },
                   { l: 'Lots de dossards', s: 'Dispo', c: 'text-emerald-500' },
                   { l: 'Jeux de société', s: 'Dispo', c: 'text-emerald-500' },
                 ].map((item, i) => (
                   <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-4 last:border-none">
                      <span className="text-xs font-bold text-slate-600">{item.l}</span>
                      <span className={`text-[10px] font-black uppercase ${item.c}`}>{item.s}</span>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Gérer les Prêts</button>
           </div>

           <div className="p-8 bg-rose-50/50 border border-rose-100 rounded-[2.5rem] flex items-start gap-4">
              <Info size={24} className="text-rose-600 shrink-0" />
              <p className="text-[12px] font-medium text-slate-700 leading-relaxed italic">
                "N'oubliez pas de remplir la fiche d'évaluation après chaque animation pour améliorer notre algorithme de suggestion."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EventAnimator;
