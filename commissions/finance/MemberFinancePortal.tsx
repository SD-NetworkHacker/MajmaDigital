
import React, { useMemo, useState } from 'react';
import { History, Download, ShieldCheck, Calendar, ChevronRight, User, Wallet, CheckCircle, Smartphone, ArrowLeft, Loader2, X, FileText, Share2, Eye } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../context/AuthContext';
import { MemberCategory, Contribution } from '../../types';
import { formatDate } from '../../utils/date';

const MemberFinancePortal: React.FC = () => {
  const { user } = useAuth();
  const { contributions, members, addContribution } = useData();
  
  // Navigation interne
  const [view, setView] = useState<'overview' | 'history' | 'receipt'>('overview');
  const [selectedTx, setSelectedTx] = useState<Contribution | null>(null);

  // States pour le paiement
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentType, setPaymentType] = useState<'Adiyas' | 'Sass' | 'Diayanté'>('Sass');
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'om' | null>(null);
  const [paymentPhone, setPaymentPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Identifier le membre courant via le contexte d'authentification
  const currentUser = useMemo(() => {
     if (!user) return null;
     return members.find(m => m.email === user.email);
  }, [members, user]);

  const myContributions = useMemo(() => {
    if (!currentUser) return [];
    return contributions.filter(c => c.memberId === currentUser.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [contributions, currentUser]);

  const totalContributed = useMemo(() => myContributions.reduce((acc, c) => acc + c.amount, 0), [myContributions]);

  // Calcul des cotisations théoriques
  const monthlySass = currentUser?.category === MemberCategory.TRAVAILLEUR ? 5000 : currentUser?.category === MemberCategory.ETUDIANT ? 2500 : 1000;
  
  // Vérifier si à jour
  const currentMonth = new Date().toISOString().slice(0, 7);
  const isUpToDate = myContributions.some(c => c.type === 'Sass' && c.date.startsWith(currentMonth));

  // --- ACTIONS ---

  const handleViewReceipt = (tx: Contribution) => {
      setSelectedTx(tx);
      setView('receipt');
  };

  const handleDownloadReceipt = () => {
      setIsDownloading(true);
      setTimeout(() => {
          setIsDownloading(false);
          alert("Reçu téléchargé (Simulation PDF)");
      }, 1500);
  };

  const processPayment = () => {
     if (!currentUser || !paymentAmount || !paymentMethod || !paymentPhone) return;
     
     setIsProcessing(true);
     setTimeout(() => {
        const newContrib: Contribution = {
           id: `TX-${Date.now()}`,
           memberId: currentUser.id,
           type: paymentType,
           amount: parseInt(paymentAmount),
           date: new Date().toISOString().split('T')[0],
           eventLabel: `Paiement Mobile (${paymentMethod.toUpperCase()})`,
           status: 'paid'
        };
        addContribution(newContrib);
        setIsProcessing(false);
        setPaymentStep(3); // Success step
     }, 2000);
  };

  const resetPayment = () => {
     setShowPaymentModal(false);
     setPaymentStep(1);
     setPaymentAmount('');
     setPaymentPhone('');
     setPaymentMethod(null);
  };

  if (!currentUser) {
     return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-in fade-in">
           <div className="p-6 bg-slate-50 rounded-full border-4 border-white shadow-xl">
              <User size={48} className="text-slate-300" />
           </div>
           <div>
              <h3 className="text-xl font-black text-slate-800">Profil Membre Introuvable</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
                 Votre compte utilisateur est actif mais n'est pas encore lié à une fiche membre.
              </p>
           </div>
        </div>
     );
  }

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700 pb-20 relative">
      
      {/* --- PAYMENT MODAL --- */}
      {showPaymentModal && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                     <Smartphone size={20} className="text-indigo-600"/> Guichet Mobile
                  </h3>
                  <button onClick={resetPayment} className="p-2 hover:bg-slate-200 rounded-full"><X size={20}/></button>
               </div>
               
               <div className="p-8">
                  {paymentStep === 1 && (
                     <div className="space-y-6">
                         {/* ... Payment Form Steps (Unchanged) ... */}
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400">Type de versement</label>
                           <div className="flex bg-slate-100 p-1 rounded-xl">
                              {['Sass', 'Adiyas', 'Diayanté'].map(t => (
                                 <button 
                                    key={t}
                                    onClick={() => setPaymentType(t as any)}
                                    className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${paymentType === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                                 >
                                    {t}
                                 </button>
                              ))}
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400">Montant (FCFA)</label>
                           <input 
                              type="number" 
                              value={paymentAmount}
                              onChange={e => setPaymentAmount(e.target.value)}
                              placeholder={paymentType === 'Sass' ? monthlySass.toString() : 'Ex: 5000'}
                              className="w-full p-4 bg-slate-50 border-none rounded-2xl text-2xl font-black text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20"
                           />
                        </div>
                        <button 
                           onClick={() => setPaymentStep(2)}
                           disabled={!paymentAmount}
                           className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
                        >
                           Continuer
                        </button>
                     </div>
                  )}

                  {paymentStep === 2 && (
                     <div className="space-y-6">
                         {/* ... Payment Details Step ... */}
                         <div className="grid grid-cols-2 gap-4">
                            <button 
                               onClick={() => setPaymentMethod('wave')}
                               className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all ${paymentMethod === 'wave' ? 'border-blue-400 bg-blue-50' : 'border-slate-100 hover:border-blue-200'}`}
                            >
                               <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-black">W</div>
                               <span className="text-xs font-bold">Wave</span>
                            </button>
                            <button 
                               onClick={() => setPaymentMethod('om')}
                               className={`p-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all ${paymentMethod === 'om' ? 'border-orange-400 bg-orange-50' : 'border-slate-100 hover:border-orange-200'}`}
                            >
                               <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-black">OM</div>
                               <span className="text-xs font-bold">Orange</span>
                            </button>
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400">Numéro de téléphone</label>
                           <input 
                              type="tel" 
                              value={paymentPhone}
                              onChange={e => setPaymentPhone(e.target.value)}
                              placeholder="77 000 00 00"
                              className="w-full p-4 bg-slate-50 border-none rounded-2xl text-lg font-bold text-slate-800 outline-none"
                           />
                        </div>
                        <div className="flex gap-3">
                           <button onClick={() => setPaymentStep(1)} className="px-6 py-4 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs uppercase">Retour</button>
                           <button 
                              onClick={processPayment}
                              disabled={!paymentMethod || !paymentPhone || isProcessing}
                              className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                           >
                              {isProcessing ? <Loader2 size={16} className="animate-spin"/> : <CheckCircle size={16}/>}
                              {isProcessing ? 'Traitement...' : 'Payer'}
                           </button>
                        </div>
                     </div>
                  )}

                  {paymentStep === 3 && (
                     <div className="text-center py-6 space-y-4">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
                           <CheckCircle size={40}/>
                        </div>
                        <h4 className="text-2xl font-black text-slate-800">Paiement Réussi !</h4>
                        <p className="text-sm text-slate-500">Votre contribution de <span className="font-bold text-emerald-600">{parseInt(paymentAmount).toLocaleString()} F</span> a bien été enregistrée.</p>
                        <button onClick={resetPayment} className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest">Fermer</button>
                     </div>
                  )}
               </div>
            </div>
         </div>
      )}

      {/* --- RECEIPT VIEW (DETAIL) --- */}
      {view === 'receipt' && selectedTx && (
        <div className="animate-in slide-in-from-right-4 duration-300 max-w-2xl mx-auto">
           <button 
             onClick={() => setView('overview')} 
             className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold text-xs uppercase tracking-widest transition-colors"
           >
             <ArrowLeft size={16}/> Retour
           </button>
           
           <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
              <div className="bg-slate-900 p-8 text-white text-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 opacity-10 p-6"><Wallet size={120}/></div>
                 <h3 className="text-2xl font-black uppercase tracking-widest relative z-10">Reçu de Transaction</h3>
                 <p className="text-sm opacity-60 font-mono mt-2 relative z-10">REF: {selectedTx.id}</p>
                 <div className="mt-8 p-4 bg-white/10 backdrop-blur-md rounded-2xl inline-block border border-white/10 relative z-10">
                    <p className="text-xs font-bold uppercase opacity-80 mb-1">Montant Payé</p>
                    <p className="text-3xl font-black">{selectedTx.amount.toLocaleString()} FCFA</p>
                 </div>
              </div>
              <div className="p-8 space-y-6">
                 <div className="flex justify-between border-b border-slate-100 pb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase">Bénéficiaire</span>
                    <span className="text-sm font-black text-slate-800">{currentUser.firstName} {currentUser.lastName}</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-100 pb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase">Type</span>
                    <span className="text-sm font-black text-slate-800">{selectedTx.type}</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-100 pb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase">Date</span>
                    <span className="text-sm font-black text-slate-800">{formatDate(selectedTx.date)}</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-100 pb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase">Libellé</span>
                    <span className="text-sm font-black text-slate-800">{selectedTx.eventLabel || '-'}</span>
                 </div>
                 <div className="flex justify-between items-center pt-2">
                    <span className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase"><CheckCircle size={14}/> Certifié MajmaDigital</span>
                    <div className="flex gap-2">
                       <button className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 text-slate-600 transition-all"><Share2 size={18}/></button>
                       <button 
                         onClick={handleDownloadReceipt}
                         className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all"
                       >
                          {isDownloading ? <Loader2 size={16} className="animate-spin"/> : <Download size={16}/>}
                          Télécharger
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- OVERVIEW VIEW (MAIN) --- */}
      {view === 'overview' && (
        <>
            {/* Header Personal */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg border-2 border-white">
                        {currentUser.firstName[0]}{currentUser.lastName[0]}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 leading-none">{currentUser.firstName} {currentUser.lastName}</h2>
                        <p className="text-sm text-slate-500 mt-1 font-medium">{currentUser.category} • {currentUser.matricule}</p>
                    </div>
                </div>
            </div>
            
            <button 
                className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-900/10 flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-indigo-700"
                onClick={() => setShowPaymentModal(true)}
            >
                <Smartphone size={18}/> Effectuer un Paiement
            </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Status & Next Dues */}
            <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 bg-gradient-to-br from-indigo-800 to-indigo-950 text-white relative overflow-hidden shadow-2xl group">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-12 opacity-50">Total Contributions</h4>
                    <h2 className="text-5xl font-black tracking-tighter">{totalContributed.toLocaleString()} <span className="text-xl opacity-30">F</span></h2>
                    <div className="mt-10 flex items-center gap-4 text-emerald-400">
                        <ShieldCheck size={20} />
                        <span className="text-[11px] font-black uppercase tracking-widest">Compte certifié</span>
                    </div>
                    <div className="absolute -right-10 -bottom-10 opacity-5 font-arabic text-8xl group-hover:scale-125 transition-transform duration-700">ق</div>
                </div>

                <div className="glass-card p-10 border-indigo-100 bg-white">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-3">
                        <Calendar size={18} className="text-indigo-600" /> État des Cotisations
                    </h4>
                    <div className="space-y-6">
                        <div className={`flex justify-between items-center p-4 rounded-2xl border ${isUpToDate ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                        <div>
                            <p className={`text-xs font-black uppercase ${isUpToDate ? 'text-emerald-800' : 'text-rose-800'}`}>Sass Mensuel</p>
                            <p className={`text-[9px] font-bold uppercase mt-1 ${isUpToDate ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {isUpToDate ? 'À jour pour ce mois' : 'Paiement en attente'}
                            </p>
                        </div>
                        <span className={`text-sm font-black ${isUpToDate ? 'text-emerald-700' : 'text-rose-700'}`}>{monthlySass} F</span>
                        </div>
                        
                        {!isUpToDate && (
                        <button 
                            onClick={() => { setPaymentType('Sass'); setPaymentAmount(monthlySass.toString()); setShowPaymentModal(true); }}
                            className="w-full py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-md"
                        >
                            Régulariser Maintenant
                        </button>
                        )}
                    </div>
                </div>
            </div>

            {/* History of Flows */}
            <div className="lg:col-span-8 space-y-8">
                <div className="glass-card overflow-hidden bg-white border-slate-100">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                        <h4 className="font-black text-slate-800 flex items-center gap-3">
                        <History size={22} className="text-indigo-600" /> Historique Personnel
                        </h4>
                    </div>
                    <div className="divide-y divide-slate-50 overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left">
                        <thead className="sticky top-0 bg-white z-10">
                            <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                <th className="px-8 py-5">Date</th>
                                <th className="px-8 py-5">Catégorie</th>
                                <th className="px-8 py-5">Montant</th>
                                <th className="px-8 py-5">ID Transaction</th>
                                <th className="px-8 py-5 text-right">Détails</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {myContributions.length > 0 ? myContributions.map((c, i) => (
                                <tr key={i} className="hover:bg-indigo-50/20 transition-all group cursor-pointer" onClick={() => handleViewReceipt(c)}>
                                <td className="px-8 py-6 text-xs font-bold text-slate-500">{formatDate(c.date)}</td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${c.type === 'Sass' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'}`}>
                                        {c.type}
                                    </span>
                                </td>
                                <td className="px-8 py-6 font-black text-indigo-600 text-sm">{c.amount.toLocaleString()}</td>
                                <td className="px-8 py-6"><span className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded font-mono text-[9px] border border-slate-100">{c.id.slice(-8)}</span></td>
                                <td className="px-8 py-6 text-right">
                                    <button className="p-2 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 shadow-sm transition-all"><Eye size={14}/></button>
                                </td>
                                </tr>
                            )) : (
                                <tr>
                                <td colSpan={5} className="text-center py-20 text-slate-400 text-xs italic">
                                    <Wallet size={32} className="mx-auto mb-3 opacity-20"/>
                                    Aucune contribution enregistrée.
                                </td>
                                </tr>
                            )}
                        </tbody>
                        </table>
                    </div>
                </div>

                {/* Security Note Portal */}
                <div className="p-8 bg-emerald-50/30 border border-emerald-100 rounded-[2rem] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                    <div className="p-4 bg-white rounded-2xl shadow-xl text-emerald-600 border border-emerald-50"><ShieldCheck size={32}/></div>
                    <div className="flex-1">
                        <h5 className="text-base font-black text-emerald-900 mb-1">Protection des Données Financières</h5>
                        <p className="text-[12px] font-medium text-emerald-800/70 leading-relaxed">
                        Vos informations de versement sont chiffrées. MajmaDigital utilise une architecture d'audit trail décentralisée pour garantir qu'aucune transaction ne peut être modifiée une fois validée par la trésorerie.
                        </p>
                    </div>
                    <div className="absolute -right-6 -bottom-6 opacity-5 text-emerald-900 font-arabic text-8xl pointer-events-none">ص</div>
                </div>
            </div>
            </div>
        </>
      )}
    </div>
  );
};

export default MemberFinancePortal;
