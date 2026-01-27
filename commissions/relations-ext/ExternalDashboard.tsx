
import React, { useState, useMemo } from 'react';
import { 
  Landmark, Globe, Users, FileText, LayoutDashboard, 
  MapPinned, Handshake, MessageSquare, ChevronRight,
  TrendingUp, Award, Zap, Sparkles, UserCheck, ShieldCheck, Wallet,
  BadgeCheck, Mail, User
} from 'lucide-react';
import PartnerNetwork from './PartnerNetwork';
import ProtocolManager from './ProtocolManager';
import InstitutionalComm from './InstitutionalComm';
import PartnershipWorkflow from './PartnershipWorkflow';
import InternationalLiaison from './InternationalLiaison';
import CommissionFinancialDashboard from '../shared/CommissionFinancialDashboard';
import CommissionMeetingDashboard from '../shared/CommissionMeetingDashboard';
import FinancialOverviewWidget from '../shared/FinancialOverviewWidget';
import MeetingOverviewWidget from '../shared/MeetingOverviewWidget';
import { CommissionType } from '../../types';
import { useData } from '../../contexts/DataContext';

const ExternalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { members } = useData();

  // Filtrer les membres de la commission Relations Extérieures
  const commissionTeam = useMemo(() => members.filter(m => 
    m.commissions.some(c => c.type === CommissionType.RELATIONS_EXT)
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
    { id: 'overview', label: 'Console Diplomatique', icon: LayoutDashboard },
    { id: 'finance', label: 'Budget', icon: Wallet },
    { id: 'meetings', label: 'Réunions', icon: FileText },
    { id: 'network', label: 'Réseau Partenaires', icon: MapPinned },
    { id: 'protocol', label: 'Protocole & VIP', icon: UserCheck },
    { id: 'partnerships', label: 'Conventions', icon: Handshake },
    { id: 'comm', label: 'Presse & Com.', icon: MessageSquare },
    { id: 'intl', label: 'Diaspora & Intl', icon: Globe },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Sub-Navigation Relations Extérieures */}
      <div className="flex flex-wrap gap-3 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 w-fit">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === item.id ? 'bg-slate-800 text-white shadow-xl shadow-slate-900/10 border border-slate-700' : 'text-slate-400 hover:text-slate-800'
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
             <FinancialOverviewWidget commission={CommissionType.RELATIONS_EXT} onClick={() => setActiveTab('finance')} />
             <MeetingOverviewWidget commission={CommissionType.RELATIONS_EXT} onClick={() => setActiveTab('meetings')} />
             
             {/* Quick Stats */}
             <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Globe size={20}/></div>
                   <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">24</span>
                </div>
                <div>
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Partenaires</h4>
                   <p className="text-[10px] text-slate-400 font-bold">Actifs globalement</p>
                </div>
             </div>
             
             <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Handshake size={20}/></div>
                   <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">08</span>
                </div>
                <div>
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Accords</h4>
                   <p className="text-[10px] text-slate-400 font-bold">Signés cette année</p>
                </div>
             </div>
          </div>

          {/* Diplomacy Banner */}
          <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-16">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60 mb-4">Portefeuille Institutionnel</p>
                  <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">Diplomatie <br/> <span className="text-slate-300 italic">Extérieure</span></h2>
                </div>
                <div className="p-4 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-700">
                  <Globe size={48} className="text-slate-200" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {[
                   { l: 'Dahiras Partenaires', v: '24', trend: 'Global', color: 'text-emerald-300' },
                   { l: 'Accords Actifs', v: '08', trend: 'Signés', color: 'text-blue-300' },
                   { l: 'VIP Protocolés', v: '15', trend: 'Registrés', color: 'text-amber-300' },
                   { l: 'Pays Couverts', v: '06', trend: 'International', color: 'text-indigo-300' }
                 ].map((item, i) => (
                   <div key={i} className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/5">
                     <p className="text-[9px] font-black uppercase opacity-40 mb-2 tracking-widest">{item.l}</p>
                     <p className="text-xl font-black mb-1">{item.v}</p>
                     <span className={`text-[8px] font-bold ${item.color} bg-white/5 px-2 py-0.5 rounded-full`}>{item.trend}</span>
                   </div>
                 ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 p-20 opacity-5 font-arabic text-[25rem] pointer-events-none rotate-12">ق</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Live Diplomatic Feed */}
            <div className="lg:col-span-8 space-y-8">
               <div className="glass-card p-10">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                      <Zap size={22} className="text-slate-600" /> Événements Partenaires
                    </h3>
                    <div className="px-3 py-1 bg-slate-50 text-slate-600 rounded-full text-[9px] font-black uppercase tracking-widest">Aujourd'hui</div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] flex items-center gap-6 group hover:bg-white transition-all cursor-pointer">
                      <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-600"><Landmark size={24}/></div>
                      <div className="flex-1">
                        <h4 className="text-sm font-black text-slate-800">Ziar Annuel - Dahira Moukhadimatul</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">Délégation de 5 membres attendue à 14h00. Protocole de réception activé.</p>
                      </div>
                      <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 group-hover:text-slate-800 transition-all"><ChevronRight size={18}/></button>
                    </div>
                    <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] flex items-center gap-6 group hover:bg-white transition-all cursor-pointer">
                      <div className="p-4 bg-white rounded-2xl shadow-sm text-emerald-600"><Handshake size={24}/></div>
                      <div className="flex-1">
                        <h4 className="text-sm font-black text-slate-800">Renouvellement Convention : Mairie Dakar</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">Signature de l'accord cadre pour le Gott Social 2024 prévu la semaine prochaine.</p>
                      </div>
                      <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 group-hover:text-slate-800 transition-all"><ChevronRight size={18}/></button>
                    </div>
                  </div>
               </div>
            </div>

            {/* AI Strategic Recs */}
            <div className="lg:col-span-4 space-y-8">
               <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10"><Sparkles size={24} className="text-amber-400" /></div>
                      <h4 className="font-black text-xs uppercase tracking-widest">IA Strategic Insight</h4>
                    </div>
                    <p className="text-sm font-medium leading-relaxed opacity-80 mb-8 italic">
                      "Nous avons détecté une opportunité de jumelage avec le Dahira de Lyon (France) pour le kurel étudiant. Voulez-vous générer un projet de convention ?"
                    </p>
                    <button className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">Générer brouillon</button>
                  </div>
                  <div className="absolute -right-10 -bottom-10 opacity-5 font-arabic text-8xl">و</div>
               </div>

               <div className="glass-card p-10 border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3 mb-6 text-slate-700">
                   <ShieldCheck size={22} />
                   <h4 className="font-black text-xs uppercase tracking-widest">Sécurité Diplomatique</h4>
                </div>
                <p className="text-[12px] font-medium text-slate-500 leading-relaxed italic">
                  "Tous les échanges avec les kurels de la diaspora sont désormais chiffrés. MajmaDigital assure la confidentialité absolue des registres de dons internationaux."
                </p>
              </div>
            </div>
          </div>

          {/* SECTION: ÉQUIPE DE LA COMMISSION */}
          <div className="glass-card p-8 bg-white border border-slate-100/50 mt-8">
             <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-slate-50 pb-6">
                <div>
                   <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                      <BadgeCheck size={24} className="text-slate-600"/> Membres de la Commission
                   </h4>
                   <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2">Hiérarchie et Rôles</p>
                </div>
                <span className="px-4 py-2 bg-slate-50 text-slate-600 rounded-full text-[10px] font-black uppercase border border-slate-100">
                   {commissionTeam.length} Membres Affectés
                </span>
             </div>
             
             {commissionTeam.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {commissionTeam.sort((a, b) => {
                      const roleA = a.commissions.find(c => c.type === CommissionType.RELATIONS_EXT)?.role_commission || '';
                      const roleB = b.commissions.find(c => c.type === CommissionType.RELATIONS_EXT)?.role_commission || '';
                      return getRolePriority(roleA) - getRolePriority(roleB);
                  }).map(member => {
                      const assignment = member.commissions.find(c => c.type === CommissionType.RELATIONS_EXT);
                      const roleName = assignment ? assignment.role_commission : 'Membre';
                      
                      return (
                          <div key={member.id} className="p-6 rounded-[1.5rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5 hover:border-slate-100 transition-all group cursor-pointer relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-slate-50 to-white rounded-bl-[3rem] -mr-4 -mt-4 transition-all group-hover:from-slate-100 group-hover:to-slate-50"></div>
                              
                              <div className="relative z-10">
                                  <div className="flex justify-between items-start mb-4">
                                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-700 font-black text-lg shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                          {member.firstName[0]}{member.lastName[0]}
                                      </div>
                                      <span className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                  </div>
                                  
                                  <h5 className="font-black text-slate-800 text-sm leading-tight mb-1">{member.firstName} {member.lastName}</h5>
                                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-4 bg-slate-50 inline-block px-2 py-0.5 rounded">{roleName}</p>
                                  
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

      {activeTab === 'finance' && <CommissionFinancialDashboard commission={CommissionType.RELATIONS_EXT} />}
      {activeTab === 'meetings' && <CommissionMeetingDashboard commission={CommissionType.RELATIONS_EXT} />}
      {activeTab === 'network' && <PartnerNetwork />}
      {activeTab === 'protocol' && <ProtocolManager />}
      {activeTab === 'comm' && <InstitutionalComm />}
      {activeTab === 'partnerships' && <PartnershipWorkflow />}
      {activeTab === 'intl' && <InternationalLiaison />}
    </div>
  );
};

export default ExternalDashboard;
