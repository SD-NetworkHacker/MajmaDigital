import React, { useState, useMemo } from 'react';
import { 
  HeartPulse, Activity, Stethoscope, ShieldCheck, 
  Brain, Siren, LayoutDashboard, Bell, 
  ChevronRight, Apple, AlertCircle, Search, 
  Filter, Plus, Zap, TrendingUp, Lock, UserCheck,
  Wallet, FileText, BadgeCheck, Mail, User, ListTodo,
  ArrowLeft
} from 'lucide-react';
import WellnessProgram from './WellnessProgram';
import MedicalSupportHub from './MedicalSupportHub';
import MentalHealthSupport from './MentalHealthSupport';
import EmergencyResponse from './EmergencyResponse';
import CommissionFinancialDashboard from '../shared/CommissionFinancialDashboard';
import CommissionMeetingDashboard from '../shared/CommissionMeetingDashboard';
import FinancialOverviewWidget from '../shared/FinancialOverviewWidget';
import MeetingOverviewWidget from '../shared/MeetingOverviewWidget';
import TaskManager from '../../components/shared/TaskManager';
import { CommissionType } from '../../types';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

const HealthDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSecureMode, setIsSecureMode] = useState(false);
  const { members } = useData();
  const { user } = useAuth();

  // 1. Identifier le rôle dans la Santé
  const currentUserMember = useMemo(() => (members || []).find(m => m.email === user?.email), [members, user]);
  const myRole = useMemo(() => {
    return currentUserMember?.commissions?.find(c => c.type === CommissionType.SANTE)?.role_commission || 'Membre';
  }, [currentUserMember]);

  // 2. Permissions
  const isLeader = ['Dieuwrine', 'Adjoint', 'Secrétaire', 'Responsable'].some(r => myRole.includes(r));
  const isMedicalStaff = myRole.includes('Médecin') || myRole.includes('Infirmier') || myRole.includes('Sage-femme') || isLeader;

  const navItems = [
    { id: 'overview', label: 'Console Santé', icon: LayoutDashboard, access: true },
    { id: 'finance', label: 'Budget', icon: Wallet, access: isLeader },
    { id: 'meetings', label: 'Réunions', icon: FileText, access: isLeader },
    { id: 'tasks', label: 'Tâches', icon: ListTodo, access: true },
    { id: 'wellness', label: 'Bien-être & Challenges', icon: Apple, access: true },
    { id: 'support', label: 'Soutien Médical', icon: Stethoscope, access: isMedicalStaff },
    { id: 'mental', label: 'Santé Mentale', icon: Brain, access: isMedicalStaff },
    { id: 'emergency', label: 'Urgence Majma', icon: Siren, access: true },
  ];

  const visibleNavItems = navItems.filter(item => item.access);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      
      {/* Role Badge */}
      <div className="flex items-center gap-3 bg-teal-50/50 p-3 rounded-2xl border border-teal-100 w-fit">
         <span className="px-3 py-1 bg-teal-600 text-white text-[10px] font-black uppercase rounded-lg tracking-widest">
            Poste
         </span>
         <span className="text-xs font-bold text-teal-900">{myRole}</span>
         {isMedicalStaff && <span className="text-[10px] text-teal-600 flex items-center gap-1 font-black uppercase ml-2"><ShieldCheck size={10}/> Corps Médical</span>}
      </div>

      {/* Sub-Navigation Santé */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap gap-3 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 w-fit">
          {visibleNavItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === item.id ? 'bg-teal-600 text-white shadow-xl shadow-teal-900/10 border border-teal-500' : 'text-slate-400 hover:text-teal-600'
              }`}
            >
              <item.icon size={16} />
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </div>

        {isMedicalStaff && (
          <button 
            onClick={() => setIsSecureMode(!isSecureMode)}
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              isSecureMode ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
          >
            <Lock size={14} className={isSecureMode ? 'text-emerald-600' : 'text-slate-300'} />
            Mode Médical {isSecureMode ? 'Sécurisé' : 'Public'}
          </button>
        )}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Admin Widgets Row */}
          {isLeader && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <FinancialOverviewWidget commission={CommissionType.SANTE} onClick={() => setActiveTab('finance')} />
               <MeetingOverviewWidget commission={CommissionType.SANTE} onClick={() => setActiveTab('meetings')} />
               
               <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl"><Stethoscope size={20}/></div>
                     <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-2 py-1 rounded-lg">Live</span>
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Corps Médical</h4>
                     <p className="text-[10px] text-slate-400 font-bold">Actifs dans le réseau</p>
                  </div>
               </div>
               
               <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><Siren size={20}/></div>
                     <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">Prêt</span>
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Secourisme</h4>
                     <p className="text-[10px] text-slate-400 font-bold">Équipe d'urgence</p>
                  </div>
               </div>
            </div>
          )}

          {/* Vigilance Banner */}
          <div className="bg-gradient-to-br from-teal-600 via-emerald-800 to-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-16">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60 mb-4">Indice de Santé Communautaire</p>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">Vigilance <br/> <span className="text-emerald-300 italic">Optimale</span></h2>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-700">
                  <HeartPulse size={48} className="text-teal-200" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { l: 'Membres', v: '100%', trend: 'Suivis', color: 'text-teal-300' },
                  { l: 'Urgences', v: '0', trend: 'Actives', color: 'text-emerald-300' },
                  { l: 'Conseils', v: 'Active', trend: 'IA', color: 'text-teal-200' },
                  { l: 'Stock', v: 'OK', trend: 'Premier secours', color: 'text-white' }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/5">
                    <p className="text-[9px] font-black uppercase opacity-40 mb-2 tracking-widest">{item.l}</p>
                    <p className="text-xl font-black mb-1">{item.v}</p>
                    <span className={`text-[8px] font-bold ${item.color} bg-white/5 px-2 py-0.5 rounded-full`}>{item.trend}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 p-20 opacity-5 font-arabic text-[25rem] pointer-events-none rotate-12">ص</div>
          </div>
        </div>
      )}

      {activeTab === 'finance' && isLeader && <CommissionFinancialDashboard commission={CommissionType.SANTE} />}
      {activeTab === 'meetings' && isLeader && <CommissionMeetingDashboard commission={CommissionType.SANTE} />}
      {activeTab === 'tasks' && <TaskManager commission={CommissionType.SANTE} />}
      {activeTab === 'wellness' && <WellnessProgram />}
      {activeTab === 'support' && <MedicalSupportHub secureMode={isSecureMode} />}
      {activeTab === 'mental' && <MentalHealthSupport />}
      {activeTab === 'emergency' && <EmergencyResponse />}
    </div>
  );
};

export default HealthDashboard;
