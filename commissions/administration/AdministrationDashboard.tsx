
import React, { useState, useMemo } from 'react';
import { 
  Users, Calendar, Briefcase, FileCheck, Megaphone, 
  LayoutDashboard, ShieldCheck, Settings, Activity, 
  Bell, Info, Radar, CheckCircle, XCircle, ChevronRight, 
  UserCheck, ArrowRight, BadgeCheck, Mail, Phone
} from 'lucide-react';
import MemberManagementDashboard from './MemberManagementDashboard';
import MeetingManager from './MeetingManager';
import SectorCoordinator from './SectorCoordinator';
import DocumentWorkflow from './DocumentWorkflow';
import CommunicationHub from './CommunicationHub';
import AdministrationReviewInterface from './AdministrationReviewInterface';
import UnifiedAdminTracking from './UnifiedAdminTracking';
import { useData } from '../../contexts/DataContext';
import { getReportsByStatus } from '../../services/reportService';
import { CommissionType } from '../../types';

type QuickViewType = 'none' | 'members_active' | 'pvs_validated' | 'alerts';

const AdministrationDashboard: React.FC = () => {
  const [activeAdminTab, setActiveAdminTab] = useState('overview');
  const [quickView, setQuickView] = useState<QuickViewType>('none');
  
  const { members, updateMemberStatus, deleteMember } = useData();

  // --- DATA DERIVATION ---
  const activeMembers = useMemo(() => members.filter(m => m.status === 'active'), [members]);
  const pendingMembers = useMemo(() => members.filter(m => m.status === 'pending'), [members]);
  const validatedReports = useMemo(() => getReportsByStatus(['valide_admin', 'approuve_bureau']), []);
  
  // Filtrer les membres de la commission Administration pour le profilage
  const commissionTeam = useMemo(() => members.filter(m => 
    m.commissions.some(c => c.type === CommissionType.ADMINISTRATION)
  ), [members]);
  
  // Mock alerts for demo
  const alerts = [
    { id: 1, msg: "Quorum non atteint - Réunion Bureau", level: "high" },
    { id: 2, msg: "Retard validation PV Finance", level: "medium" },
    { id: 3, msg: "Stock fournitures admin bas", level: "low" }
  ];

  // --- HANDLERS ---
  const handleApproveMember = (id: string) => {
    if(confirm("Confirmer l'inscription de ce membre ?")) {
      updateMemberStatus(id, 'active');
    }
  };

  const handleRejectMember = (id: string) => {
    if(confirm("Rejeter cette demande d'inscription ?")) {
      deleteMember(id); 
    }
  };

  const navItems = [
    { id: 'overview', label: 'Console Centrale', icon: LayoutDashboard },
    { id: 'tracking', label: 'Suivi des Commissions', icon: Radar },
    { id: 'review', label: 'Revue des PV', icon: FileCheck },
    { id: 'members', label: 'Gestion Talibés', icon: Users },
    { id: 'meetings', label: 'Instances & PV', icon: Calendar },
    { id: 'sectors', label: 'Coord. Secteurs', icon: Briefcase },
    { id: 'documents', label: 'Workflows Doc', icon: FileCheck },
    { id: 'hub', label: 'Admin Hub', icon: Megaphone },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Sub-Navigation Admin */}
      <div className="flex flex-wrap gap-3 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 w-fit">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveAdminTab(item.id)}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeAdminTab === item.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/10 border border-emerald-500' : 'text-slate-400 hover:text-emerald-600'
            }`}
          >
            <item.icon size={16} />
            <span className="hidden md:inline">{item.label}</span>
          </button>
        ))}
      </div>

      {activeAdminTab === 'overview' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Main KPI Stats - Interactive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                id: 'members_active', 
                l: 'Total Effectif', 
                v: activeMembers.length.toString(), 
                trend: `+${pendingMembers.length} en attente`, 
                icon: Users, 
                color: 'text-emerald-600', 
                bg: 'bg-emerald-50',
                borderColor: quickView === 'members_active' ? 'border-emerald-500' : 'border-transparent'
              },
              { 
                id: 'none', 
                l: 'Taux d\'Activité', 
                v: '92%', 
                trend: 'En hausse', 
                icon: Activity, 
                color: 'text-blue-600', 
                bg: 'bg-blue-50',
                borderColor: 'border-transparent'
              },
              { 
                id: 'pvs_validated', 
                l: 'PV Validés', 
                v: validatedReports.length.toString(), 
                trend: '100% conformité', 
                icon: FileCheck, 
                color: 'text-purple-600', 
                bg: 'bg-purple-50',
                borderColor: quickView === 'pvs_validated' ? 'border-purple-500' : 'border-transparent'
              },
              { 
                id: 'alerts', 
                l: 'Alertes Admin', 
                v: alerts.length.toString().padStart(2, '0'), 
                trend: 'Action requise', 
                icon: Bell, 
                color: 'text-rose-600', 
                bg: 'bg-rose-50',
                borderColor: quickView === 'alerts' ? 'border-rose-500' : 'border-transparent'
              },
            ].map((stat, i) => (
              <button 
                key={i} 
                onClick={() => setQuickView(stat.id === quickView ? 'none' : stat.id as QuickViewType)}
                disabled={stat.id === 'none'}
                className={`glass-card p-8 group hover:-translate-y-1 transition-all text-left w-full border-2 ${stat.borderColor} hover:shadow-lg`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-inner group-hover:scale-110 transition-transform`}>
                    <stat.icon size={24} />
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded-lg">{stat.trend}</span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.l}</p>
                <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.v}</h4>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Dynamic Content Area (Validation Queue or Quick View) */}
            <div className="lg:col-span-7 space-y-6">
              
              {quickView === 'members_active' && (
                <div className="glass-card p-8 bg-emerald-50/50 border-emerald-100 animate-in fade-in slide-in-from-top-4">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-black text-emerald-800 flex items-center gap-2"><UserCheck size={20}/> Effectif Actif</h3>
                      <button onClick={() => setQuickView('none')} className="p-2 hover:bg-emerald-100 rounded-full text-emerald-600"><XCircle size={20}/></button>
                   </div>
                   <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2">
                      {activeMembers.slice(0, 10).map(m => (
                        <div key={m.id} className="flex justify-between items-center p-3 bg-white rounded-xl border border-emerald-100/50">
                           <span className="text-xs font-bold text-slate-700">{m.firstName} {m.lastName}</span>
                           <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{m.category}</span>
                        </div>
                      ))}
                      <button onClick={() => setActiveAdminTab('members')} className="w-full py-3 text-[10px] font-black uppercase text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all">Voir l'annuaire complet</button>
                   </div>
                </div>
              )}

              {quickView === 'pvs_validated' && (
                <div className="glass-card p-8 bg-purple-50/50 border-purple-100 animate-in fade-in slide-in-from-top-4">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-black text-purple-800 flex items-center gap-2"><FileCheck size={20}/> Derniers PV Validés</h3>
                      <button onClick={() => setQuickView('none')} className="p-2 hover:bg-purple-100 rounded-full text-purple-600"><XCircle size={20}/></button>
                   </div>
                   <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2">
                      {validatedReports.length > 0 ? validatedReports.map(r => (
                        <div key={r.id} className="p-3 bg-white rounded-xl border border-purple-100/50">
                           <p className="text-xs font-bold text-slate-700">{r.title}</p>
                           <p className="text-[9px] text-slate-400 mt-1">{r.date} • Comm. {r.commission}</p>
                        </div>
                      )) : <p className="text-xs text-slate-400 italic">Aucun PV validé récemment.</p>}
                   </div>
                </div>
              )}

              {quickView === 'alerts' && (
                <div className="glass-card p-8 bg-rose-50/50 border-rose-100 animate-in fade-in slide-in-from-top-4">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-black text-rose-800 flex items-center gap-2"><Bell size={20}/> Alertes Système</h3>
                      <button onClick={() => setQuickView('none')} className="p-2 hover:bg-rose-100 rounded-full text-rose-600"><XCircle size={20}/></button>
                   </div>
                   <div className="space-y-2">
                      {alerts.map(a => (
                        <div key={a.id} className="flex gap-3 items-center p-3 bg-white rounded-xl border border-rose-100/50">
                           <div className={`w-2 h-2 rounded-full ${a.level === 'high' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                           <span className="text-xs font-bold text-slate-700">{a.msg}</span>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* Default View: Validation Queue */}
              <div className="glass-card p-10 h-full flex flex-col">
                <div className="flex justify-between items-center mb-10 shrink-0">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <ShieldCheck size={22} className="text-emerald-500" /> File d'Attente de Validation
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">{pendingMembers.length} En attente</span>
                  </div>
                </div>
                
                <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 flex-1">
                  {pendingMembers.length > 0 ? pendingMembers.map((req) => (
                    <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-emerald-100 transition-all gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-emerald-700 shadow-sm border border-slate-100">
                          {req.firstName[0]}{req.lastName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">{req.firstName} {req.lastName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{req.category} • {req.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 self-end sm:self-auto">
                         <button 
                           onClick={() => handleApproveMember(req.id)}
                           className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/10 active:scale-95 transition-all flex items-center gap-2 hover:bg-emerald-700"
                         >
                           <CheckCircle size={12} /> Approuver
                         </button>
                         <button 
                           onClick={() => handleRejectMember(req.id)}
                           className="p-2 text-slate-400 hover:text-rose-500 bg-white border border-slate-200 rounded-lg transition-colors hover:border-rose-200"
                           title="Rejeter"
                         >
                           <XCircle size={18}/>
                         </button>
                         <button className="p-2 text-slate-300 hover:text-blue-500 bg-white border border-slate-200 rounded-lg transition-colors hover:border-blue-200" title="Détails">
                           <Settings size={18}/>
                         </button>
                      </div>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400 h-full">
                       <UserCheck size={48} className="mb-4 opacity-20" />
                       <p className="text-xs font-bold uppercase">Aucune demande en attente</p>
                    </div>
                  )}
                </div>
                {pendingMembers.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-100 flex justify-center shrink-0">
                     <button onClick={() => setActiveAdminTab('members')} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                        Gérer tout le registre <ArrowRight size={12}/>
                     </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Summary Sectors */}
            <div className="lg:col-span-5 space-y-8">
              <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-50">Répartition Talibés</h4>
                 <div className="space-y-6 relative z-10">
                   {[
                     { l: 'Étudiants', v: 45, c: 'bg-emerald-400' },
                     { l: 'Travailleurs', v: 35, c: 'bg-blue-400' },
                     { l: 'Élèves', v: 20, c: 'bg-amber-400' },
                   ].map((sec, i) => (
                     <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase">
                          <span className="opacity-60">{sec.l}</span>
                          <span>{sec.v}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                           <div className={`h-full ${sec.c} transition-all duration-1000`} style={{ width: `${sec.v}%` }}></div>
                        </div>
                     </div>
                   ))}
                 </div>
                 <div className="absolute -right-10 -bottom-10 opacity-5 font-arabic text-[12rem] rotate-12 pointer-events-none">ت</div>
              </div>

              <div className="glass-card p-10 border-amber-100 bg-amber-50/20">
                <div className="flex items-center gap-3 mb-6 text-amber-700">
                   <Info size={22} />
                   <h4 className="font-black text-xs uppercase tracking-widest">Note de Direction</h4>
                </div>
                <p className="text-[13px] font-medium text-slate-700 leading-relaxed italic">
                  "Nous devons finaliser l'affectation des nouveaux talibés aux commissions avant la fin de la semaine pour le Magal. Priorité aux demandes en attente."
                </p>
                <div className="mt-6 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">FS</div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Fatou Sylla • Secrétaire Générale</p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: COMMISSION TEAM PROFILES */}
          <div className="glass-card p-8 bg-white border border-slate-100/50">
             <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-slate-50 pb-6">
                <div>
                   <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                      <BadgeCheck size={24} className="text-emerald-600"/> Bureau de la Commission
                   </h4>
                   <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2">Équipe en charge de l'Administration</p>
                </div>
                <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase border border-emerald-100">
                   {commissionTeam.length} Membres Affectés
                </span>
             </div>
             
             {commissionTeam.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {commissionTeam.map(member => {
                      const assignment = member.commissions.find(c => c.type === CommissionType.ADMINISTRATION);
                      const roleName = assignment ? assignment.role_commission : 'Membre';
                      
                      return (
                          <div key={member.id} className="p-6 rounded-[1.5rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 hover:border-emerald-100 transition-all group cursor-pointer relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-50 to-white rounded-bl-[3rem] -mr-4 -mt-4 transition-all group-hover:from-emerald-100 group-hover:to-emerald-50"></div>
                              
                              <div className="relative z-10">
                                  <div className="flex justify-between items-start mb-4">
                                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-emerald-700 font-black text-lg shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                          {member.firstName[0]}{member.lastName[0]}
                                      </div>
                                      <span className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                  </div>
                                  
                                  <h5 className="font-black text-slate-800 text-sm leading-tight mb-1">{member.firstName} {member.lastName}</h5>
                                  <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mb-4 bg-emerald-50 inline-block px-2 py-0.5 rounded">{roleName}</p>
                                  
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
                   <Users size={32} className="mb-3 opacity-30"/>
                   <p className="text-xs font-bold uppercase">Aucun membre assigné</p>
                   <p className="text-[10px] opacity-70 mt-1">Utilisez la gestion des talibés pour affecter des membres.</p>
                </div>
             )}
          </div>
        </div>
      )}

      {activeAdminTab === 'tracking' && <UnifiedAdminTracking />}
      {activeAdminTab === 'review' && <AdministrationReviewInterface />}
      {activeAdminTab === 'members' && <MemberManagementDashboard />}
      {activeAdminTab === 'meetings' && <MeetingManager />}
      {activeAdminTab === 'sectors' && <SectorCoordinator />}
      {activeAdminTab === 'documents' && <DocumentWorkflow />}
      {activeAdminTab === 'hub' && <CommunicationHub />}
    </div>
  );
};

export default AdministrationDashboard;
