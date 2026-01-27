
import React from 'react';
import { History, Camera, Mic, Map, BookHeart, ChevronRight } from 'lucide-react';

const HeritageHub: React.FC = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-8">
            <div className="glass-card p-10 bg-gradient-to-br from-amber-900 to-amber-950 text-white relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 text-amber-200"><History size={32} /></div>
                     <h4 className="font-black text-sm uppercase tracking-[0.2em] text-amber-100/60">Mémoire Vivante</h4>
                  </div>
                  <h2 className="text-4xl font-black mb-6 tracking-tight font-serif">L'Histoire du Dahira</h2>
                  <p className="text-sm font-medium leading-relaxed opacity-80 mb-10 max-w-xl font-serif">
                    "Plongez dans les récits des fondateurs, découvrez les premières correspondances et revivez les moments clés qui ont bâti notre communauté depuis 1995."
                  </p>
                  <button className="px-8 py-4 bg-white text-amber-950 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 hover:bg-amber-50 transition-all">
                     <BookHeart size={16}/> Explorer la Frise Chronologique
                  </button>
               </div>
               <div className="absolute -right-20 -bottom-20 opacity-10 font-arabic text-[15rem] rotate-12 pointer-events-none">ت</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="glass-card p-8 bg-white group cursor-pointer hover:border-amber-200 transition-all">
                  <div className="flex justify-between items-start mb-6">
                     <div className="p-4 bg-amber-50 text-amber-700 rounded-2xl"><Camera size={24}/></div>
                     <ChevronRight size={20} className="text-slate-300 group-hover:text-amber-600 transition-colors"/>
                  </div>
                  <h4 className="text-lg font-black text-slate-800 mb-2">Galerie Historique</h4>
                  <p className="text-xs text-slate-500">Archives photos des Magals de 1998 à nos jours.</p>
               </div>
               <div className="glass-card p-8 bg-white group cursor-pointer hover:border-indigo-200 transition-all">
                  <div className="flex justify-between items-start mb-6">
                     <div className="p-4 bg-indigo-50 text-indigo-700 rounded-2xl"><Mic size={24}/></div>
                     <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-600 transition-colors"/>
                  </div>
                  <h4 className="text-lg font-black text-slate-800 mb-2">Témoignages Oraux</h4>
                  <p className="text-xs text-slate-500">Enregistrements des anciens et sages du quartier.</p>
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-8">
            <div className="glass-card p-10 bg-white h-full flex flex-col relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
               <div className="relative z-10">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2"><Map size={14}/> Lieux Sacrés</h4>
                  <div className="space-y-6">
                     {[
                       { name: 'Grande Mosquée Touba', dist: '180 km', type: 'Sanctuaire' },
                       { name: 'Résidence Cheikhoul Khadim', dist: 'Dakar', type: 'Historique' },
                       { name: 'Khelcom', dist: 'Région Centre', type: 'Patrimoine' }
                     ].map((place, i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                          <div>
                             <p className="text-xs font-black text-slate-800">{place.name}</p>
                             <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{place.type}</p>
                          </div>
                          <span className="text-[9px] font-bold text-indigo-600">{place.dist}</span>
                       </div>
                     ))}
                  </div>
               </div>
               <button className="w-full mt-auto py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Voir Carte Interactive</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default HeritageHub;
