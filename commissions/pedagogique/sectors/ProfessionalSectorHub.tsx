
import React from 'react';
import { Briefcase, Zap, Users, Target, Rocket, Share2, Award, ChevronRight, Plus, Star, MapPin, Search } from 'lucide-react';

const ProfessionalSectorHub: React.FC = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Professional Development & Skill Sharing */}
        <div className="lg:col-span-8 space-y-8">
           <div className="glass-card p-10 bg-white">
              <div className="flex justify-between items-center mb-10">
                 <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <Zap size={24} className="text-blue-500" /> Skill-Sharing : Partage de Talents
                 </h4>
                 <button className="px-5 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-2 shadow-sm hover:bg-blue-600 hover:text-white transition-all"><Plus size={14}/> Proposer Formation</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[
                   { title: 'Gestion de Projet Agile', tutor: 'Awa Ndiaye', level: 'Intermédiaire', dur: '4 sessions' },
                   { title: 'Fiscalité des PME', tutor: 'Modou Fall', level: 'Expert', dur: '1 Masterclass' },
                   { title: 'Leadership Éthique', tutor: 'Ibrahima Fall', level: 'Tous niveaux', dur: '2 mois' },
                   { title: 'Outils Digitaux Dahira', tutor: 'Saliou Diop', level: 'Débutant', dur: 'Continu' },
                 ].map((skill, i) => (
                   <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:border-blue-200 transition-all group flex flex-col justify-between">
                      <div className="space-y-3">
                         <div className="flex justify-between">
                            <h5 className="text-sm font-black text-slate-800 leading-tight">{skill.title}</h5>
                            <Star size={14} className="text-amber-400 fill-current" />
                         </div>
                         <p className="text-[10px] text-slate-400 font-bold uppercase">Formateur : {skill.tutor} • {skill.dur}</p>
                      </div>
                      <div className="mt-6 flex justify-between items-center pt-6 border-t border-slate-50/50">
                         <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{skill.level}</span>
                         <button className="text-[10px] font-black text-slate-300 group-hover:text-blue-600 transition-colors flex items-center gap-1">Détails <ChevronRight size={12}/></button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="glass-card p-10 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 text-white relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10"><Rocket size={24} /></div>
                    <h4 className="font-black text-sm uppercase tracking-[0.15em]">Majma Entrepreneurship Hub</h4>
                 </div>
                 <h2 className="text-3xl font-black mb-4 tracking-tight">Accélérateur de Projets</h2>
                 <p className="text-sm font-medium leading-relaxed italic opacity-80 mb-10 max-w-xl">
                   "Transformez vos idées en entreprises durables avec le soutien de la communauté. Accès aux financements Adiyas Gott et mentorat business."
                 </p>
                 <div className="flex flex-wrap gap-4">
                    <button className="px-8 py-4 bg-white text-blue-900 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-blue-50 transition-all flex items-center gap-3">
                       <Plus size={16}/> Soumettre un Projet
                    </button>
                    <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/20 transition-all">
                       Voir les Lauréats
                    </button>
                 </div>
              </div>
              <div className="absolute top-1/2 right-0 -translate-y-1/2 p-10 opacity-[0.05] font-arabic text-[15rem] rotate-12 pointer-events-none">ص</div>
           </div>
        </div>

        {/* Networking & Events Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-white">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-3">
                 <Users size={18} className="text-blue-500" /> Networking Professionnel
              </h4>
              <div className="space-y-6">
                 {[
                   { l: 'Business Dinner Médina', d: '25 Mai • 20h', s: 'Limitée' },
                   { l: 'Conférence Management', d: '02 Juin • 10h', s: 'Ouvert' },
                   { l: 'Afterwork Talibés-PME', d: '15 Juin • 18h', s: 'Invitations' },
                 ].map((event, i) => (
                   <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-blue-200 transition-all cursor-pointer group">
                      <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm border border-slate-100 group-hover:bg-blue-50 transition-colors"><MapPin size={16}/></div>
                      <div className="min-w-0 flex-1">
                         <p className="text-xs font-black text-slate-800 truncate mb-1">{event.l}</p>
                         <p className="text-[9px] text-slate-400 font-bold uppercase">{event.d}</p>
                         <span className="text-[8px] font-black text-blue-500 uppercase mt-2 block">{event.s}</span>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                 <Share2 size={16}/> Accéder à l'annuaire Pro
              </button>
           </div>

           <div className="glass-card p-8 border-emerald-100 bg-emerald-50/20">
              <div className="flex items-center gap-3 mb-6 text-emerald-700">
                 <Award size={22} />
                 <h4 className="font-black text-xs uppercase tracking-widest">IA Matchmaking</h4>
              </div>
              <p className="text-[12px] font-medium text-slate-700 leading-relaxed italic">
                "Nous avons détecté une synergie entre votre profil (Informatique) et le projet de Modou Fall (Agrobusiness). Souhaitez-vous une mise en relation ?"
              </p>
              <button className="mt-6 text-[10px] font-black text-emerald-600 hover:underline uppercase tracking-widest">Connecter maintenant</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSectorHub;
