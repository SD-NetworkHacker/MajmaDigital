import React from 'react';
import { useAuth } from '../context/AuthContext';
import MemberDashboard from './member/MemberDashboard';
import AdminCockpit from './admin/AdminCockpit';
import TechnicalDashboard from './admin/TechnicalDashboard';
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
    return <AdminCockpit setActiveTab={setActiveTab} onSwitchView={() => setActiveTab('dashboard')} />;
  }

  // 3. VUE CONSOLE SYSTÈME
  if (currentTab === 'admin_system') {
    return <TechnicalDashboard onSwitchView={() => setActiveTab('dashboard')} />;
  }

  // 4. PAR DÉFAUT : DASHBOARD MEMBRE (Tout le monde y a accès)
  return <MemberDashboard setActiveTab={setActiveTab} />;
};

export default Dashboard;