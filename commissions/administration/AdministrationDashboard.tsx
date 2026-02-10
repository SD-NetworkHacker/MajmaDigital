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
// Fixed: AuthContext path updated to contexts/
import { useAuth } from '../../contexts/AuthContext';
import { CommissionType } from '../../types';

type QuickViewType = 'none' | 'members_active' | 'pvs_validated' | 'alerts' | 'recruitment';

const AdministrationDashboard: React.FC = () => {
  const [activeAdminTab, setActiveAdminTab] = useState('overview');
  const [quickView, setQuickView] = useState<QuickViewType>('none');
  
  const { members, updateMemberStatus, deleteMember, batchApproveMembers, reports } = useData();
  const { user } = useAuth();

  // 1. Identifier le rôle dans l'Administration
  const currentUserMember = useMemo(() => (members || []).find(m => m.email === user?.email), [members, user]);
  const myRole = useMemo(() => {
    return currentUserMember?.commissions?.find(c => c.type === CommissionType.ADMINISTRATION)?.role_commission || 'Membre';
  }, [currentUserMember]);

  // 2. Permissions
  const isExec = ['Secrétaire Général', 'Adjoint', 'Dieuwrine', 'Responsable'].some(r => myRole.includes(r));

  // --- DATA DERIVATION ---
  const activeMembers = useMemo(() => (members || []).filter(m => m.status === 'active'), [members]);
  const pendingMembers = useMemo(() => (members || []).filter(m => m.status === 'pending'), [members]);
  const validatedReports = useMemo(() => (reports || []).filter(r => ['valide_admin', 'approuve_bureau'].includes(r.status)), [reports]);
  
  // Mock des candidatures internes
  const applications = [
     { id: 1, member: 'Ibrahima Fall', target: CommissionType.ORGANISATION, date: 'Il y a 2h', msg: 'Expérience en logistique Magal.' },
     { id: 2, member: 'Aissatou Diop', target: CommissionType.SANTE, date: 'Hier', msg: 'Infirmière diplômée d\'état.' }
  ];

  const handleApproveMember = (id: string) => {
    if(confirm("Confirmer l'inscription de ce membre ?")) {
      updateMemberStatus(id, 'active');
    }
  };

  const handleBatchApprove = () => {
      const ids = pendingMembers.map(m => m.id);
      if(confirm(`Approuver les ${ids.length} inscriptions en attente ?`)) {
          if (batchApproveMembers) batchApproveMembers(ids);
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 'members_active', l: 'Effectif Actif', v: activeMembers.length, trend: `+${pendingMembers.length} attente`, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { id: 'recruitment', l: 'Candidatures', v: applications.length, trend: 'Pôles', icon: UserPlus, color: 'text-blue-600', bg: 'bg-blue-50' },
              { id: 'pvs_validated', l: 'PV Archivés', v: validatedReports.length, trend: 'Conformité', icon: FileCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
              { id: 'alerts', l: 'Alertes Système', v: '0', trend: 'Sécurité OK', icon: Bell, color: 'text-rose-600', bg: 'bg-rose-50' },
            ].map((stat, i) => (
              <button key={i} onClick={() => setQuickView(stat.id as QuickViewType)} className="glass-card p-8 group hover:-translate-y-1 transition-all text-left w-full border-2 border-transparent hover:border-slate-100 shadow-sm hover:shadow-lg">
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
            <div className="lg:col-span-7 space-y-6">
              <div className="glass-card p-10 h-full flex flex-col bg-white">
                  <div className="flex justify-between items-center mb-10 shrink-0">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                      <ShieldCheck size={22} className="text-emerald-500" /> Inscriptions à Valider
                    </h3>
                    {pendingMembers.length > 1 && isExec && (
                        <button onClick={handleBatchApprove} className="text-[10px] font-black text-emerald-600 hover:underline uppercase tracking-widest">Tout approuver</button>
                    )}
                  </div>
                  
                  <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 flex-1">
                      {pendingMembers.length > 0 ? pendingMembers.map((req) => (
                          <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-emerald-100 transition-all gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-emerald-700 shadow-sm border border-slate-100 uppercase">
                                  {req.firstName[0]}{req.lastName[0]}
                                </div>
                                <div>
                                  <p className="text-sm font-black text-slate-800">{req.firstName} {req.lastName}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{req.category} • {req.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 self-end sm:self-auto">
                                <button onClick={() => handleApproveMember(req.id)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md flex items-center gap-2 hover:bg-emerald-700 transition-all">
                                  <CheckCircle size={12} /> Approuver
                                </button>
                                <button onClick={() => handleRejectMember(req.id)} className="p-2 text-slate-400 hover:text-rose-500 bg-white border border-slate-200 rounded-lg hover:border-rose-200 transition-colors">
                                  <XCircle size={18}/>
                                </button>
                            </div>
                          </div>
                      )) : (
                          <div className="flex flex-col items-center justify-center py-20 text-slate-400 h-full">
                            <UserCheck size={48} className="mb-4 opacity-10" />
                            <p className="text-xs font-black uppercase tracking-widest">Aucune demande en attente</p>
                          </div>
                      )}
                  </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-8">
              <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-50">Rapport Sectoriel Global</h4>
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
                            <span>{count} ({percent}%)</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                             <div className={`h-full ${sec.c} transition-all duration-1000`} style={{ width: `${percent}%` }}></div>
                          </div>
                       </div>
                     );
                   })}
                 </div>
                 <div className="absolute -right-10 -bottom-10 opacity-5 font-arabic text-[12rem] rotate-12 pointer-events-none text-white">م</div>
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