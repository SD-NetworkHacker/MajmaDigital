import React, { useMemo, useState } from 'react';
import { 
  Calendar, ArrowRight, MapPin, Sparkles, BookOpen, Wallet, Zap,
  Activity, FileQuestion, Send, X, UserPlus, Fingerprint, Award, 
  Smartphone, ChevronRight, CheckCircle, FileText, HeartHandshake,
  ShieldCheck, Loader2, Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../contexts/DataContext';
import { MemberCategory, CommissionType } from '../../types';
import { INITIAL_COMMISSIONS } from '../../constants';

interface MemberDashboardProps {
  setActiveTab: (tab: string) => void;
}

const MemberDashboard: React.FC<MemberDashboardProps> = ({ setActiveTab }) => {
  const { user } = useAuth();
  const { members, events, contributions } = useData();
  
  // --- STATES MODALES ---
  const [activeModal, setActiveModal] = useState<'none' | 'pay' | 'request' | 'join'>('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  
  // Form States
  const [requestType, setRequestType] = useState('Attestation de Membre');
  const [targetCommission, setTargetCommission] = useState(CommissionType.ORGANISATION);

  // --- LOGIQUE DE DONNÉES ---
  const currentMember = useMemo(() => {
    return members.find(m => m.id === user?.id || m.email === user?.email) || null;
  }, [members, user]);

  const primaryCommission = useMemo(() => currentMember?.commissions[0] || null, [currentMember]);
  
  const quickActions = useMemo(() => [
      { id: 'pay', label: 'Cotiser', icon: Wallet, color: 'emerald', action: () => { setStep(1); setActiveModal('pay'); } },
      { id: 'pedagogy', label: 'Études', icon: BookOpen, action: () => setActiveTab('pedagogy'), color: 'cyan' },
      { id: 'events', label: 'Agenda', icon: Calendar, action: () => setActiveTab('events'), color: 'indigo' },
      { 
        id: 'action', 
        label: primaryCommission ? 'Requête' : "S'engager", 
        icon: primaryCommission ? FileQuestion : UserPlus, 
        action: () => { setStep(1); setActiveModal(primaryCommission ? 'request' : 'join'); }, 
        color: primaryCommission ? 'blue' : 'amber' 
      },
  ], [primaryCommission, setActiveTab]);

  const nextEvent = useMemo(() => {
    return events
      .filter(e => new Date(e.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(a.date).getTime())[0];
  }, [events]);

  // --- HANDLERS ---
  const handleFinalizeAction = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3); // Écran de succès
      setTimeout(() => setActiveModal('none'), 2000);
    }, 1500);
  };

  if (!currentMember) return <div className="p-20 text-center animate-pulse text-slate-400 font-black uppercase tracking-widest">Chargement du cockpit...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* 1. SECTION HERO - PLATINUM DESIGN */}
      <div className="relative overflow-hidden rounded-[3.5rem] bg-[#030712] p-12 shadow-2xl border border-white/5 group">
         <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-1000"></div>
         <div className="absolute top-0 right-0 p-12 opacity-5 font-arabic text-[18rem] pointer-events-none rotate-12 select-none transition-transform group-hover:scale-110 duration-1000">م</div>
         
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-end gap-10">
            <div className="text-center md:text-left space-y-6">
               <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                  <span className="px-5 py-2 bg-white/5 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 text-emerald-400 flex items-center gap-2">
                     <Sparkles size={12} className="animate-pulse" /> {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </span>
                  <span className="px-5 py-2 bg-white/5 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 text-amber-400">
                     {primaryCommission ? primaryCommission.role_commission : 'Membre Sympathisant'}
                  </span>
               </div>
               
               <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                  Salam, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-100 to-white">{currentMember.firstName}</span>
               </h1>
               
               <p className="text-slate-400 font-medium max-w-xl leading-relaxed italic text-sm md:text-lg opacity-80">
                  "L'engagement au service de la communauté est une source intarissable de baraka. Votre présence fortifie notre noble marche."
               </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-6 shrink-0">
               <div className="flex items-center gap-5 p-5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl ring-1 ring-white/5">
                  <div className="text-right">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5 opacity-60">Matricule</p>
                     <p className="text-sm font-mono font-bold text-white tracking-tighter bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{currentMember.matricule}</p>
                  </div>
                  <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-900/40 transform group-hover:rotate-3 transition-transform">
                     {currentMember.firstName[0]}
                  </div>
               </div>
               <button onClick={() => setActiveTab('profile')} className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 hover:text-white transition-all flex items-center gap-3 group/link">
                  Espace Personnel <ChevronRight size={14} className="group-hover/link:translate-x-2 transition-transform" />
               </button>
            </div>
         </div>
      </div>

      {/* 2. BENTO GRID - ACTIONS & KPI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Colonne Actions (Style Sidebar Platinum) */}
        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-6">
           {quickActions.map(action => (
             <button 
                key={action.id}
                onClick={action.action}
                className="group relative flex flex-col items-center justify-center p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:bg-[#030712] hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.25)] transition-all duration-500 hover:-translate-y-3 overflow-hidden"
             >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className={`p-5 rounded-2xl mb-5 transition-all duration-700 bg-${action.color}-50 text-${action.color}-600 group-hover:bg-white/10 group-hover:text-emerald-400 group-hover:scale-125 group-hover:rotate-6 shadow-sm`}>
                   <action.icon size={32} strokeWidth={2} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-white transition-colors">
                   {action.label}
                </span>
             </button>
           ))}

           {/* WIDGET EVENT - PANORAMIQUE */}
           <div 
             onClick={() => setActiveTab('events')}
             className="col-span-2 md:col-span-4 bg-white rounded-[3.5rem] p-10 border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-10 group cursor-pointer hover:shadow-2xl hover:border-emerald-200 transition-all duration-700"
           >
              <div className="flex items-center gap-8">
                 <div className="w-24 h-24 bg-slate-900 rounded-[2.2rem] flex flex-col items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-700 shadow-xl border border-white/10 scale-110">
                    <span className="text-4xl font-black">{nextEvent ? new Date(nextEvent.date).getDate() : '--'}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest mt-1">
                       {nextEvent ? new Date(nextEvent.date).toLocaleString('fr-FR', {month: 'short'}) : 'Mois'}
                    </span>
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center gap-3">
                       <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[8px] font-black uppercase tracking-widest">Rendez-vous</span>
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                          <Clock size={10}/> {nextEvent ? 'Prochainement' : 'Aucun agenda'}
                       </p>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight">
                       {nextEvent ? nextEvent.title : "Calme Spirituel"}
                    </h3>
                    <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
                       <MapPin size={16} className="text-emerald-500"/> {nextEvent ? nextEvent.location : "Lieu à confirmer"}
                    </p>
                 </div>
              </div>
              <div className="flex items-center gap-4 bg-slate-50 group-hover:bg-emerald-600 px-8 py-4 rounded-[1.5rem] transition-all duration-500 shadow-sm group-hover:shadow-lg">
                 <span className="text-xs font-black text-slate-500 group-hover:text-white uppercase tracking-widest">S'inscrire</span>
                 <ArrowRight size={20} className="text-slate-300 group-hover:text-white group-hover:translate-x-2 transition-all" />
              </div>
           </div>
        </div>

        {/* Colonne Latérale - Khidma Progress */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-[#030712] rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-white/10 group/khidma">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50"></div>
              
              <div className="relative z-10 flex flex-col h-full items-center text-center">
                 <div className="flex justify-between items-start w-full mb-12">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-400 opacity-80">Indice de Khidma</h4>
                    <div className="p-2 bg-emerald-500/10 rounded-lg"><Award size={20} className="text-amber-500 animate-pulse" /></div>
                 </div>
                 
                 <div className="relative w-48 h-48 flex items-center justify-center mb-12 transform group-hover/khidma:scale-105 transition-transform duration-700">
                    <div className="absolute inset-0 rounded-full border-[12px] border-white/5 shadow-inner"></div>
                    <svg className="absolute w-48 h-48 -rotate-90 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                       <circle cx="96" cy="96" r="82" fill="none" stroke="currentColor" strokeWidth="12" strokeDasharray="515" strokeDashoffset="120" className="text-emerald-500 transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="flex flex-col items-center">
                       <span className="text-6xl font-black">74<span className="text-2xl opacity-40 ml-1">%</span></span>
                       <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-2">Niveau Actif</span>
                    </div>
                 </div>

                 <div className="w-full grid grid-cols-2 gap-4 pt-8 border-t border-white/10">
                    <div className="text-left space-y-1">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Présence</p>
                       <p className="text-lg font-black text-white">08/10</p>
                    </div>
                    <div className="text-right space-y-1">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Finance</p>
                       <p className="text-lg font-black text-emerald-400 flex items-center justify-end gap-2">
                          <CheckCircle size={14}/> À jour
                       </p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl flex flex-col justify-center items-center text-center group hover:border-blue-200 transition-all">
              <div className="p-5 bg-blue-50 text-blue-600 rounded-[2rem] mb-6 group-hover:scale-110 transition-transform shadow-inner"><Fingerprint size={40}/></div>
              <h4 className="text-lg font-black text-slate-900 leading-tight">Accès Sécurisé Atlas</h4>
              <p className="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-widest opacity-60">Validation Chiffrée v3.1</p>
              <button className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95">Voir Journal Accès</button>
           </div>
        </div>
      </div>

      {/* --- SECTION DES MODALES RÉACTIVES --- */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#030712]/90 backdrop-blur-2xl animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] animate-in zoom-in duration-300 relative border border-slate-100 overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] font-arabic text-[12rem] pointer-events-none rotate-12">م</div>
              
              <div className="flex justify-between items-center mb-10 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 text-emerald-400 rounded-2xl shadow-xl">
                       {activeModal === 'pay' && <Wallet size={24}/>}
                       {activeModal === 'request' && <FileQuestion size={24}/>}
                       {activeModal === 'join' && <UserPlus size={24}/>}
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900">
                          {activeModal === 'pay' && 'Règlement Rapide'}
                          {activeModal === 'request' && 'Nouveau Dossier'}
                          {activeModal === 'join' && "Candidature Pôle"}
                       </h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Action Immédiate</p>
                    </div>
                 </div>
                 <button onClick={() => setActiveModal('none')} className="p-3 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-rose-500"><X size={24}/></button>
              </div>

              <div className="relative z-10 space-y-8">
                 {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4">
                       {activeModal === 'pay' && (
                          <>
                             <div className="grid grid-cols-2 gap-4">
                                <button className="p-8 bg-slate-900 border-2 border-emerald-500 text-white rounded-[2rem] flex flex-col items-center gap-4 shadow-2xl">
                                   <Smartphone size={32} className="text-emerald-400"/>
                                   <span className="text-[11px] font-black uppercase">Wave</span>
                                </button>
                                <button className="p-8 bg-slate-50 border-2 border-transparent text-slate-400 rounded-[2rem] flex flex-col items-center gap-4">
                                   <Smartphone size={32}/>
                                   <span className="text-[11px] font-black uppercase">Orange Money</span>
                                </button>
                             </div>
                             <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Montant à verser (FCFA)</label>
                                <input type="number" className="w-full p-6 bg-slate-50 border-none rounded-3xl text-3xl font-black text-slate-900 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none" placeholder="5000" autoFocus />
                             </div>
                          </>
                       )}

                       {activeModal === 'request' && (
                          <div className="space-y-4">
                             <p className="text-sm font-medium text-slate-500 italic">"Générez ou sollicitez des documents administratifs officiels."</p>
                             <div className="grid grid-cols-1 gap-3">
                                {['Attestation de Membre', 'Carte de Membre Digitale', 'Aide Sociale d\'Urgence', 'Demande de Prêt Matériel'].map(r => (
                                   <button 
                                      key={r}
                                      onClick={() => setRequestType(r)}
                                      className={`p-5 text-left rounded-2xl border-2 transition-all font-bold text-sm ${requestType === r ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'}`}
                                   >
                                      {r}
                                   </button>
                                ))}
                             </div>
                          </div>
                       )}

                       {activeModal === 'join' && (
                          <div className="space-y-6">
                             <p className="text-sm font-medium text-slate-500 italic">"Choisissez un pôle pour mettre vos talents au service du Dahira."</p>
                             <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Commission Cible</label>
                                <select 
                                   value={targetCommission}
                                   onChange={(e) => setTargetCommission(e.target.value as CommissionType)}
                                   className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none"
                                >
                                   {INITIAL_COMMISSIONS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                </select>
                             </div>
                             <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Motivation (Courte)</label>
                                <textarea className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-medium h-32 resize-none outline-none" placeholder="Décrivez votre expérience ou envie d'aider..." />
                             </div>
                          </div>
                       )}

                       <button 
                          onClick={handleFinalizeAction}
                          disabled={isProcessing}
                          className="w-full py-6 bg-[#030712] text-white rounded-[1.8rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
                       >
                          {isProcessing ? <Loader2 size={24} className="animate-spin"/> : <><Send size={20}/> Confirmer l'Action</>}
                       </button>
                    </div>
                 )}

                 {step === 3 && (
                    <div className="text-center py-12 space-y-10 animate-in zoom-in duration-500">
                       <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/40 border-4 border-white rotate-12">
                          <CheckCircle size={48} />
                       </div>
                       <div className="space-y-4">
                          <h4 className="text-3xl font-black text-slate-900 tracking-tight">C'est validé !</h4>
                          <p className="text-sm text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                             Votre demande a été transmise avec succès au Bureau Exécutif. Vous recevrez une notification d'ici peu.
                          </p>
                       </div>
                       <button onClick={() => setActiveModal('none')} className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">Fermer</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default MemberDashboard;