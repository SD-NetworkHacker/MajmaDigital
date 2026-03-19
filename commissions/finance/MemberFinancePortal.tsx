import React, { useMemo, useState, useEffect } from 'react';
import { 
  History, Download, ShieldCheck, Calendar, User, Wallet, 
  CheckCircle, Smartphone, ArrowLeft, Loader2, X, Share2, 
  Eye, Target, Tent, Bus, Sparkles, TrendingUp, Info, 
  ChevronRight, CreditCard, Clock, AlertCircle, Plus,
  HeartHandshake, BookOpen
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { MemberCategory, Contribution, AdiyaCampaign, FundraisingEvent, TransportSchedule } from '../../types';
import { formatDate } from '../../utils/date';

const MemberFinancePortal: React.FC = () => {
  const { user } = useAuth();
  const { 
    contributions = [], members = [], addContribution, isLoading, 
    adiyaCampaigns = [], fundraisingEvents = [], schedules = [], tickets = [], addTicket 
  } = useData();
  
  const [activePortalTab, setActivePortalTab] = useState<'overview' | 'campaigns' | 'events' | 'transport'>('overview');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentType, setPaymentType] = useState<'Adiyas' | 'Sass' | 'Diayanté' | 'Gott' | 'Adiya Élite' | 'Transport'>('Sass');
  const [paymentLabel, setPaymentLabel] = useState('');
  const [relatedId, setRelatedId] = useState<string | null>(null);

  const quickActions = [
    { label: 'Sass (Mensualité)', type: 'Sass', icon: Wallet, color: 'indigo', amount: monthlySass.toString() },
    { label: 'Adiya Hebdomadaire', type: 'Adiyas', icon: Sparkles, color: 'amber', amount: '' },
    { label: 'Magal Touba (Diayanté)', type: 'Diayanté', icon: Tent, color: 'emerald', amount: '' },
    { label: 'Berndé Gott', type: 'Diayanté', icon: HeartHandshake, color: 'rose', amount: '' },
    { label: 'Thiant Annuel', type: 'Diayanté', icon: BookOpen, color: 'blue', amount: '' },
    { label: 'Transport Magal', type: 'Transport', icon: Bus, color: 'indigo', amount: '7500' },
  ];

  const currentUserMember = useMemo(() => {
     return members.find(m => m.id === user?.id || m.email === user?.email);
  }, [members, user]);

  const myContributions = useMemo(() => {
    if (!currentUserMember) return [];
    return contributions.filter(c => c.memberId === currentUserMember.id);
  }, [contributions, currentUserMember]);

  const myTickets = useMemo(() => {
    if (!currentUserMember) return [];
    return tickets.filter(t => t.memberId === currentUserMember.id || t.phone === currentUserMember.phone);
  }, [tickets, currentUserMember]);

  const totalContributed = useMemo(() => myContributions.reduce((acc, c) => acc + c.amount, 0), [myContributions]);
  const monthlySass = currentUserMember?.category === MemberCategory.TRAVAILLEUR ? 5000 : currentUserMember?.category === MemberCategory.ETUDIANT ? 2500 : 1000;
  
  const isUpToDate = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    return myContributions.some(c => c.type === 'Sass' && (c.date || '').startsWith(currentMonth));
  }, [myContributions]);

  const openPaymentModal = (type: any, label: string, amount: string = '', id: string | null = null) => {
    setPaymentType(type);
    setPaymentLabel(label);
    setPaymentAmount(amount);
    setRelatedId(id);
    setShowPaymentModal(true);
  };

  const handleProcessPayment = async () => {
    if (!currentUserMember || !paymentAmount) return;
    
    if (activePortalTab === 'transport' && relatedId) {
      // Logic for transport ticket
      const schedule = schedules.find(s => s.id === relatedId);
      if (addTicket) {
        await addTicket({
          memberId: currentUserMember.id,
          passenger: `${currentUserMember.firstName} ${currentUserMember.lastName}`,
          phone: currentUserMember.phone,
          trip: schedule?.eventTitle || 'Transport Magal',
          tripId: relatedId,
          amount: Number(paymentAmount),
          date: new Date().toISOString(),
          status: 'payé',
          type: 'Aller-Retour'
        });
      }
    } else {
      if (addContribution) {
          await addContribution({
            memberId: currentUserMember.id,
            amount: Number(paymentAmount),
            type: paymentType,
            date: new Date().toISOString().split('T')[0],
            eventLabel: paymentLabel || (paymentType === 'Sass' ? `Mensualité ${new Date().toLocaleString('fr-FR', {month: 'long'})}` : 'Contribution'),
            status: 'paid'
          });
      }
    }
    setShowPaymentModal(false);
    setPaymentAmount('');
    setPaymentLabel('');
    setRelatedId(null);
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-500" size={40}/></div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* MODALE PAIEMENT RAPIDE */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-8">
                 <div>
                    <h3 className="text-xl font-black text-slate-900">Finaliser le Paiement</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{paymentLabel || paymentType}</p>
                 </div>
                 <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
              </div>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Montant (F CFA)</label>
                    <div className="relative">
                       <input 
                        type="number" 
                        value={paymentAmount} 
                        onChange={e => setPaymentAmount(e.target.value)} 
                        className="w-full p-6 bg-slate-50 rounded-2xl text-3xl font-black outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                        placeholder="0" 
                       />
                       <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">F</div>
                    </div>
                 </div>
                 
                 <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-3">
                    <Info size={16} className="text-indigo-600 mt-0.5" />
                    <p className="text-[10px] font-medium text-indigo-800 leading-relaxed">
                       En validant, votre contribution sera enregistrée et certifiée par la commission finance. Vous pourrez télécharger votre reçu immédiatement.
                    </p>
                 </div>

                 <button onClick={handleProcessPayment} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3">
                    <CreditCard size={18}/> Confirmer le versement
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* HEADER PERSONNEL */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white font-black text-3xl shadow-xl border-4 border-white">
            {currentUserMember?.firstName ? currentUserMember.firstName[0] : ''}{currentUserMember?.lastName ? currentUserMember.lastName[0] : ''}
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 leading-none">{currentUserMember?.firstName} {currentUserMember?.lastName}</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">{currentUserMember?.category} • {currentUserMember?.matricule}</p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4">
          <button 
            onClick={() => openPaymentModal('Sass', 'Contribution Libre')}
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-900/20 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <Plus size={16} /> Nouveau Versement
          </button>
          
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
             {(['overview', 'campaigns', 'events', 'transport'] as const).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActivePortalTab(tab)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePortalTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                   {tab === 'overview' ? 'Général' : tab === 'campaigns' ? 'Adiyas' : tab === 'events' ? 'Collectes' : 'Transport'}
                </button>
             ))}
          </div>
        </div>
      </div>

      {/* --- VUE GÉNÉRALE --- */}
      {activePortalTab === 'overview' && (
        <div className="space-y-10 animate-in fade-in duration-500">
          {/* ACTIONS RAPIDES DEMANDÉES */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, idx) => (
              <button 
                key={idx}
                onClick={() => {
                  if (action.type === 'Transport') {
                    setActivePortalTab('transport');
                  } else {
                    openPaymentModal(action.type as any, action.label, action.amount);
                  }
                }}
                className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                <div className={`p-4 rounded-2xl mb-4 bg-${action.color}-50 text-${action.color}-600 group-hover:scale-110 transition-transform`}>
                  <action.icon size={24} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 text-center leading-tight">{action.label}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-8">
              <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-800 to-indigo-950 text-white relative overflow-hidden shadow-2xl">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-12 opacity-50">Cumul des Versements</h4>
                  <h2 className="text-5xl font-black tracking-tighter">{totalContributed.toLocaleString()} <span className="text-xl opacity-30 font-bold ml-2">F</span></h2>
                  <div className="mt-10 flex items-center gap-4 text-emerald-400">
                      <ShieldCheck size={20} />
                      <span className="text-[11px] font-black uppercase tracking-widest">Compte certifié par la Finance</span>
                  </div>
                  <div className="absolute -right-10 -bottom-10 opacity-5 font-arabic text-8xl">ق</div>
              </div>

              <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-3">
                      <Calendar size={18} className="text-indigo-600" /> État Civil Financier
                  </h4>
                  <div className={`p-6 rounded-2xl border ${isUpToDate ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                      <p className="text-xs font-black uppercase">Mensualité de {new Date().toLocaleString('fr-FR', {month: 'long'})}</p>
                      <p className="text-2xl font-black mt-2">{isUpToDate ? 'À JOUR' : 'EN RETARD'}</p>
                      <p className="text-[10px] font-bold mt-1 opacity-70">Barème : {monthlySass.toLocaleString()} F / mois</p>
                  </div>
                  {!isUpToDate && (
                    <button 
                      onClick={() => openPaymentModal('Sass', `Mensualité ${new Date().toLocaleString('fr-FR', {month: 'long'})}`, monthlySass.toString())}
                      className="w-full mt-6 py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-black transition-all"
                    >
                      Régulariser maintenant
                    </button>
                  )}
              </div>
          </div>

          <div className="lg:col-span-8">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
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
                                  <th className="px-8 py-5 text-right">Action</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                              {myContributions.map((c, i) => (
                                  <tr key={i} className="hover:bg-indigo-50/20 transition-all group">
                                      <td className="px-8 py-6 text-xs font-bold text-slate-500">{formatDate(c.date)}</td>
                                      <td className="px-8 py-6">
                                          <div className="flex flex-col">
                                             <span className={`w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase ${c.type === 'Sass' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'}`}>
                                                {c.type}
                                             </span>
                                             <span className="text-[9px] text-slate-400 font-medium mt-1">{c.eventLabel}</span>
                                          </div>
                                      </td>
                                      <td className="px-8 py-6 font-black text-indigo-600 text-sm">{c.amount.toLocaleString()} F</td>
                                      <td className="px-8 py-6 text-right">
                                          <button className="p-2 bg-white border border-slate-100 rounded-xl text-slate-300 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
                                              <Download size={16}/>
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                              {myContributions.length === 0 && (
                                <tr>
                                  <td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic text-xs">Aucun versement enregistré</td>
                                </tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
        </div>
      </div>
      )}

      {/* --- VUE CAMPAGNES (ADIYAS) --- */}
      {activePortalTab === 'campaigns' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* ADIYA HEBDOMADAIRE - CARTE SPÉCIALE */}
              <div className="p-8 rounded-[2.5rem] bg-amber-50 border-2 border-amber-100 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                    <Sparkles size={60} className="text-amber-600" />
                 </div>
                 <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-4">Engagement Permanent</h4>
                 <h3 className="text-2xl font-black text-slate-900 mb-2">Adiya Hebdomadaire</h3>
                 <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8">
                    Soutenez les activités courantes du Dahira par votre don hebdomadaire défini par la commission finance.
                 </p>
                 <div className="flex items-center justify-between mb-8">
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase">Dernier versement</p>
                       <p className="text-sm font-bold text-slate-700">
                          {myContributions.find(c => c.eventLabel?.includes('Hebdo')) ? formatDate(myContributions.find(c => c.eventLabel?.includes('Hebdo'))!.date) : 'Aucun'}
                       </p>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-black text-slate-400 uppercase">Suggéré</p>
                       <p className="text-sm font-black text-amber-600">Libre</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => openPaymentModal('Adiyas', 'Adiya Hebdomadaire')}
                  className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all"
                 >
                    Verser mon Adiya
                 </button>
              </div>

              {/* AUTRES CAMPAGNES (ADIYA ÉLITE, ETC) */}
              {adiyaCampaigns.filter(c => c.status === 'open').map(campaign => (
                 <div key={campaign.id} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:border-indigo-200 transition-all">
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                          <Target size={24} />
                       </div>
                       <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase">Ouvert</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">{campaign.title}</h3>
                    <p className="text-xs text-slate-400 font-medium mb-8 line-clamp-2">{campaign.description || 'Campagne de mobilisation exceptionnelle.'}</p>
                    
                    <div className="space-y-4 mb-8">
                       <div className="flex justify-between text-[10px] font-black uppercase">
                          <span className="text-slate-400">Objectif Unitaire</span>
                          <span className="text-indigo-600">{campaign.unitAmount.toLocaleString()} F</span>
                       </div>
                       <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: '45%' }}></div>
                       </div>
                    </div>

                    <button 
                      onClick={() => openPaymentModal('Adiya Élite', campaign.title, campaign.unitAmount.toString(), campaign.id)}
                      className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                    >
                       Participer
                    </button>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* --- VUE COLLECTES (ÉVÉNEMENTS) --- */}
      {activePortalTab === 'events' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {fundraisingEvents.filter(e => e.status === 'active').map(event => (
                 <div key={event.id} className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 shrink-0">
                       <Tent size={40} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                       <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[9px] font-black uppercase tracking-widest">{event.type}</span>
                          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Deadline: {formatDate(event.deadline)}</span>
                       </div>
                       <h3 className="text-2xl font-black text-slate-900 mb-4">{event.name}</h3>
                       
                       <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
                          {event.groups?.map(g => (
                             <button 
                              key={g.id}
                              onClick={() => openPaymentModal('Diayanté', `${event.name} - ${g.name}`, g.amount.toString(), event.id)}
                              className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all"
                             >
                                <p className="text-[8px] font-black text-slate-400 uppercase">{g.name}</p>
                                <p className="text-xs font-black text-slate-700">{g.amount.toLocaleString()} F</p>
                             </button>
                          ))}
                       </div>

                       <button 
                        onClick={() => openPaymentModal('Diayanté', event.name, '', event.id)}
                        className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:gap-3 transition-all"
                       >
                          Contribution libre <ChevronRight size={14}/>
                       </button>
                    </div>
                 </div>
              ))}
              {fundraisingEvents.length === 0 && (
                <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                   <p className="text-slate-400 font-bold uppercase text-xs">Aucune collecte active pour le moment</p>
                </div>
              )}
           </div>
        </div>
      )}

      {/* --- VUE TRANSPORT --- */}
      {activePortalTab === 'transport' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="bg-indigo-900 p-10 rounded-[3rem] text-white relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-indigo-300">Commission Transport</h4>
                 <h2 className="text-4xl font-black tracking-tighter mb-6">Transport Magal Touba 2024</h2>
                 <p className="text-sm text-indigo-100 font-medium leading-relaxed mb-8">
                    Réservez votre place pour le convoi officiel du Dahira. Places limitées. Le paiement valide votre réservation définitive.
                 </p>
                 <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Clock size={20}/></div>
                       <div>
                          <p className="text-[8px] font-bold text-indigo-300 uppercase">Départ</p>
                          <p className="text-xs font-black">15 Sept. - 22h00</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Bus size={20}/></div>
                       <div>
                          <p className="text-[8px] font-bold text-indigo-300 uppercase">Type</p>
                          <p className="text-xs font-black">Bus Grand Confort</p>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="absolute -right-20 -bottom-20 opacity-10 font-arabic text-[20rem] pointer-events-none">ح</div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {schedules.filter(s => s.eventTitle.includes('Magal')).map(schedule => (
                 <div key={schedule.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                    <div className="flex justify-between items-center mb-6">
                       <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase">Disponible</span>
                       <p className="text-xl font-black text-indigo-600">7 500 F</p>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-1">{schedule.origin} → {schedule.destination}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{schedule.eventTitle}</p>
                    
                    <div className="space-y-3 mb-8">
                       <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                          <Calendar size={14} className="text-slate-400" /> {formatDate(schedule.departureDate)}
                       </div>
                       <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                          <TrendingUp size={14} className="text-slate-400" /> {schedule.seatsFilled} / {schedule.totalCapacity} places occupées
                       </div>
                    </div>

                    {myTickets.some(t => t.tripId === schedule.id) ? (
                       <div className="w-full py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                          <CheckCircle size={14}/> Ticket Réservé
                       </div>
                    ) : (
                       <button 
                        onClick={() => openPaymentModal('Transport', `Ticket ${schedule.origin}-${schedule.destination}`, '7500', schedule.id)}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                       >
                          Réserver ma place
                       </button>
                    )}
                 </div>
              ))}
              {schedules.filter(s => s.eventTitle.includes('Magal')).length === 0 && (
                <div className="col-span-full py-12 text-center bg-slate-50 rounded-[2.5rem] border border-slate-100">
                   <AlertCircle size={24} className="mx-auto text-slate-300 mb-2"/>
                   <p className="text-slate-400 font-bold uppercase text-[10px]">Les plannings de transport seront bientôt définis</p>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default MemberFinancePortal;
