
import React, { useState } from 'react';
import { Palette, Layers, Users, Map, Plus, ClipboardList } from 'lucide-react';

const DecorationSubModule: React.FC = () => {
  // Liste des tâches de déco (Vide par défaut)
  const tasks: any[] = [];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 glass-card p-10 bg-white relative overflow-hidden group">
           <div className="flex justify-between items-center mb-12">
              <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                 <Palette size={24} className="text-fuchsia-600" /> Plan d'Aménagement & Déco
              </h4>
              <button className="p-3 bg-fuchsia-50 text-fuchsia-600 rounded-xl hover:bg-fuchsia-600 hover:text-white transition-all shadow-sm"><Map size={18}/></button>
           </div>
           
           <div className="aspect-video bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-12 group-hover:bg-white transition-all cursor-pointer">
              <div className="p-5 bg-white rounded-2xl shadow-xl text-slate-300 mb-6 group-hover:text-fuchsia-400 transition-all"><Layers size={40} /></div>
              <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2">Charger le Plan 3D / Photo</p>
              <p className="text-[10px] text-slate-400 font-medium">Aucun plan chargé pour le moment.</p>
           </div>

           <div className="mt-10">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><ClipboardList size={12}/> Tâches en cours</h5>
              {tasks.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tasks.map((task, i) => (
                       <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm font-black text-xs">--</div>
                          <div>
                             <p className="text-xs font-black text-slate-800">{task.name}</p>
                             <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">En attente</p>
                          </div>
                       </div>
                    ))}
                 </div>
              ) : (
                 <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 text-center text-slate-400 text-xs italic">
                    Aucune tâche de décoration ou d'aménagement définie.
                 </div>
              )}
              <button className="w-full mt-4 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-fuchsia-200 hover:text-fuchsia-600 transition-all flex items-center justify-center gap-2">
                 <Plus size={12}/> Ajouter une tâche
              </button>
           </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
           <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-50 flex items-center gap-2"><Users size={14}/> Équipe de Montage (Setup Crew)</h4>
              <div className="space-y-6">
                 <p className="text-xs text-slate-500 italic text-center">Aucun membre assigné au montage</p>
              </div>
              <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 active:scale-95">Affecter Nouveau Bénévole</button>
           </div>

           <div className="glass-card p-10 bg-white">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-3">
                 <Palette size={18} /> Matériel de Déco Requis
              </h4>
              <div className="space-y-4">
                 <p className="text-xs text-slate-400 italic text-center">Liste de matériel vide</p>
              </div>
              <button className="w-full mt-10 py-4 bg-fuchsia-50 text-fuchsia-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-fuchsia-100 hover:bg-fuchsia-100 transition-all">Commander Matériel</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DecorationSubModule;
