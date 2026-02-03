
import React from 'react';
import { INITIAL_COMMISSIONS } from '../../constants';
import { CheckCircle, AlertTriangle, Users, Wallet, Activity, ArrowUpRight, Power, MoreHorizontal } from 'lucide-react';
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

  // Mock data pour la "santé" (health) de la commission pour l'UI
  const getHealthStatus = (index: number) => {
     if (index === 2) return { status: 'warning', label: 'Charge élevée', color: 'text-amber-500', border: 'border-amber-500/30', bg: 'bg-amber-500/5' };
     if (index === 6) return { status: 'critical', label: 'Maintenance', color: 'text-red-500', border: 'border-red-500/30', bg: 'bg-red-500/5' };
     return { status: 'healthy', label: 'Nominal', color: 'text-emerald-500', border: 'border-emerald-500/30', bg: 'bg-emerald-500/5' };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header Statut */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-slate-800">
         <div>
            <h3 className="text-3xl font-black text-slate-100 uppercase tracking-widest flex items-center gap-3">
               <Activity size={32} className="text-blue-500" /> Matrice de Supervision
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">État opérationnel des pôles et commissions du Dahira.</p>
         </div>
         <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">8 Actifs</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg">
               <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
               <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">1 Attention</span>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
         {INITIAL_COMMISSIONS.map((comm, i) => {
           const count = getMemberCount(comm.name);
           const pendingBudgets = getPendingBudgetCount(comm.name);
           const health = getHealthStatus(i);
           
           return (
             <div key={i} className={`relative bg-slate-900 border rounded-2xl p-6 overflow-hidden group hover:bg-slate-800 transition-all duration-300 ${health.border}`}>
                {/* Background Grid Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
                
                {/* Active Indicator Line */}
                <div className={`absolute top-0 left-0 w-full h-1 ${health.status === 'healthy' ? 'bg-emerald-500' : health.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`}></div>

                {/* Header */}
                <div className="relative z-10 flex justify-between items-start mb-6">
                   <div>
                      <h4 className="text-sm font-black text-slate-100 uppercase tracking-wider truncate max-w-[150px]">{comm.name}</h4>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">ID: {comm.slug.substring(0,3).toUpperCase()}-{i+10}</p>
                   </div>
                   <div className={`p-1.5 rounded-lg border ${health.border} ${health.bg}`}>
                      {health.status === 'healthy' ? <CheckCircle size={14} className={health.color}/> : <AlertTriangle size={14} className={health.color}/>}
                   </div>
                </div>
                
                {/* Metrics */}
                <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
                   <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/50">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                         <Users size={12}/>
                         <span className="text-[9px] font-bold uppercase">Effectif</span>
                      </div>
                      <span className="text-xl font-black text-slate-200">{count}</span>
                   </div>
                   <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/50">
                      <div className="flex items-center gap-2 text-slate-500 mb-1">
                         <Wallet size={12}/>
                         <span className="text-[9px] font-bold uppercase">Budgets</span>
                      </div>
                      <span className={`text-xl font-black ${pendingBudgets > 0 ? 'text-amber-500' : 'text-slate-200'}`}>{pendingBudgets}</span>
                   </div>
                </div>

                {/* Footer / Dieuwrine */}
                <div className="relative z-10 flex items-center justify-between pt-4 border-t border-slate-800">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[9px] font-bold text-slate-400 border border-slate-700">
                         {comm.dieuwrine ? comm.dieuwrine.charAt(0) : '?'}
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 truncate max-w-[100px]">{comm.dieuwrine || 'Non assigné'}</span>
                   </div>
                   <button className="text-slate-500 hover:text-white transition-colors">
                      <MoreHorizontal size={16} />
                   </button>
                </div>
             </div>
           );
         })}
      </div>
    </div>
  );
};

export default CommissionMatrix;
