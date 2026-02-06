
import React, { useState } from 'react';
import { Award, ChevronRight, Plus, X, Save, Book, CheckCircle, Lock, PlayCircle } from 'lucide-react';
import { useData } from '../../../contexts/DataContext';
import { KhassaideModule } from '../../../types';

interface Props { sector: string; }

const SpiritualCurriculum: React.FC<Props> = ({ sector }) => {
  const { khassaideModules, addKhassaideModule } = useData();
  const [showModal, setShowModal] = useState(false);
  const [newModule, setNewModule] = useState({ title: '', level: 'Débutant', author: 'Cheikh Ahmadou Bamba' });

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModule.title) return;
    
    addKhassaideModule({
      id: '', // Backend generated
      title: newModule.title,
      author: newModule.author,
      level: newModule.level as any,
      progress: 0,
      lessons: []
    });
    
    setShowModal(false);
    setNewModule({ title: '', level: 'Débutant', author: 'Cheikh Ahmadou Bamba' });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 relative">
      
      {/* ADD MODULE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <Book size={24} className="text-cyan-600"/> Nouveau Module
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleAddModule} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Titre du Xassaid / Module</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-500/20"
                  value={newModule.title}
                  onChange={e => setNewModule({...newModule, title: e.target.value})}
                  placeholder="Ex: Mawahibou"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Auteur</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-500/20"
                  value={newModule.author}
                  onChange={e => setNewModule({...newModule, author: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Niveau Difficulté</label>
                <select 
                  className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none"
                  value={newModule.level}
                  onChange={e => setNewModule({...newModule, level: e.target.value})}
                >
                   <option>Débutant</option>
                   <option>Intermédiaire</option>
                   <option>Avancé</option>
                </select>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full py-4 bg-cyan-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Save size={16} /> Créer le cours
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Parcours Pédagogique</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Award size={14} className="text-cyan-500" /> Programme d'étude du secteur {sector}
          </p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => setShowModal(true)}
             className="px-6 py-4 bg-cyan-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 hover:bg-cyan-700 transition-all"
           >
             <Plus size={18}/> Créer Module
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Progress List */}
        <div className="lg:col-span-8 space-y-6">
          {khassaideModules.length > 0 ? khassaideModules.map((module, i) => (
            <div key={module.id} className="glass-card p-6 bg-white group hover:border-cyan-200 transition-all flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center font-black text-lg border border-cyan-100">
                     {i + 1}
                  </div>
                  <div>
                     <h4 className="text-lg font-black text-slate-800">{module.title}</h4>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{module.level} • {module.lessons?.length || 0} Leçons</p>
                     <div className="flex gap-2 mt-2">
                        <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-cyan-500" style={{ width: `${module.progress}%` }}></div>
                        </div>
                        <span className="text-[9px] font-bold text-cyan-600">{module.progress}%</span>
                     </div>
                  </div>
               </div>
               <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-cyan-50 hover:text-cyan-600 transition-all"><ChevronRight size={20}/></button>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center h-64 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400">
                <Book size={48} className="opacity-20 mb-4"/>
                <p className="text-xs font-bold uppercase">Aucun module actif</p>
                <button onClick={() => setShowModal(true)} className="mt-4 text-cyan-600 text-[10px] font-black uppercase hover:underline">Initialiser le programme</button>
            </div>
          )}
        </div>

        {/* Requirements Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-50">Prochain Examen</h4>
              <div className="space-y-6 relative z-10">
                 <div>
                    <p className="text-lg font-black leading-tight">Session Générale</p>
                    <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest mt-1">Date à définir</p>
                 </div>
                 
                 <button className="w-full py-4 bg-white/10 text-white/50 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl cursor-not-allowed">S'inscrire</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SpiritualCurriculum;
