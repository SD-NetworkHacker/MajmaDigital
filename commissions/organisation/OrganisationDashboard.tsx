
import React, { useState, useMemo } from 'react';
import { 
  ListTodo, Truck, Users, Package, Coffee, UtensilsCrossed, 
  GlassWater, Palette, Sparkles, LayoutDashboard, Clock, 
  CheckCircle, AlertTriangle, Plus, ChevronRight, Zap, Wallet, FileText,
  BadgeCheck, Mail, ShieldCheck, User
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
import { CommissionType } from '../../types';
import { useData } from '../../contexts/DataContext';

const OrganisationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { members } = useData();

  // Filtrer les membres de la commission Organisation
  const commissionTeam = useMemo(() => members.filter(m => 
    m.commissions.some(c => c.type === CommissionType.ORGANISATION)
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
    { id: 'overview', label: 'Console Logistique', icon: LayoutDashboard },
    { id: 'finance', label: 'Finance & Budget', icon: Wallet },
    { id: 'meetings', label: 'Réunions & PV', icon: FileText },
    { id: 'resources', label: 'Équipes & Gott', icon: Users },
    { id: 'inventory', label: 'Matériel & Stock', icon: Package },
    { id: 'coffee', label: 'Pôle Café', icon: Coffee },
    { id: 'kitchen', label: 'Pôle Cuisine', icon: UtensilsCrossed },
    { id: 'vaisselle', label: 'Pôle Vaisselle', icon: GlassWater },
    { id: 'deco', label: 'Décoration', icon: Palette },
    { id: 'hygiene', label: 'Hygiène', icon: Sparkles },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Sub-Navigation Organisation */}
      <div className="flex flex-wrap gap-3 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 w-fit">
        {navItems.map(item => (
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

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Admin Widgets Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <FinancialOverviewWidget commission={CommissionType.ORGANISATION} onClick={() => setActiveTab('finance')} />
             <MeetingOverviewWidget commission={CommissionType.ORGANISATION} onClick={() => setActiveTab('meetings')} />
             
             {/* Operational Quick Stats */}
             <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Truck size={20}/></div>
                   <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest bg-purple-50 px-2 py-1 rounded-lg">En cours</span>
                </div>
                <div>
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Gott Touba</h4>
                   <p className="text-[10px] text-slate-400 font-bold">Logistique à 85%</p>
                </div>
             </div>
             
             <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><AlertTriangle size={20}/></div>
                   <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">2 Alertes</span>
                </div>
                <div>
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Points Critiques</h4>
                   <p className="text-[10px] text-slate-400 font-bold">Stock Café & Hygiène</p>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <EventLogisticsDashboard />
            </div>
            <div className="lg:col-span-4 space-y-8">
               <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-50">Alerte Chaine Logistique</h4>
                  <div className="space-y-6 relative z-10">
                     <div className="p-4 bg-rose-500/20 border border-rose-500/50 rounded-2xl flex gap-4 items-start">
                        <AlertTriangle className="text-rose-400 shrink-0" size={20} />
                        <div>
                           <p className="text-xs font-black">Stock Café Critique</p>
                           <p className="text-[10px] opacity-70 mt-1">Il reste moins de 5kg pour le Thiant de samedi. Approvisionnement requis sous 24h.</p>
                        </div>
                     </div>
                  </div>
                  <div className="absolute -right-10 -bottom-10 opacity-5 font-arabic text-[12rem] rotate-12 pointer-events-none">ص</div>
               </div>

               <div className="glass-card p-10">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Efficacité Opérationnelle</h4>
                  <div className="space-y-8">
                    {[
                      { l: 'Cuisine', p: 85, c: 'bg-emerald-500' },
                      { l: 'Logistique', p: 92, c: 'bg-purple-500' },
                      { l: 'Hygiène', p: 78, c: 'bg-blue-500' },
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

          {/* SECTION: ÉQUIPE DE LA COMMISSION */}
          <div className="glass-card p-8 bg-white border border-slate-100/50 mt-8">
             <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-slate-50 pb-6">
                <div>
                   <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                      <BadgeCheck size={24} className="text-purple-600"/> Membres de la Commission
                   </h4>
                   <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2">Hiérarchie et Rôles</p>
                </div>
                <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-[10px] font-black uppercase border border-purple-100">
                   {commissionTeam.length} Membres Affectés
                </span>
             </div>
             
             {commissionTeam.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {commissionTeam.sort((a, b) => {
                      const roleA = a.commissions.find(c => c.type === CommissionType.ORGANISATION)?.role_commission || '';
                      const roleB = b.commissions.find(c => c.type === CommissionType.ORGANISATION)?.role_commission || '';
                      return getRolePriority(roleA) - getRolePriority(roleB);
                  }).map(member => {
                      const assignment = member.commissions.find(c => c.type === CommissionType.ORGANISATION);
                      const roleName = assignment ? assignment.role_commission : 'Membre';
                      
                      return (
                          <div key={member.id} className="p-6 rounded-[1.5rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-purple-900/5 hover:border-purple-100 transition-all group cursor-pointer relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-50 to-white rounded-bl-[3rem] -mr-4 -mt-4 transition-all group-hover:from-purple-100 group-hover:to-purple-50"></div>
                              
                              <div className="relative z-10">
                                  <div className="flex justify-between items-start mb-4">
                                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-purple-700 font-black text-lg shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                          {member.firstName[0]}{member.lastName[0]}
                                      </div>
                                      <span className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                  </div>
                                  
                                  <h5 className="font-black text-slate-800 text-sm leading-tight mb-1">{member.firstName} {member.lastName}</h5>
                                  <p className="text-[10px] text-purple-600 font-black uppercase tracking-widest mb-4 bg-purple-50 inline-block px-2 py-0.5 rounded">{roleName}</p>
                                  
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

      {activeTab === 'finance' && <CommissionFinancialDashboard commission={CommissionType.ORGANISATION} />}
      {activeTab === 'meetings' && <CommissionMeetingDashboard commission={CommissionType.ORGANISATION} />}
      {activeTab === 'resources' && <ResourceCoordinator />}
      {activeTab === 'inventory' && <InventoryManagement />}
      {activeTab === 'coffee' && <CoffeeSubModule />}
      {activeTab === 'kitchen' && <KitchenSubModule />}
      {activeTab === 'vaisselle' && <TablewareSubModule />}
      {activeTab === 'deco' && <DecorationSubModule />}
      {activeTab === 'hygiene' && <HygieneSubModule />}
    </div>
  );
};

export default OrganisationDashboard;
