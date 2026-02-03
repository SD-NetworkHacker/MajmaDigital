
import React, { useState, useMemo } from 'react';
import { 
  Users, Calendar, Briefcase, FileCheck, Megaphone, 
  LayoutDashboard, ShieldCheck, Settings, Activity, 
  Bell, Info, Radar, CheckCircle, XCircle, ChevronRight, 
  UserCheck, ArrowRight, BadgeCheck, Mail, Phone, ArrowLeft,
  ListTodo, Lock, UserPlus, Inbox
} from 'lucide-react';
import MemberManagementDashboard from './MemberManagementDashboard';
import MeetingManager from './MeetingManager';
import SectorCoordinator from './SectorCoordinator';
import DocumentWorkflow from './DocumentWorkflow';
import CommunicationHub from './CommunicationHub';
import AdministrationReviewInterface from './AdministrationReviewInterface';
import UnifiedAdminTracking from './UnifiedAdminTracking';
import TaskManager from '../../components/shared/TaskManager';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../context/AuthContext';
import { getReportsByStatus } from '../../services/reportService';
import { CommissionType } from '../../types';

type QuickViewType = 'none' | 'members_active' | 'pvs_validated' | 'alerts' | 'recruitment';

const AdministrationDashboard: React.FC = () => {
  const [activeAdminTab, setActiveAdminTab] = useState('overview');
  const [quickView, setQuickView] = useState<QuickViewType>('none');
  
  const { members, updateMemberStatus, deleteMember } = useData();
  const { user } = useAuth();

  // 1. Identifier le rôle dans l'Administration
  const currentUserMember = useMemo(() => members.find(m => m.email === user?.email), [members, user]);
  const myRole = useMemo(() => {
    return currentUserMember?.commissions.find(c => c.type === CommissionType.ADMINISTRATION)?.role_commission || 'Membre';
  }, [currentUserMember]);

  // 2. Permissions
  const isExec = ['Secrétaire Général', 'Adjoint', 'Dieuwrine', 'Responsable'].some(r => myRole.includes(r));

  // --- DATA DERIVATION ---
  const activeMembers = useMemo(() => members.filter(m => m.status === 'active'), [members]);
  const pendingMembers = useMemo(() => members.filter(m => m.status === 'pending'), [members]);
  const validatedReports = useMemo(() => getReportsByStatus(['valide_admin', 'approuve_bureau']), []);
  
  // Mock des candidatures internes (Simule les demandes envoyées depuis le MemberDashboard)
  const applications = [
     { id: 1, member: 'Ibrahima Fall', target: CommissionType.ORGANISATION, date: 'Il y a 2h', msg: 'Expérience en logistique Magal.' },
     { id: 2, member: 'Aissatou Diop', target: CommissionType.SANTE, date: 'Hier', msg: 'Infirmière diplômée d\'état.' },
     { id: 3, member: 'Moussa Seck', target: CommissionType.COMMUNICATION, date: '12 Mars', msg: 'Compétences en montage vidéo.' }
  ];

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
    { id: 'overview', label: 'Console Centrale', icon: LayoutDashboard, access: true },
    { id: 'tracking', label: 'Suivi des Commissions', icon: Radar, access: isExec },
    { id: 'tasks', label: 'Tâches & Suivi', icon: ListTodo, access: true },
    { id: 'review', label: 'Revue des PV', icon: FileCheck, access: isExec },
    { id: 'members', label: 'Gestion Talibés', icon: Users, access: isExec },
    { id: 'meetings', label: 'Instances & PV', icon: Calendar, access: isExec },
    { id: 'sectors', label: 'Coord. Secteurs', icon: Briefcase, access: true },
    { id: 'documents', label: 'Workflows Doc', icon: FileCheck, access: isExec },
    { id: 'hub', label: 'Admin Hub', icon: Megaphone, access: true },
  ];

  const visibleNavItems = navItems.filter(item => item.access);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Role Indicator */}
      <div className="flex items-center gap-3 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100 w-fit">
         <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-lg tracking-widest">
            Poste
         </span>
         <span className="text-xs font-bold text-emerald-900">{myRole}</span>
         {isExec && <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-black uppercase"><ShieldCheck size={10}/> Accès Exécutif</span>}
      </div>

      {/* Sub-Navigation Admin */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
        <div className="flex flex-wrap gap-3 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 w-fit">
          {visibleNavItems.map(item => (
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
        
        {/* Back Button for Sub-Modules */}
        {activeAdminTab !== 'overview' && (
          <button 
            onClick={() => setActiveAdminTab('overview')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all shadow-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="uppercase text-[10px] tracking-widest">Retour Vue Globale</span>
          </button>
        )}
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
                id: 'recruitment', 
                l: 'Candidatures', 
                v: applications.length.toString(), 
                trend: 'Membres -> Actifs', 
                icon: UserPlus, 
                color: 'text-blue-600', 
                bg: 'bg-blue-50',
                borderColor: quickView === 'recruitment' ? 'border-blue-500' : 'border-transparent'
              },
              { 
                id: 'pvs_validated', 
                l: 'PV Validés', 
                v: validatedReports.length.toString(), 
                trend: 'Conformité', 
                icon: FileCheck, 
                color: 'text-purple-600', 
                bg: 'bg-purple-50',
                borderColor: quickView === 'pvs_validated' ? 'border-purple-500' : 'border-transparent'
              },
              { 
                id: 'alerts', 
                l: 'Alertes Admin', 
                v: '00', 
                trend: 'Système sain', 
                icon: Bell, 
                color: 'text-rose-600', 
                bg: 'bg-rose-50',
                borderColor: quickView === 'alerts' ? 'border-rose-500' : 'border-transparent'
              },
            ].map((stat, i) => (
              <button 
                key={i} 
                onClick={() => setQuickView(stat.id === quickView ? 'none' : stat.id as QuickViewType)}
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
            
            {/* Dynamic Content Area */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* RECRUITMENT QUICK VIEW */}
              {quickView === 'recruitment' && (
                <div className="glass-card p-8 bg-blue-50/50 border-blue-100 animate-in fade-in slide-in-from-top-4">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-black text-blue-900 flex items-center gap-2"><UserPlus size={20}/> Candidatures Internes</h3>
                      <button onClick={() => setQuickView('none')} className="p-2 hover:bg-blue-100 rounded-full text-blue-600"><XCircle size={20}/></button>
                   </div>
                   <div className="space-y-3">
                      {applications.map(app => (
                        <div key={app.id} className="p-4 bg-white rounded-xl border border-blue-100 shadow-sm flex flex-col gap-2">
                           <div className="flex justify-between items-start">
                              <span className="text-xs font-black text-slate-800">{app.member}</span>
                              <span className="text-[9px] font-bold text-slate-400">{app.date}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="text-[9px] uppercase font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Vers {app.target}</span>
                           </div>
                           <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg">"{app.msg}"</p>
                           <div className="flex gap-2 mt-1">
                              <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase">Accepter</button>
                              <button className="px-3 py-2 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase">Refuser</button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* Default View: Validation Queue */}
              {quickView === 'none' && (
                <div className="glass-card p-10 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-10 shrink-0">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                      <ShieldCheck size={22} className="text-emerald-500" /> File d'Attente de Validation
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">{pendingMembers.length} En attente</span>
                    </div>
                  </div>
                  
                  {isExec ? (
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
                          </div>
                          </div>
                      )) : (
                          <div className="flex flex-col items-center justify-center py-12 text-slate-400 h-full">
                          <UserCheck size={48} className="mb-4 opacity-20" />
                          <p className="text-xs font-bold uppercase">Aucune demande en attente</p>
                          </div>
                      )}
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-300 border-2 border-dashed border-slate-100 rounded-2xl">
                          <Lock size={32} className="mb-2"/>
                          <p className="text-xs font-bold uppercase">Accès restreint</p>
                      </div>
                  )}
                  
                  {pendingMembers.length > 0 && isExec && (
                    <div className="mt-6 pt-6 border-t border-slate-100 flex justify-center shrink-0">
                       <button onClick={() => setActiveAdminTab('members')} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                          Gérer tout le registre <ArrowRight size={12}/>
                       </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Summary Sectors */}
            <div className="lg:col-span-5 space-y-8">
              <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-50">Répartition Talibés</h4>
                 <div className="space-y-6 relative z-10">
                   {[
                     { l: 'Étudiants', cat: 'Étudiant', c: 'bg-emerald-400' },
                     { l: 'Travailleurs', cat: 'Travailleur', c: 'bg-blue-400' },
                     { l: 'Élèves', cat: 'Élève', c: 'bg-amber-400' },
                   ].map((sec, i) => {
                     const count = activeMembers.filter(m => m.category === sec.cat).length;
                     const percent = activeMembers.length > 0 ? Math.round((count / activeMembers.length) * 100) : 0;
                     return (
                       <div key={i} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase">
                            <span className="opacity-60">{sec.l}</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                             <div className={`h-full ${sec.c} transition-all duration-1000`} style={{ width: `${percent}%` }}></div>
                          </div>
                       </div>
                     );
                   })}
                 </div>
                 <div className="absolute -right-10 -bottom-10 opacity-5 font-arabic text-[12rem] rotate-12 pointer-events-none">ت</div>
              </div>

              {/* Commission Applications Teaser (Visual) */}
              <div className="glass-card p-6 bg-white border border-slate-100">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Inbox size={14}/> Dernières Candidatures</h4>
                 <div className="space-y-2">
                    {applications.slice(0, 2).map((app, i) => (
                       <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-black text-[10px] text-slate-500 border border-slate-100">
                                {app.member.charAt(0)}
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-slate-800">{app.member}</p>
                                <p className="text-[8px] text-slate-400 uppercase">{app.target}</p>
                             </div>
                          </div>
                          <span className="text-[8px] font-bold text-slate-400">{app.date}</span>
                       </div>
                    ))}
                 </div>
                 <button onClick={() => setQuickView('recruitment')} className="w-full mt-4 py-2 border border-dashed border-slate-200 text-slate-400 rounded-xl text-[10px] font-bold uppercase hover:bg-slate-50 transition-all">Voir tout</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'tracking' && isExec && <UnifiedAdminTracking />}
      {activeAdminTab === 'review' && isExec && <AdministrationReviewInterface />}
      {activeAdminTab === 'tasks' && <TaskManager commission={CommissionType.ADMINISTRATION} />}
      {activeAdminTab === 'members' && isExec && <MemberManagementDashboard />}
      {activeAdminTab === 'meetings' && isExec && <MeetingManager />}
      {activeAdminTab === 'sectors' && <SectorCoordinator />}
      {activeAdminTab === 'documents' && isExec && <DocumentWorkflow />}
      {activeAdminTab === 'hub' && <CommunicationHub />}
    </div>
  );
};

export default AdministrationDashboard;
