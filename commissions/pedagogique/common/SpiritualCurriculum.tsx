
import React from 'react';
import { Award, CheckCircle, Lock, Play, ChevronRight, Bookmark, TrendingUp, Star } from 'lucide-react';

interface Props { sector: string; }

const SpiritualCurriculum: React.FC<Props> = ({ sector }) => {
  const curriculum = [
    { title: 'Niveau 1 : Les Fondements', status: 'Terminé', progress: 100, lessons: 12, icon: Star },
    { title: 'Niveau 2 : Maîtrise des Xassaids', status: 'En cours', progress: 45, lessons: 24, icon: Award },
    { title: 'Niveau 3 : Exégèse Avancée', status: 'Verrouillé', progress: 0, lessons: 18, icon: Lock },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Parcours Pédagogique</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <TrendingUp size={14} className="text-cyan-500" /> Structure d'apprentissage par niveaux de maîtrise
          </p>
        </div>
        <div className="px-6 py-4 bg-cyan-50 border border-cyan-100 rounded-2xl text-cyan-700 flex items-center gap-3">
           <Award size={18} />
           <span className="text-[10px] font-black uppercase tracking-widest">3 Certifications obtenues</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Progress List */}
        <div className="lg:col-span-8 space-y-6">
          {curriculum.map((level, i) => (
            <div key={i} className={`glass-card p-1 relative overflow-hidden group ${level.status === 'Verrouillé' ? 'opacity-60 grayscale' : 'hover:border-cyan-200'}`}>
              <div className="p-8 flex flex-col md:flex-row items-center gap-8">
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner ${
                  level.status === 'Terminé' ? 'bg-emerald-50 text-emerald-600' : level.status === 'En cours' ? 'bg-cyan-50 text-cyan-600' : 'bg-slate-100 text-slate-400'
                }`}>
                  <level.icon size={32} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-black text-slate-900">{level.title}</h4>
                    {level.status === 'Terminé' && <CheckCircle size={16} className="text-emerald-500" />}
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">{level.lessons} Modules d'étude • {level.status}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase">
                       <span>Progression Totale</span>
                       <span>{level.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full transition-all duration-1000 ${
                         level.status === 'Terminé' ? 'bg-emerald-500' : 'bg-cyan-500'
                       }`} style={{ width: `${level.progress}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="shrink-0">
                  <button className={`p-4 rounded-2xl transition-all shadow-sm ${
                    level.status === 'Verrouillé' ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-cyan-600 text-white shadow-cyan-900/10 hover:scale-105 active:scale-95'
                  }`}>
                    {level.status === 'Terminé' ? <Bookmark size={20} /> : <Play size={20} className="fill-current" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Requirements Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-50">Prochain Examen</h4>
              <div className="space-y-6 relative z-10">
                 <div>
                    <p className="text-lg font-black leading-tight">Validation Mawaahibu Naafi</p>
                    <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest mt-1">Prévu pour : 15 Juin 2024</p>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black uppercase mb-4 opacity-60">Pré-requis</p>
                    <div className="space-y-3">
                       {[
                         { l: 'Sindidi maîtrisé', v: true },
                         { l: 'Assiduité > 80%', v: true },
                         { l: 'Quiz intermédiaire', v: false }
                       ].map((req, i) => (
                         <div key={i} className="flex items-center justify-between">
                            <span className="text-[11px] font-medium">{req.l}</span>
                            {req.v ? <CheckCircle size={14} className="text-emerald-400" /> : <div className="w-3.5 h-3.5 rounded-full border border-white/20"></div>}
                         </div>
                       ))}
                    </div>
                 </div>
                 <button className="w-full py-4 bg-cyan-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">S'inscrire à l'examen</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SpiritualCurriculum;
