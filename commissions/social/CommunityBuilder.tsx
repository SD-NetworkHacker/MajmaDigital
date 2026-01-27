
import React from 'react';
import { Users, UserPlus, Heart, Sparkles, Search, Filter, ChevronRight, MessageCircle, Star, Target } from 'lucide-react';

const CommunityBuilder: React.FC = () => {
  const matchingPool = [
    { name: 'Modou Ndiaye', role: 'Mentor', expertise: 'Entrepreneuriat', level: 'Ancien', matches: 3 },
    { name: 'Khady Diop', role: 'Filleule', interest: 'Xassaids', level: 'Nouvelle', matches: 1 },
    { name: 'Saliou Fall', role: 'Mentor', expertise: 'Études Tech', level: 'Ancien', matches: 5 },
  ];

  return (
    <div className="space-y-8 animate-in zoom-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Mentor Matching Area */}
        <div className="lg:col-span-8 glass-card p-10 bg-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-[0.03] font-arabic text-[15rem] pointer-events-none rotate-12">ص</div>
           <div className="relative z-10">
              <div className="flex justify-between items-center mb-12">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                      <UserPlus size={24} className="text-rose-600" /> Système de Parrainage (Nid de Fraternité)
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Algorithme de matching spirituel et professionnel</p>
                 </div>
                 <button className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"><Filter size={18}/></button>
              </div>

              <div className="space-y-4">
                 {matchingPool.map((p, i) => (
                   <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:border-rose-100 hover:shadow-xl hover:shadow-rose-900/5 transition-all">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center font-black text-rose-700 text-xl shadow-sm border border-slate-100 group-hover:bg-rose-600 group-hover:text-white transition-all">
                            {p.name.split(' ').map(n => n[0]).join('')}
                         </div>
                         <div>
                            <p className="text-base font-black text-slate-800 leading-none mb-2">{p.name}</p>
                            <div className="flex items-center gap-3">
                               <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${p.role === 'Mentor' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{p.role}</span>
                               <span className="text-[10px] text-slate-400 font-bold uppercase">{p.expertise || p.interest}</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="text-right hidden sm:block">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Score de Compatibilité</p>
                            <div className="flex gap-1 justify-end">
                               {[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= p.matches ? 'text-amber-400 fill-current' : 'text-slate-200'} />)}
                            </div>
                         </div>
                         <button className="px-5 py-3 bg-white border border-slate-100 text-slate-400 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-all shadow-sm font-black text-[10px] uppercase">Contacter</button>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                 <Sparkles size={18} /> Lancer Nouveau Cycle de Matching
              </button>
           </div>
        </div>

        {/* Groups of Interest Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group h-full">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 opacity-50 flex items-center gap-2"><Target size={14}/> Kurels d'Intérêt</h4>
              <div className="space-y-8 relative z-10">
                 {[
                   { l: 'Foot & Sport', c: 32, i: '⚽' },
                   { l: 'Business & Networking', c: 18, i: '💼' },
                   { l: 'Lecture & Poésie', c: 24, i: '📚' },
                   { l: 'Cuisine Fraternelle', c: 15, i: '🍲' },
                 ].map((g, i) => (
                   <div key={i} className="flex items-center justify-between group cursor-pointer hover:translate-x-2 transition-transform">
                      <div className="flex items-center gap-4">
                         <span className="text-2xl">{g.i}</span>
                         <div>
                            <p className="text-sm font-black">{g.l}</p>
                            <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest">{g.c} Membres</p>
                         </div>
                      </div>
                      <ChevronRight size={16} className="opacity-20 group-hover:opacity-100" />
                   </div>
                 ))}
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-5 font-arabic text-[12rem] rotate-12 pointer-events-none">ت</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityBuilder;
