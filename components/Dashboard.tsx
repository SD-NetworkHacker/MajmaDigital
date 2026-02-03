
import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../contexts/DataContext';
import { Member, Event, Contribution } from '../types';
import MemberDashboard from './member/MemberDashboard';
import AdminDashboard from './admin/AdminDashboard';
import CommissionLoader from '../commissions/CommissionLoader';
import { ArrowRight, User, Briefcase } from 'lucide-react';

interface DashboardProps {
  members: Member[];
  events: Event[];
  contributions: Contribution[];
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { user } = useAuth();
  const { members } = useData();
  
  // State to toggle between Commission view and Personal view for commission members
  const [viewMode, setViewMode] = useState<'commission' | 'personal'>('commission');

  // 1. Identify Global Admin (Super Admin Platform)
  const isAdminOrManager = useMemo(() => {
     if (!user) return false;
     return ['admin', 'manager', 'Super Admin'].includes(user.role);
  }, [user]);

  // 2. Identify Current Member Profile
  const currentMember = useMemo(() => {
    if (!user) return null;
    // Try matching by ID first, then email
    return members.find(m => m.id === user.id) || members.find(m => m.email === user.email);
  }, [members, user]);

  // 3. Check for Commission Assignment
  const activeCommission = useMemo(() => {
      if (!currentMember || currentMember.commissions.length === 0) return null;
      // Default to the first commission found (Primary role)
      return currentMember.commissions[0];
  }, [currentMember]);

  // --- RENDER LOGIC ---

  // A. Global Admin / Super Admin View
  if (isAdminOrManager) {
     return <AdminDashboard {...props} />;
  }

  // B. Commission Member View (Finance, Org, Admin, etc.)
  if (activeCommission && viewMode === 'commission') {
     return (
        <div className="space-y-6 animate-in fade-in">
           {/* Context Switcher Bar */}
           <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-900 text-white p-4 rounded-[1.5rem] shadow-xl border border-slate-800 gap-4">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-emerald-400 border border-white/10">
                    <Briefcase size={18} />
                 </div>
                 <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Espace Professionnel</p>
                    <h3 className="text-sm font-bold">Commission {activeCommission.type}</h3>
                 </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white/5 p-1 rounded-xl border border-white/10">
                 <span className="hidden sm:inline-block text-[10px] font-medium px-3 text-emerald-400">
                    Rôle : {activeCommission.role_commission}
                 </span>
                 <button 
                   onClick={() => setViewMode('personal')}
                   className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-sm"
                 >
                   <User size={14} /> Espace Perso
                 </button>
              </div>
           </div>
           
           {/* Load Specific Commission Dashboard dynamically */}
           <CommissionLoader type={activeCommission.type} />
        </div>
     );
  }

  // C. Standard Member View (Personal Dashboard)
  return (
     <div className="space-y-6">
        {/* If member has a commission but is in personal view, show button to switch back */}
        {activeCommission && (
           <div className="flex justify-end animate-in slide-in-from-top-2">
              <button 
                onClick={() => setViewMode('commission')}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all group"
              >
                Accéder à la Commission {activeCommission.type} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
              </button>
           </div>
        )}
        
        <MemberDashboard setActiveTab={props.setActiveTab} />
     </div>
  );
};

export default Dashboard;
