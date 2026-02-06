
import React, { useMemo } from 'react';
import { Book, History, ShieldCheck, Bookmark, Sparkles, ChevronRight, Play, ExternalLink, Users, Camera, Plus } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const HeritageHub: React.FC = () => {
  const { library } = useData();
  
  // Filtrer les ressources de type 'Patrimoine' ou 'Histoire'
  const traditions = useMemo(() => {
     return library.filter(r => r.category === 'Histoire' || r.category === 'Patrimoine');
  }, [library]);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Patrimoine Culturel & Valeurs</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Book size={14} className="text-rose-500" /> Transmettre le leg spirituel aux nouvelles générations
          </p>
        </div>
        <div className="flex gap-3">
            <button className="px-6 py-4 bg-white border border-slate-100 rounded-2xl text-slate-600 font-black uppercase text-[10px] tracking-widest shadow-sm flex items-center gap-2">
                <Plus size={14}/> Proposer Contenu
            </button>
            <div className="px-6 py-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700 flex items-center gap-3">
                <Sparkles size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Certifié par les Sages</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {traditions.length > 0 ? traditions.map((t, i) => (
          <div key={i} className="glass-card p-10 group hover:border-rose-100 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden h-full flex flex-col bg-white">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] font-arabic text-8xl pointer-events-none rotate-12 group-hover:scale-150 transition-transform duration-1000">و</div>
             <div className="flex justify-between items-start mb-10">
                <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-rose-50 group-hover:text-rose-600 transition-all">
                  <Book size={28} />
                </div>
                <button className="p-2 text-slate-200 hover:text-rose-500 transition-colors"><Bookmark size={20}/></button>
             </div>
             <h4 className="text-xl font-black text-slate-800 leading-tight mb-4">{t.title}</h4>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10">Auteur : {t.author}</p>
             
             <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl group-hover:bg-rose-600 transition-all active:scale-95">Consulter <Play size={12} className="fill-current"/></button>
                <div className="p-2 bg-slate-50 text-slate-300 rounded-lg group-hover:text-rose-400 transition-colors"><ChevronRight size={18}/></div>
             </div>
          </div>
        )) : (
          <div className="col-span-3 flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/30">
             <Book size={48} className="mb-4 opacity-20"/>
             <p className="text-xs font-bold uppercase">Archives en cours de numérisation</p>
             <p className="text-[10px] text-slate-400 mt-2">Le patrimoine du Dahira sera bientôt accessible ici.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Intergenerational Section */}
         <div className="lg:col-span-8 glass-card p-10 bg-white relative overflow-hidden group">
            <div className="flex items-center gap-4 mb-10">
               <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><Users size={24}/></div>
               <h4 className="text-xl font-black text-slate-900">Transmission Intergénérationnelle</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <p className="text-sm font-medium text-slate-600 leading-relaxed italic border-l-4 border-rose-200 pl-6">
                    "Chaque ancien est une bibliothèque vivante. Ce mois-ci, nous collectons les mémoires vocales des membres fondateurs du quartier Médina."
                  </p>
                  <div className="space-y-4">
                     <p className="text-xs text-slate-400 italic">Aucun témoignage enregistré pour le moment.</p>
                  </div>
               </div>
               <div className="aspect-square bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-10 text-center group-hover:bg-rose-50 group-hover:border-rose-200 transition-all cursor-pointer">
                  <div className="p-4 bg-white rounded-2xl shadow-xl text-rose-300 group-hover:text-rose-600 transition-all mb-4"><Camera size={32}/></div>
                  <h5 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2">Atelier Souvenirs</h5>
                  <p className="text-[10px] text-slate-400 mt-2">Uploadez des archives historiques (Photos, Audios) pour la base de données du patrimoine.</p>
               </div>
            </div>
         </div>

         {/* Digital Preservation Sidebar */}
         <div className="lg:col-span-4 glass-card p-10 bg-slate-900 text-white">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] mb-10 opacity-50 flex items-center gap-2">Stats Patrimoine</h4>
            <div className="space-y-8">
               {[
                 { label: 'Récits Collectés', val: traditions.length, target: 50 },
                 { label: 'Archives Photos', val: 0, target: 1000 },
                 { label: 'Vidéos Témoignages', val: 0, target: 15 },
               ].map((stat, i) => (
                 <div key={i} className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                       <span className="opacity-50">{stat.label}</span>
                       <span>{stat.val}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${Math.min(100, (stat.val/stat.target)*100)}%` }}></div>
                    </div>
                 </div>
               ))}
               <button className="w-full mt-6 py-4 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 active:scale-95">Générer Livre d'Or Digital</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default HeritageHub;
