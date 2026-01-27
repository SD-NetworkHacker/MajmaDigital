
import React from 'react';
// Added Plus to the lucide-react imports
import { Brain, Heart, Users, MessageSquare, ChevronRight, Play, Info, Sparkles, Wind, Sun, Plus } from 'lucide-react';

const MentalHealthSupport: React.FC = () => {
  const groups = [
    { name: 'Cercle de Résilience', time: 'Mardi 21h00', members: 12, topic: 'Gestion du stress' },
    { name: 'Sérénité Spirituelle', time: 'Jeudi 18h30', members: 8, topic: 'Dhikr & Relaxation' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Soutien & Santé Mentale</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Brain size={14} className="text-teal-500" /> "L'apaisement des cœurs par le souvenir d'Allah et le soutien mutuel"
          </p>
        </div>
        <div className="px-6 py-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-700 flex items-center gap-3">
           <Heart size={18} />
           <span className="text-[10px] font-black uppercase tracking-widest">Espace 100% Bienveillant</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Relaxation Techniques */}
        <div className="lg:col-span-8 space-y-8">
           <div className="glass-card p-10 bg-white">
              <div className="flex justify-between items-center mb-12">
                 <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                   <Wind size={24} className="text-teal-600" /> Techniques de Relaxation & Dhikr
                 </h4>
                 <button className="text-[10px] font-black text-teal-600 hover:underline uppercase tracking-widest">Voir toutes les séances</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4">
                 {[
                   { title: 'Respiration Profonde (4-7-8)', dur: '5 min', theme: 'Anti-anxiété', color: 'bg-teal-50' },
                   { title: 'Visualisation : Touba Serene', dur: '10 min', theme: 'Paix intérieure', color: 'bg-emerald-50' },
                   { title: 'Dhikr Apaisant : SubhanAllah', dur: '15 min', theme: 'Clarté Mentale', color: 'bg-blue-50' },
                   { title: 'Libération Émotionnelle', dur: '20 min', theme: 'Équilibre', color: 'bg-indigo-50' },
                 ].map((med, i) => (
                   <div key={i} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:bg-white hover:border-teal-200 transition-all cursor-pointer flex flex-col justify-between h-48">
                      <div className="flex justify-between items-start">
                         <div className={`p-4 rounded-2xl shadow-inner ${med.color} text-slate-600 group-hover:scale-110 transition-transform`}><Play size={24} className="fill-current"/></div>
                         <span className="text-[8px] font-black uppercase bg-white px-2 py-1 rounded-lg text-slate-400 border border-slate-100">{med.dur}</span>
                      </div>
                      <div>
                         <h5 className="font-black text-slate-800 text-base leading-tight mb-1">{med.title}</h5>
                         <p className="text-[9px] font-bold text-teal-600 uppercase tracking-widest">{med.theme}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass-card p-10 bg-gradient-to-br from-indigo-700 to-indigo-950 text-white relative overflow-hidden shadow-2xl group">
              <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10 text-blue-400">
                       <MessageSquare size={32} />
                    </div>
                    <h4 className="font-black text-sm uppercase tracking-[0.15em]">Ligne de Soutien Anonyme</h4>
                 </div>
                 <h2 className="text-3xl font-black mb-4 tracking-tight">Besoin de parler ?</h2>
                 <p className="text-sm font-medium leading-relaxed italic opacity-80 mb-10 max-w-xl">
                   "Nos psychologues bénévoles et nos sages sont à votre écoute en toute confidentialité. Ne restez pas seul avec vos épreuves."
                 </p>
                 <div className="flex gap-4">
                    <button className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-blue-50 transition-all flex items-center gap-3">
                       <MessageSquare size={16}/> Lancer un Chat Privé
                    </button>
                    <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/20 transition-all">
                       Appel Audio (Protégé)
                    </button>
                 </div>
              </div>
              <div className="absolute top-1/2 right-0 -translate-y-1/2 p-10 opacity-[0.05] font-arabic text-[15rem] rotate-12 pointer-events-none">ص</div>
           </div>
        </div>

        {/* Support Groups Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-white">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-3">
                 <Users size={18} className="text-teal-500" /> Groupes d'Entraide
              </h4>
              <div className="space-y-6">
                 {groups.map((g, i) => (
                   <div key={i} className="p-5 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-white transition-all cursor-pointer group">
                      <div className="flex justify-between items-start mb-4">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-teal-600 shadow-sm border border-slate-100 group-hover:bg-teal-600 group-hover:text-white transition-all font-black text-xs">GR</div>
                         <span className="text-[8px] font-black uppercase text-slate-300">{g.time}</span>
                      </div>
                      <h5 className="text-sm font-black text-slate-800 mb-1">{g.name}</h5>
                      <p className="text-[9px] text-teal-600 font-bold uppercase mb-4">{g.topic}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{g.members} Talibés inscrits</span>
                         <ChevronRight size={14} className="text-slate-300 group-hover:text-teal-600 transition-colors" />
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                 <Plus size={16}/> Créer un cercle d'échange
              </button>
           </div>

           <div className="glass-card p-8 border-teal-100 bg-teal-50/20">
              <div className="flex items-center gap-3 mb-6 text-teal-700">
                 <Sun size={22} />
                 <h4 className="font-black text-xs uppercase tracking-widest">Inspiration du Jour</h4>
              </div>
              <p className="text-[12px] font-medium text-slate-700 leading-relaxed italic">
                "N'est-ce pas par l'évocation d'Allah que les cœurs se tranquillisent ?" (Coran 13:28). Prenez un instant pour respirer et remercier.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthSupport;
