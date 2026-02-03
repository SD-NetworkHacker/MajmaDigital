
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, Library, BookOpen, 
  History, Wallet, FileText, Music, Mic,
  BadgeCheck, Mail, ShieldCheck, User, ListTodo
} from 'lucide-react';
import CulturalCalendar from './CulturalCalendar';
import DigitalLibrary from './DigitalLibrary';
import KhassaideAcademy from './KhassaideAcademy';
import HeritageHub from './HeritageHub';
import CommissionFinancialDashboard from '../shared/CommissionFinancialDashboard';
import CommissionMeetingDashboard from '../shared/CommissionMeetingDashboard';
import FinancialOverviewWidget from '../shared/FinancialOverviewWidget';
import MeetingOverviewWidget from '../shared/MeetingOverviewWidget';
import TaskManager from '../../components/shared/TaskManager';
import { CommissionType } from '../../types';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../context/AuthContext';

const CulturalDashboard: React.FC = () => {
  const { members } = useData();
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'Super Admin';
  const [activeTab, setActiveTab] = useState(isAdmin ? 'overview' : 'library');

  // Filtrer les membres de la commission Culturelle
  const commissionTeam = useMemo(() => members.filter(m => 
    m.commissions.some(c => c.type === CommissionType.CULTURELLE)
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
    ...(isAdmin ? [
      { id: 'overview', label: 'Console Culture', icon: LayoutDashboard },
      { id: 'finance', label: 'Budget', icon: Wallet },
      { id: 'meetings', label: 'Réunions', icon: FileText },
      { id: 'tasks', label: 'Tâches', icon: ListTodo },
    ] : []),
    { id: 'library', label: 'Médiathèque', icon: Library },
    { id: 'calendar', label: 'Agenda', icon: Calendar },
    { id: 'academy', label: 'Académie', icon: BookOpen },
    { id: 'heritage', label: 'Patrimoine', icon: History },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Navigation */}
      <div className="flex flex-wrap gap-3 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 w-fit">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/10 border border-indigo-500' : 'text-slate-400 hover:text-indigo-600'
            }`}
          >
            <item.icon size={16} />
            <span className="hidden md:inline">{item.label}</span>
          </button>
        ))}
      </div>

      {isAdmin && activeTab === 'overview' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Admin Widgets Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <FinancialOverviewWidget commission={CommissionType.CULTURELLE} onClick={() => setActiveTab('finance')} />
             <MeetingOverviewWidget commission={CommissionType.CULTURELLE} onClick={() => setActiveTab('meetings')} />
             
             {/* Culture Specific Stats */}
             <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><BookOpen size={20}/></div>
                   <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">0</span>
                </div>
                <div>
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Ressources</h4>
                   <p className="text-[10px] text-slate-400 font-bold">Ajoutées ce mois</p>
                </div>
             </div>
             
             <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Music size={20}/></div>
                   <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">--%</span>
                </div>
                <div>
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Veillées</h4>
                   <p className="text-[10px] text-slate-400 font-bold">Taux participation</p>
                </div>
             </div>
          </div>

          {/* Hero Banner */}
          <div className="bg-gradient-to-br from-indigo-800 to-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-16">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60 mb-4">Commission Culturelle</p>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                    Rayonnement <br/> <span className="text-indigo-400 italic">Spirituel</span>
                  </h2>
                </div>
                <div className="p-5 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-inner">
                  <Library size={48} className="text-indigo-200" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {[
                   { l: 'Bibliothèque', v: '0', trend: 'Ouvrages', color: 'text-indigo-300' },
                   { l: 'Apprenants', v: '0', trend: 'Actifs', color: 'text-emerald-300' },
                   { l: 'Événements', v: '0', trend: 'Annuels', color: 'text-amber-200' },
                   { l: 'Archives', v: '0', trend: 'Numérisées', color: 'text-blue-200' }
                 ].map((item, i) => (
                   <div key={i} className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/5">
                     <p className="text-[9px] font-black uppercase opacity-40 mb-2 tracking-widest">{item.l}</p>
                     <p className="text-xl font-black mb-1">{item.v}</p>
                     <span className={`text-[8px] font-bold ${item.color} bg-white/5 px-2 py-0.5 rounded-full`}>{item.trend}</span>
                   </div>
                 ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 p-20 opacity-5 font-arabic text-[25rem] pointer-events-none rotate-12">ف</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             <div className="lg:col-span-8">
                <CulturalCalendar />
             </div>
             <div className="lg:col-span-4 space-y-8">
                <div className="glass-card p-10 bg-white">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                      <Mic size={18} className="text-indigo-500" /> Podcast de la Semaine
                   </h4>
                   <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 text-center">
                      <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-md text-indigo-600">
                         <Music size={32} />
                      </div>
                      <h5 className="font-black text-slate-800 text-sm mb-1">Aucun épisode</h5>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-6">-- min</p>
                      <button className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-transform">Écouter</button>
                   </div>
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
                      const roleA = a.commissions.find(c => c.type === CommissionType.CULTURELLE)?.role_commission || '';
                      const roleB = b.commissions.find(c => c.type === CommissionType.CULTURELLE)?.role_commission || '';
                      return getRolePriority(roleA) - getRolePriority(roleB);
                  }).map(member => {
                      const assignment = member.commissions.find(c => c.type === CommissionType.CULTURELLE);
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

      {/* Admin Modules */}
      {isAdmin && activeTab === 'finance' && <CommissionFinancialDashboard commission={CommissionType.CULTURELLE} />}
      {isAdmin && activeTab === 'meetings' && <CommissionMeetingDashboard commission={CommissionType.CULTURELLE} />}
      {isAdmin && activeTab === 'tasks' && <TaskManager commission={CommissionType.CULTURELLE} />}
      
      {/* Public/Member Modules */}
      {activeTab === 'calendar' && <CulturalCalendar />}
      {activeTab === 'library' && <DigitalLibrary />}
      {activeTab === 'academy' && <KhassaideAcademy />}
      {activeTab === 'heritage' && <HeritageHub />}
    </div>
  );
};

export default CulturalDashboard;
