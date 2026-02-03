
import React from 'react';
import { Users, UserPlus, Calendar, ArrowRight, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';

const ResourceCoordinator: React.FC = () => {
  const teams: any[] = []; // Liste vide

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[200px]">
        {teams.length > 0 ? teams.map((team, i) => (
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
        )) : (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400">
             <Users size={32} className="mb-4 opacity-30"/>
             <p className="text-xs font-bold uppercase">Aucune équipe constituée</p>
          </div>
        )}
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
                  {/* Planning vide */}
                  <tr>
                     <td colSpan={5} className="py-10 text-center text-xs text-slate-400 italic">Aucun shift planifié pour aujourd'hui</td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default ResourceCoordinator;
