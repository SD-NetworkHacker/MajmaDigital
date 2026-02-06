
import React, { useState } from 'react';
import { Users, Calendar, Clock, MapPin, ChevronRight, Plus, UserPlus, Info, CheckCircle, ShieldCheck, X, Save } from 'lucide-react';
import { useData } from '../../../contexts/DataContext';

interface Props { sector: string; }

const StudyGroupManager: React.FC<Props> = ({ sector }) => {
  const { studyGroups, addStudyGroup } = useData();
  const [showModal, setShowModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', theme: '' });

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroup.name) return;
    
    addStudyGroup({
       name: newGroup.name,
       theme: newGroup.theme,
       membersCount: 1
    });
    
    setShowModal(false);
    setNewGroup({ name: '', theme: '' });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-500 relative">
      
      {/* ADD GROUP MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <Users size={24} className="text-cyan-600"/> Nouveau Groupe
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleAddGroup} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Nom du groupe</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-500/20"
                  value={newGroup.name}
                  onChange={e => setNewGroup({...newGroup, name: e.target.value})}
                  placeholder="ex: Kurel 1 - Mawahibou"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Thème d'étude</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-500/20"
                  value={newGroup.theme}
                  onChange={e => setNewGroup({...newGroup, theme: e.target.value})}
                  placeholder="ex: Fiqh & Xassaid"
                />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full py-4 bg-cyan-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Save size={16} /> Former le groupe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Group Management */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                 <Users size={22} className="text-cyan-500" /> Mes Groupes d'Étude
              </h3>
              <button 
                onClick={() => setShowModal(true)}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl active:scale-95 transition-all"
              >
                <Plus size={14}/> Créer un Groupe
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studyGroups.length > 0 ? studyGroups.map((group) => (
                <div key={group.id} className="p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-lg transition-all group">
                   <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl group-hover:bg-cyan-600 group-hover:text-white transition-all"><Users size={20}/></div>
                      <span className="text-[9px] font-black uppercase bg-slate-50 px-2 py-1 rounded text-slate-500">{group.membersCount} Membres</span>
                   </div>
                   <h4 className="text-lg font-black text-slate-800">{group.name}</h4>
                   <p className="text-xs text-slate-500 mt-1">{group.theme}</p>
                   <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                      <div className="flex -space-x-2">
                         <div className="w-6 h-6 bg-slate-200 rounded-full border-2 border-white"></div>
                         <div className="w-6 h-6 bg-slate-300 rounded-full border-2 border-white flex items-center justify-center text-[6px] font-bold text-slate-600">...</div>
                      </div>
                      <button className="text-[9px] font-black text-cyan-600 uppercase">Rejoindre</button>
                   </div>
                </div>
              )) : (
                <div className="col-span-full flex flex-col items-center justify-center h-48 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400">
                   <Users size={32} className="mb-4 opacity-20"/>
                   <p className="text-xs font-bold uppercase">Aucun groupe actif</p>
                </div>
              )}
           </div>
        </div>

        {/* Sessions Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-slate-50/50 border-cyan-100/50">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-10 flex items-center gap-3">
                 <Calendar size={20} className="text-cyan-600" /> Prochaines Sessions
              </h4>
              <div className="space-y-6">
                 <p className="text-xs text-slate-400 italic text-center">Aucune session planifiée.</p>
              </div>
           </div>

           <div className="p-8 bg-cyan-50/50 border border-cyan-100 rounded-[2.5rem] flex items-start gap-4">
              <Info size={24} className="text-cyan-600 shrink-0" />
              <p className="text-[12px] font-medium text-cyan-800/80 leading-relaxed italic">
                "La science ne s'acquiert que par l'étude, et la sagesse par la méditation collective. Multipliez les groupes d'échanges."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudyGroupManager;
