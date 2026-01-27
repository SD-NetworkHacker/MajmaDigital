
import React, { useState, useMemo } from 'react';
import { 
  Camera, Video, Share2, Instagram, Facebook, MessageCircle, 
  TrendingUp, Calendar, Image as ImageIcon, FileText, 
  Users, Plus, Search, Filter, ChevronRight, LayoutGrid, 
  List, Zap, Sparkles, MoreHorizontal, CheckCircle, Bot, Wallet,
  BadgeCheck, Mail, ShieldCheck, User
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import EventCoveragePlanner from './EventCoveragePlanner';
import MultimediaLibrary from './MultimediaLibrary';
import ContentScheduler from './ContentScheduler';
import SocialMediaAnalytics from './SocialMediaAnalytics';
import AICommunityManager from './AICommunityManager';
import CommissionFinancialDashboard from '../shared/CommissionFinancialDashboard';
import CommissionMeetingDashboard from '../shared/CommissionMeetingDashboard';
import FinancialOverviewWidget from '../shared/FinancialOverviewWidget';
import MeetingOverviewWidget from '../shared/MeetingOverviewWidget';
import { CommissionType } from '../../types';
import { useData } from '../../contexts/DataContext';

const MediaDashboard: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const { members } = useData();

  // Filtrer les membres de la commission Communication
  const commissionTeam = useMemo(() => members.filter(m => 
    m.commissions.some(c => c.type === CommissionType.COMMUNICATION)
  ), [members]);

  const getRolePriority = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('dieuwrine') && !r.includes('adjoint')) return 1;
    if (r.includes('dieuwrine adjoint')) return 2;
    if (r.includes('secrétaire') || r.includes('trésorier')) return 3;
    if (r.includes('chargé')) return 4;
    return 10;
  };

  const socialStats = [
    { platform: 'Facebook', followers: '12.4k', reach: '+15%', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50' },
    { platform: 'Instagram', followers: '8.2k', reach: '+24%', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50' },
    { platform: 'WhatsApp', followers: '3.1k', reach: '+8%', icon: MessageCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { platform: 'YouTube', followers: '5.6k', reach: '+12%', icon: Video, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const engagementData = [
    { name: 'Lun', posts: 12, likes: 450 },
    { name: 'Mar', posts: 8, likes: 320 },
    { name: 'Mer', posts: 15, likes: 680 },
    { name: 'Jeu', posts: 20, likes: 890 },
    { name: 'Ven', posts: 32, likes: 1450 },
    { name: 'Sam', posts: 18, likes: 720 },
    { name: 'Dim', posts: 10, likes: 410 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-3 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 w-fit">
        {[
          { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutGrid },
          { id: 'finance', label: 'Budget & Fin.', icon: Wallet },
          { id: 'meetings', label: 'Réunions', icon: FileText },
          { id: 'ai-agent', label: 'Agent IA', icon: Bot },
          { id: 'coverage', label: 'Couverture', icon: Camera },
          { id: 'library', label: 'Médiathèque', icon: ImageIcon },
          { id: 'scheduler', label: 'Calendrier', icon: Calendar },
          { id: 'analytics', label: 'Stats & Impact', icon: TrendingUp },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeSubTab === tab.id ? 'bg-amber-500 text-white shadow-xl shadow-amber-900/10 border border-amber-400' : 'text-slate-400 hover:text-amber-600'
            }`}
          >
            <tab.icon size={16} />
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {activeSubTab === 'overview' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Admin Widgets Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <FinancialOverviewWidget commission={CommissionType.COMMUNICATION} onClick={() => setActiveSubTab('finance')} />
             <MeetingOverviewWidget commission={CommissionType.COMMUNICATION} onClick={() => setActiveSubTab('meetings')} />
             
             {socialStats.slice(0, 2).map((stat, i) => (
                <div key={i} className="glass-card p-6 group hover:border-amber-200 transition-all border-transparent bg-white flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
                      <stat.icon size={20} />
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black">
                      <TrendingUp size={10} /> {stat.reach}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.platform}</p>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tighter">{stat.followers}</h4>
                  </div>
                </div>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Analytics Area */}
            <div className="lg:col-span-8 glass-card p-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <Zap size={22} className="text-amber-500" /> Courbe d'Engagement Hebdo
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Interactions cumulées sur tous les réseaux</p>
                </div>
                <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase text-slate-500 focus:ring-2 focus:ring-amber-500 outline-none">
                  <option>7 Derniers Jours</option>
                  <option>Mois Actuel</option>
                </select>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={engagementData}>
                    <defs>
                      <linearGradient id="colorAmber" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', fontSize: '11px', fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey="likes" stroke="#f59e0b" strokeWidth={4} fillOpacity={1} fill="url(#colorAmber)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions & Recent Content */}
            <div className="lg:col-span-4 space-y-8">
              <div className="glass-card p-8 bg-slate-900 text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10"><Sparkles size={24} className="text-amber-400" /></div>
                    <h4 className="font-black text-xs uppercase tracking-widest">IA Majma Writer</h4>
                  </div>
                  <p className="text-sm font-medium leading-relaxed opacity-80 mb-8 italic">
                    "Générez des légendes inspirantes et spirituelles pour vos publications Facebook & Instagram en un clic."
                  </p>
                  <button 
                    onClick={() => setActiveSubTab('ai-agent')}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
                  >
                    Ouvrir l'Assistant de Rédaction
                  </button>
                </div>
                <div className="absolute -right-10 -bottom-10 opacity-5 font-arabic text-[12rem] rotate-12 pointer-events-none">ق</div>
              </div>

              <div className="glass-card p-8 flex flex-col h-full">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Top Contenus du Mois</h4>
                <div className="space-y-4 flex-1">
                  {[
                    { title: 'Ziar 2024 : Moment d\'émotion', likes: '2.4k', type: 'Video' },
                    { title: 'Enseignements du Vendredi', likes: '1.8k', type: 'Infographie' },
                    { title: 'Retour sur le Magal Gott', likes: '1.2k', type: 'Photo' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-white transition-all group border border-transparent hover:border-slate-100">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm font-black text-xs">{item.likes}</div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-slate-800 truncate mb-1">{item.title}</p>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{item.type}</span>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-amber-500 transition-all" />
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
                      <BadgeCheck size={24} className="text-amber-600"/> Membres de la Commission
                   </h4>
                   <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2">Hiérarchie et Rôles</p>
                </div>
                <span className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-[10px] font-black uppercase border border-amber-100">
                   {commissionTeam.length} Membres Affectés
                </span>
             </div>
             
             {commissionTeam.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {commissionTeam.sort((a, b) => {
                      const roleA = a.commissions.find(c => c.type === CommissionType.COMMUNICATION)?.role_commission || '';
                      const roleB = b.commissions.find(c => c.type === CommissionType.COMMUNICATION)?.role_commission || '';
                      return getRolePriority(roleA) - getRolePriority(roleB);
                  }).map(member => {
                      const assignment = member.commissions.find(c => c.type === CommissionType.COMMUNICATION);
                      const roleName = assignment ? assignment.role_commission : 'Membre';
                      
                      return (
                          <div key={member.id} className="p-6 rounded-[1.5rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-amber-900/5 hover:border-amber-100 transition-all group cursor-pointer relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-50 to-white rounded-bl-[3rem] -mr-4 -mt-4 transition-all group-hover:from-amber-100 group-hover:to-amber-50"></div>
                              
                              <div className="relative z-10">
                                  <div className="flex justify-between items-start mb-4">
                                      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-amber-700 font-black text-lg shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                          {member.firstName[0]}{member.lastName[0]}
                                      </div>
                                      <span className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                  </div>
                                  
                                  <h5 className="font-black text-slate-800 text-sm leading-tight mb-1">{member.firstName} {member.lastName}</h5>
                                  <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest mb-4 bg-amber-50 inline-block px-2 py-0.5 rounded">{roleName}</p>
                                  
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

      {activeSubTab === 'finance' && <CommissionFinancialDashboard commission={CommissionType.COMMUNICATION} />}
      {activeSubTab === 'meetings' && <CommissionMeetingDashboard commission={CommissionType.COMMUNICATION} />}
      {activeSubTab === 'ai-agent' && <AICommunityManager />}
      {activeSubTab === 'coverage' && <EventCoveragePlanner />}
      {activeSubTab === 'library' && <MultimediaLibrary />}
      {activeSubTab === 'scheduler' && <ContentScheduler />}
      {activeSubTab === 'analytics' && <SocialMediaAnalytics />}
    </div>
  );
};

export default MediaDashboard;
