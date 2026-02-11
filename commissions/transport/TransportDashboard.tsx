import React, { useState, useMemo, useEffect } from 'react';
import { 
  Bus, Map, Users, Ticket, Wrench, LayoutDashboard, Wallet, FileText,
  Navigation, Calendar, BadgeCheck, Mail, ShieldCheck, User, ArrowLeft,
  ListTodo, MapPin, Clock, Search, QrCode, Download, Trash2, Printer,
  Activity, Fuel, AlertTriangle, Radar, Plus, ClipboardCheck, Lock, Zap
} from 'lucide-react';
import FleetManager from './FleetManager';
import TripScheduler from './TripScheduler';
import ReservationConsole from './ReservationConsole';
import TicketingManager from './TicketingManager';
import DriverRoster from './DriverRoster';
import LiveConvoys from './LiveConvoys';
import TransportStats from './TransportStats';
import TripPlannerWizard from './TripPlannerWizard';
import VehicleInspectionModal from './VehicleInspectionModal';
import CommissionFinancialDashboard from '../shared/CommissionFinancialDashboard';
import CommissionMeetingDashboard from '../shared/CommissionMeetingDashboard';
import FinancialOverviewWidget from '../shared/FinancialOverviewWidget';
import MeetingOverviewWidget from '../shared/MeetingOverviewWidget';
import TaskManager from '../../components/shared/TaskManager';
import { CommissionType, TransportSchedule } from '../../types';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

const TransportDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { members } = useData();
  const { user } = useAuth();

  // 1. Identifier le rôle dans le Transport
  const currentUserMember = useMemo(() => (members || []).find(m => m.email === user?.email), [members, user]);
  const myRole = useMemo(() => {
    return currentUserMember?.commissions?.find(c => c.type === CommissionType.TRANSPORT)?.role_commission || 'Membre';
  }, [currentUserMember]);

  // 2. Permissions
  const isLeader = ['Dieuwrine', 'Adjoint', 'Secrétaire', 'Responsable'].some(r => myRole.includes(r));
  const isOpsTeam = myRole.includes('Logistique') || myRole.includes('Régulateur') || isLeader;

  const navItems = [
    { id: 'overview', label: 'Console Mobilité', icon: LayoutDashboard, access: true },
    { id: 'finance', label: 'Budget', icon: Wallet, access: isLeader },
    { id: 'meetings', label: 'Réunions', icon: FileText, access: isLeader },
    { id: 'tasks', label: 'Tâches', icon: ListTodo, access: true },
    { id: 'fleet', label: 'Flotte & Parc', icon: Bus, access: isOpsTeam },
    { id: 'trips', label: 'Planning Convois', icon: Navigation, access: true },
    { id: 'ticketing', label: 'Billetterie', icon: Ticket, access: isOpsTeam },
    { id: 'drivers', label: 'Chauffeurs', icon: User, access: isOpsTeam },
    { id: 'live', label: 'Live Tracking', icon: Radar, access: true },
    { id: 'stats', label: 'Coûts & ROI', icon: Activity, access: isLeader },
  ];

  const visibleNavItems = navItems.filter(item => item.access);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      
      {/* Role Badge */}
      <div className="flex items-center gap-3 bg-orange-50/50 p-3 rounded-2xl border border-orange-100 w-fit">
         <span className="px-3 py-1 bg-orange-600 text-white text-[10px] font-black uppercase rounded-lg tracking-widest">
            Poste
         </span>
         <span className="text-xs font-bold text-orange-900">{myRole}</span>
         {isOpsTeam && <span className="text-[10px] text-orange-600 flex items-center gap-1 font-black uppercase"><Zap size={10}/> Ops Team</span>}
      </div>

      {/* Sub-Navigation Transport */}
      <div className="flex flex-wrap gap-3 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 w-fit">
        {visibleNavItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === item.id ? 'bg-orange-600 text-white shadow-xl shadow-orange-900/10 border border-orange-500' : 'text-slate-400 hover:text-orange-600'
            }`}
          >
            <item.icon size={16} />
            <span className="hidden md:inline">{item.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {isLeader && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <FinancialOverviewWidget commission={CommissionType.TRANSPORT} onClick={() => setActiveTab('finance')} />
               <MeetingOverviewWidget commission={CommissionType.TRANSPORT} onClick={() => setActiveTab('meetings')} />
               <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Bus size={20}/></div>
                     <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">Prêt</span>
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Véhicules</h4>
                     <p className="text-[10px] text-slate-400 font-bold">Disponibles ce jour</p>
                  </div>
               </div>
               <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Ticket size={20}/></div>
                     <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">94%</span>
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Remplissage</h4>
                     <p className="text-[10px] text-slate-400 font-bold">Moyenne des convois</p>
                  </div>
               </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-orange-600 via-orange-700 to-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-16">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60 mb-4">Logistique de Mobilité</p>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">Convois <br/> <span className="text-orange-300 italic">Touba</span></h2>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-inner">
                  <Bus size={48} className="text-orange-200" />
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-20 opacity-5 font-arabic text-[25rem] pointer-events-none rotate-12">ص</div>
          </div>
        </div>
      )}

      {activeTab === 'finance' && isLeader && <CommissionFinancialDashboard commission={CommissionType.TRANSPORT} />}
      {activeTab === 'meetings' && isLeader && <CommissionMeetingDashboard commission={CommissionType.TRANSPORT} />}
      {activeTab === 'tasks' && <TaskManager commission={CommissionType.TRANSPORT} />}
      {activeTab === 'fleet' && <FleetManager />}
      {activeTab === 'trips' && <TripScheduler />}
      {activeTab === 'ticketing' && <TicketingManager />}
      {activeTab === 'drivers' && <DriverRoster />}
      {activeTab === 'live' && <LiveConvoys />}
      {activeTab === 'stats' && <TransportStats />}
    </div>
  );
};

export default TransportDashboard;