
import React from 'react';
import { CommissionType } from '../../types';
import { Wallet, TrendingUp, AlertCircle, ChevronRight } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface Props {
  commission: CommissionType;
  onClick: () => void;
}

const FinancialOverviewWidget: React.FC<Props> = ({ commission, onClick }) => {
  const { budgetRequests } = useData();
  const requests = budgetRequests.filter(r => r.commission === commission);
  const pendingRequests = requests.filter(r => ['soumis_finance', 'soumis_bureau'].includes(r.status));
  
  // Données réelles (initialisées à 0 si pas de système de budget global connecté)
  const budgetTotal = 0; 
  const budgetUsed = requests
    .filter(r => r.status === 'approuve')
    .reduce((acc, r) => acc + (r.amountApproved || 0), 0);
    
  const percent = budgetTotal > 0 ? Math.round((budgetUsed / budgetTotal) * 100) : 0;

  return (
    <div 
      onClick={onClick}
      className="glass-card p-6 bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all cursor-pointer group h-full flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
           <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Wallet size={20} />
           </div>
           {pendingRequests.length > 0 && (
             <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1 border border-amber-100">
                <AlertCircle size={10} /> {pendingRequests.length} en attente
             </span>
           )}
        </div>
        
        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Situation Financière</h4>
        <div className="flex items-end gap-2 mb-4">
           <span className="text-2xl font-black text-slate-900">{budgetTotal > 0 ? (budgetTotal - budgetUsed).toLocaleString() : '--'}</span>
           <span className="text-[10px] font-bold text-slate-400 mb-1">F (Solde)</span>
        </div>

        <div className="space-y-2">
           <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
              <span>Budget Utilisé</span>
              <span>{percent}%</span>
           </div>
           <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${percent > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${percent}%` }}></div>
           </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-600">
         <span>Gérer Trésorerie</span>
         <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export default FinancialOverviewWidget;
