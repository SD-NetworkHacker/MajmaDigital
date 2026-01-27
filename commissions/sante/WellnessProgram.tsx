
import React from 'react';
import { Apple, TrendingUp, Users, Target, Award, Plus, ChevronRight, Zap, Heart, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WellnessProgram: React.FC = () => {
  const challengeData = [
    { name: 'Lun', steps: 4500 }, { name: 'Mar', steps: 6800 },
    { name: 'Mer', steps: 5200 }, { name: 'Jeu', steps: 8100 },
    { name: 'Ven', steps: 9400 }, { name: 'Sam', steps: 7200 },
    { name: 'Dim', steps: 4800 },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Programme Wellness & Challenges</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <TrendingUp size={14} className="text-teal-500" /> Cultiver une vitalité physique pour servir la communauté
          </p>
        </div>
        <div className="px-6 py-4 bg-teal-50 border border-teal-100 rounded-2xl text-teal-700 flex items-center gap-3">
           <Award size={18} />
           <span className="text-[10px] font-black uppercase tracking-widest">Niveau Vitalité : Avancé</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Challenge Stats */}
        <div className="lg:col-span-8 glass-card p-10 bg-white">
           <div className="flex justify-between items-center mb-12">
              <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                 <Users size={24} className="text-teal-600" /> Challenge Hebdo : Marche Fraternelle
              </h4>
              <button className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100">Top 10 Membres</button>
           </div>
           
           <div className="h-[300px] w-full mb-10">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={challengeData}>
                    <defs>
                      <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', fontSize: '11px', fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey="steps" stroke="#0d9488" strokeWidth={4} fillOpacity={1} fill="url(#colorSteps)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-slate-50">
              {[
                { l: 'Pas Moyens', v: '6,420', trend: '+12%' },
                { l: 'Calories (Kcal)', v: '450', trend: 'Stable' },
                { l: 'Minutes Activité', v: '320', trend: '+5%' }
              ].map((s, i) => (
                <div key={i} className="text-center group">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-teal-600 transition-colors">{s.l}</p>
                   <p className="text-2xl font-black text-slate-900 leading-none">{s.v}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Personalized Goals Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-slate-50/50 border-teal-100">
              <h4 className="text-[10px] font-black text-teal-800 uppercase tracking-widest mb-8 flex items-center gap-3">
                 <Target size={20} className="text-teal-600" /> Objectifs Personnels
              </h4>
              <div className="space-y-6">
                 {[
                   { l: 'Hydratation (2L)', p: 85, c: 'bg-teal-500' },
                   { l: 'Sommeil (7h)', p: 60, c: 'bg-emerald-500' },
                   { l: 'Méditation (20m)', p: 100, c: 'bg-blue-500' },
                 ].map((obj, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                        <span className="text-slate-600">{obj.l}</span>
                        <span className="text-teal-600">{obj.p}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white rounded-full border border-slate-100 overflow-hidden shadow-inner">
                         <div className={`h-full ${obj.c} transition-all duration-1000`} style={{ width: `${obj.p}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-4 bg-teal-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Ajouter un objectif</button>
           </div>

           <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10"><Award size={24} className="text-amber-400" /></div>
                    <h4 className="font-black text-xs uppercase tracking-widest">Récompenses Wellness</h4>
                 </div>
                 <h2 className="text-2xl font-black mb-2 tracking-tight">Médaille de Constance</h2>
                 <p className="text-[11px] leading-relaxed italic opacity-60">"Félicitations ! Vous avez maintenu vos objectifs Wellness pendant 15 jours consécutifs."</p>
              </div>
              <div className="absolute -right-6 -bottom-6 opacity-5 font-arabic text-8xl">و</div>
           </div>
        </div>
      </div>

      <div className="glass-card p-10 bg-emerald-50/50 border-emerald-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
         <div className="p-5 bg-white rounded-[2rem] shadow-xl text-emerald-600 shrink-0 border border-emerald-50 group-hover:rotate-12 transition-transform duration-500"><Zap size={40}/></div>
         <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-black text-emerald-900 mb-2">IA Wellness Advice</h4>
            <p className="text-sm font-medium text-emerald-700/80 leading-relaxed max-w-2xl">
               Votre activité a diminué de 15% en milieu de semaine. Pensez à de courtes sessions de marche entre vos heures de bureau pour maintenir votre métabolisme actif.
            </p>
         </div>
         <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-200 active:scale-95 transition-all">Détails IA</button>
      </div>
    </div>
  );
};

export default WellnessProgram;
