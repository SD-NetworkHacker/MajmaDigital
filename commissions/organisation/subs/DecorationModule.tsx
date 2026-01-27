
import React from 'react';
import { Palette, Layers, Users, Map, CheckCircle, Plus } from 'lucide-react';

const DecorationSubModule: React.FC = () => {
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
              <p className="text-[10px] text-slate-400 font-medium">Visualisation de l'agencement des bâches et du podium officiel pour le Magal.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-fuchsia-600 shadow-sm font-black text-xs">85%</div>
                 <div>
                    <p className="text-xs font-black text-slate-800">Montage Podium</p>
                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Équipe A en action</p>
                 </div>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm font-black text-xs">OK</div>
                 <div>
                    <p className="text-xs font-black text-slate-800">Moquettes & Tapis</p>
                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">Installation validée</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
           <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-50 flex items-center gap-2"><Users size={14}/> Équipe de Montage (Setup Crew)</h4>
              <div className="space-y-6">
                 {[
                   { name: 'Ousmane Cissé', role: 'Coord. Montage' },
                   { name: 'Birane Sarr', role: 'Technicien Sono' },
                   { name: 'Assane Ba', role: 'Éclairage' },
                 ].map((m, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-black text-xs">OC</div>
                         <div>
                            <p className="text-xs font-black">{m.name}</p>
                            <p className="text-[9px] opacity-60 uppercase tracking-widest">{m.role}</p>
                         </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 active:scale-95">Affecter Nouveau Bénévole</button>
           </div>

           <div className="glass-card p-10 bg-white">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-3">
                 <Palette size={18} /> Matériel de Déco Requis
              </h4>
              <div className="space-y-4">
                 {[
                   { l: 'Fleurs Fraîches (Autel)', s: true },
                   { l: 'Guirlandes LED 50m', s: true },
                   { l: 'Peinture blanche (5L)', s: false },
                   { l: 'Tissus satin blanc/vert', s: true },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between group cursor-pointer">
                      <span className={`text-[11px] font-bold ${item.s ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.l}</span>
                      <div className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${item.s ? 'bg-fuchsia-500 text-white' : 'bg-white border-2 border-slate-200 text-transparent'}`}>
                         <CheckCircle size={12} />
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-4 bg-fuchsia-50 text-fuchsia-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-fuchsia-100 hover:bg-fuchsia-100 transition-all">Commander Matériel</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DecorationSubModule;
