
import React from 'react';
import { Users, UserPlus, Calendar, ArrowRight, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';

const ResourceCoordinator: React.FC = () => {
  const teams = [
    { name: 'Kurel Cuisine', leader: 'Modou Fall', members: 12, status: 'Complet' },
    { name: 'Kurel Café', leader: 'Saliou Diop', members: 8, status: 'Besoins: 2' },
    { name: 'Kurel Hygiène', leader: 'Awa Ndiaye', members: 15, status: 'Complet' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Coordination des Équipes (Gott)</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Users size={14} className="text-purple-500" /> Gestion des rotations et affectations des bénévoles
          </p>
        </div>
        <button className="px-8 py-4 bg-purple-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3">
          <UserPlus size={18} /> Mobiliser Renfort
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {teams.map((team, i) => (
          <div key={i} className="glass-card p-8 group hover:border-purple-100 transition-all relative overflow-hidden">
             <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <ShieldCheck size={24} />
                </div>
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                  team.status === 'Complet' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>{team.status}</span>
             </div>
             <h4 className="text-lg font-black text-slate-900 mb-1 leading-none">{team.name}</h4>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10">Dieuwrine : {team.leader}</p>
             
             <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                <div className="flex -space-x-3">
                   {[1,2,3,4].map(idx => <div key={idx} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black">AD</div>)}
                   <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-100 text-purple-700 flex items-center justify-center text-[8px] font-black">+{team.members - 4}</div>
                </div>
                <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-purple-600 transition-all"><ArrowRight size={18} /></button>
             </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-10">
         <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-10 flex items-center gap-3">
            <Calendar size={20} className="text-purple-600" /> Planning des Shifts du Jour
         </h4>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                     <th className="py-6 px-4">Créneau</th>
                     <th className="py-6 px-4">Équipe</th>
                     <th className="py-6 px-4">Mission Principale</th>
                     <th className="py-6 px-4">Effectif Présent</th>
                     <th className="py-6 px-4 text-right">Statut</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {[
                    { time: '08:00 - 12:00', team: 'Vaisselle A', mission: 'Nettoyage post-petit déj', count: '5/6', status: 'OK' },
                    { time: '12:00 - 14:00', team: 'Cuisine B', mission: 'Service Déjeuner Touba', count: '10/10', status: 'ACTIF' },
                    { time: '14:00 - 18:00', team: 'Café C', mission: 'Accueil Kurels', count: '4/4', status: 'PRÊT' },
                  ].map((shift, i) => (
                    <tr key={i} className="group hover:bg-slate-50 transition-all">
                       <td className="py-6 px-4 text-xs font-black text-slate-900">{shift.time}</td>
                       <td className="py-6 px-4 text-xs font-bold text-slate-600">{shift.team}</td>
                       <td className="py-6 px-4 text-xs text-slate-500 italic">"{shift.mission}"</td>
                       <td className="py-6 px-4 text-xs font-black text-purple-600">{shift.count}</td>
                       <td className="py-6 px-4 text-right">
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-black uppercase">{shift.status}</span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default ResourceCoordinator;
