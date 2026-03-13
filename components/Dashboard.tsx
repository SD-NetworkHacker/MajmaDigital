import React from 'react';
// Fixed: AuthContext path updated to contexts/
import { useAuth } from '../contexts/AuthContext';
import MemberDashboard from './member/MemberDashboard';
import AdministrationDashboard from '../commissions/administration/AdministrationDashboard';
// import TechnicalDashboard from './admin/TechnicalDashboard';
import CommissionModule from './CommissionModule';
import { CommissionType } from '../types';
import { safeLower } from '../utils/string';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, activeTab }) => {
  const { user } = useAuth();
  
  const currentTab = safeLower(activeTab);

  // 1. DÉTECTION VUE COMMISSION MÉTIER
  if (currentTab.startsWith('comm_')) {
    const typeStr = currentTab.replace('comm_', '');
    const type = Object.values(CommissionType).find(t => safeLower(t) === typeStr) || CommissionType.CULTURELLE;
    return <CommissionModule defaultView={type} />;
  }

  // 2. VUE PILOTAGE SG
  if (currentTab === 'admin_dashboard') {
    return <AdministrationDashboard />;
  }

  // 3. VUE CONSOLE SYSTÈME
  if (currentTab === 'admin_system') {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Console Système</h2>
        <p className="text-slate-500 mt-2">Cette fonctionnalité est en cours de maintenance.</p>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase"
        >
          Retour au Dashboard
        </button>
      </div>
    );
  }

  // 4. PAR DÉFAUT : DASHBOARD MEMBRE (Tout le monde y a accès)
  return <MemberDashboard setActiveTab={setActiveTab} />;
};

export default Dashboard;