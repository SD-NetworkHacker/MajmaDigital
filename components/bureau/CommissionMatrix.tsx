
import React from 'react';
import { INITIAL_COMMISSIONS } from '../../constants';
import { CheckCircle, AlertCircle, Users, Wallet } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { CommissionType } from '../../types';

const CommissionMatrix: React.FC = () => {
  const { members, budgetRequests } = useData();

  // Calcul réel des effectifs par commission
  const getMemberCount = (type: CommissionType) => {
    return members.filter(m => m.commissions.some(c => c.type === type)).length;
  };

  // Calcul réel des demandes de budget en cours
  const getPendingBudgetCount = (type: CommissionType) => {
    return budgetRequests.filter(r => r.commission === type && r.status.includes('soumis')).length;
  };

  return (
    <div className="space-y-8 animate-in zoom-in duration-500">
      <div className="flex justify-between items-end">
         <h3 className="text-2xl font-black text-slate-100 uppercase tracking-widest">Matrice de Supervision</h3>
         <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-2 text-emerald-500"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Opérationnel</span>
            <span className="flex items-center gap-2 text-slate-500"><div className="w-2 h-2 bg-slate-500 rounded-full"></div> Inactif</span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {INITIAL_COMMISSIONS.map((comm, i) => {
           const count = getMemberCount(comm.name);
           const pendingBudgets = getPendingBudgetCount(comm.name);
           const isActive = count > 0;
           const color = isActive ? 'emerald' : 'slate';
           
           return (
             <div key={i} className={`bg-slate-900/50 border ${isActive ? 'border-emerald-900/30' : 'border-slate-800'} rounded-2xl p-6 relative overflow-hidden group hover:bg-slate-800/50 transition-all cursor-pointer`}>
                <div className={`absolute top-0 left-0 w-1 h-full bg-${color}-500`}></div>
                <div className="flex justify-between items-start mb-6">
                   <h4 className={`text-sm font-black uppercase tracking-wider ${isActive ? 'text-slate-200' : 'text-slate-600'}`}>{comm.name}</h4>
                   {isActive ? <CheckCircle size={16} className="text-emerald-500"/> : <div className="w-4 h-4 rounded-full border-2 border-slate-700"></div>}
                </div>
                
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 font-bold uppercase flex items-center gap-2"><Users size={12}/> Effectif</span>
                      <span className={`font-mono ${isActive ? 'text-slate-300' : 'text-slate-600'}`}>{count}</span>
                   </div>
                   <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full bg-${color}-500/50`} style={{ width: count > 0 ? '100%' : '0%' }}></div>
                   </div>
                   
                   <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500 font-bold uppercase flex items-center gap-2"><Wallet size={12}/> Demandes</span>
                      <span className={`${pendingBudgets > 0 ? 'text-amber-500' : 'text-slate-600'} font-mono`}>{pendingBudgets} en cours</span>
                   </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                   <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{comm.dieuwrine || 'Non assigné'}</span>
                   <button className="text-[9px] text-slate-500 hover:text-white uppercase font-bold border border-slate-700 px-3 py-1 rounded hover:bg-slate-700 transition-colors">Audit</button>
                </div>
             </div>
           );
         })}
      </div>
    </div>
  );
};

export default CommissionMatrix;
