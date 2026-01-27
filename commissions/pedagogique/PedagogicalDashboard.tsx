
import React, { useState, useMemo } from 'react';
import { 
  BookOpen, GraduationCap, School, Briefcase, 
  Target, LayoutDashboard, Library, Users, 
  Award, TrendingUp, Sparkles, Zap, ChevronRight,
  ShieldCheck, Brain, Wallet, FileText, BadgeCheck, Mail, User
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
import { CommissionType } from '../../types';
import { useData } from '../../contexts/DataContext';

const PedagogicalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSector, setSelectedSector] = useState<'eleves' | 'etudiants' | 'travailleurs'>('etudiants');
  const { members } = useData();

  // Filtrer les membres de la commission Pédagogique
  const commissionTeam = useMemo(() => members.filter(m => 
    m.commissions.some(c => c.type === CommissionType.PEDAGOGIQUE)
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
    { id: 'overview', label: 'Console Savoir', icon: LayoutDashboard },
    { id: 'finance', label: 'Budget', icon: Wallet },
    { id: 'meetings', label: 'Réunions', icon: FileText },
    { id: 'curriculum', label: 'Parcours Spirituel', icon: Award },
    { id: 'resources', label: 'Médiathèque', icon: Library },
    { id: 'groups', label: 'Groupes d\'Étude', icon: Users },
    { id: 'sector', label: 'Espace Sectoriel', icon: Brain },
  ];

  const sectorConfig = {
    eleves: { label: 'Pôle Élèves', icon: School, color: 'bg-amber-500' },
    etudiants: { label: 'Pôle Étudiants', icon: GraduationCap, color: 'bg-emerald-500' },
    travailleurs: { label: 'Pôle Travailleurs', icon: Briefcase, color: 'bg-blue-500' },
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Sector Switcher and Main Navigation */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap gap-3 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 w-fit">
          {navItems.map(item => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <FinancialOverviewWidget commission={CommissionType.PEDAGOGIQUE} onClick={() => setActiveTab('finance')} />
             <MeetingOverviewWidget commission={CommissionType.PEDAGOGIQUE} onClick={() => setActiveTab('meetings')} />
             
             {/* Pedagogic Specific Stats */}
             <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl"><BookOpen size={20}/></div>
                   <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Top 1</span>
                </div>
                <div>
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Mémorisation</h4>
                   <p className="text-[10px] text-slate-400 font-bold">Kurel {sectorConfig[selectedSector].label}</p>
                </div>
             </div>
             
             <div className="glass-card p-6 bg-white border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Award size={20}/></div>
                   <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">12</span>
                </div>
                <div>
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Certifiés</h4>
                   <p className="text-[10px] text-slate-400 font-bold">Ce mois-ci</p>
                </div>
             </div>
          </div>

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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {[
                   { l: 'Taux Réussite', v: '94%', trend: '+4%', color: 'text-emerald-300' },
                   { l: 'Heures Étude', v: '1,240', trend: 'Global', color: 'text-cyan-200' },
                   { l: 'Textes Maîtrisés', v: '18', trend: 'Moyenne', color: 'text-amber-200' },
                   { l: 'Apprenants', v: '112', trend: 'Actifs', color: 'text-blue-200' }
                 ].map((item, i) => (
                   <div key={i} className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/5">
                     <p className="text-[9px] font-black uppercase opacity-40 mb-2 tracking-widest">{item.l}</p>
                     <p className="text-xl font-black mb-1">{item.v}</p>
                     <span className={`text-[8px] font-bold ${item.color} bg-white/5 px-2 py-0.5 rounded-full`}>{item.trend}</span>
                   </div>
                 ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 p-20 opacity-5 font-arabic text-[25rem] pointer-events-none rotate-12">ع</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
               <div className="glass-card p-10">
                  <div className="flex justify-between items-center mb-10">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                      <Sparkles size={22} className="text-cyan-500" /> Recommandations d'Apprentissage (IA)
                    </h3>
                    <div className="px-3 py-1 bg-cyan-50 text-cyan-600 rounded-full text-[9px] font-black uppercase">Basé sur votre profil {selectedSector}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-cyan-200 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="p-3 bg-white rounded-2xl shadow-sm text-cyan-600"><Zap size={20}/></div>
                           <h4 className="font-black text-sm text-slate-800">Prochaine étape : Jawartu</h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-6">Vous avez terminé Sindidi. Le texte Jawartu est recommandé pour votre niveau actuel de mémorisation.</p>
                        <button className="w-full py-3 bg-cyan-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cyan-900/10 group-hover:scale-105 transition-transform">Commencer le module</button>
                     </div>
                     <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600"><Users size={20}/></div>
                           <h4 className="font-black text-sm text-slate-800">Groupe d'étude suggéré</h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-6">Un groupe de 4 membres de votre secteur révise Sindidi ce soir à 21h. Rejoignez-les !</p>
                        <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-transform group-hover:scale-105">S'inscrire à la session</button>
                     </div>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
               <div className="glass-card p-10 bg-slate-900 text-white relative overflow-hidden h-full">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-50">Top Apprenants - {sectorConfig[selectedSector].label}</h4>
                  <div className="space-y-6 relative z-10">
                     {[
                       { name: 'Saliou Diop', pts: 1240, level: 'Maître' },
                       { name: 'Fatou Ndiaye', pts: 980, level: 'Avancé' },
                       { name: 'Modou Fall', pts: 850, level: 'Intermédiaire' },
                     ].map((user, i) => (
                       <div key={i} className="flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-xs">{i+1}</div>
                             <div>
                                <p className="text-xs font-black">{user.name}</p>
                                <p className="text-[9px] opacity-40 uppercase font-bold">{user.level}</p>
                             </div>
                          </div>
                          <span className="text-xs font-black text-cyan-400">{user.pts} XP</span>
                       </div>
                     ))}
                  </div>
                  <button className="w-full mt-10 py-3 bg-white/10 hover:bg-white hover:text-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">Voir le classement</button>
               </div>
            </div>
          </div>

          {/* SECTION: ÉQUIPE DE LA COMMISSION */}
          <div className="glass-card p-8 bg-white border border-slate-100/50 mt-8">
             <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b border-slate-50 pb-6">
                <div>
                   <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                      <BadgeCheck size={24} className="text-cyan-600"/> Membres de la Commission
                   </h4>
                   <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2">Hiérarchie et Rôles</p>
                </div>
                <span className="px-4 py-2 bg-cyan-50 text-cyan-700 rounded-full text-[10px] font-black uppercase border border-cyan-100">
                   {commissionTeam.length} Membres Affectés
                </span>
             </div>
             
             {commissionTeam.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {commissionTeam.sort((a, b) => {
                      const roleA = a.commissions.find(c => c.type === CommissionType.PEDAGOGIQUE)?.role_commission || '';
                      const roleB = b.commissions.find(c => c.type === CommissionType.PEDAGOGIQUE)?.role_commission || '';
                      return getRolePriority(roleA) - getRolePriority(roleB);
                  }).map(member => {
                      const assignment = member.commissions.find(c => c.type === CommissionType.PEDAGOGIQUE);
                      const roleName = assignment ? assignment.role_commission : 'Membre';
                      
                      return (
                          <div key={member.id} className="p-6 rounded-[1.5rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-cyan-900/5 hover:border-cyan-100 transition-all group cursor-pointer relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-cyan-50 to-white rounded-bl-[3rem] -mr-4 -mt-4 transition-all group-hover:from-cyan-100 group-hover:to-cyan-50"></div>
                              
                              <div className="relative z-10">
                                  <div className="flex justify-between items-start mb-4">
                                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-cyan-700 font-black text-lg shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                          {member.firstName[0]}{member.lastName[0]}
                                      </div>
                                      <span className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                  </div>
                                  
                                  <h5 className="font-black text-slate-800 text-sm leading-tight mb-1">{member.firstName} {member.lastName}</h5>
                                  <p className="text-[10px] text-cyan-600 font-black uppercase tracking-widest mb-4 bg-cyan-50 inline-block px-2 py-0.5 rounded">{roleName}</p>
                                  
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

      {activeTab === 'finance' && <CommissionFinancialDashboard commission={CommissionType.PEDAGOGIQUE} />}
      {activeTab === 'meetings' && <CommissionMeetingDashboard commission={CommissionType.PEDAGOGIQUE} />}
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
