
import React, { useState } from 'react';
import { CommissionType, CommissionFinancialReport, BudgetRequest } from '../../types';
import { 
  Wallet, TrendingUp, FileText, Plus, PieChart, 
  AlertCircle, CheckCircle, Clock, ChevronRight 
} from 'lucide-react';
import { getCommissionReports, getCommissionRequests } from '../../services/financialService';
import FinancialReportBuilder from './FinancialReportBuilder';
import BudgetRequestWizard from './BudgetRequestWizard';

interface Props {
  commission: CommissionType;
}

const CommissionFinancialDashboard: React.FC<Props> = ({ commission }) => {
  const [showReportBuilder, setShowReportBuilder] = useState(false);
  const [showBudgetWizard, setShowBudgetWizard] = useState(false);

  const reports = getCommissionReports(commission);
  const requests = getCommissionRequests(commission);

  // Initialisation à 0 (pas de budget alloué par défaut)
  const activeBudget = 0; 
  // Calcul des dépenses réelles basées sur les rapports soumis
  const spent = reports.reduce((acc, r) => acc + (r.totalExpenses || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {showReportBuilder && <FinancialReportBuilder commission={commission} onClose={() => setShowReportBuilder(false)} />}
      {showBudgetWizard && <BudgetRequestWizard commission={commission} onClose={() => setShowBudgetWizard(false)} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Budget Overview Card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-slate-800 to-slate-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                 <div className="p-3 bg-white/10 rounded-2xl border border-white/10"><Wallet size={24}/></div>
                 <h4 className="text-sm font-black uppercase tracking-widest">Budget Actif</h4>
              </div>
              <h2 className="text-4xl font-black mb-2">{activeBudget.toLocaleString()} <span className="text-lg opacity-40">F</span></h2>
              <div className="w-full bg-white/10 h-2 rounded-full mt-6 overflow-hidden">
                 <div className="bg-emerald-400 h-full" style={{ width: activeBudget > 0 ? `${(spent/activeBudget)*100}%` : '0%' }}></div>
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-bold opacity-60 uppercase">
                 <span>Dépensé: {spent.toLocaleString()}</span>
                 <span>Reste: {(activeBudget - spent).toLocaleString()}</span>
              </div>
           </div>
           <div className="absolute -right-10 -bottom-10 opacity-5 font-arabic text-9xl">م</div>
        </div>

        {/* Actions */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div 
             onClick={() => setShowBudgetWizard(true)}
             className="p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:shadow-xl hover:border-emerald-200 transition-all cursor-pointer group flex flex-col justify-between"
           >
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform"><Plus size={24}/></div>
              <div>
                 <h4 className="text-lg font-black text-slate-800">Demander Budget</h4>
                 <p className="text-xs text-slate-400 mt-2 leading-relaxed">Créer une nouvelle requête de fonds pour un événement ou un projet spécifique.</p>
              </div>
           </div>
           <div 
             onClick={() => setShowReportBuilder(true)}
             className="p-8 bg-white border border-slate-100 rounded-[2.5rem] hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group flex flex-col justify-between"
           >
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform"><FileText size={24}/></div>
              <div>
                 <h4 className="text-lg font-black text-slate-800">Soumettre Bilan</h4>
                 <p className="text-xs text-slate-400 mt-2 leading-relaxed">Justifier les dépenses effectuées et clôturer une enveloppe budgétaire.</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Requests List */}
         <div className="glass-card p-8 bg-white">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2"><TrendingUp size={18}/> Suivi des Demandes</h4>
            <div className="space-y-4">
               {requests.length > 0 ? requests.map(req => (
                 <div key={req.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                       <p className="text-xs font-black text-slate-800">{req.title}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{req.amountRequested.toLocaleString()} F • {new Date(req.submittedAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                      req.status === 'approuve' ? 'bg-emerald-100 text-emerald-700' : req.status === 'rejete' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                       {req.status.replace('_', ' ')}
                    </span>
                 </div>
               )) : (
                 <p className="text-xs text-slate-400 italic text-center py-4">Aucune demande en cours</p>
               )}
            </div>
         </div>

         {/* Reports History */}
         <div className="glass-card p-8 bg-white">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2"><PieChart size={18}/> Historique Bilans</h4>
            <div className="space-y-4">
               {reports.length > 0 ? reports.map(rpt => (
                 <div key={rpt.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                       <div className="p-2 bg-white rounded-lg text-blue-500 shadow-sm"><CheckCircle size={16}/></div>
                       <div>
                          <p className="text-xs font-black text-slate-800">{rpt.period}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Solde: {rpt.balance.toLocaleString()} F</p>
                       </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500" />
                 </div>
               )) : (
                 <p className="text-xs text-slate-400 italic text-center py-4">Aucun bilan archivé</p>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default CommissionFinancialDashboard;
