
import React, { useMemo, useState, useEffect } from 'react';
import { History, Download, ShieldCheck, Calendar, User, Wallet, CheckCircle, Smartphone, ArrowLeft, Loader2, X, Share2, Eye } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../context/AuthContext';
import { MemberCategory, Contribution } from '../../types';
import { formatDate } from '../../utils/date';

const MemberFinancePortal: React.FC = () => {
  const { user } = useAuth();
  const { contributions, members, addContribution, isLoading } = useData();
  
  const [view, setView] = useState<'overview' | 'history' | 'receipt'>('overview');
  const [selectedTx, setSelectedTx] = useState<Contribution | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentType, setPaymentType] = useState<'Adiyas' | 'Sass' | 'Diayanté'>('Sass');

  const currentUserMember = useMemo(() => {
     return members.find(m => m.id === user?.id || m.email === user?.email);
  }, [members, user]);

  const myContributions = useMemo(() => {
    if (!currentUserMember) return [];
    return contributions.filter(c => c.memberId === currentUserMember.id);
  }, [contributions, currentUserMember]);

  const totalContributed = useMemo(() => myContributions.reduce((acc, c) => acc + c.amount, 0), [myContributions]);
  const monthlySass = currentUserMember?.category === MemberCategory.TRAVAILLEUR ? 5000 : currentUserMember?.category === MemberCategory.ETUDIANT ? 2500 : 1000;
  
  const isUpToDate = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return myContributions.some(c => c.type === 'Sass' && c.date.startsWith(currentMonth));
  }, [myContributions]);

  const handleProcessPayment = async () => {
    if (!currentUserMember || !paymentAmount) return;
    await addContribution({
      memberId: currentUserMember.id,
      amount: Number(paymentAmount),
      type: paymentType,
      date: new Date().toISOString().split('T')[0],
      eventLabel: paymentType === 'Sass' ? `Mensualité ${new Date().toLocaleString('fr-FR', {month: 'long'})}` : 'Contribution Volontaire'
    });
    setShowPaymentModal(false);
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-500" size={40}/></div>;

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* MODALE PAIEMENT RAPIDE */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-black text-slate-900">Régulariser Cotisation</h3>
                 <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
              </div>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Type</label>
                    <select value={paymentType} onChange={e => setPaymentType(e.target.value as any)} className="w-full p-4 bg-slate-50 rounded-2xl font-bold">
                       <option value="Sass">Sass (Mensualité)</option>
                       <option value="Adiyas">Adiyas (Don)</option>
                       <option value="Diayanté">Diayanté (Social)</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Montant (F CFA)</label>
                    <input type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl text-2xl font-black" placeholder={monthlySass.toString()} />
                 </div>
                 <button onClick={handleProcessPayment} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Valider le versement</button>
              </div>
           </div>
        </div>
      )}

      {/* HEADER PERSONNEL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white font-black text-3xl shadow-xl border-4 border-white">
            {currentUserMember?.firstName[0]}{currentUserMember?.lastName[0]}
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 leading-none">{currentUserMember?.firstName} {currentUserMember?.lastName}</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">{currentUserMember?.category} • {currentUserMember?.matricule}</p>
          </div>
        </div>
        <button onClick={() => setShowPaymentModal(true)} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-3">
          <Smartphone size={18}/> Verser Cotisation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* STATS & STATUS */}
        <div className="lg:col-span-4 space-y-8">
            <div className="glass-card p-10 bg-gradient-to-br from-indigo-800 to-indigo-950 text-white relative overflow-hidden shadow-2xl">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-12 opacity-50">Cumul des Versements</h4>
                <h2 className="text-5xl font-black tracking-tighter">{totalContributed.toLocaleString()} <span className="text-xl opacity-30 font-bold ml-2">F</span></h2>
                <div className="mt-10 flex items-center gap-4 text-emerald-400">
                    <ShieldCheck size={20} />
                    <span className="text-[11px] font-black uppercase tracking-widest">Compte certifié par la Finance</span>
                </div>
                <div className="absolute -right-10 -bottom-10 opacity-5 font-arabic text-8xl">ق</div>
            </div>

            <div className="glass-card p-10 bg-white border-indigo-100">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-3">
                    <Calendar size={18} className="text-indigo-600" /> État Civil Financier
                </h4>
                <div className={`p-6 rounded-2xl border ${isUpToDate ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                    <p className="text-xs font-black uppercase">Mensualité de {new Date().toLocaleString('fr-FR', {month: 'long'})}</p>
                    <p className="text-2xl font-black mt-2">{isUpToDate ? 'À JOUR' : 'EN RETARD'}</p>
                    <p className="text-[10px] font-bold mt-1 opacity-70">Barème : {monthlySass.toLocaleString()} F / mois</p>
                </div>
            </div>
        </div>

        {/* LISTE DES TRANSACTIONS */}
        <div className="lg:col-span-8">
            <div className="glass-card overflow-hidden bg-white border-slate-100">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                    <h4 className="font-black text-slate-800 text-lg">Historique des Flux</h4>
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-400 uppercase">{myContributions.length} Entrées</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="px-8 py-5">Date</th>
                                <th className="px-8 py-5">Nature</th>
                                <th className="px-8 py-5">Montant</th>
                                <th className="px-8 py-5">ID Transaction</th>
                                <th className="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {myContributions.map((c, i) => (
                                <tr key={i} className="hover:bg-indigo-50/20 transition-all group">
                                    <td className="px-8 py-6 text-xs font-bold text-slate-500">{formatDate(c.date)}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${c.type === 'Sass' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'}`}>
                                            {c.type}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 font-black text-indigo-600 text-sm">{c.amount.toLocaleString()} F</td>
                                    <td className="px-8 py-6 font-mono text-[10px] text-slate-400">#{c.transactionId?.slice(-8) || c.id.slice(-8)}</td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 bg-white border border-slate-100 rounded-xl text-slate-300 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
                                            <Download size={16}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MemberFinancePortal;
