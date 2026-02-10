import React, { useState, useMemo } from 'react';
import { 
  Heart, Users, Calendar, Sparkles, Smile, Target, 
  TrendingUp, LayoutDashboard, History, Book, 
  Zap, UserCheck, ShieldCheck, Activity, Wallet, FileText,
  BadgeCheck, Mail, User, ArrowLeft, ListTodo, Lock
} from 'lucide-react';
import SocialCalendar from './SocialCalendar';
import CommunityBuilder from './CommunityBuilder';
import EventAnimator from './EventAnimator';
import WellbeingTracker from './WellbeingTracker';
import CulturalHeritage from './CulturalHeritage';
import CommissionFinancialDashboard from '../shared/CommissionFinancialDashboard';
import CommissionMeetingDashboard from '../shared/CommissionMeetingDashboard';
import FinancialOverviewWidget from '../shared/FinancialOverviewWidget';
import MeetingOverviewWidget from '../shared/MeetingOverviewWidget';
import TaskManager from '../../components/shared/TaskManager';
import { CommissionType } from '../../types';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../context/AuthContext';

const SocialDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { members } = useData();
  const { user } = useAuth();

  // 1. Identifier le rôle dans le Social
  const currentUserMember = useMemo(() => (members || []).find(m => m.email === user?.email), [members, user]);
  const myRole = useMemo(() => {
    return currentUserMember?.commissions?.find(c => c.type === CommissionType.SOCIAL)?.role_commission || 'Membre';
  }, [currentUserMember]);

  // 2. Permissions
  const isLeader = ['Dieuwrine', 'Adjoint', 'Secrétaire', 'Responsable'].some(r => myRole.includes(r));
  const isCasSociaux = myRole.includes('Cas Sociaux') || isLeader; // Accès aux dossiers confidentiels
  const isAnimator = myRole.includes('Animation') || isLeader;

  const commissionTeam = useMemo(() => (members || []).filter(m => 
    m.commissions?.some(c => c.type === CommissionType.SOCIAL)
  ), [members]);

  const navItems = [
    { id: 'overview', label: 'Console Fraternité', icon: LayoutDashboard, access: true },
    // Fixed: Corrected double 'id' property definition
    { id: 'finance', label: 'Budget Social', icon: Wallet, access: isLeader },
    { id: 'meetings', label: 'Réunions', icon: FileText, access: isLeader },
    { id: 'tasks', label: 'Tâches', icon: ListTodo, access: true },
    { id: 'calendar', label: 'Activités & Sorties', icon: Calendar, access: true },
    { id: 'builder', label: 'Groupes & Mentorat', icon: Users, access: true },
    { id: 'animator', label: 'Boîte à Idées', icon: Zap, access: isAnimator },
    { id: 'wellbeing', label: 'Bien-être & Confidentialité', icon: Activity, access: isCasSociaux }, // Restreint
    { id: 'heritage', label: 'Patrimoine & Valeurs', icon: Book, access: true },
  ];

  const visibleNavItems = navItems.filter(item => item.access);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Role Badge */}
      <div className="flex items-center gap-3 bg-rose-50/50 p-3 rounded-2xl border border-rose-100 w-fit">
         <span className="px-3 py-1 bg-rose-600 text-white text-[10px] font-black uppercase rounded-lg tracking-widest">
            Poste
         </span>
         <span className="text-xs font-bold text-rose-900">{myRole}</span>
         {isCasSociaux && <span className="text-[10px] text-rose-600 flex items-center gap-1 font-black uppercase"><ShieldCheck size={10}/> Accès Confidentiel</span>}
      </div>

      {/* Sub-Navigation Social */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
        <div className="flex flex-wrap gap-3 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 w-fit">
          {visibleNavItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === item.id ? 'bg-rose-600 text-white shadow-xl shadow-rose-900/10 border border-rose-500' : 'text-slate-400 hover:text-rose-600'
              }`}
            >
              <item.icon size={16} />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Back Button for Sub-Modules */}
        {activeTab !== 'overview' && (
          <button 
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all shadow-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="uppercase text-[10px] tracking-widest">Retour Fraternité</span>
          </button>
        )}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Admin Widgets Row */}
          {isLeader && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <FinancialOverviewWidget commission={CommissionType.SOCIAL} onClick={() => setActiveTab('finance')} />
               <MeetingOverviewWidget commission={CommissionType.SOCIAL} onClick={() => setActiveTab('meetings')} />
               
               <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><Users size={20}/></div>
                     <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">0</span>
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Nouveaux Membres</h4>
                     <p className="text-[10px] text-slate-400 font-bold">À parrainer ce mois</p>
                  </div>
               </div>
               
               <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Smile size={20}/></div>
                     <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">--%</span>
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Satisfaction</h4>
                     <p className="text-[10px] text-slate-400 font-bold">En attente de données</p>
                  </div>
               </div>
            </div>
          )}

          {/* Social Health Banner */}
          <div className="bg-gradient-to-br from-rose-600 via-rose-700 to-rose-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-16">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60 mb-4">Indice de Cohésion Globale</p>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter">--<span className="text-2xl opacity-30 font-bold ml-2">%</span></h2>
                  <p className="text-rose-100/60 mt-4 text-sm font-medium">L'index sera calculé après les premières activités.</p>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-inner">
                  <ShieldCheck size={48} className="text-rose-200" />
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-20 opacity-5 font-arabic text-[25rem] pointer-events-none rotate-12">ح</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Live Social Feed & Alerts */}
            <div className="lg:col-span-8 space-y-8">
               <div className="glass-card p-10 h-full flex flex-col justify-center items-center text-center">
                  <div className="flex justify-between items-center mb-10 w-full">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                      <Zap size={22} className="text-rose-500" /> Pulse de la Communauté
                    </h3>
                    {isCasSociaux && <div className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[9px] font-black uppercase">Aucune alerte confidentielle</div>}
                  </div>
                  
                  <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                     <Heart size={48} className="mb-4 opacity-20"/>
                     <p className="text-xs font-bold uppercase">Aucune activité sociale récente</p>
                  </div>
               </div>
            </div>

            {/* Sidebar Stats */}
            <div className="lg:col-span-4 space-y-8">
               <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-50">Participation par Secteur</h4>
                  <div className="space-y-6 relative z-10">
                    {[
                      { l: 'Étudiants', v: 0, c: 'bg-rose-500' },
                      { l: 'Travailleurs', v: 0, c: 'bg-emerald-500' },
                      { l: 'Élèves', v: 0, c: 'bg-blue-500' },
                    ].map((stat, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                           <span className="opacity-50">{stat.l}</span>
                           <span>{stat.v}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                           <div className={`h-full ${stat.c} transition-all duration-1000`} style={{ width: `${stat.v}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'finance' && isLeader && <CommissionFinancialDashboard commission={CommissionType.SOCIAL} />}
      {activeTab === 'meetings' && isLeader && <CommissionMeetingDashboard commission={CommissionType.SOCIAL} />}
      {activeTab === 'tasks' && <TaskManager commission={CommissionType.SOCIAL} />}
      {activeTab === 'calendar' && <SocialCalendar />}
      {activeTab === 'builder' && <CommunityBuilder />}
      {activeTab === 'animator' && isAnimator && <EventAnimator />}
      {activeTab === 'wellbeing' && isCasSociaux && <WellbeingTracker />}
      {activeTab === 'heritage' && <CulturalHeritage />}
    </div>
  );
};

export default SocialDashboard;