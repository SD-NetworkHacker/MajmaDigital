import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wallet, CheckCircle, XCircle, Activity, PieChart, AlertCircle, X, DollarSign, Target, TrendingUp, Layers
} from 'lucide-react';
import { PieChart as RePie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useData } from '../../contexts/DataContext';
import { getAllBudgetRequests, processRequestDecision } from '../../services/financialService';
import { BudgetRequest } from '../../types';

interface DecisionModalState {
  isOpen: boolean;
  type: 'approve' | 'reject';
  request: BudgetRequest | null;
}

const StrategicOversight: React.FC = () => {
  const { totalTreasury } = useData();
  const [requests, setRequests] = useState<BudgetRequest[]>([]);
  const [modal, setModal] = useState<DecisionModalState>({ isOpen: false, type: 'approve', request: null });
  
  // États pour la décision
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [rejectionReason, setRejectionReason] = useState('');

  const loadRequests = () => {
    setRequests(getAllBudgetRequests());
  };

  useEffect(() => {
    loadRequests();
    window.addEventListener('storage', loadRequests);
    return () => window.removeEventListener('storage', loadRequests);
  }, []);

  // Filtrer les demandes en attente d'arbitrage (Venant de la Finance > 50k)
  const pendingArbitration = useMemo(() => 
    requests.filter(r => r.status === 'soumis_bureau'), 
  [requests]);

  // Calculs Budgétaires
  const totalEngaged = requests
    .filter(r => r.status === 'approuve' || r.status === 'finance_partiel')
    .reduce((acc, r) => acc + (r.amountApproved || 0), 0);

  const availableFunds = Math.max(0, totalTreasury - totalEngaged);
  const engagementRate = totalTreasury > 0 ? Math.round((totalEngaged / totalTreasury) * 100) : 0;

  const chartData = [
    { name: 'Disponible', value: availableFunds, color: '#10b981' }, // Emerald
    { name: 'Engagé', value: totalEngaged, color: '#6366f1' }, // Indigo
  ];

  // Handlers
  const openDecisionModal = (type: 'approve' | 'reject', req: BudgetRequest) => {
    setModal({ isOpen: true, type, request: req });
    if (type === 'approve') {
      setFinalAmount(req.amountApproved || req.amountRequested); // Reprend le montant validé par la finance ou le montant demandé
    }
    setRejectionReason('');
  };

  const handleDecision = () => {
    if (!modal.request) return;

    processRequestDecision(
      modal.request.id,
      modal.type,
      'bureau',
      modal.type === 'approve' ? finalAmount : undefined,
      modal.type === 'reject' ? rejectionReason : undefined
    );

    setModal({ ...modal, isOpen: false });
    loadRequests(); // Refresh UI
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      
      {/* DECISION MODAL (DARK) */}
      {modal.isOpen && modal.request && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 w-full max-w-md rounded-[2rem] p-8 shadow-2xl border border-slate-700 animate-in zoom-in duration-200">
             <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-black flex items-center gap-2 ${modal.type === 'approve' ? 'text-emerald-400' : 'text-rose-400'}`}>
                   {modal.type === 'approve' ? <CheckCircle size={24}/> : <XCircle size={24}/>}
                   {modal.type === 'approve' ? 'Approbation Finale' : 'Rejet Définitif'}
                </h3>
                <button onClick={() => setModal({...modal, isOpen: false})} className="p-2 hover:bg-slate-800 rounded-full text-slate-400"><X size={20}/></button>
             </div>

             <div className="space-y-6">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Contexte</p>
                   <p className="text-sm font-bold text-white">{modal.request.title}</p>
                   <p className="text-xs text-slate-400 mt-1">Commission {modal.request.commission}</p>
                </div>

                {modal.type === 'approve' && (
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant Autorisé (FCFA)</label>
                     <div className="relative">
                        <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                        <input 
                          type="number" 
                          className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-emerald-500/30 rounded-xl font-black text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                          value={finalAmount}
                          onChange={(e) => setFinalAmount(Number(e.target.value))}
                        />
                     </div>
                     <p className="text-[10px] text-slate-500">Montant initialement validé par Finance : {(modal.request.amountApproved || modal.request.amountRequested).toLocaleString()} F</p>
                  </div>
                )}

                {modal.type === 'reject' && (
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Motif du refus</label>
                     <textarea 
                        className="w-full p-4 bg-slate-800 border border-rose-500/30 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none h-32"
                        placeholder="Indiquez la raison pour la commission..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                     />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                   <button 
                     onClick={() => setModal({...modal, isOpen: false})}
                     className="flex-1 py-3 bg-slate-800 text-slate-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700"
                   >
                     Annuler
                   </button>
                   <button 
                     onClick={handleDecision}
                     disabled={modal.type === 'reject' && !rejectionReason}
                     className={`flex-1 py-3 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                       modal.type === 'approve' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                     }`}
                   >
                     Valider Décision
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Health Matrix & Global Status */}
        <div className="lg:col-span-8 space-y-6">
           {/* Global Health Indicator */}
           <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 relative overflow-hidden group">
              {/* Animated Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
              
              <div className="relative z-10">
                 <div className="flex justify-between items-start mb-10">
                    <div>
                       <h4 className="text-xl font-black text-white">Indice de Santé Globale</h4>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Conformité & Trésorerie</p>
                    </div>
                    <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 text-emerald-400">
                       <Activity size={24} />
                    </div>
                 </div>

                 <div className="flex items-end gap-4 mb-6">
                    <span className="text-6xl font-black text-white">{engagementRate}%</span>
                    <span className="text-sm font-bold text-emerald-400 mb-2">+2.4% vs M-1</span>
                 </div>

                 <div className="space-y-4">
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                          <span>Disponibilité Fonds</span>
                          <span>{availableFunds.toLocaleString()} F</span>
                       </div>
                       <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${(availableFunds/totalTreasury)*100}%` }}></div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
           
           {/* Quick Actions */}
           <div className="grid grid-cols-2 gap-4">
              <button className="p-5 bg-slate-900 border border-slate-800 rounded-[1.5rem] hover:bg-slate-800 transition-all group/btn text-left">
                 <Target size={24} className="text-blue-500 mb-3 group-hover/btn:scale-110 transition-transform"/>
                 <p className="text-xs font-black text-white">Objectifs 2024</p>
                 <p className="text-[9px] text-slate-500 uppercase mt-1">Voir KPI</p>
              </button>
              <button className="p-5 bg-slate-900 border border-slate-800 rounded-[1.5rem] hover:bg-slate-800 transition-all group/btn text-left">
                 <Layers size={24} className="text-purple-500 mb-3 group-hover/btn:scale-110 transition-transform"/>
                 <p className="text-xs font-black text-white">Audit Complet</p>
                 <p className="text-[9px] text-slate-500 uppercase mt-1">Générer</p>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicOversight;