
import React, { useState, useMemo } from 'react';
import { 
  Bus, Map, Users, Ticket, Wrench, LayoutDashboard, Wallet, FileText,
  Navigation, Calendar, BadgeCheck, Mail, ShieldCheck, User
} from 'lucide-react';
import FleetManager from './FleetManager';
import TripScheduler from './TripScheduler';
import ReservationConsole from './ReservationConsole';
import DriverRoster from './DriverRoster';
import CommissionFinancialDashboard from '../shared/CommissionFinancialDashboard';
import CommissionMeetingDashboard from '../shared/CommissionMeetingDashboard';
import FinancialOverviewWidget from '../shared/FinancialOverviewWidget';
import MeetingOverviewWidget from '../shared/MeetingOverviewWidget';
import { CommissionType } from '../../types';
import { useData } from '../../contexts/DataContext';

const TransportDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { members } = useData();

  // Filtrer les membres de la commission Transport
  const commissionTeam = useMemo(() => members.filter(m => 
    m.commissions.some(c => c.type === CommissionType.TRANSPORT)
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
    { id: 'overview', label: 'Console Transport', icon: LayoutDashboard },
    { id: 'fleet', label: 'Parc Auto', icon: Bus },
    { id: 'planning', label: 'Plannings', icon: Navigation },
    { id: 'reservation', label: 'Billetterie', icon: Ticket },
    { id: 'drivers', label: 'Chauffeurs', icon: User },
    { id: 'finance', label: 'Budget', icon: Wallet },
    { id: 'meetings', label: 'Réunions', icon: FileText },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-wrap gap-3 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 w-fit">
        {navItems.map(item => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <FinancialOverviewWidget commission={CommissionType.TRANSPORT} onClick={() => setActiveTab('finance')} />
             <MeetingOverviewWidget commission={CommissionType.TRANSPORT} onClick={() => setActiveTab('meetings')} />
             
             {/* Transport Specific Stats */}
             <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Bus size={20}/></div>
                   <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">8/10</span>
                </div>
                <div>
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Flotte Active</h4>
                   <p className="text-[10px] text-slate-400 font-bold">Véhicules prêts</p>
                </div>
             </div>
             
             <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Ticket size={20}/></div>
                   <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">45%</span>
                </div>
                <div>
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Réservations</h4>
                   <p className="text-[10px] text-slate-400 font-bold">Magal 2024</p>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             <div className="lg:col-span-8">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                   <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-8">
                         <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20"><Navigation size={24}/></div>
                         <h3 className="text-xl font-black uppercase tracking-widest">Prochain Convoi</h3>
                      </div>
                      <div className="flex justify-between items-end">
                         <div>
                            <p className="text-4xl font-black mb-2">Magal Touba</p>
                            <p className="text-sm font-bold opacity-80 flex items-center gap-2"><Calendar size={16}/> Départ : 23 Août 2024</p>
                         </div>
                         <button className="px-6 py-3 bg-white text-orange-600 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg hover:scale-105 transition-transform">Gérer</button>
                      </div>
                   </div>
                   <div className="absolute -right-10 -bottom-10 opacity-10 text-white"><Bus size={200} /></div>
                </div>
             </div>
             <div className="lg:col-span-4">
                <div className="glass-card p-10 bg-white h-full flex flex-col justify-center text-center border-slate-100">
                   <Wrench size={40} className="text-slate-300 mx-auto mb-4"/>
                   <h4 className="font-black text-slate-800 mb-1">Maintenance</h4>
                   <p className="text-xs text-slate-400">1 véhicule en révision technique</p>
                </div>
             </div>
          </div>

          {/* SECTION: ÉQUIPE DE LA COMMISSION */}
          <div className="glass-card p-8 bg-white border border-slate-100/50 mt-8">
             <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-slate-50 pb-6">
                <div>
                   <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                      <BadgeCheck size={24} className="text-orange-600"/> Membres de la Commission
                   </h4>
                   <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2">Hiérarchie et Rôles</p>
                </div>
                <span className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-[10px] font-black uppercase border border-orange-100">
                   {commissionTeam.length} Membres Affectés
                </span>
             </div>
             
             {commissionTeam.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {commissionTeam.sort((a, b) => {
                      const roleA = a.commissions.find(c => c.type === CommissionType.TRANSPORT)?.role_commission || '';
                      const roleB = b.commissions.find(c => c.type === CommissionType.TRANSPORT)?.role_commission || '';
                      return getRolePriority(roleA) - getRolePriority(roleB);
                  }).map(member => {
                      const assignment = member.commissions.find(c => c.type === CommissionType.TRANSPORT);
                      const roleName = assignment ? assignment.role_commission : 'Membre';
                      
                      return (
                          <div key={member.id} className="p-6 rounded-[1.5rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-orange-900/5 hover:border-orange-100 transition-all group cursor-pointer relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-50 to-white rounded-bl-[3rem] -mr-4 -mt-4 transition-all group-hover:from-orange-100 group-hover:to-orange-50"></div>
                              
                              <div className="relative z-10">
                                  <div className="flex justify-between items-start mb-4">
                                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-orange-700 font-black text-lg shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                          {member.firstName[0]}{member.lastName[0]}
                                      </div>
                                      <span className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                  </div>
                                  
                                  <h5 className="font-black text-slate-800 text-sm leading-tight mb-1">{member.firstName} {member.lastName}</h5>
                                  <p className="text-[10px] text-orange-600 font-black uppercase tracking-widest mb-4 bg-orange-50 inline-block px-2 py-0.5 rounded">{roleName}</p>
                                  
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

      {activeTab === 'fleet' && <FleetManager />}
      {activeTab === 'planning' && <TripScheduler />}
      {activeTab === 'reservation' && <ReservationConsole />}
      {activeTab === 'drivers' && <DriverRoster />}
      {activeTab === 'finance' && <CommissionFinancialDashboard commission={CommissionType.TRANSPORT} />}
      {activeTab === 'meetings' && <CommissionMeetingDashboard commission={CommissionType.TRANSPORT} />}
    </div>
  );
};

export default TransportDashboard;
