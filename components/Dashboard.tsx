import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../contexts/DataContext';
import { CommissionType, GlobalRole } from '../types';
import MemberDashboard from './member/MemberDashboard';
import AdminCockpit from './admin/AdminCockpit';
import CommissionLoader from '../commissions/CommissionLoader';
import { User, Briefcase, ShieldAlert } from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { user } = useAuth();
  const { members } = useData();
  
  // State pour basculer entre vue métier et vue personnelle pour les responsables
  const [viewMode, setViewMode] = useState<'work' | 'personal'>('work');

  // 1. Détection Direction / Administration (SG ou Commission Admin)
  const isDirection = useMemo(() => {
    if (!user) return false;
    const isSG = user.role === GlobalRole.SG || user.role === 'SG' || user.role === 'ADMIN';
    // On vérifie aussi si l'utilisateur est dans la commission Administration
    const isInAdminComm = user.id && members.find(m => m.id === user.id)?.commissions.some(c => c.type === CommissionType.ADMINISTRATION);
    return isSG || isInAdminComm;
  }, [user, members]);

  // 2. Détection Membre de Commission (autre que admin)
  const primaryCommission = useMemo(() => {
    if (!user) return null;
    const memberProfile = members.find(m => m.id === user.id);
    return memberProfile?.commissions[0] || null;
  }, [members, user]);

  // --- RENDU CONDITIONNEL ---

  // A. Vue Direction (Cockpit Stratégique)
  if (isDirection && viewMode === 'work') {
    return <AdminCockpit setActiveTab={setActiveTab} onSwitchView={() => setViewMode('personal')} />;
  }

  // B. Vue Responsable Commission (Tableau de bord métier spécifique)
  if (primaryCommission && viewMode === 'work') {
    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-[#0F172A] text-white p-4 rounded-[1.5rem] shadow-xl border border-slate-800 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-emerald-400 border border-white/10">
              <Briefcase size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Espace Professionnel</p>
              <h3 className="text-sm font-bold">Commission {primaryCommission.type}</h3>
            </div>
          </div>
          <button 
            onClick={() => setViewMode('personal')}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-sm"
          >
            <User size={14} /> Mon Espace Perso
          </button>
        </div>
        <CommissionLoader type={primaryCommission.type} />
      </div>
    );
  }

  // C. Vue Membre Standard (ou Mode Personnel)
  return (
    <div className="space-y-6">
      {(isDirection || primaryCommission) && (
        <div className="flex justify-end animate-in slide-in-from-top-2">
           <button 
             onClick={() => setViewMode('work')}
             className="flex items-center gap-2 px-6 py-3 bg-[#0F172A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-all"
           >
             <ShieldAlert size={14} /> Retour au Pilotage
           </button>
        </div>
      )}
      <MemberDashboard setActiveTab={setActiveTab} />
    </div>
  );
};

export default Dashboard;