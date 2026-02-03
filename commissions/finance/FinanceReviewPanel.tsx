
import React, { useState, useEffect } from 'react';
import { 
  getAllBudgetRequests, 
  getAllFinancialReports, 
  processRequestDecision, 
  processReportDecision 
} from '../../services/financialService';
import { 
  CheckCircle, XCircle, AlertCircle, FileText, Banknote, 
  Filter, Search, Clock, ChevronRight, X, DollarSign, MessageSquare 
} from 'lucide-react';
import { BudgetRequest, CommissionFinancialReport } from '../../types';

interface DecisionModalState {
  isOpen: boolean;
  type: 'approve' | 'reject';
  itemType: 'request' | 'report';
  item: BudgetRequest | CommissionFinancialReport | null;
}

const FinanceReviewPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'reports'>('requests');
  const [viewMode, setViewMode] = useState<'pending' | 'processed'>('pending');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [modal, setModal] = useState<DecisionModalState>({ isOpen: false, type: 'approve', itemType: 'request', item: null });
  const [approvalAmount, setApprovalAmount] = useState<number>(0);
  const [rejectionReason, setRejectionReason] = useState('');

  // Data Loading
  const [requests, setRequests] = useState<BudgetRequest[]>([]);
  const [reports, setReports] = useState<CommissionFinancialReport[]>([]);

  const loadData = () => {
    // Force refresh from storage
    const freshRequests = getAllBudgetRequests();
    const freshReports = getAllFinancialReports();
    setRequests(freshRequests);
    setReports(freshReports);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  // Filtering Logic Update: 
  // 'soumis_bureau' is considered processed for the Finance Commission view (it moved up the chain)
  const filteredRequests = requests.filter(req => {
    const isPending = ['soumis_finance', 'revu_finance'].includes(req.status);
    // Si viewMode est 'pending', on veut ceux en attente. Sinon (processed), on veut tout le reste (approuve, rejete, soumis_bureau)
    const matchesView = viewMode === 'pending' ? isPending : !isPending;
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) || req.commission.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesView && matchesSearch;
  });

  const filteredReports = reports.filter(rep => {
    const isPending = ['soumis', 'revu_finance'].includes(rep.status);
    const matchesView = viewMode === 'pending' ? isPending : !isPending;
    const matchesSearch = rep.period.toLowerCase().includes(searchTerm.toLowerCase()) || rep.commission.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesView && matchesSearch;
  });

  // Handlers
  const openDecisionModal = (type: 'approve' | 'reject') => {
    if (!selectedItem) return;
    setModal({
      isOpen: true,
      type,
      itemType: activeTab === 'requests' ? 'request' : 'report',
      item: selectedItem
    });
    
    if (activeTab === 'requests') {
      // Default to requested amount
      setApprovalAmount(selectedItem.amountRequested);
    }
    setRejectionReason('');
  };

  const handleSubmitDecision = () => {
    if (!modal.item) return;

    if (modal.itemType === 'request') {
      processRequestDecision(
        modal.item.id, 
        modal.type, 
        'finance', 
        modal.type === 'approve' ? approvalAmount : undefined, 
        modal.type === 'reject' ? rejectionReason : undefined
      );
    } else {
      processReportDecision(
        modal.item.id,
        modal.type === 'approve' ? 'validate' : 'reject',
        rejectionReason
      );
    }

    // Close Modal
    setModal({ ...modal, isOpen: false });
    
    // Clear selection to return to list view (mobile friendly) and show update
    setSelectedItem(null);
    
    // Force Reload Data immediately to update UI
    setTimeout(() => {
        loadData();
        // Optional: Simple feedback
        // alert("Dossier traité avec succès."); 
    }, 100);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      
      {/* DECISION MODAL */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl animate-in zoom-in duration-200">
             <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-black flex items-center gap-2 ${modal.type === 'approve' ? 'text-emerald-700' : 'text-rose-700'}`}>
                   {modal.type === 'approve' ? <CheckCircle size={24}/> : <XCircle size={24}/>}
                   {modal.type === 'approve' ? 'Valider le Dossier' : 'Rejeter le Dossier'}
                </h3>
                <button onClick={() => setModal({...modal, isOpen: false})} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
             </div>

             <div className="space-y-6">
                {modal.type === 'approve' && modal.itemType === 'request' && (
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant Accordé (FCFA)</label>
                     <div className="relative">
                        <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                        <input 
                          type="number" 
                          className="w-full pl-10 pr-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl font-black text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          value={approvalAmount}
                          onChange={(e) => setApprovalAmount(Number(e.target.value))}
                        />
                     </div>
                     <p className="text-[10px] text-slate-400">Montant demandé : {(modal.item as BudgetRequest).amountRequested.toLocaleString()} F</p>
                     
                     {(modal.item as BudgetRequest).amountRequested > 50000 && (
                        <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2">
                           <AlertCircle size={14} className="text-amber-600 mt-0.5" />
                           <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                              Attention : Ce montant dépasse le seuil de 50.000 F. La validation transmettra le dossier au <strong>Bureau Exécutif</strong> pour approbation finale.
                           </p>
                        </div>
                     )}
                  </div>
                )}

                {modal.type === 'reject' && (
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Motif du rejet</label>
                     <textarea 
                        className="w-full p-4 bg-rose-50 border border-rose-100 rounded-xl text-sm text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 resize-none h-32"
                        placeholder="Veuillez indiquer la raison du rejet pour la commission..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                     />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                   <button 
                     onClick={() => setModal({...modal, isOpen: false})}
                     className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200"
                   >
                     Annuler
                   </button>
                   <button 
                     onClick={handleSubmitDecision}
                     disabled={modal.type === 'reject' && !rejectionReason}
                     className={`flex-1 py-3 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                       modal.type === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                     }`}
                   >
                     Confirmer
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Centre de Contrôle Financier</h3>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Validation des budgets et bilans</p>
         </div>
         
         <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <button 
              onClick={() => setActiveTab('requests')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'requests' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-indigo-600'}`}
            >
               <Banknote size={16}/> Demandes Budget
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reports' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-indigo-600'}`}
            >
               <FileText size={16}/> Bilans à Valider
            </button>
         </div>
      </div>

      {/* SECONDARY TOOLBAR */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-50 p-2 rounded-[1.5rem] border border-slate-100">
         <div className="flex p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
            <button 
               onClick={() => { setViewMode('pending'); setSelectedItem(null); }}
               className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'pending' ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:bg-slate-50'}`}
            >
               En Attente
            </button>
            <button 
               onClick={() => { setViewMode('processed'); setSelectedItem(null); }}
               className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'processed' ? 'bg-blue-100 text-blue-700' : 'text-slate-400 hover:bg-slate-50'}`}
            >
               Historique
            </button>
         </div>
         
         <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input 
               type="text" 
               placeholder="Filtrer par commission, titre..." 
               className="w-full pl-10 pr-4 py-2.5 bg-white border-none rounded-xl text-xs font-bold shadow-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
         
         {/* LEFT LIST */}
         <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 pb-10">
            {activeTab === 'requests' ? (
               filteredRequests.length > 0 ? filteredRequests.map(req => (
                 <div 
                   key={req.id} 
                   onClick={() => setSelectedItem(req)}
                   className={`p-5 bg-white border-2 rounded-2xl cursor-pointer transition-all group ${
                     selectedItem?.id === req.id 
                       ? 'border-indigo-500 shadow-lg ring-4 ring-indigo-500/10' 
                       : 'border-slate-100 hover:border-indigo-200'
                   }`}
                 >
                    <div className="flex justify-between items-start mb-3">
                       <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          {req.commission}
                       </span>
                       {req.priority === 'urgence' && (
                          <span className="flex items-center gap-1 text-[9px] font-black uppercase text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                             <AlertCircle size={10}/> Urgent
                          </span>
                       )}
                    </div>
                    <h4 className="text-sm font-black text-slate-800 mb-1 leading-tight">{req.title}</h4>
                    <div className="flex justify-between items-end mt-4">
                       <div>
                          <p className="text-[10px] text-slate-400 font-medium">Demandé</p>
                          <p className="text-lg font-black text-indigo-600">{req.amountRequested.toLocaleString()} F</p>
                       </div>
                       <ChevronRight size={16} className={`transition-transform ${selectedItem?.id === req.id ? 'text-indigo-600 translate-x-1' : 'text-slate-300'}`} />
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
                        <span className={`text-[9px] font-bold uppercase ${
                           req.status === 'approuve' ? 'text-emerald-500' : req.status === 'rejete' ? 'text-rose-500' : req.status === 'soumis_bureau' ? 'text-purple-500' : 'text-amber-500'
                        }`}>
                           {req.status.replace('_', ' ')}
                        </span>
                        <span className="text-[9px] text-slate-400">{new Date(req.submittedAt).toLocaleDateString()}</span>
                    </div>
                 </div>
               )) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-[2rem]">
                     <Banknote size={32} className="mb-4 opacity-30"/>
                     <p className="text-xs font-bold uppercase">Aucune demande</p>
                  </div>
               )
            ) : (
               filteredReports.length > 0 ? filteredReports.map(rep => (
                 <div 
                   key={rep.id} 
                   onClick={() => setSelectedItem(rep)}
                   className={`p-5 bg-white border-2 rounded-2xl cursor-pointer transition-all ${
                     selectedItem?.id === rep.id ? 'border-indigo-500 shadow-lg ring-4 ring-indigo-500/10' : 'border-slate-100 hover:border-indigo-200'
                   }`}
                 >
                    <div className="flex justify-between items-start mb-2">
                       <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">{rep.commission}</span>
                       <FileText size={16} className="text-slate-300"/>
                    </div>
                    <h4 className="text-sm font-black text-slate-800 mb-1">{rep.period}</h4>
                    <p className={`text-xs font-bold ${rep.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>Solde: {rep.balance.toLocaleString()} F</p>
                    <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
                        <span className="text-[9px] font-bold uppercase text-slate-400">Statut: {rep.status}</span>
                    </div>
                 </div>
               )) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-[2rem]">
                     <FileText size={32} className="mb-4 opacity-30"/>
                     <p className="text-xs font-bold uppercase">Aucun bilan</p>
                  </div>
               )
            )}
         </div>

         {/* RIGHT DETAIL */}
         <div className="lg:col-span-7 flex flex-col h-full overflow-hidden">
            {selectedItem ? (
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl h-full flex flex-col animate-in slide-in-from-right-4 duration-300 relative">
                  
                  {/* Detail Header */}
                  <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-100">
                     <div>
                        <div className="flex items-center gap-3 mb-2">
                           <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                              {activeTab === 'requests' ? 'Demande Budget' : 'Bilan Financier'}
                           </span>
                           <span className="text-[10px] text-slate-400 font-mono">#{selectedItem.id.slice(-6)}</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 leading-tight">
                           {activeTab === 'requests' ? selectedItem.title : selectedItem.period}
                        </h2>
                        <p className="text-xs font-medium text-slate-500 mt-2 flex items-center gap-2">
                           <Clock size={12}/> {new Date(selectedItem.submittedAt).toLocaleString()} • Par {selectedItem.submittedBy}
                        </p>
                     </div>
                     
                     {/* Status Badge in Detail */}
                     <div className={`p-4 rounded-2xl ${
                        selectedItem.status === 'approuve' || selectedItem.status === 'cloture' ? 'bg-emerald-100 text-emerald-600' :
                        selectedItem.status === 'rejete' ? 'bg-rose-100 text-rose-600' : 
                        selectedItem.status === 'soumis_bureau' ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'
                     }`}>
                        {selectedItem.status === 'approuve' || selectedItem.status === 'cloture' ? <CheckCircle size={32}/> :
                         selectedItem.status === 'rejete' ? <XCircle size={32}/> : <Clock size={32}/>}
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-8">
                     {activeTab === 'requests' ? (
                       <>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                               <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Montant Demandé</p>
                               <p className="text-3xl font-black text-indigo-900">{selectedItem.amountRequested.toLocaleString()} F</p>
                            </div>
                            {selectedItem.amountApproved && (
                               <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Accordé</p>
                                  <p className="text-3xl font-black text-emerald-800">{selectedItem.amountApproved.toLocaleString()} F</p>
                               </div>
                            )}
                         </div>

                         <div>
                            <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2"><FileText size={14}/> Justification</h5>
                            <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 font-medium">
                               {selectedItem.description}
                            </div>
                         </div>

                         <div>
                            <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Ventilation des Coûts</h5>
                            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                               <table className="w-full text-left">
                                  <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase">
                                     <tr>
                                        <th className="p-4">Item</th>
                                        <th className="p-4 text-center">Qté</th>
                                        <th className="p-4 text-right">Total</th>
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-50 text-sm">
                                     {selectedItem.breakdown.map((item: any, i: number) => (
                                       <tr key={i}>
                                          <td className="p-4 font-medium text-slate-700">{item.item}</td>
                                          <td className="p-4 text-center text-slate-500">{item.quantity}</td>
                                          <td className="p-4 text-right font-bold text-slate-900">{item.total.toLocaleString()} F</td>
                                       </tr>
                                     ))}
                                  </tbody>
                               </table>
                            </div>
                         </div>
                       </>
                     ) : (
                       // Report Detail
                       <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-5 bg-slate-50 rounded-2xl text-center border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Budget Alloué</p>
                                <p className="text-2xl font-black text-slate-800">{selectedItem.totalBudgetAllocated.toLocaleString()} F</p>
                             </div>
                             <div className="p-5 bg-slate-50 rounded-2xl text-center border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Dépenses</p>
                                <p className="text-2xl font-black text-rose-600">{selectedItem.totalExpenses.toLocaleString()} F</p>
                             </div>
                          </div>
                          
                          <div>
                             <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Lignes de Dépenses</h5>
                             <div className="space-y-2">
                               {selectedItem.expenses.map((exp: any, i: number) => (
                                 <div key={i} className="p-4 border border-slate-100 rounded-xl flex justify-between items-center text-sm hover:bg-slate-50 transition-colors">
                                    <div>
                                       <p className="font-bold text-slate-700">{exp.description}</p>
                                       <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-0.5">{exp.category}</p>
                                    </div>
                                    <span className="font-black text-slate-900">{exp.amount.toLocaleString()} F</span>
                                 </div>
                               ))}
                             </div>
                          </div>
                       </div>
                     )}

                     {selectedItem.rejectionReason && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                           <p className="text-[10px] font-black text-rose-600 uppercase mb-1">Motif du rejet</p>
                           <p className="text-sm text-rose-800 font-medium">{selectedItem.rejectionReason}</p>
                        </div>
                     )}
                  </div>

                  {/* Actions Bar - Only show if pending */}
                  {viewMode === 'pending' && (
                     <div className="pt-6 mt-6 border-t border-slate-100 flex gap-4">
                        <button 
                           onClick={() => openDecisionModal('reject')}
                           className="flex-1 py-4 border-2 border-rose-100 text-rose-600 hover:bg-rose-50 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                           <XCircle size={18}/> Rejeter
                        </button>
                        <button 
                           onClick={() => openDecisionModal('approve')}
                           className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                           <CheckCircle size={18}/> 
                           {activeTab === 'requests' && selectedItem.amountRequested > 50000 
                              ? 'Valider & Transmettre Bureau' 
                              : 'Approuver Définitivement'
                           }
                        </button>
                     </div>
                  )}
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
                  <div className="p-6 bg-white rounded-full shadow-sm mb-4"><Filter size={32} className="opacity-50"/></div>
                  <p className="text-sm font-black uppercase tracking-widest text-slate-400">Sélectionnez un dossier</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default FinanceReviewPanel;
