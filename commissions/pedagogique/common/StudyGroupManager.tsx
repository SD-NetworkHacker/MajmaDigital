
import React from 'react';
import { Users, Calendar, Clock, MapPin, ChevronRight, Plus, UserPlus, Info, CheckCircle, ShieldCheck } from 'lucide-react';

interface Props { sector: string; }

const StudyGroupManager: React.FC<Props> = ({ sector }) => {
  const groups = [
    { name: 'Kurel Mémorisation A', leader: 'Omar Ndiaye', members: 8, activity: 'Récitation collective', time: 'Mardi 21h', status: 'Actif' },
    { name: 'Cercle de Réflexion', leader: 'Sokhna Fall', members: 12, activity: 'Analyse des écrits', time: 'Samedi 10h', status: 'Ouvert' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Group Management */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                 <Users size={22} className="text-cyan-500" /> Mes Groupes d'Étude
              </h3>
              <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl active:scale-95 transition-all"><Plus size={14}/> Créer un Groupe</button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groups.map((group, i) => (
                <div key={i} className="glass-card p-8 group hover:border-cyan-100 transition-all flex flex-col justify-between">
                   <div className="flex justify-between items-start mb-8">
                      <div className="w-14 h-14 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center font-black shadow-inner group-hover:bg-cyan-600 group-hover:text-white transition-all">
                         {group.name[0]}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        group.status === 'Actif' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>{group.status}</span>
                   </div>
                   <div>
                      <h4 className="text-lg font-black text-slate-900 leading-tight mb-2">{group.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10">Dieuwrine : {group.leader} • {group.members} membres</p>
                   </div>
                   <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase">
                         <Clock size={12}/> {group.time}
                      </div>
                      <button className="p-2 bg-slate-50 text-slate-300 rounded-xl hover:text-cyan-600 hover:bg-white hover:shadow-md transition-all"><ChevronRight size={18}/></button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Sessions Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-slate-50/50 border-cyan-100/50">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-10 flex items-center gap-3">
                 <Calendar size={20} className="text-cyan-600" /> Prochaines Sessions
              </h4>
              <div className="space-y-6">
                 {[
                   { title: 'Webinaire : Tawhid', time: 'Demain 18h', type: 'Digital' },
                   { title: 'Séance d\'Imprégnation', time: 'Vendredi 15h', type: 'Présentiel' },
                 ].map((s, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group hover:border-cyan-200 transition-all cursor-pointer">
                      <div>
                         <p className="text-xs font-black text-slate-800 leading-none mb-1.5">{s.title}</p>
                         <p className="text-[9px] text-slate-400 font-bold uppercase">{s.time} • {s.type}</p>
                      </div>
                      <UserPlus size={16} className="text-slate-200 group-hover:text-cyan-500 transition-colors" />
                   </div>
                 ))}
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
