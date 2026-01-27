
import React, { useState } from 'react';
// Added FileText to the list of imported icons from lucide-react to fix the 'Cannot find name' error
import { CreditCard, Smartphone, CheckCircle, Download, Share2, ShieldCheck, ArrowRight, Wallet, History, X, FileText } from 'lucide-react';

const PaymentProcessing: React.FC = () => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<'wave' | 'om' | null>(null);

  return (
    <div className="space-y-8 animate-in zoom-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Terminal de Paiement */}
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
                   <div className="pt-6">
                      <button 
                        disabled={!method}
                        onClick={() => setStep(2)}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 transition-all active:scale-95"
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
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black text-white uppercase ${method === 'wave' ? 'bg-blue-500' : 'bg-orange-500'}`}>{method} Active</span>
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between">
                            <span className="text-xs font-bold text-slate-500">Montant Principal</span>
                            <span className="text-xs font-black text-slate-800">25,000 F</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-xs font-bold text-slate-500">Frais de réseau</span>
                            <span className="text-xs font-black text-slate-800">250 F</span>
                         </div>
                         <div className="flex justify-between pt-4 border-t border-slate-200">
                            <span className="text-sm font-black text-slate-900">Total à payer</span>
                            <span className="text-xl font-black text-indigo-600">25,250 F</span>
                         </div>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Numéro de téléphone {method === 'wave' ? 'Wave' : 'Orange'}</label>
                      <input type="tel" placeholder="7x xxx xx xx" className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xl font-black focus:border-indigo-500 focus:bg-white outline-none transition-all" />
                   </div>
                   <div className="flex gap-4">
                      <button onClick={() => setStep(1)} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest">Retour</button>
                      <button onClick={() => setStep(3)} className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-indigo-900/10">Lancer la demande USSD</button>
                   </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-10 space-y-8 animate-in zoom-in duration-500">
                   <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner"><CheckCircle size={48}/></div>
                   <div>
                      <h4 className="text-2xl font-black text-slate-900">Paiement Validé !</h4>
                      <p className="text-sm text-slate-500 mt-2">La contribution a été enregistrée avec succès dans le grand livre.</p>
                   </div>
                   <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 font-mono text-[10px] text-slate-400">
                      Transaction ID: #MAJ-5092-WX-22<br/>
                      Hash d'audit: 0x4f8e...92ac
                   </div>
                   <div className="flex flex-col gap-3">
                      <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3"><Download size={16}/> Télécharger Reçu Numérique</button>
                      <button onClick={() => {setStep(1); setMethod(null);}} className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest">Nouvelle Transaction</button>
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

           <div className="glass-card p-10 flex flex-col h-full">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Derniers Reçus Édités</h4>
              <div className="space-y-4 flex-1">
                 {[
                   { name: 'Abdou Wade', date: 'Aujourd\'hui', amt: '5,000 F', type: 'Sass' },
                   { name: 'Khady Diop', date: 'Hier', amt: '50,000 F', type: 'Adiyas' },
                   { name: 'Bakary Sow', date: '02 Mai', amt: '2,500 F', type: 'Sass' },
                 ].map((r, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-indigo-200 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm"><FileText size={18}/></div>
                         <div>
                            <p className="text-xs font-black text-slate-800 leading-none mb-1">{r.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">{r.date} • {r.type}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xs font-black text-slate-900">{r.amt}</p>
                         <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-indigo-600"><Share2 size={12}/></button>
                            <button className="text-indigo-600"><Download size={12}/></button>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;
