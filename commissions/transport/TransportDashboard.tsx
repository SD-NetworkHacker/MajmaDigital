
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Bus, Map, Users, Ticket, Wrench, LayoutDashboard, Wallet, FileText,
  Navigation, Calendar, BadgeCheck, Mail, ShieldCheck, User, ArrowLeft,
  ListTodo, MapPin, Clock, Search, QrCode, Download, Trash2, Printer,
  Activity, Fuel, AlertTriangle, Radar, Plus, ClipboardCheck, Lock
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
import { useAuth } from '../../context/AuthContext';
import { getSchedules } from '../../services/transportService';

interface BookedTicket extends TransportSchedule {
  seatId: number;
  bookingId: string;
  bookingDate: string;
}

const TransportDashboard: React.FC = () => {
  const { user } = useAuth();
  const { members } = useData();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [schedules, setSchedules] = useState<TransportSchedule[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<TransportSchedule | null>(null);
  
  // Modals State
  const [showTripWizard, setShowTripWizard] = useState(false);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  
  // Member View States
  const [viewMode, setViewMode] = useState<'list' | 'booking' | 'ticket' | 'my-tickets'>('list');
  const [myTickets, setMyTickets] = useState<BookedTicket[]>([]);
  const [currentTicket, setCurrentTicket] = useState<BookedTicket | null>(null);

  // 1. Identifier le rôle dans le Transport
  const currentUserMember = useMemo(() => members.find(m => m.email === user?.email), [members, user]);
  const myRole = useMemo(() => {
    return currentUserMember?.commissions.find(c => c.type === CommissionType.TRANSPORT)?.role_commission || 'Membre';
  }, [currentUserMember]);

  // 2. Permissions hiérarchiques
  const isLeader = ['Dieuwrine', 'Adjoint', 'Secrétaire', 'Responsable'].some(r => myRole.includes(r));
  const isFleetStaff = myRole.includes('Chauffeur') || myRole.includes('Parc') || isLeader;
  const isTicketingStaff = myRole.includes('Billet') || myRole.includes('Trésorier') || isLeader;
  const isOpsStaff = myRole.includes('Logistique') || myRole.includes('Convoyeur') || isLeader;

  // Global Admin check for dashboard switching (handled in Dashboard.tsx, here we assume if we are here, we are either admin OR commission member)
  // We keep isAdmin logic for "Passenger View" vs "Commission View" toggle if needed, or rely on Dashboard.tsx logic.
  // Assuming Dashboard.tsx handles the switch between "Passenger" and "Commission" views.
  // Here we implement the COMMISSION VIEW details.
  
  // BUT: Need to handle Simple Member View if user is NOT in commission (Dashboard.tsx handles this separation)
  // We will assume this component is rendered for COMMISSION MEMBERS or ADMINS.
  // If a simple member accesses this component (e.g. direct link), we should probably fallback to Passenger View?
  // Let's implement Passenger View logic inside, but primarily focus on Commission Dashboard.

  useEffect(() => {
    getSchedules().then(setSchedules);
    // Load mock tickets
    const saved = localStorage.getItem('majma_my_tickets');
    if (saved) setMyTickets(JSON.parse(saved));
  }, []);

  // --- PASSENGER LOGIC (Fallback or Testing) ---
  const handleBookTrip = (trip: TransportSchedule) => {
      setSelectedTrip(trip);
      setViewMode('booking');
  };

  const handleBookingConfirm = (seatId: number) => {
      if (!selectedTrip) return;
      const newTicket: BookedTicket = {
          ...selectedTrip,
          seatId,
          bookingId: `TR-${Date.now().toString().slice(-6)}-${seatId}`,
          bookingDate: new Date().toISOString()
      };
      const updatedTickets = [...myTickets, newTicket];
      setMyTickets(updatedTickets);
      localStorage.setItem('majma_my_tickets', JSON.stringify(updatedTickets));
      setCurrentTicket(newTicket);
      setViewMode('ticket');
  };

  const handleCancelTicket = (bookingId: string) => {
      if(confirm("Êtes-vous sûr de vouloir annuler ce billet ? Cette action est irréversible.")) {
          const updated = myTickets.filter(t => t.bookingId !== bookingId);
          setMyTickets(updated);
          localStorage.setItem('majma_my_tickets', JSON.stringify(updated));
          if (currentTicket?.bookingId === bookingId) {
              setViewMode('my-tickets');
              setCurrentTicket(null);
          }
      }
  };

  const handleViewTicket = (ticket: BookedTicket) => {
      setCurrentTicket(ticket);
      setViewMode('ticket');
  };

  // --- COMMISSION DASHBOARD CONFIG ---

  const navItems = [
    { id: 'overview', label: 'Console Transport', icon: LayoutDashboard, access: true },
    { id: 'finance', label: 'Budget', icon: Wallet, access: isLeader },
    { id: 'meetings', label: 'Réunions', icon: FileText, access: isLeader },
    { id: 'tasks', label: 'Tâches', icon: ListTodo, access: true },
    { id: 'live', label: 'Live Ops', icon: Radar, access: isOpsStaff },
    { id: 'fleet', label: 'Parc & Maint.', icon: Bus, access: isFleetStaff },
    { id: 'planning', label: 'Convois', icon: Navigation, access: isOpsStaff },
    { id: 'reservation', label: 'Billetterie', icon: Ticket, access: isTicketingStaff },
    { id: 'drivers', label: 'Chauffeurs', icon: User, access: isFleetStaff },
    { id: 'stats', label: 'Coûts & Rent.', icon: Activity, access: isLeader },
  ];

  const visibleNavItems = navItems.filter(item => item.access);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Modals */}
      {showTripWizard && <TripPlannerWizard onClose={() => setShowTripWizard(false)} />}
      {showInspectionModal && <VehicleInspectionModal onClose={() => setShowInspectionModal(false)} />}

      {/* Role Badge */}
      <div className="flex items-center gap-3 bg-orange-50/50 p-3 rounded-2xl border border-orange-100 w-fit">
         <span className="px-3 py-1 bg-orange-600 text-white text-[10px] font-black uppercase rounded-lg tracking-widest">
            Poste
         </span>
         <span className="text-xs font-bold text-orange-900">{myRole}</span>
         {isLeader && <span className="text-[10px] text-orange-600 flex items-center gap-1 font-black uppercase"><ShieldCheck size={10}/> Admin</span>}
      </div>

      {/* Navigation Tabs */}
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
           {/* Admin Widgets Row */}
           {isLeader && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FinancialOverviewWidget commission={CommissionType.TRANSPORT} onClick={() => setActiveTab('finance')} />
              <MeetingOverviewWidget commission={CommissionType.TRANSPORT} onClick={() => setActiveTab('meetings')} />
              
              <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Bus size={20}/></div>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">8/10</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Flotte Active</h4>
                    <p className="text-[10px] text-slate-400 font-bold">2 véhicules en maintenance</p>
                  </div>
              </div>
              
              <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Ticket size={20}/></div>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">45%</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Remplissage</h4>
                    <p className="text-[10px] text-slate-400 font-bold">Magal 2024</p>
                  </div>
              </div>
            </div>
           )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             <div className="lg:col-span-8">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                   <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-8">
                         <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20"><Navigation size={24}/></div>
                         <h3 className="text-xl font-black uppercase tracking-widest">Prochain Convoi</h3>
                      </div>
                      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                         <div>
                            <p className="text-4xl font-black mb-2">Magal Touba</p>
                            <p className="text-sm font-bold opacity-80 flex items-center gap-2"><Calendar size={16}/> Départ le 21 Août à 07:00</p>
                            <div className="mt-4 flex gap-3">
                               <div className="px-3 py-1 bg-black/20 rounded-lg text-[10px] font-bold uppercase backdrop-blur-sm">5 Bus Confirmés</div>
                               <div className="px-3 py-1 bg-black/20 rounded-lg text-[10px] font-bold uppercase backdrop-blur-sm">240 Sièges</div>
                            </div>
                         </div>
                         {isOpsStaff && (
                           <div className="flex gap-3">
                             <button onClick={() => setShowTripWizard(true)} className="px-8 py-4 bg-white text-orange-600 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                                 <Plus size={16}/> Nouveau Convoi
                             </button>
                             <button onClick={() => setShowInspectionModal(true)} className="px-8 py-4 bg-black/20 text-white border border-white/10 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-black/30 transition-transform flex items-center gap-2">
                                 <ClipboardCheck size={16}/> Contrôle
                             </button>
                           </div>
                         )}
                      </div>
                   </div>
                   <div className="absolute -right-10 -bottom-10 opacity-10 text-white"><Bus size={200} /></div>
                </div>
             </div>

             <div className="lg:col-span-4 space-y-6">
                 {isFleetStaff ? (
                   <div className="glass-card p-8 bg-white h-full flex flex-col">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                          <AlertTriangle size={16} className="text-amber-500" /> Alertes Flotte
                      </h4>
                      <div className="space-y-3 flex-1">
                          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                              <p className="text-[10px] font-black text-amber-700 uppercase mb-1">Bus DK-2099</p>
                              <p className="text-xs text-slate-600">Contrôle technique expire dans 5 jours.</p>
                          </div>
                      </div>
                      <button onClick={() => setActiveTab('fleet')} className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">
                          Voir Parc
                      </button>
                   </div>
                 ) : (
                    <div className="glass-card p-8 bg-slate-50 border border-dashed border-slate-200 h-full flex flex-col items-center justify-center text-center text-slate-400">
                       <Lock size={32} className="mb-2 opacity-20"/>
                       <p className="text-xs font-bold uppercase">Données Flotte</p>
                       <p className="text-[10px]">Accès restreint</p>
                    </div>
                 )}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'finance' && isLeader && <CommissionFinancialDashboard commission={CommissionType.TRANSPORT} />}
      {activeTab === 'meetings' && isLeader && <CommissionMeetingDashboard commission={CommissionType.TRANSPORT} />}
      {activeTab === 'tasks' && <TaskManager commission={CommissionType.TRANSPORT} />}
      {activeTab === 'live' && isOpsStaff && <LiveConvoys />}
      {activeTab === 'fleet' && isFleetStaff && <FleetManager />}
      {activeTab === 'planning' && isOpsStaff && <TripScheduler />}
      {activeTab === 'reservation' && isTicketingStaff && <TicketingManager />}
      {activeTab === 'drivers' && isFleetStaff && <DriverRoster />}
      {activeTab === 'stats' && isLeader && <TransportStats />}
    </div>
  );
};

export default TransportDashboard;
