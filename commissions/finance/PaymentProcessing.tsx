
import React, { useState, useMemo } from 'react';
import { CreditCard, Smartphone, CheckCircle, Download, Share2, ShieldCheck, ArrowRight, Wallet, History, X, FileText, Loader2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Contribution } from '../../types';

const PaymentProcessing: React.FC = () => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<'wave' | 'om' | null>(null);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTransactionId, setLastTransactionId] = useState<string | null>(null);

  const { contributions, members, addContribution } = useData();

  // Récupération des dernières transactions réelles
  const recentReceipts = useMemo(() => {
    return [...contributions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(c => {
        const m = members.find(mem => mem.id === c.memberId);
        return {
          id: c.id,
          name: m ? `${m.firstName} ${m.lastName}` : 'Inconnu',
          date: new Date(c.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
          amt: c.amount.toLocaleString() + ' F',
          type: c.type
        };
      });
  }, [contributions, members]);

  const handlePayment = () => {
    if (!amount || !phone) return;
    setIsProcessing(true);

    // Simulation d'appel API Paiement (Wave/OM)
    setTimeout(() => {
      // 1. Créer la contribution
      const newContrib: Contribution = {
        id: Date.now().toString(),
        memberId: members[0]?.id || 'unknown', // Simule le membre connecté ou par défaut
        type: 'Adiyas', // Par défaut
        amount: parseInt(amount),
        date: new Date().toISOString().split('T')[0],
        eventLabel: `Paiement Mobile (${method === 'wave' ? 'Wave' : 'OM'})`,
        status: 'paid'
      };

      // 2. Sauvegarder
      addContribution(newContrib);
      setLastTransactionId(newContrib.id);

      // 3. Update UI
      setIsProcessing(false);
      setStep(3);
    }, 2000);
  };

  const resetForm = () => {
    setStep(1);
    setMethod(null);
    setAmount('');
    setPhone('');
    setLastTransactionId(null);
  };

  const fees = amount ? Math.ceil(parseInt(amount) * 0.01) : 0;
  const total = amount ? parseInt(amount) + fees : 0;

  return (
    <div className="space-y-8 animate-in zoom-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Terminal de Paiement (Interface Mockup fonctionnelle) */}
        <div className="lg:col-span-7">
           <div className="glass-card p-10 bg-white border-indigo-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] font-arabic text-8xl pointer-events-none">و</div>
              
              <div className="flex justify-between items-center mb-12">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-none">Guichet Digital Majma</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-3">Passerelle de paiement sécurisée</p>
                 </div>
                 <div className="flex gap-2">
                    <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                    <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                    <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                 </div>
              </div>

              {step === 1 && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Choisir le mode de paiement</p>
                      <div className="grid grid-cols-2 gap-6">
                         <button 
                          onClick={() => setMethod('wave')}
                          className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 group ${method === 'wave' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-indigo-300'}`}
                         >
                            <div className="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg"><Smartphone size={32}/></div>
                            <span className="font-black text-sm text-slate-800">Wave Sénégal</span>
                         </button>
                         <button 
                          onClick={() => setMethod('om')}
                          className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 group ${method === 'om' ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-orange-300'}`}
                         >
                            <div className="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg"><Smartphone size={32}/></div>
                            <span className="font-black text-sm text-slate-800">Orange Money</span>
                         </button>
                      </div>
                   </div>
                   
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant à verser (FCFA)</label>
                      <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Ex: 5000"
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black text-slate-900 outline-none focus:border-indigo-500 focus:bg-white transition-all"
                      />
                   </div>

                   <div className="pt-2">
                      <button 
                        disabled={!method || !amount}
                        onClick={() => setStep(2)}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:cursor-not-allowed"
                      >
                        Continuer vers la transaction <ArrowRight size={18}/>
                      </button>
                   </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                   <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
                      <div className="flex justify-between items-center pb-6 border-b border-slate-200">
                         <p className="text-[10px] font-black text-slate-400 uppercase">Récapitulatif</p>
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black text-white uppercase ${method === 'wave' ? 'bg-blue-500' : 'bg-orange-500'}`}>{method === 'wave' ? 'Wave' : 'Orange Money'}</span>
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between">
                            <span className="text-xs font-bold text-slate-500">Montant Principal</span>
                            <span className="text-xs font-black text-slate-800">{parseInt(amount).toLocaleString()} F</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-xs font-bold text-slate-500">Frais de réseau (est.)</span>
                            <span className="text-xs font-black text-slate-800">{fees} F</span>
                         </div>
                         <div className="flex justify-between pt-4 border-t border-slate-200">
                            <span className="text-sm font-black text-slate-900">Total à payer</span>
                            <span className="text-xl font-black text-indigo-600">{total.toLocaleString()} F</span>
                         </div>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Numéro de téléphone {method === 'wave' ? 'Wave' : 'Orange'}</label>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="77 000 00 00" 
                        className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xl font-black focus:border-indigo-500 focus:bg-white outline-none transition-all" 
                      />
                   </div>
                   <div className="flex gap-4">
                      <button onClick={() => setStep(1)} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">Retour</button>
                      <button 
                        onClick={handlePayment}
                        disabled={!phone || phone.length < 9 || isProcessing}
                        className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-indigo-900/10 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-all"
                      >
                        {isProcessing ? <Loader2 size={18} className="animate-spin"/> : 'Lancer la demande USSD'}
                      </button>
                   </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-10 space-y-8 animate-in zoom-in duration-500">
                   <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner border-4 border-emerald-50"><CheckCircle size={48}/></div>
                   <div>
                      <h4 className="text-2xl font-black text-slate-900">Paiement Validé !</h4>
                      <p className="text-sm text-slate-500 mt-2">La contribution a été enregistrée avec succès dans le grand livre.</p>
                   </div>
                   <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 font-mono text-[10px] text-slate-400">
                      Transaction ID: #{lastTransactionId}<br/>
                      Montant: {total.toLocaleString()} F<br/>
                      Date: {new Date().toLocaleString()}
                   </div>
                   <div className="flex flex-col gap-3">
                      <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all"><Download size={16}/> Télécharger Reçu Numérique</button>
                      <button onClick={resetForm} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">Nouvelle Transaction</button>
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* Sidebar Historique & Sécurité */}
        <div className="lg:col-span-5 space-y-8">
           <div className="glass-card p-10 bg-indigo-900 text-white relative overflow-hidden group">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 opacity-50 flex items-center gap-2"><ShieldCheck size={14}/> Sécurité des Flux</h4>
              <div className="space-y-6 relative z-10">
                 <p className="text-sm font-medium leading-relaxed italic opacity-80">"Chaque reçu généré possède un code de vérification unique. Les fonds sont réconciliés quotidiennement avec les relevés opérateurs."</p>
                 <div className="pt-6 border-t border-white/10 flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl"><History size={20}/></div>
                    <p className="text-[10px] font-black uppercase tracking-widest">Réconciliation Auto active</p>
                 </div>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-5 font-arabic text-[12rem] rotate-12 pointer-events-none">ص</div>
           </div>

           <div className="glass-card p-10 flex flex-col h-full bg-white border border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Derniers Reçus Édités</h4>
              <div className="space-y-4 flex-1">
                 {recentReceipts.length > 0 ? recentReceipts.map((r, i) => (
                   <div key={r.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-indigo-200 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100"><FileText size={18}/></div>
                         <div>
                            <p className="text-xs font-black text-slate-800 leading-none mb-1">{r.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">{r.date} • {r.type}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xs font-black text-slate-900">{r.amt}</p>
                         <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                            <button className="text-indigo-600 hover:scale-110 transition-transform"><Share2 size={12}/></button>
                            <button className="text-indigo-600 hover:scale-110 transition-transform"><Download size={12}/></button>
                         </div>
                      </div>
                   </div>
                 )) : (
                   <p className="text-center text-slate-400 text-xs italic py-10">Aucune transaction récente.</p>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;
