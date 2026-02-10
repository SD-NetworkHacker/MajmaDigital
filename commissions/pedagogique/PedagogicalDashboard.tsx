import React, { useState, useMemo } from 'react';
import { 
  BookOpen, GraduationCap, School, Briefcase, 
  Target, LayoutDashboard, Library, Users, 
  Award, TrendingUp, Sparkles, Zap, ChevronRight,
  ShieldCheck, Brain, Wallet, FileText, BadgeCheck, Mail, User, ListTodo, Lock
} from 'lucide-react';
import SpiritualCurriculum from './common/SpiritualCurriculum';
import LearningResources from './common/LearningResources';
import StudyGroupManager from './common/StudyGroupManager';
import StudentSectorHub from './sectors/StudentSectorHub';
import UniversitySectorHub from './sectors/UniversitySectorHub';
import ProfessionalSectorHub from './sectors/ProfessionalSectorHub';
import CommissionFinancialDashboard from '../shared/CommissionFinancialDashboard';
import CommissionMeetingDashboard from '../shared/CommissionMeetingDashboard';
import FinancialOverviewWidget from '../shared/FinancialOverviewWidget';
import MeetingOverviewWidget from '../shared/MeetingOverviewWidget';
import TaskManager from '../../components/shared/TaskManager';
import { CommissionType } from '../../types';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../context/AuthContext';

const PedagogicalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSector, setSelectedSector] = useState<'eleves' | 'etudiants' | 'travailleurs'>('etudiants');
  const { members } = useData();
  const { user } = useAuth();

  // 1. Identifier le rôle dans la Pédagogie
  const currentUserMember = useMemo(() => (members || []).find(m => m.email === user?.email), [members, user]);
  const myRole = useMemo(() => {
    return currentUserMember?.commissions?.find(c => c.type === CommissionType.PEDAGOGIQUE)?.role_commission || 'Membre';
  }, [currentUserMember]);

  // 2. Permissions
  const isLeader = ['Dieuwrine', 'Adjoint', 'Secrétaire', 'Responsable'].some(r => myRole.includes(r));
  const isTeacher = myRole.includes('Oustaz') || myRole.includes('Enseignant') || myRole.includes('Formateur') || isLeader;

  // Filtrer les membres de la commission Pédagogique
  const commissionTeam = useMemo(() => (members || []).filter(m => 
    m.commissions?.some(c => c.type === CommissionType.PEDAGOGIQUE)
  ), [members]);

  const navItems = [
    { id: 'overview', label: 'Console Savoir', icon: LayoutDashboard, access: true },
    { id: 'finance', label: 'Budget', icon: Wallet, access: isLeader },
    { id: 'meetings', label: 'Réunions', icon: FileText, access: isLeader },
    { id: 'tasks', label: 'Tâches', icon: ListTodo, access: true },
    { id: 'curriculum', label: 'Parcours Spirituel', icon: Award, access: true },
    { id: 'resources', label: 'Médiathèque', icon: Library, access: true },
    { id: 'groups', label: 'Groupes d\'Étude', icon: Users, access: true },
    { id: 'sector', label: 'Espace Sectoriel', icon: Brain, access: true },
  ];

  const visibleNavItems = navItems.filter(item => item.access);

  const sectorConfig = {
    eleves: { label: 'Pôle Élèves', icon: School, color: 'bg-amber-500' },
    etudiants: { label: 'Pôle Étudiants', icon: GraduationCap, color: 'bg-emerald-500' },
    travailleurs: { label: 'Pôle Travailleurs', icon: Briefcase, color: 'bg-blue-500' },
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Role Badge */}
      <div className="flex items-center gap-3 bg-cyan-50/50 p-3 rounded-2xl border border-cyan-100 w-fit">
         <span className="px-3 py-1 bg-cyan-600 text-white text-[10px] font-black uppercase rounded-lg tracking-widest">
            Poste
         </span>
         <span className="text-xs font-bold text-cyan-900">{myRole}</span>
         {isTeacher && <span className="text-[10px] text-cyan-600 flex items-center gap-1 font-black uppercase"><BookOpen size={10}/> Corps Enseignant</span>}
      </div>

      {/* Sector Switcher and Main Navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap gap-3 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 w-fit">
          {visibleNavItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === item.id ? 'bg-cyan-600 text-white shadow-xl shadow-cyan-900/10 border border-cyan-500' : 'text-slate-400 hover:text-cyan-600'
              }`}
            >
              <item.icon size={16} />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200">
           {(Object.keys(sectorConfig) as Array<keyof typeof sectorConfig>).map(s => {
             const Icon = sectorConfig[s].icon;
             return (
              <button 
                key={s} 
                onClick={() => setSelectedSector(s)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${
                  selectedSector === s ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'
                }`}
              >
                <Icon size={14} className={selectedSector === s ? 'text-cyan-500' : ''} /> {sectorConfig[s].label}
              </button>
             )
           })}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Admin Widgets Row */}
          {isLeader && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <FinancialOverviewWidget commission={CommissionType.PEDAGOGIQUE} onClick={() => setActiveTab('finance')} />
               <MeetingOverviewWidget commission={CommissionType.PEDAGOGIQUE} onClick={() => setActiveTab('meetings')} />
               
               {/* Pedagogic Specific Stats */}
               <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl"><BookOpen size={20}/></div>
                     <span className="text-[10px] font-black text-slate-300 bg-slate-50 px-2 py-1 rounded-lg">--</span>
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Mémorisation</h4>
                     <p className="text-[10px] text-slate-400 font-bold">Kurel {sectorConfig[selectedSector].label}</p>
                  </div>
               </div>
               
               <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Award size={20}/></div>
                     <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">0</span>
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Certifiés</h4>
                     <p className="text-[10px] text-slate-400 font-bold">Ce mois-ci</p>
                  </div>
               </div>
            </div>
          )}

          {/* Academy Header */}
          <div className="bg-gradient-to-br from-cyan-700 via-sky-800 to-indigo-950 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-16">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60 mb-4">Académie Majma : {sectorConfig[selectedSector].label}</p>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                    Excellence <br/> <span className="text-cyan-400 italic">Spirituelle</span>
                  </h2>
                </div>
                <div className="p-5 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-inner">
                  <BookOpen size={48} className="text-cyan-200" />
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-20 opacity-5 font-arabic text-[25rem] pointer-events-none rotate-12">ع</div>
          </div>
        </div>
      )}

      {activeTab === 'finance' && isLeader && <CommissionFinancialDashboard commission={CommissionType.PEDAGOGIQUE} />}
      {activeTab === 'meetings' && isLeader && <CommissionMeetingDashboard commission={CommissionType.PEDAGOGIQUE} />}
      {activeTab === 'tasks' && <TaskManager commission={CommissionType.PEDAGOGIQUE} />}
      {activeTab === 'curriculum' && <SpiritualCurriculum sector={selectedSector} />}
      {activeTab === 'resources' && <LearningResources sector={selectedSector} />}
      {activeTab === 'groups' && <StudyGroupManager sector={selectedSector} />}
      {activeTab === 'sector' && (
        <>
          {selectedSector === 'eleves' && <StudentSectorHub />}
          {selectedSector === 'etudiants' && <UniversitySectorHub />}
          {selectedSector === 'travailleurs' && <ProfessionalSectorHub />}
        </>
      )}
    </div>
  );
};

export default PedagogicalDashboard;