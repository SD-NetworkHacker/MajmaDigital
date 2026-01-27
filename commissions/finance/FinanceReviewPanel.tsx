
import React, { useState } from 'react';
import { getAllPendingRequests, getPendingReports, processRequestDecision } from '../../services/financialService';
import { CheckCircle, XCircle, AlertCircle, Eye, FileText, Banknote, Filter, Search } from 'lucide-react';

const FinanceReviewPanel: React.FC = () => {
  const [activeView, setActiveView] = useState<'requests' | 'reports'>('requests');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const requests = getAllPendingRequests();
  const reports = getPendingReports(); // Assumed to return array

  const handleDecision = (id: string, decision: 'approve' | 'reject') => {
    // In a real app, this would open a modal for reason/amount adjustment
    if (confirm(`Confirmer la décision : ${decision} ?`)) {
      processRequestDecision(id, decision, 'finance');
      setSelectedItem(null);
      // Force refresh logic would go here
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
         <h3 className="text-2xl font-black text-slate-900 tracking-tight">Centre de Contrôle Financier</h3>
         <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button 
              onClick={() => setActiveView('requests')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'requests' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-400'}`}
            >
               Demandes Budget ({requests.length})
            </button>
            <button 
              onClick={() => setActiveView('reports')}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'reports' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-400'}`}
            >
               Bilans à Valider ({reports.length})
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* List View */}
         <div className="lg:col-span-5 space-y-4">
            {activeView === 'requests' ? (
               requests.map(req => (
                 <div 
                   key={req.id} 
                   onClick={() => setSelectedItem(req)}
                   className={`p-6 bg-white border-2 rounded-2xl cursor-pointer transition-all ${selectedItem?.id === req.id ? 'border-blue-500 shadow-lg' : 'border-slate-100 hover:border-blue-200'}`}
                 >
                    <div className="flex justify-between items-start mb-2">
                       <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">{req.commission}</span>
                       <span className={`text-[9px] font-black uppercase ${req.priority === 'urgence' ? 'text-rose-600' : 'text-slate-400'}`}>{req.priority}</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-800 mb-1">{req.title}</h4>
                    <p className="text-lg font-black text-blue-600">{req.amountRequested.toLocaleString()} F</p>
                 </div>
               ))
            ) : (
               reports.map(rep => (
                 <div 
                   key={rep.id} 
                   onClick={() => setSelectedItem(rep)}
                   className={`p-6 bg-white border-2 rounded-2xl cursor-pointer transition-all ${selectedItem?.id === rep.id ? 'border-blue-500 shadow-lg' : 'border-slate-100 hover:border-blue-200'}`}
                 >
                    <div className="flex justify-between items-start mb-2">
                       <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">{rep.commission}</span>
                       <FileText size={16} className="text-slate-300"/>
                    </div>
                    <h4 className="text-sm font-black text-slate-800 mb-1">{rep.period}</h4>
                    <p className={`text-xs font-bold ${rep.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>Solde: {rep.balance.toLocaleString()} F</p>
                 </div>
               ))
            )}
            
            {(activeView === 'requests' && requests.length === 0) && <p className="text-center text-slate-400 text-xs italic py-10">Aucune demande en attente.</p>}
         </div>

         {/* Detail View */}
         <div className="lg:col-span-7">
            {selectedItem ? (
               <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
                  <div className="flex justify-between items-start mb-8">
                     <div>
                        <h2 className="text-2xl font-black text-slate-900">{activeView === 'requests' ? selectedItem.title : selectedItem.period}</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">ID: {selectedItem.id} • Soumis par {selectedItem.submittedBy}</p>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-2xl text-slate-400">
                        {activeView === 'requests' ? <Banknote size={32}/> : <FileText size={32}/>}
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-8">
                     {activeView === 'requests' ? (
                       <>
                         <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Montant Demandé</p>
                            <p className="text-4xl font-black text-blue-900">{selectedItem.amountRequested.toLocaleString()} FCFA</p>
                         </div>
                         <div>
                            <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Justification</h5>
                            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl">{selectedItem.description}</p>
                         </div>
                         <div>
                            <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Détail du Budget</h5>
                            <div className="space-y-2">
                               {selectedItem.breakdown.map((item: any, i: number) => (
                                 <div key={i} className="flex justify-between p-3 border-b border-slate-50 text-sm">
                                    <span className="text-slate-600 font-medium">{item.item} (x{item.quantity})</span>
                                    <span className="font-bold text-slate-900">{item.total.toLocaleString()} F</span>
                                 </div>
                               ))}
                            </div>
                         </div>
                       </>
                     ) : (
                       // Report Detail View
                       <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase">Alloué</p>
                                <p className="text-lg font-black text-slate-800">{selectedItem.totalBudgetAllocated.toLocaleString()}</p>
                             </div>
                             <div className="p-4 bg-slate-50 rounded-2xl text-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase">Dépensé</p>
                                <p className="text-lg font-black text-rose-600">{selectedItem.totalExpenses.toLocaleString()}</p>
                             </div>
                          </div>
                          <div>
                             <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Lignes de Dépenses</h5>
                             {selectedItem.expenses.map((exp: any, i: number) => (
                               <div key={i} className="p-3 border-b border-slate-50 flex justify-between text-sm">
                                  <span className="text-slate-600">{exp.description}</span>
                                  <span className="font-bold">{exp.amount.toLocaleString()} F</span>
                               </div>
                             ))}
                          </div>
                       </div>
                     )}
                  </div>

                  <div className="pt-8 mt-8 border-t border-slate-100 flex gap-4">
                     <button 
                        onClick={() => handleDecision(selectedItem.id, 'reject')}
                        className="flex-1 py-4 border-2 border-rose-100 text-rose-600 hover:bg-rose-50 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all"
                     >
                        <XCircle size={18}/> Rejeter
                     </button>
                     <button 
                        onClick={() => handleDecision(selectedItem.id, 'approve')}
                        className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all"
                     >
                        <CheckCircle size={18}/> {activeView === 'requests' && selectedItem.amountRequested > 50000 ? 'Valider pour Bureau' : 'Approuver'}
                     </button>
                  </div>
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-[3rem]">
                  <AlertCircle size={48} className="mb-4 opacity-50"/>
                  <p className="text-xs font-black uppercase tracking-widest">Sélectionnez un dossier à traiter</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default FinanceReviewPanel;
