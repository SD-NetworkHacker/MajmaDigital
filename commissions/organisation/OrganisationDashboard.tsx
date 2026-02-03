
import React, { useState, useMemo } from 'react';
import { 
  ListTodo, Truck, Users, Package, Coffee, UtensilsCrossed, 
  GlassWater, Palette, Sparkles, LayoutDashboard, Clock, 
  CheckCircle, AlertTriangle, Plus, ChevronRight, Zap, Wallet, FileText,
  BadgeCheck, Mail, ShieldCheck, User, ArrowLeft, Lock
} from 'lucide-react';
import EventLogisticsDashboard from './EventLogisticsDashboard';
import ResourceCoordinator from './ResourceCoordinator';
import InventoryManagement from './InventoryManagement';
import CoffeeSubModule from './subs/CoffeeSubModule';
import KitchenSubModule from './subs/KitchenSubModule';
import TablewareSubModule from './subs/TablewareSubModule';
import DecorationSubModule from './subs/DecorationModule';
import HygieneSubModule from './subs/HygieneSubModule';
import CommissionFinancialDashboard from '../shared/CommissionFinancialDashboard';
import CommissionMeetingDashboard from '../shared/CommissionMeetingDashboard';
import FinancialOverviewWidget from '../shared/FinancialOverviewWidget';
import MeetingOverviewWidget from '../shared/MeetingOverviewWidget';
import TaskManager from '../../components/shared/TaskManager';
import { CommissionType } from '../../types';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../context/AuthContext';

const OrganisationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { members } = useData();
  const { user } = useAuth();

  // 1. Identifier le rôle dans l'Organisation
  const currentUserMember = useMemo(() => members.find(m => m.email === user?.email), [members, user]);
  const myRole = useMemo(() => {
    return currentUserMember?.commissions.find(c => c.type === CommissionType.ORGANISATION)?.role_commission || 'Bénévole';
  }, [currentUserMember]);

  // 2. Permissions
  const isLeader = ['Dieuwrine', 'Adjoint', 'Secrétaire', 'Responsable Logistique'].some(r => myRole.includes(r));
  const isKitchenStaff = myRole.includes('Cuisine') || isLeader;
  const isCoffeeStaff = myRole.includes('Café') || isLeader;
  const isLogisticsStaff = myRole.includes('Logistique') || isLeader;

  // Filtrer les membres de la commission Organisation
  const commissionTeam = useMemo(() => members.filter(m => 
    m.commissions.some(c => c.type === CommissionType.ORGANISATION)
  ), [members]);

  const navItems = [
    { id: 'overview', label: 'Console Logistique', icon: LayoutDashboard, access: true },
    { id: 'tasks', label: 'Mes Tâches', icon: ListTodo, access: true },
    // Gestion stratégique pour les leaders
    { id: 'finance', label: 'Budget & Fin.', icon: Wallet, access: isLeader },
    { id: 'meetings', label: 'Réunions & PV', icon: FileText, access: isLeader },
    { id: 'resources', label: 'Équipes & Gott', icon: Users, access: isLeader },
    // Pôles opérationnels (filtrés par spécialité ou accès leader)
    { id: 'inventory', label: 'Matériel & Stock', icon: Package, access: isLogisticsStaff },
    { id: 'coffee', label: 'Pôle Café', icon: Coffee, access: isCoffeeStaff },
    { id: 'kitchen', label: 'Pôle Cuisine', icon: UtensilsCrossed, access: isKitchenStaff },
    { id: 'vaisselle', label: 'Pôle Vaisselle', icon: GlassWater, access: isKitchenStaff },
    { id: 'deco', label: 'Décoration', icon: Palette, access: isLogisticsStaff },
    { id: 'hygiene', label: 'Hygiène', icon: Sparkles, access: true }, // Hygiène concerne tout le monde
  ];

  const visibleNavItems = navItems.filter(item => item.access);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Role Badge */}
      <div className="flex items-center gap-3 bg-purple-50/50 p-3 rounded-2xl border border-purple-100 w-fit">
         <span className="px-3 py-1 bg-purple-600 text-white text-[10px] font-black uppercase rounded-lg tracking-widest">
            Poste
         </span>
         <span className="text-xs font-bold text-purple-900">{myRole}</span>
         {isLeader && <span className="text-[10px] text-purple-400 flex items-center gap-1 font-black uppercase"><Zap size={10}/> Accès Total</span>}
      </div>

      {/* Sub-Navigation Organisation */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
        <div className="flex flex-wrap gap-3 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 w-fit">
          {visibleNavItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === item.id ? 'bg-purple-600 text-white shadow-xl shadow-purple-900/10 border border-purple-500' : 'text-slate-400 hover:text-purple-600'
              }`}
            >
              <item.icon size={16} />
              <span className="hidden lg:inline">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Back Button */}
        {activeTab !== 'overview' && (
          <button 
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all shadow-sm group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="uppercase text-[10px] tracking-widest">Retour Logistique</span>
          </button>
        )}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Admin Widgets Row (Only visible to leaders) */}
          {isLeader && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <FinancialOverviewWidget commission={CommissionType.ORGANISATION} onClick={() => setActiveTab('finance')} />
               <MeetingOverviewWidget commission={CommissionType.ORGANISATION} onClick={() => setActiveTab('meetings')} />
               
               {/* Operational Quick Stats */}
               <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Truck size={20}/></div>
                     <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">En attente</span>
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Événement Actif</h4>
                     <p className="text-[10px] text-slate-400 font-bold">Aucun événement en cours</p>
                  </div>
               </div>
               
               <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle size={20}/></div>
                     <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">RAS</span>
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">État des Alertes</h4>
                     <p className="text-[10px] text-slate-400 font-bold">Logistique saine</p>
                  </div>
               </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <EventLogisticsDashboard />
            </div>
            
            <div className="lg:col-span-4 space-y-8">
               {/* Leader Only View: Global Supply Chain */}
               {isLeader ? (
                 <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-50">Monitoring Chaine Logistique</h4>
                    <div className="space-y-6 relative z-10">
                       <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex gap-4 items-center">
                          <CheckCircle className="text-emerald-400 shrink-0" size={20} />
                          <div>
                             <p className="text-xs font-black">Aucune alerte critique</p>
                             <p className="text-[10px] opacity-70 mt-1">Les niveaux de stock sont nominaux.</p>
                          </div>
                       </div>
                    </div>
                    <div className="absolute -right-10 -bottom-10 opacity-5 font-arabic text-[12rem] rotate-12 pointer-events-none">ص</div>
                 </div>
               ) : (
                 <div className="glass-card p-10 bg-slate-50 border-2 border-dashed border-slate-200 text-center">
                    <Lock size={32} className="mx-auto mb-3 text-slate-300"/>
                    <p className="text-xs font-bold text-slate-400 uppercase">Vue Supervision restreinte</p>
                 </div>
               )}

               <div className="glass-card p-10">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Efficacité Opérationnelle</h4>
                  <div className="space-y-8">
                    {[
                      { l: 'Cuisine', p: 0, c: 'bg-emerald-500' },
                      { l: 'Logistique', p: 0, c: 'bg-purple-500' },
                      { l: 'Hygiène', p: 0, c: 'bg-blue-500' },
                    ].map((stat, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase">
                          <span>{stat.l}</span>
                          <span>{stat.p}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                          <div className={`h-full ${stat.c} transition-all duration-1000`} style={{ width: `${stat.p}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'finance' && isLeader && <CommissionFinancialDashboard commission={CommissionType.ORGANISATION} />}
      {activeTab === 'meetings' && isLeader && <CommissionMeetingDashboard commission={CommissionType.ORGANISATION} />}
      {activeTab === 'resources' && isLeader && <ResourceCoordinator />}
      
      {activeTab === 'tasks' && <TaskManager commission={CommissionType.ORGANISATION} />}
      
      {activeTab === 'inventory' && isLogisticsStaff && <InventoryManagement />}
      {activeTab === 'coffee' && isCoffeeStaff && <CoffeeSubModule />}
      {activeTab === 'kitchen' && isKitchenStaff && <KitchenSubModule />}
      {activeTab === 'vaisselle' && isKitchenStaff && <TablewareSubModule />}
      {activeTab === 'deco' && isLogisticsStaff && <DecorationSubModule />}
      {activeTab === 'hygiene' && <HygieneSubModule />}
    </div>
  );
};

export default OrganisationDashboard;
