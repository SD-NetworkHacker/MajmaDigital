
import React, { useState, useMemo } from 'react';
import { 
  Wallet, TrendingUp, Target, PieChart, FileText, 
  Share2, Download, Zap, CreditCard, LayoutDashboard, 
  ShieldCheck, Calculator, Landmark, History, User, CheckSquare,
  BadgeCheck, Mail
} from 'lucide-react';
import ContributionManager from './ContributionManager';
import PaymentProcessing from './PaymentProcessing';
import BudgetPlanner from './BudgetPlanner';
import FinancialReporting from './FinancialReporting';
import MemberFinancePortal from './MemberFinancePortal';
import FinanceReviewPanel from './FinanceReviewPanel';
import FinancialOverviewWidget from '../shared/FinancialOverviewWidget';
import MeetingOverviewWidget from '../shared/MeetingOverviewWidget';
import { CommissionType } from '../../types';
import { useData } from '../../contexts/DataContext';

const FinanceDashboard: React.FC = () => {
  const [activeFinanceTab, setActiveFinanceTab] = useState('overview');
  const { members } = useData();

  // Filtrer les membres de la commission Finance
  const commissionTeam = useMemo(() => members.filter(m => 
    m.commissions.some(c => c.type === CommissionType.FINANCE)
  ), [members]);

  const getRolePriority = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('dieuwrine') && !r.includes('adjoint')) return 1;
    if (r.includes('dieuwrine adjoint')) return 2;
    if (r.includes('secrétaire') || r.includes('trésorier')) return 3;
    if (r.includes('chargé')) return 4;
    return 10;
  };

  const navItems = [
    { id: 'overview', label: 'Console Trésorerie', icon: LayoutDashboard },
    { id: 'review', label: 'Contrôle Budgétaire', icon: CheckSquare }, // New Tab
    { id: 'contributions', label: 'Gestion Cotisations', icon: Calculator },
    { id: 'payments', label: 'Paiements & Reçus', icon: CreditCard },
    { id: 'budget', label: 'Planif. Budgétaire', icon: Target },
    { id: 'reports', label: 'États & Reporting', icon: PieChart },
    { id: 'portal', label: 'Portail Membre', icon: User },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Sub-Navigation Finance */}
      <div className="flex flex-wrap gap-3 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 w-fit">
        {navItems.map(item => (
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

      {activeFinanceTab === 'overview' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* Ledger Header */}
          <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-black rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-16">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-50 mb-4">Trésorerie Consolidée</p>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter">12,840,000 <span className="text-2xl opacity-30 font-bold ml-2">FCFA</span></h2>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/10">
                  <TrendingUp size={40} className="text-blue-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {[
                   { l: 'Adiyas Ziar', v: '2.1M', trend: 'Objectif Atteint', color: 'text-amber-400' },
                   { l: 'Sass Mensuel', v: '8.5M', trend: '+15%', color: 'text-emerald-400' },
                   { l: 'Fonds Social', v: '1.2M', trend: 'Stable', color: 'text-blue-400' },
                   { l: 'Cash en Caisse', v: '1.04M', trend: 'Vérifié', color: 'text-indigo-400' }
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
                  <Zap size={22} className="text-indigo-500" /> Opérations Prioritaires
                </h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[9px] font-black uppercase">2 Alertes de seuil</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-indigo-200 transition-all cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600"><Calculator size={20}/></div>
                    <h4 className="font-black text-sm text-slate-800">Générer Échéances Mai</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">Lancer le calcul automatique des cotisations pour les 124 membres actifs.</p>
                  <button className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/10">Exécuter Algorithme</button>
                </div>
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-emerald-200 transition-all cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-emerald-600"><FileText size={20}/></div>
                    <h4 className="font-black text-sm text-slate-800">Clôture Financière Ziar</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">Réconcilier les dernières dépenses engagées et générer le rapport final.</p>
                  <button className="w-full py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/10">Fermer Événement</button>
                </div>
              </div>
            </div>

            {/* Audit & Compliance */}
            <div className="lg:col-span-4 space-y-8">
              <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-50">Audit Trail Actif</h4>
                 <div className="space-y-4 relative z-10">
                    {[
                      { user: 'Admin', act: 'Versement Wave', amt: '25k', h: '0x4f...2a' },
                      { user: 'Trésorier', act: 'Approv. Budget', amt: '450k', h: '0x9d...1b' },
                    ].map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <div>
                          <p className="text-[10px] font-black">{log.user} • {log.act}</p>
                          <p className="text-[8px] opacity-40 font-mono">{log.h}</p>
                        </div>
                        <span className="text-xs font-black text-emerald-400">+{log.amt}</span>
                      </div>
                    ))}
                 </div>
                 <div className="absolute -right-10 -bottom-10 opacity-5 font-arabic text-[12rem] rotate-12 pointer-events-none">ت</div>
              </div>

              <div className="glass-card p-10 border-indigo-100 bg-indigo-50/20">
                <div className="flex items-center gap-3 mb-6 text-indigo-700">
                   <ShieldCheck size={22} />
                   <h4 className="font-black text-xs uppercase tracking-widest">Conformité</h4>
                </div>
                <p className="text-[12px] font-medium text-slate-700 leading-relaxed italic">
                  "Tous les flux supérieurs à 500,000 FCFA requièrent désormais une double validation du Dieuwrine et du Secrétaire Général."
                </p>
              </div>
            </div>
          </div>

          {/* SECTION: ÉQUIPE DE LA COMMISSION */}
          <div className="glass-card p-8 bg-white border border-slate-100/50 mt-8">
             <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-slate-50 pb-6">
                <div>
                   <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                      <BadgeCheck size={24} className="text-indigo-600"/> Membres de la Commission
                   </h4>
                   <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2">Hiérarchie et Rôles</p>
                </div>
                <span className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase border border-indigo-100">
                   {commissionTeam.length} Membres Affectés
                </span>
             </div>
             
             {commissionTeam.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {commissionTeam.sort((a, b) => {
                      const roleA = a.commissions.find(c => c.type === CommissionType.FINANCE)?.role_commission || '';
                      const roleB = b.commissions.find(c => c.type === CommissionType.FINANCE)?.role_commission || '';
                      return getRolePriority(roleA) - getRolePriority(roleB);
                  }).map(member => {
                      const assignment = member.commissions.find(c => c.type === CommissionType.FINANCE);
                      const roleName = assignment ? assignment.role_commission : 'Membre';
                      
                      return (
                          <div key={member.id} className="p-6 rounded-[1.5rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-indigo-900/5 hover:border-indigo-100 transition-all group cursor-pointer relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-50 to-white rounded-bl-[3rem] -mr-4 -mt-4 transition-all group-hover:from-indigo-100 group-hover:to-indigo-50"></div>
                              
                              <div className="relative z-10">
                                  <div className="flex justify-between items-start mb-4">
                                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-indigo-700 font-black text-lg shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                          {member.firstName[0]}{member.lastName[0]}
                                      </div>
                                      <span className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                  </div>
                                  
                                  <h5 className="font-black text-slate-800 text-sm leading-tight mb-1">{member.firstName} {member.lastName}</h5>
                                  <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest mb-4 bg-indigo-50 inline-block px-2 py-0.5 rounded">{roleName}</p>
                                  
                                  <div className="pt-4 border-t border-slate-200/50 space-y-2">
                                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                                          <ShieldCheck size={12} className="text-slate-400"/>
                                          <span>{member.role}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium truncate">
                                          <Mail size={12} className="text-slate-400"/>
                                          <span className="truncate">{member.email}</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )
                  })}
               </div>
             ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400">
                   <User size={32} className="mb-3 opacity-30"/>
                   <p className="text-xs font-bold uppercase">Aucun membre assigné</p>
                   <p className="text-[10px] opacity-70 mt-1">Utilisez la gestion des membres pour affecter du personnel.</p>
                </div>
             )}
          </div>
        </div>
      )}

      {activeFinanceTab === 'review' && <FinanceReviewPanel />}
      {activeFinanceTab === 'contributions' && <ContributionManager />}
      {activeFinanceTab === 'payments' && <PaymentProcessing />}
      {activeFinanceTab === 'budget' && <BudgetPlanner />}
      {activeFinanceTab === 'reports' && <FinancialReporting />}
      {activeFinanceTab === 'portal' && <MemberFinancePortal />}
    </div>
  );
};

export default FinanceDashboard;
