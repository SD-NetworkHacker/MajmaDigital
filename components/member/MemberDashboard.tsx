
import React, { useMemo, useState } from 'react';
import { 
  Calendar, CreditCard, Users, MessageSquare, ArrowRight, 
  CheckCircle, Clock, TrendingUp, AlertCircle, Plus, 
  ChevronRight, MapPin, Sparkles, BookOpen, Wallet, Zap,
  Heart, ShieldCheck, Download, Bell, Activity, FileQuestion, Send, X,
  Briefcase, GraduationCap, ListTodo, Star, Gavel, Bus, Stethoscope, 
  Landmark, LayoutDashboard, Ticket, Package, ClipboardCheck, Siren, Coffee,
  FileText, HeartHandshake, Target, UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../contexts/DataContext';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MemberCategory, CommissionType } from '../../types';
import { INITIAL_COMMISSIONS } from '../../constants';

interface MemberDashboardProps {
  setActiveTab: (tab: string) => void;
}

const MemberDashboard: React.FC<MemberDashboardProps> = ({ setActiveTab }) => {
  const { user } = useAuth();
  const { members, events, contributions, tasks, budgetRequests, reports } = useData();
  
  // States Modales
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showJoinCommissionModal, setShowJoinCommissionModal] = useState(false);
  
  // Form States
  const [requestType, setRequestType] = useState('Attestation');
  const [requestNote, setRequestNote] = useState('');
  
  const [joinTargetCommission, setJoinTargetCommission] = useState('');
  const [joinMotivation, setJoinMotivation] = useState('');

  // 1. Récupération du profil membre complet
  const currentMember = useMemo(() => {
    if (user?.id) return members.find(m => m.id === user.id) || null;
    return members.find(m => m.email === user?.email) || null;
  }, [members, user]);

  // 2. Analyse du Rôle et de la Commission Principale
  const primaryCommission = useMemo(() => currentMember?.commissions[0] || null, [currentMember]);
  
  const roleContext = useMemo(() => {
     if (!primaryCommission) return { isLeader: false, type: null, label: 'Membre Simple', theme: 'slate' };
     
     const roleName = primaryCommission.role_commission;
     const isLeader = ['Dieuwrine', 'Adjoint', 'Secrétaire', 'Trésorier', 'Responsable'].some(r => roleName.includes(r));
     
     // Définition des thèmes par commission
     let theme = 'slate';
     switch(primaryCommission.type) {
         case CommissionType.FINANCE: theme = 'indigo'; break;
         case CommissionType.TRANSPORT: theme = 'orange'; break;
         case CommissionType.SOCIAL: theme = 'rose'; break;
         case CommissionType.SANTE: theme = 'teal'; break;
         case CommissionType.PEDAGOGIQUE: theme = 'cyan'; break;
         case CommissionType.ORGANISATION: theme = 'purple'; break;
         case CommissionType.RELATIONS_EXT: theme = 'blue'; break;
         default: theme = 'slate';
     }
     
     return { isLeader, type: primaryCommission.type, label: roleName, theme };
  }, [primaryCommission]);

  // 3. Tâches assignées
  const myTasks = useMemo(() => {
     if (!currentMember) return [];
     return tasks.filter(t => t.assignedTo === currentMember.id && t.status !== 'done');
  }, [tasks, currentMember]);

  // 4. Calculs Financiers Personnels (Pour la vue par défaut ou secondaire)
  const myFinance = useMemo(() => {
    if (!currentMember) return { total: 0, pending: 0, history: [] };
    const myContribs = contributions.filter(c => c.memberId === currentMember.id);
    const total = myContribs.reduce((acc, c) => acc + c.amount, 0);
    
    const monthlyDue = currentMember.category === MemberCategory.TRAVAILLEUR ? 5000 : currentMember.category === MemberCategory.ETUDIANT ? 2500 : 1000;
    const currentMonth = new Date().toISOString().slice(0,7);
    const paidThisMonth = myContribs.some(c => c.type === 'Sass' && c.date.startsWith(currentMonth));
    const pending = paidThisMonth ? 0 : monthlyDue; 
    
    const chartData = myContribs.slice(0, 6).map((c, i) => ({
      name: new Date(c.date).toLocaleDateString('fr-FR', { month: 'short' }),
      amount: c.amount
    })).reverse();

    if (chartData.length === 0) {
       chartData.push({ name: 'Début', amount: 0 }, { name: 'Auj.', amount: 0 });
    }

    return { total, pending, history: chartData };
  }, [contributions, currentMember]);

  // 5. CONFIGURATION DASHBOARD MÉTIER (KPI & ACTIONS)
  const dashboardConfig = useMemo(() => {
      // DEFAULT (SIMPLE MEMBER - HUB D'ENGAGEMENT)
      if (!roleContext.type) {
          return {
              kpi: { label: 'Opportunités', value: '10 Pôles', icon: HeartHandshake, sub: 'Recrutement ouvert', theme: 'emerald' },
              actions: [
                  { label: 'Cotiser', icon: Plus, action: () => setActiveTab('finance'), color: 'emerald' },
                  { label: 'Mes Cours', icon: BookOpen, action: () => setActiveTab('pedagogy'), color: 'cyan' },
                  { label: 'Événements', icon: Ticket, action: () => setActiveTab('events'), color: 'indigo' },
                  { label: 'S\'engager', icon: UserPlus, action: () => setShowJoinCommissionModal(true), color: 'amber' }
              ]
          };
      }

      // FINANCE
      if (roleContext.type === CommissionType.FINANCE) {
          const pendingBudgets = budgetRequests.filter(r => r.status.includes('soumis')).length;
          return {
              kpi: { label: 'Demandes Budget', value: pendingBudgets, icon: Wallet, sub: 'En attente validation', alert: pendingBudgets > 0 },
              actions: [
                  { label: 'Validations', icon: CheckCircle, action: () => setActiveTab('finance'), color: 'indigo' },
                  { label: 'Journal Caisse', icon: FileText, action: () => setActiveTab('finance'), color: 'blue' },
                  { label: 'Bilan', icon: TrendingUp, action: () => setActiveTab('finance'), color: 'emerald' },
                  { label: 'Paramètres', icon: Zap, action: () => setActiveTab('settings'), color: 'slate' }
              ]
          };
      }

      // TRANSPORT
      if (roleContext.type === CommissionType.TRANSPORT) {
          return {
              kpi: { label: 'Prochain Convoi', value: 'J-12', icon: Bus, sub: 'Magal Touba • 85% Rempli' },
              actions: [
                  { label: 'Planning', icon: Calendar, action: () => setActiveTab('planning'), color: 'orange' },
                  { label: 'Flotte', icon: Bus, action: () => setActiveTab('fleet'), color: 'amber' },
                  { label: 'Billetterie', icon: Ticket, action: () => setActiveTab('reservation'), color: 'emerald' },
                  { label: 'Chauffeurs', icon: Users, action: () => setActiveTab('drivers'), color: 'blue' }
              ]
          };
      }

      // ORGANISATION
      if (roleContext.type === CommissionType.ORGANISATION) {
          return {
              kpi: { label: 'Logistique', value: '4 Tâches', icon: Package, sub: 'Urgentes pour samedi', alert: true },
              actions: [
                  { label: 'Inventaire', icon: ClipboardCheck, action: () => setActiveTab('inventory'), color: 'purple' },
                  { label: 'Équipes Gott', icon: Users, action: () => setActiveTab('resources'), color: 'blue' },
                  { label: 'Cuisine', icon: Coffee, action: () => setActiveTab('kitchen'), color: 'rose' },
                  { label: 'Hygiène', icon: Sparkles, action: () => setActiveTab('hygiene'), color: 'cyan' }
              ]
          };
      }

      // SOCIAL
      if (roleContext.type === CommissionType.SOCIAL) {
          return {
              kpi: { label: 'Cas Sociaux', value: '3 Actifs', icon: Heart, sub: 'Dossiers confidentiels', alert: true },
              actions: [
                  { label: 'Assistance', icon: Heart, action: () => setActiveTab('wellbeing'), color: 'rose' },
                  { label: 'Visites', icon: MapPin, action: () => setActiveTab('calendar'), color: 'emerald' },
                  { label: 'Parrainage', icon: Users, action: () => setActiveTab('builder'), color: 'blue' },
                  { label: 'Caisse Solidaire', icon: Wallet, action: () => setActiveTab('finance'), color: 'amber' }
              ]
          };
      }

      // SANTE
      if (roleContext.type === CommissionType.SANTE) {
          return {
              kpi: { label: 'Astreinte', value: 'Active', icon: Stethoscope, sub: 'Dr. Diop de garde' },
              actions: [
                  { label: 'Consultation', icon: Activity, action: () => setActiveTab('support'), color: 'teal' },
                  { label: 'Pharmacie', icon: Plus, action: () => setActiveTab('inventory'), color: 'emerald' },
                  { label: 'Urgence', icon: Siren, action: () => setActiveTab('emergency'), color: 'rose' },
                  { label: 'Planning', icon: Calendar, action: () => setActiveTab('planning'), color: 'blue' }
              ]
          };
      }

      // DEFAULT FALLBACK FOR OTHER COMMISSIONS
      const pendingTasks = tasks.filter(t => t.commission === roleContext.type && t.status !== 'done').length;
      return {
          kpi: { label: 'Mes Tâches', value: pendingTasks, icon: ListTodo, sub: 'À traiter', alert: pendingTasks > 3 },
          actions: [
              { label: 'Mes Tâches', icon: CheckCircle, action: () => setActiveTab('tasks'), color: 'emerald' },
              { label: 'Réunions', icon: Calendar, action: () => setActiveTab('meetings'), color: 'blue' },
              { label: 'Documents', icon: FileText, action: () => setActiveTab('documents'), color: 'amber' },
              { label: 'Membres', icon: Users, action: () => setActiveTab('members'), color: 'purple' }
          ]
      };

  }, [roleContext, budgetRequests, tasks, myFinance]);

  // 6. Prochain Événement Global
  const nextEvent = useMemo(() => {
    return events
      .filter(e => new Date(e.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [events]);

  const daysToNextEvent = useMemo(() => {
    if (!nextEvent) return null;
    const diff = new Date(nextEvent.date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }, [nextEvent]);

  // Helpers
  const handleSubmitRequest = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Votre demande de ${requestType} a été transmise.`);
      setShowRequestModal(false);
      setRequestNote('');
  };

  const handleJoinCommission = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Votre candidature pour la commission ${joinTargetCommission} a été envoyée au Secrétariat Général pour validation.`);
      setShowJoinCommissionModal(false);
      setJoinMotivation('');
      setJoinTargetCommission('');
  };

  const today = new Date();
  const gregorianDate = today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  // Icone personnalisée pour le bouton "S'engager"
  const UserPlusIcon = (props: any) => <Users {...props} />;

  if (!currentMember) return (
     <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400">
        <Users size={48} className="mb-4 opacity-20 animate-pulse"/>
        <p>Chargement du profil membre...</p>
     </div>
  );

  // --- RENDU ---

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 relative">
      
      {/* REQUEST MODAL (Documents) */}
      {showRequestModal && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl animate-in zoom-in duration-200">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                     <FileQuestion size={24} className="text-blue-600"/> Nouvelle Requête
                  </h3>
                  <button onClick={() => setShowRequestModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
               </div>
               
               <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400">Type de demande</label>
                     <select 
                        className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-800 outline-none"
                        value={requestType}
                        onChange={(e) => setRequestType(e.target.value)}
                     >
                        <option>Attestation de Membre</option>
                        <option>Carte de Membre</option>
                        <option>Audience Bureau</option>
                        <option>Demande Sociale</option>
                        <option>Autre</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400">Note / Détails</label>
                     <textarea 
                        className="w-full p-4 bg-slate-50 border-none rounded-xl text-sm font-medium text-slate-600 outline-none resize-none h-32"
                        placeholder="Précisez votre demande..."
                        value={requestNote}
                        onChange={(e) => setRequestNote(e.target.value)}
                        required
                     />
                  </div>
                  <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-black flex items-center justify-center gap-2">
                     <Send size={16}/> Transmettre
                  </button>
               </form>
            </div>
         </div>
      )}

      {/* JOIN COMMISSION MODAL (Engagement) */}
      {showJoinCommissionModal && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom-8 duration-300 relative overflow-hidden">
               {/* Decorative background */}
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] font-arabic text-9xl pointer-events-none rotate-12">خ</div>
               
               <div className="flex justify-between items-center mb-6">
                  <div>
                     <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <HeartHandshake size={24} className="text-amber-500"/> Khidma (Service)
                     </h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Rejoindre une commission</p>
                  </div>
                  <button onClick={() => setShowJoinCommissionModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
               </div>
               
               <form onSubmit={handleJoinCommission} className="space-y-5">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400">Commission souhaitée</label>
                     <select 
                        className="w-full p-4 bg-amber-50 border-none rounded-2xl text-sm font-black text-amber-900 outline-none focus:ring-2 focus:ring-amber-200"
                        value={joinTargetCommission}
                        onChange={(e) => setJoinTargetCommission(e.target.value)}
                        required
                     >
                        <option value="">Sélectionner un pôle...</option>
                        {INITIAL_COMMISSIONS.map(c => (
                           <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                     </select>
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400">Motivation & Compétences</label>
                     <textarea 
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-medium text-slate-600 outline-none resize-none h-32 focus:ring-2 focus:ring-slate-200"
                        placeholder="Pourquoi souhaitez-vous rejoindre cette commission ? Quelles compétences pouvez-vous apporter ?"
                        value={joinMotivation}
                        onChange={(e) => setJoinMotivation(e.target.value)}
                        required
                     />
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3">
                     <div className="p-2 bg-white rounded-xl text-slate-400 shadow-sm"><Target size={16}/></div>
                     <p className="text-[10px] text-slate-500 leading-relaxed italic">
                        "Le meilleur d'entre vous est celui qui est le plus utile aux autres." <br/>
                        <span className="not-italic font-bold opacity-60">- Hadith</span>
                     </p>
                  </div>

                  <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-black flex items-center justify-center gap-3 transition-all hover:scale-[1.02]">
                     <Send size={16}/> Envoyer Candidature
                  </button>
               </form>
            </div>
         </div>
      )}

      {/* 1. HERO SECTION (Dynamic Theme) */}
      <div className={`relative overflow-hidden rounded-[2.5rem] p-8 md:p-10 shadow-2xl group transition-colors duration-500 bg-gradient-to-r from-${roleContext.theme}-900 to-slate-900 text-white`}>
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="absolute top-0 right-0 p-12 opacity-5 font-arabic text-9xl pointer-events-none group-hover:scale-110 transition-transform duration-1000 rotate-12 z-0">م</div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 flex items-center gap-2">
                 <Sparkles size={10} className="text-yellow-400" /> {gregorianDate}
              </span>
              {roleContext.type ? (
                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 ${
                    roleContext.isLeader ? 'bg-yellow-500/20 text-yellow-300' : 'bg-white/10 text-white'
                 }`}>
                    {roleContext.label} • {roleContext.type}
                 </span>
              ) : (
                 <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 bg-white/10 text-slate-300">
                    Membre Sympathisant
                 </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
              Salam, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{currentMember.firstName}</span>
            </h1>
            <p className="text-sm text-slate-300 font-medium max-w-lg leading-relaxed border-l-2 border-white/20 pl-4">
              {roleContext.type 
                ? `"Le service est la porte d'accès à la satisfaction divine. ${roleContext.isLeader ? 'Guide avec sagesse.' : 'Œuvre avec dévouement.'}"`
                : `"L'adhésion au Dahira est un premier pas. L'engagement dans une commission est l'élévation vers l'excellence."`}
            </p>
          </div>

          <div className="flex items-center gap-3">
             <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-white">{currentMember.matricule}</p>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{currentMember.category}</p>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-lg shadow-inner">
                {currentMember.firstName[0]}{currentMember.lastName[0]}
             </div>
          </div>
        </div>
      </div>

      {/* 2. DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (MAIN CONTENT) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* WIDGET 1: FOCUS WIDGET (Métier ou Engagement pour membre simple) */}
              <div 
                 onClick={() => !roleContext.type && setShowJoinCommissionModal(true)}
                 className={`rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl cursor-pointer hover:scale-[1.02] transition-transform ${
                  !roleContext.type ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 
                  `bg-gradient-to-br from-${roleContext.theme}-600 to-${roleContext.theme}-800`
              }`}>
                  <div className="relative z-10 flex flex-col justify-between h-full min-h-[180px]">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/10">
                          {React.createElement(dashboardConfig.kpi.icon, { size: 24 })}
                        </div>
                        {!roleContext.type && (
                          <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse border border-white/20">
                             Devenir Actif
                          </span>
                        )}
                        {dashboardConfig.kpi.alert && (
                          <span className="px-3 py-1 bg-red-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse">Action Requise</span>
                        )}
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">{dashboardConfig.kpi.label}</p>
                        <h3 className="text-4xl font-black tracking-tighter mb-1">{dashboardConfig.kpi.value}</h3>
                        <p className="text-xs opacity-80 font-medium">{dashboardConfig.kpi.sub}</p>
                    </div>
                  </div>
                  
                  {/* Decor for Simple Member */}
                  {!roleContext.type && (
                     <div className="absolute -right-6 -bottom-6 opacity-20 text-white rotate-12">
                        <HeartHandshake size={120} />
                     </div>
                  )}
              </div>

              {/* WIDGET 2: NEXT EVENT (Standard for everyone) */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group cursor-pointer hover:border-indigo-100 transition-all" onClick={() => setActiveTab('events')}>
                 <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Calendar size={24} /></div>
                    {daysToNextEvent !== null && daysToNextEvent <= 7 && (
                       <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-100 animate-pulse">
                          J-{daysToNextEvent}
                       </span>
                    )}
                 </div>
                 
                 {nextEvent ? (
                    <div className="relative z-10">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Prochain Rendez-vous</p>
                       <h3 className="text-xl font-black text-slate-900 leading-tight mb-1 line-clamp-2">{nextEvent.title}</h3>
                       <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-3">
                          <Clock size={14} className="text-indigo-400"/> 
                          <span>{new Date(nextEvent.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                          <MapPin size={14} className="text-indigo-400 ml-2"/>
                          <span className="truncate max-w-[100px]">{nextEvent.location}</span>
                       </div>
                    </div>
                 ) : (
                    <div className="h-full flex flex-col justify-center items-center text-center text-slate-300">
                       <p className="text-xs font-bold uppercase">Aucun événement</p>
                    </div>
                 )}
              </div>
           </div>

           {/* WIDGET 3: ACTIVITY OR PEDAGOGY DETAILS */}
           {/* Si membre simple, on affiche les commissions à rejoindre */}
           {!roleContext.type ? (
              <div className="glass-card p-8 bg-white border-slate-100">
                 <div className="flex justify-between items-center mb-6">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                       <Star size={16} className="text-amber-500"/> Commissions Recrutent
                    </h4>
                    <button onClick={() => setShowJoinCommissionModal(true)} className="text-[10px] font-bold text-amber-600 hover:underline">Tout voir</button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {INITIAL_COMMISSIONS.slice(0, 3).map((comm, i) => (
                       <div 
                         key={i} 
                         onClick={() => { setJoinTargetCommission(comm.name); setShowJoinCommissionModal(true); }}
                         className="p-4 rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all cursor-pointer group bg-slate-50 hover:bg-white"
                       >
                          <div className="flex justify-between items-start mb-2">
                             <h5 className="font-bold text-slate-800 text-xs">{comm.name}</h5>
                             <ChevronRight size={14} className="text-slate-300 group-hover:text-amber-500"/>
                          </div>
                          <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{comm.description}</p>
                       </div>
                    ))}
                 </div>
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="md:col-span-2 glass-card p-6 bg-white border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                       <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                          <TrendingUp size={16} className="text-emerald-500"/> 
                          {currentMember.category === MemberCategory.ETUDIANT ? 'Progression Khassaid' : 'Historique Adiyas'}
                       </h4>
                    </div>
                    <div className="h-40 w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={myFinance.history}>
                             <defs>
                               <linearGradient id="colorChart" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={currentMember.category === MemberCategory.ETUDIANT ? '#06b6d4' : '#10b981'} stopOpacity={0.1}/>
                                  <stop offset="95%" stopColor={currentMember.category === MemberCategory.ETUDIANT ? '#06b6d4' : '#10b981'} stopOpacity={0}/>
                               </linearGradient>
                             </defs>
                             <Tooltip 
                               contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '11px', fontWeight: 'bold' }} 
                             />
                             <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} interval="preserveStartEnd" />
                             <Area type="monotone" dataKey="amount" stroke={currentMember.category === MemberCategory.ETUDIANT ? '#06b6d4' : '#10b981'} strokeWidth={3} fillOpacity={1} fill="url(#colorChart)" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 {/* Quick Requests Widget */}
                 <div className="glass-card p-6 bg-blue-50 border-blue-100 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="relative z-10">
                       <div className="bg-white p-4 rounded-full shadow-md text-blue-600 mb-4 mx-auto w-16 h-16 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform" onClick={() => setShowRequestModal(true)}>
                          <Plus size={24} />
                       </div>
                       <h4 className="text-sm font-black text-blue-900">Besoin d'aide ?</h4>
                       <p className="text-[9px] text-blue-700/70 font-bold uppercase tracking-widest mt-1">Faire une requête</p>
                    </div>
                 </div>
              </div>
           )}

        </div>

        {/* RIGHT COLUMN (ACTIONS & NOTIFICATIONS) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           
           {/* Quick Actions Grid - Fully Dynamic based on Role/Commission */}
           <div className="grid grid-cols-2 gap-4">
              {dashboardConfig.actions.map((action, idx) => (
                 <button 
                   key={idx}
                   onClick={action.action} 
                   className={`p-4 bg-white border border-slate-100 rounded-[1.5rem] hover:shadow-lg hover:-translate-y-1 hover:border-${action.color}-200 transition-all group text-center flex flex-col items-center gap-3`}
                 >
                    <div className={`p-3 bg-${action.color}-50 rounded-2xl text-${action.color}-600 group-hover:bg-${action.color}-100 transition-colors`}>
                        {React.createElement(action.icon, { size: 20 })}
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-600 group-hover:text-slate-900">{action.label}</span>
                 </button>
              ))}
           </div>

           {/* TASKS OR NOTIFICATIONS */}
           <div className="flex-1 glass-card bg-white p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    {myTasks.length > 0 ? <><ListTodo size={14} className="text-slate-400" /> Tâches {roleContext.type ? `(${roleContext.type.substring(0,4)}.)` : ''}</> : <><Bell size={14} className="text-slate-400" /> Notifications</>}
                 </h4>
                 <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              </div>
              
              <div className="space-y-3 overflow-y-auto pr-1 flex-1 max-h-[300px] custom-scrollbar">
                 {myTasks.length > 0 ? (
                    myTasks.map(task => (
                       <div key={task.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer group" onClick={() => setActiveTab('tasks')}>
                          <div className="flex justify-between items-start mb-1">
                             <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${task.priority === 'high' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>{task.priority}</span>
                             <span className="text-[9px] text-slate-400">{new Date(task.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-700 leading-tight group-hover:text-emerald-700 transition-colors">{task.title}</p>
                       </div>
                    ))
                 ) : (
                    <>
                       {/* Messages contextuels pour membres sans tâches (incitation) */}
                       {!roleContext.type ? (
                          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-center">
                             <p className="text-xs font-bold text-amber-800 mb-1">Aucune mission</p>
                             <p className="text-[10px] text-amber-700/80">Rejoignez une commission pour participer activement aux projets du Dahira.</p>
                             <button onClick={() => setShowJoinCommissionModal(true)} className="mt-3 w-full py-2 bg-amber-200 text-amber-900 rounded-lg text-[9px] font-black uppercase hover:bg-amber-300">Voir les opportunités</button>
                          </div>
                       ) : (
                          <>
                             {myFinance.pending > 0 && (
                                <div className="flex gap-3 p-3 rounded-xl bg-rose-50 border border-rose-100">
                                  <div className="mt-1 min-w-[8px] h-2 w-2 rounded-full bg-rose-500 animate-pulse"></div>
                                  <div>
                                     <p className="text-xs font-bold text-rose-800 leading-tight">Retard de Cotisation</p>
                                     <p className="text-[10px] text-rose-600/80 mt-1">Sass du mois en cours impayé.</p>
                                  </div>
                               </div>
                             )}
                             <div className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="mt-1 min-w-[8px] h-2 w-2 rounded-full bg-blue-500"></div>
                                <div>
                                   <p className="text-xs font-bold text-slate-700 leading-tight">Prochaine Réunion</p>
                                   <p className="text-[10px] text-slate-400 mt-1">Assemblée Générale - Samedi</p>
                                </div>
                             </div>
                          </>
                       )}
                    </>
                 )}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default MemberDashboard;
