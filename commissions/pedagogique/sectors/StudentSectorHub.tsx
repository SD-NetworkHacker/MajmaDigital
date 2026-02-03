
import React from 'react';
import { School, Users, Gamepad2, TrendingUp, Award, Plus, Star } from 'lucide-react';

const StudentSectorHub: React.FC = () => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { l: 'Moyenne Scolaire', v: '--/20', c: 'text-amber-600', icon: TrendingUp },
          { l: 'Participation', v: '0%', c: 'text-emerald-600', icon: Users },
          { l: 'Badges Apprentis', v: '0', c: 'text-cyan-600', icon: Award },
          { l: 'Points Majma', v: '0', c: 'text-indigo-600', icon: Star },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 group hover:-translate-y-1 transition-all flex flex-col justify-between">
             <div className="flex justify-between items-start mb-6">
                <div className={`p-3 bg-slate-50 rounded-xl group-hover:bg-white transition-colors ${stat.c}`}>
                   <stat.icon size={20} />
                </div>
                <span className="text-[8px] font-black uppercase text-slate-300">Live stats</span>
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.l}</p>
                <h4 className={`text-3xl font-black ${stat.c}`}>{stat.v}</h4>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Academic Support */}
        <div className="lg:col-span-7 glass-card p-10 bg-white">
           <div className="flex justify-between items-center mb-12">
              <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                 <School size={24} className="text-amber-500" /> Soutien Scolaire & Tutorat
              </h4>
              <button className="px-5 py-2 bg-amber-50 text-amber-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100 shadow-sm"><Plus size={14} className="inline mr-2"/> Demander Aide</button>
           </div>
           
           <div className="space-y-6">
              <p className="text-xs text-slate-400 italic text-center py-10">Aucun cours de soutien programmé.</p>
           </div>
        </div>

        {/* Gamification Sidebar */}
        <div className="lg:col-span-5 space-y-8">
           <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group h-full flex flex-col">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 opacity-50 flex items-center gap-2"><Gamepad2 size={16}/> Apprentissage Ludique</h4>
              <div className="space-y-8 relative z-10 flex-1">
                 <div className="aspect-video bg-white/5 rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center text-center p-8 group-hover:bg-white/10 transition-all cursor-pointer">
                    <div className="p-4 bg-amber-500 rounded-2xl shadow-xl text-white mb-6"><TrendingUp size={32} /></div>
                    <p className="text-sm font-black uppercase tracking-widest mb-2">Lancer le Quiz Spiritualité</p>
                    <p className="text-[10px] opacity-40 font-medium leading-relaxed">Défiez les autres apprenants et gagnez des points XP pour votre Kurel.</p>
                 </div>
                 
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-800 text-slate-500 flex items-center justify-center shadow-inner font-black text-2xl">-</div>
                    <div>
                       <p className="text-xs font-black uppercase opacity-60">Meilleur Kurel</p>
                       <p className="text-xl font-black text-white">Non Classé</p>
                    </div>
                 </div>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-5 font-arabic text-[12rem] rotate-12 pointer-events-none">ت</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSectorHub;
