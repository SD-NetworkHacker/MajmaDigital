
import React, { useState, useMemo } from 'react';
import { 
  Camera, Video, Share2, Instagram, Facebook, MessageCircle, 
  TrendingUp, Calendar, Image as ImageIcon, FileText, 
  Plus, Search, Filter, ChevronRight, LayoutGrid, 
  List, Zap, Sparkles, MoreHorizontal, CheckCircle, Bot, Wallet,
  BadgeCheck, Mail, ShieldCheck, User, ListTodo, Lock
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
import TaskManager from '../../components/shared/TaskManager';
import { CommissionType } from '../../types';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../context/AuthContext';

const MediaDashboard: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const { members } = useData();
  const { user } = useAuth();

  // 1. Identifier le rôle dans la Com
  const currentUserMember = useMemo(() => members.find(m => m.email === user?.email), [members, user]);
  const myRole = useMemo(() => {
    return currentUserMember?.commissions.find(c => c.type === CommissionType.COMMUNICATION)?.role_commission || 'Membre';
  }, [currentUserMember]);

  // 2. Permissions
  const isLeader = ['Dieuwrine', 'Adjoint', 'Secrétaire', 'Responsable'].some(r => myRole.includes(r));
  const isContentCreator = myRole.includes('Redacteur') || myRole.includes('CM') || isLeader;
  const isTechTeam = myRole.includes('Photographe') || myRole.includes('Technicien') || myRole.includes('Vidéo') || isLeader;

  // Filtrer les membres de la commission Communication
  const commissionTeam = useMemo(() => members.filter(m => 
    m.commissions.some(c => c.type === CommissionType.COMMUNICATION)
  ), [members]);

  const socialStats = [
    { platform: 'Facebook', followers: '--', reach: '0%', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50' },
    { platform: 'Instagram', followers: '--', reach: '0%', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50' },
    { platform: 'WhatsApp', followers: '--', reach: '0%', icon: MessageCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { platform: 'YouTube', followers: '--', reach: '0%', icon: Video, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const navItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutGrid, access: true },
    { id: 'finance', label: 'Budget & Fin.', icon: Wallet, access: isLeader },
    { id: 'meetings', label: 'Réunions', icon: FileText, access: isLeader },
    { id: 'tasks', label: 'Tâches', icon: ListTodo, access: true },
    { id: 'ai-agent', label: 'Agent IA', icon: Bot, access: isContentCreator },
    { id: 'coverage', label: 'Couverture', icon: Camera, access: isTechTeam },
    { id: 'library', label: 'Médiathèque', icon: ImageIcon, access: true },
    { id: 'scheduler', label: 'Calendrier', icon: Calendar, access: isContentCreator },
    { id: 'analytics', label: 'Stats & Impact', icon: TrendingUp, access: isLeader },
  ];

  const visibleNavItems = navItems.filter(item => item.access);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Role Badge */}
      <div className="flex items-center gap-3 bg-amber-50/50 p-3 rounded-2xl border border-amber-100 w-fit">
         <span className="px-3 py-1 bg-amber-600 text-white text-[10px] font-black uppercase rounded-lg tracking-widest">
            Poste
         </span>
         <span className="text-xs font-bold text-amber-900">{myRole}</span>
         {isLeader && <span className="text-[10px] text-amber-600 flex items-center gap-1 font-black uppercase"><ShieldCheck size={10}/> Admin</span>}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-3 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 w-fit">
        {visibleNavItems.map(tab => (
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
          {isLeader && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <FinancialOverviewWidget commission={CommissionType.COMMUNICATION} onClick={() => setActiveSubTab('finance')} />
               <MeetingOverviewWidget commission={CommissionType.COMMUNICATION} onClick={() => setActiveSubTab('meetings')} />
               
               {socialStats.slice(0, 2).map((stat, i) => (
                  <div key={i} className="glass-card p-6 group hover:border-amber-200 transition-all border-transparent bg-white flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-inner`}>
                        <stat.icon size={20} />
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-black">
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
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Analytics Area - Visible to everyone but simplified if not leader */}
            <div className="lg:col-span-8 glass-card p-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <Zap size={22} className="text-amber-500" /> Courbe d'Engagement Hebdo
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Interactions cumulées sur tous les réseaux</p>
                </div>
              </div>
              <div className="h-[350px] w-full flex items-center justify-center bg-slate-50/50 rounded-3xl border border-slate-100">
                 <div className="text-center text-slate-400">
                    <TrendingUp size={48} className="mx-auto mb-4 opacity-20"/>
                    <p className="text-xs font-bold uppercase">Aucune donnée d'engagement disponible</p>
                    <p className="text-[10px] mt-1">Connectez les API réseaux sociaux pour voir les stats.</p>
                 </div>
              </div>
            </div>

            {/* Quick Actions & Recent Content */}
            <div className="lg:col-span-4 space-y-8">
              {isContentCreator && (
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
              )}

              <div className="glass-card p-8 flex flex-col h-full">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Derniers Contenus</h4>
                <div className="flex-1 flex items-center justify-center text-slate-300">
                   <div className="text-center">
                      <ImageIcon size={32} className="mx-auto mb-2 opacity-30"/>
                      <p className="text-[10px] font-bold uppercase">Aucun contenu récent</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'finance' && isLeader && <CommissionFinancialDashboard commission={CommissionType.COMMUNICATION} />}
      {activeSubTab === 'meetings' && isLeader && <CommissionMeetingDashboard commission={CommissionType.COMMUNICATION} />}
      {activeSubTab === 'tasks' && <TaskManager commission={CommissionType.COMMUNICATION} />}
      {activeSubTab === 'ai-agent' && isContentCreator && <AICommunityManager />}
      {activeSubTab === 'coverage' && isTechTeam && <EventCoveragePlanner />}
      {activeSubTab === 'library' && <MultimediaLibrary />}
      {activeSubTab === 'scheduler' && isContentCreator && <ContentScheduler />}
      {activeSubTab === 'analytics' && isLeader && <SocialMediaAnalytics />}
    </div>
  );
};

export default MediaDashboard;
