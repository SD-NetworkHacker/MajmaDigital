
import React, { useState, useEffect } from 'react';
import { Book, PlayCircle, CheckCircle, Lock, Award, TrendingUp } from 'lucide-react';
import { KhassaideModule } from '../../types';
import { getKhassaideModules } from '../../services/cultureService';

const KhassaideAcademy: React.FC = () => {
  const [modules, setModules] = useState<KhassaideModule[]>([]);

  useEffect(() => {
    getKhassaideModules().then(setModules);
  }, []);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Académie Khassaide</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Book size={14} className="text-indigo-500" /> Apprentissage structuré et progression
          </p>
        </div>
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl flex items-center gap-4 shadow-xl">
           <div className="p-2 bg-white/20 rounded-xl"><Award size={24}/></div>
           <div>
              <p className="text-sm font-black">Niveau: Talibé Confirmé</p>
              <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest">3 Modules validés</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {modules.map(module => (
          <div key={module.id} className="glass-card p-8 bg-white relative overflow-hidden group">
             <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-black text-slate-800">{module.title}</h4>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  module.level === 'debutant' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>{module.level}</span>
             </div>
             
             <div className="mb-8">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
                   <span>Progression</span>
                   <span>{module.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${module.progress}%` }}></div>
                </div>
             </div>

             <div className="space-y-3">
                {module.lessons.map((lesson, idx) => (
                  <div key={lesson.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    lesson.status === 'locked' ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 hover:border-indigo-300 cursor-pointer'
                  }`}>
                     <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                          lesson.status === 'completed' ? 'bg-emerald-500 text-white' : lesson.status === 'locked' ? 'bg-slate-200 text-slate-400' : 'bg-indigo-100 text-indigo-600'
                        }`}>
                           {lesson.status === 'completed' ? <CheckCircle size={14}/> : lesson.status === 'locked' ? <Lock size={14}/> : idx + 1}
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-700">{lesson.title}</p>
                           <p className="text-[9px] text-slate-400 font-bold uppercase">{lesson.duration}</p>
                        </div>
                     </div>
                     {lesson.status !== 'locked' && <PlayCircle size={18} className="text-indigo-500" />}
                  </div>
                ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KhassaideAcademy;
