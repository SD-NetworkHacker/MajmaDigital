
import React, { useState } from 'react';
import { Target, TrendingUp, Plus, ChevronRight, PieChart, AlertTriangle, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { BudgetRequest, CommissionType } from '../../types';
import BudgetRequestWizard from '../shared/BudgetRequestWizard';

const BudgetPlanner: React.FC = () => {
  const { budgetRequests } = useData();
  const [showWizard, setShowWizard] = useState(false);
  const [filter, setFilter] = useState<'all' | 'actif' | 'clos'>('all');

  // Filtrer et trier les budgets
  const filteredBudgets = budgetRequests.filter(req => {
    if (filter === 'actif') return ['soumis_finance', 'soumis_bureau', 'approuve'].includes(req.status);
    if (filter === 'clos') return ['rejete', 'termine'].includes(req.status);
    return true;
  }).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  // Calculs globaux
  const totalBudgeted = budgetRequests
    .filter(r => r.status === 'approuve')
    .reduce((acc, r) => acc + (r.amountApproved || r.amountRequested), 0);

  const pendingAmount = budgetRequests
    .filter(r => r.status.includes('soumis'))
    .reduce((acc, r) => acc + r.amountRequested, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approuve': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'rejete': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'soumis_bureau': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'soumis_finance': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approuve': return <CheckCircle size={14}/>;
      case 'rejete': return <XCircle size={14}/>;
      default: return <Clock size={14}/>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative">
      {showWizard && (
        <BudgetRequestWizard 
          commission={CommissionType.FINANCE} 
          onClose={() => setShowWizard(false)} 
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Budgets Événementiels</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Target size={14} className="text-indigo-500" /> Planification prévisionnelle & Suivi
          </p>
        </div>
        <button 
          onClick={() => setShowWizard(true)}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all hover:bg-slate-800"
        >
          <Plus size={18} /> Nouveau Budget
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
           
           {/* Filtres */}
           <div className="flex gap-2 pb-2">
              {['all', 'actif', 'clos'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === f ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {f === 'all' ? 'Tous' : f}
                </button>
              ))}
           </div>

           {filteredBudgets.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-64 glass-card border-dashed border-2 border-slate-200">
                <PieChart size={48} className="text-slate-300 mb-4" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aucun budget correspondant</p>
                <p className="text-[10px] text-slate-400 mt-1">Créez une nouvelle demande pour commencer le suivi.</p>
             </div>
           ) : (
             <div className="space-y-4">
               {filteredBudgets.map(budget => (
                 <div key={budget.id} className="glass-card p-6 bg-white border border-slate-100 hover:border-indigo-200 transition-all group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                             budget.priority === 'urgence' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'
                          }`}>
                             {budget.priority === 'urgence' ? <AlertTriangle size={20}/> : <FileText size={20}/>}
                          </div>
                          <div>
                             <h4 className="text-sm font-black text-slate-800">{budget.title}</h4>
                             <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                               {budget.category} • {new Date(budget.submittedAt).toLocaleDateString()}
                             </p>
                          </div>
                       </div>
                       <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-[9px] font-black uppercase border ${getStatusColor(budget.status)}`}>
                          {getStatusIcon(budget.status)}
                          {budget.status.replace('_', ' ')}
                       </div>
                    </div>

                    <div className="flex items-end justify-between mt-6">
                       <div className="space-y-1">
                          <p className="text-[9px] font-bold text-slate-400 uppercase">Montant {budget.status === 'approuve' ? 'Validé' : 'Estimé'}</p>
                          <p className={`text-xl font-black ${budget.status === 'approuve' ? 'text-emerald-600' : 'text-slate-800'}`}>
                             {(budget.amountApproved || budget.amountRequested).toLocaleString()} <span className="text-xs text-slate-400">FCFA</span>
                          </p>
                       </div>
                       <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors bg-slate-50 rounded-lg group-hover:bg-white border border-transparent group-hover:border-slate-100">
                          <ChevronRight size={20} />
                       </button>
                    </div>
                    
                    {/* Progress Bar (Mockup for execution) */}
                    {budget.status === 'approuve' && (
                      <div className="mt-4 pt-4 border-t border-slate-50">
                         <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
                            <span>Exécution</span>
                            <span>0%</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-0"></div>
                         </div>
                      </div>
                    )}
                 </div>
               ))}
             </div>
           )}
        </div>

        <div className="lg:col-span-4 space-y-8">
           {/* Total Summary */}
           <div className="glass-card p-8 bg-indigo-900 text-white relative overflow-hidden">
              <div className="relative z-10">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 opacity-60">Enveloppe Globale</h4>
                 <p className="text-4xl font-black mb-2">{totalBudgeted.toLocaleString()}</p>
                 <p className="text-[10px] font-medium opacity-60 uppercase tracking-widest mb-8">FCFA Engagés (Approuvés)</p>
                 
                 <div className="pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-[10px] font-bold opacity-80">En attente validation</span>
                       <span className="text-xs font-black text-amber-400">{pendingAmount.toLocaleString()} F</span>
                    </div>
                 </div>
              </div>
              <div className="absolute -bottom-6 -right-6 text-white/5 rotate-12"><PieChart size={140} /></div>
           </div>

           <div className="glass-card p-10 bg-rose-50/50 border-rose-100/50">
              <h4 className="text-[11px] font-black text-rose-800 uppercase tracking-widest mb-8 flex items-center gap-3">
                <AlertTriangle size={22} className="text-rose-600" /> Vigilance Budgétaire
              </h4>
              {pendingAmount > 1000000 ? (
                 <div className="p-4 bg-white border border-rose-100 rounded-xl shadow-sm">
                    <p className="text-xs font-bold text-rose-700">Volume de demandes élevé</p>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Les demandes en attente dépassent 1M FCFA. Une revue prioritaire est conseillée.</p>
                 </div>
              ) : (
                 <p className="text-xs text-slate-500 italic text-center">Aucune alerte critique pour le moment.</p>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanner;
