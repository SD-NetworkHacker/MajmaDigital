
import React, { useState, useEffect } from 'react';
import { Book, PlayCircle, CheckCircle, Lock, Award, TrendingUp, Unlock, RefreshCcw } from 'lucide-react';
import { KhassaideModule, KhassaideLesson } from '../../types';
import { getKhassaideModules } from '../../services/cultureService';

const KhassaideAcademy: React.FC = () => {
  const [modules, setModules] = useState<KhassaideModule[]>([]);

  useEffect(() => {
    getKhassaideModules().then(setModules);
  }, []);

  const toggleLessonStatus = (moduleId: string, lessonId: string) => {
    setModules(prevModules => prevModules.map(mod => {
      if (mod.id !== moduleId) return mod;

      // Update specific lesson
      const updatedLessons = mod.lessons.map(lesson => {
        if (lesson.id !== lessonId) return lesson;
        
        // Cycle statuses: locked -> unlocked -> completed -> locked
        let newStatus: 'locked' | 'unlocked' | 'completed' = 'locked';
        if (lesson.status === 'locked') newStatus = 'unlocked';
        else if (lesson.status === 'unlocked') newStatus = 'completed';
        else newStatus = 'locked';

        return { ...lesson, status: newStatus };
      });

      // Recalculate progress
      const completedCount = updatedLessons.filter(l => l.status === 'completed').length;
      const newProgress = Math.round((completedCount / updatedLessons.length) * 100);

      return { ...mod, lessons: updatedLessons, progress: newProgress };
    }));
  };

  const getStatusIcon = (status: string, index: number) => {
      switch(status) {
          case 'completed': return <CheckCircle size={18} className="text-white" />;
          case 'unlocked': return <PlayCircle size={18} className="text-indigo-600" />;
          default: return <Lock size={14} className="text-slate-400" />;
      }
  };

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
              <p className="text-[10px] opacity-80 font-bold uppercase tracking-widest">
                 {modules.reduce((acc, m) => acc + (m.progress === 100 ? 1 : 0), 0)} Modules validés
              </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {modules.map(module => (
          <div key={module.id} className="glass-card p-8 bg-white relative overflow-hidden group border border-slate-100 shadow-sm hover:shadow-lg transition-all">
             <div className="flex justify-between items-center mb-6">
                <div>
                    <h4 className="text-xl font-black text-slate-800">{module.title}</h4>
                    <p className="text-[10px] text-slate-400 uppercase font-bold mt-1">Auteur: {module.author}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  module.level === 'debutant' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>{module.level}</span>
             </div>
             
             <div className="mb-8">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
                   <span>Progression Global</span>
                   <span className={module.progress === 100 ? 'text-emerald-600' : 'text-indigo-600'}>{module.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div 
                     className={`h-full transition-all duration-1000 ${module.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
                     style={{ width: `${module.progress}%` }}
                   ></div>
                </div>
             </div>

             <div className="space-y-3">
                {module.lessons.map((lesson, idx) => (
                  <div 
                    key={lesson.id} 
                    onClick={() => toggleLessonStatus(module.id, lesson.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group/lesson ${
                      lesson.status === 'locked' 
                        ? 'bg-slate-50 border-slate-100 opacity-70 hover:opacity-100' 
                        : lesson.status === 'completed'
                            ? 'bg-emerald-50 border-emerald-100'
                            : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                    }`}
                  >
                     <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-colors ${
                          lesson.status === 'completed' ? 'bg-emerald-500 text-white' : 
                          lesson.status === 'unlocked' ? 'bg-indigo-100 text-indigo-600' : 
                          'bg-slate-200 text-slate-500'
                        }`}>
                           {getStatusIcon(lesson.status, idx)}
                        </div>
                        <div>
                           <p className={`text-xs font-bold ${lesson.status === 'completed' ? 'text-emerald-800 line-through decoration-emerald-300' : 'text-slate-700'}`}>{lesson.title}</p>
                           <p className="text-[9px] text-slate-400 font-bold uppercase">{lesson.duration}</p>
                        </div>
                     </div>
                     <div className="text-[9px] font-black uppercase text-slate-300 group-hover/lesson:text-indigo-400 transition-colors">
                        {lesson.status === 'locked' ? 'Verrouillé' : lesson.status === 'completed' ? 'Terminé' : 'En cours'}
                     </div>
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
