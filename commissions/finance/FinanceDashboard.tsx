
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Wallet, TrendingUp, Target, PieChart, FileText, 
  Share2, Download, Zap, CreditCard, LayoutDashboard, 
  ShieldCheck, Calculator, Landmark, History, User, CheckSquare,
  BadgeCheck, Mail, ArrowLeft, ListTodo, Sparkles, Lock
} from 'lucide-react';
import ContributionManager from './ContributionManager';
import PaymentProcessing from './PaymentProcessing';
import BudgetPlanner from './BudgetPlanner';
import FinancialReporting from './FinancialReporting';
import MemberFinancePortal from './MemberFinancePortal';
import FinanceReviewPanel from './FinanceReviewPanel';
import FinancialOverviewWidget from '../shared/FinancialOverviewWidget';
import MeetingOverviewWidget from '../shared/MeetingOverviewWidget';
import TaskManager from '../../components/shared/TaskManager';
import { CommissionType } from '../../types';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../context/AuthContext';
import { getSmartInsight } from '../../services/geminiService';

const FinanceDashboard: React.FC = () => {
  const [activeFinanceTab, setActiveFinanceTab] = useState('overview');
  const [aiInsight, setAiInsight] = useState("Analyse des flux financiers en cours...");
  const { members, contributions, totalTreasury } = useData();
  const { user } = useAuth();

  // 1. Identifier le rôle précis de l'utilisateur dans CETTE commission
  const currentUserMember = useMemo(() => members.find(m => m.email === user?.email), [members, user]);
  const myCommissionRole = useMemo(() => {
    return currentUserMember?.commissions.find(c => c.type === CommissionType.FINANCE)?.role_commission || 'Membre';
  }, [currentUserMember]);

  // 2. Définir les niveaux d'accès
  const isDecisionMaker = ['Dieuwrine', 'Dieuwrine Adjoint', 'Trésorier', 'Secrétaire'].some(r => myCommissionRole.includes(r));
  const isTreasurer = myCommissionRole.includes('Trésorier') || myCommissionRole.includes('Dieuwrine');

  // Load AI Insight
  useEffect(() => {
    const loadInsight = async () => {
      const insight = await getSmartInsight("Analyse la santé financière actuelle basée sur une trésorerie stable et des cotisations régulières.");
      setAiInsight(insight);
    };
    loadInsight();
  }, []);

  // Filtrer les membres de la commission Finance
  const commissionTeam = useMemo(() => members.filter(m => 
    m.commissions.some(c => c.type === CommissionType.FINANCE)
  ), [members]);

  // Calcul des statistiques réelles
  const stats = useMemo(() => {
    const adiyasTotal = contributions.filter(c => c.type === 'Adiyas').reduce((acc, c) => acc + c.amount, 0);
    const sassTotal = contributions.filter(c => c.type === 'Sass').reduce((acc, c) => acc + c.amount, 0);
    const diayanteTotal = contributions.filter(c => c.type === 'Diayanté').reduce((acc, c) => acc + c.amount, 0);
    
    const recentLogs = [...contributions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(c => {
        const m = members.find(mem => mem.id === c.memberId);
        return {
          user: m ? `${m.firstName} ${m.lastName}` : 'Membre inconnu',
          act: `Versement ${c.type}`,
          amt: c.amount.toLocaleString(),
          h: `TX-${c.id.slice(-6)}`
        };
      });

    return { adiyasTotal, sassTotal, diayanteTotal, recentLogs };
  }, [contributions, members]);

  // Configuration des onglets avec permissions
  const navItems = [
    { id: 'overview', label: 'Console Trésorerie', icon: LayoutDashboard, restricted: false },
    { id: 'tasks', label: 'Mes Tâches', icon: ListTodo, restricted: false },
    { id: 'contributions', label: 'Saisie Cotisations', icon: Calculator, restricted: false }, // Tous les membres finance peuvent saisir
    { id: 'payments', label: 'Caisse & Reçus', icon: CreditCard, restricted: false },
    { id: 'review', label: 'Contrôle & Validation', icon: CheckSquare, restricted: true }, // Réservé Décideurs
    { id: 'budget', label: 'Planif. Budgétaire', icon: Target, restricted: true }, // Réservé Décideurs
    { id: 'reports', label: 'États Financiers', icon: PieChart, restricted: true }, // Réservé Trésorier/Dieuwrine
  ];

  // Filtrer les onglets selon le rôle
  const visibleNavItems = navItems.filter(item => !item.restricted || isDecisionMaker);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Role Banner */}
      <div className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-2xl border border-blue-100 w-fit">
         <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase rounded-lg tracking-widest">
            Votre Rôle
         </span>
         <span className="text-xs font-bold text-blue-900">{myCommissionRole}</span>
         {!isDecisionMaker && <span className="text-[10px] text-slate-400 flex items-center gap-1"><Lock size={10}/> Accès Standard</span>}
      </div>

      {/* Sub-Navigation Finance */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
        <div className="flex flex-wrap gap-3 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 w-fit">
          {visibleNavItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveFinanceTab(item.id)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeFinanceTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/10 border border-indigo-500' : 'text-slate-400 hover:text-indigo-600'
              }`}
            >
              <item.icon size={16} />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </div>

        {activeFinanceTab !== 'overview' && (
          <button 
            onClick={() => setActiveFinanceTab('overview')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all shadow-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="uppercase text-[10px] tracking-widest">Retour Trésorerie</span>
          </button>
        )}
      </div>

      {activeFinanceTab === 'overview' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* Ledger Header */}
          <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-black rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-16">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-50 mb-4">Trésorerie Consolidée</p>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
                    {totalTreasury.toLocaleString()} <span className="text-2xl opacity-30 font-bold ml-2">FCFA</span>
                  </h2>
                  <div className="mt-6 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 w-fit">
                    <Sparkles size={14} className="text-amber-400" />
                    <p className="text-xs font-medium italic opacity-90">{aiInsight}</p>
                  </div>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/10">
                  <TrendingUp size={40} className="text-blue-400" />
                </div>
              </div>
              {/* Stats Grid - Visible to everyone */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {[
                   { l: 'Adiyas', v: stats.adiyasTotal.toLocaleString(), trend: 'Participations', color: 'text-amber-400' },
                   { l: 'Sass Mensuel', v: stats.sassTotal.toLocaleString(), trend: 'Cotisations', color: 'text-emerald-400' },
                   { l: 'Diayanté', v: stats.diayanteTotal.toLocaleString(), trend: 'Social', color: 'text-blue-400' },
                   { l: 'Fonds Global', v: totalTreasury.toLocaleString(), trend: 'Total', color: 'text-indigo-400' }
                 ].map((item, i) => (
                   <div key={i} className="p-5 bg-white/5 backdrop-blur-md rounded-3xl border border-white/5">
                     <p className="text-[9px] font-black uppercase opacity-40 mb-2 tracking-widest">{item.l}</p>
                     <p className="text-xl font-black mb-1">{item.v}</p>
                     <span className={`text-[8px] font-bold ${item.color} bg-white/5 px-2 py-0.5 rounded-full`}>{item.trend}</span>
                   </div>
                 ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 p-20 opacity-5 font-arabic text-[25rem] pointer-events-none">ق</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-8 glass-card p-10">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <Zap size={22} className="text-indigo-500" /> Opérations Rapides
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-indigo-200 transition-all cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600"><Calculator size={20}/></div>
                    <h4 className="font-black text-sm text-slate-800">Saisie Rapide</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">Enregistrer une nouvelle cotisation ou un versement pour un membre.</p>
                  <button 
                    onClick={() => setActiveFinanceTab('contributions')}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/10"
                  >
                    Nouvelle Entrée
                  </button>
                </div>
                
                {/* Conditional Block: Only for Decision Makers */}
                {isDecisionMaker ? (
                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-emerald-200 transition-all cursor-pointer">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-white rounded-2xl shadow-sm text-emerald-600"><FileText size={20}/></div>
                      <h4 className="font-black text-sm text-slate-800">Bilans & Validation</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">Valider les demandes budgétaires ou générer les états financiers.</p>
                    <button 
                      onClick={() => setActiveFinanceTab('review')}
                      className="w-full py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/10"
                    >
                      Console de Validation
                    </button>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 flex flex-col justify-center items-center text-center opacity-60">
                     <Lock size={24} className="mb-2 text-slate-400"/>
                     <p className="text-xs font-bold uppercase text-slate-500">Zone Réservée</p>
                     <p className="text-[10px] mt-1">Validation Budgétaire</p>
                  </div>
                )}
              </div>
            </div>

            {/* Audit & Compliance */}
            <div className="lg:col-span-4 space-y-8">
              {/* Only show full logs to Treasurer */}
              <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-50">Audit Trail (Live)</h4>
                 <div className="space-y-4 relative z-10 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                    {stats.recentLogs.length > 0 ? stats.recentLogs.map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-black truncate">{log.user}</p>
                          <p className="text-[8px] opacity-40 font-mono">{log.act} • {log.h}</p>
                        </div>
                        <span className="text-xs font-black text-emerald-400 whitespace-nowrap">{log.amt} F</span>
                      </div>
                    )) : (
                      <p className="text-xs opacity-40 text-center italic">Aucune transaction récente</p>
                    )}
                 </div>
                 <div className="absolute -right-10 -bottom-10 opacity-5 font-arabic text-[12rem] rotate-12 pointer-events-none">ت</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeFinanceTab === 'review' && isDecisionMaker && <FinanceReviewPanel />}
      {activeFinanceTab === 'tasks' && <TaskManager commission={CommissionType.FINANCE} />}
      {activeFinanceTab === 'contributions' && <ContributionManager />}
      {activeFinanceTab === 'payments' && <PaymentProcessing />}
      {activeFinanceTab === 'budget' && isDecisionMaker && <BudgetPlanner />}
      {activeFinanceTab === 'reports' && isTreasurer && <FinancialReporting />}
    </div>
  );
};

export default FinanceDashboard;
