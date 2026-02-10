import React from 'react';
import { useAuth } from '../context/AuthContext';
import MemberDashboard from './member/MemberDashboard';
import AdminCockpit from './admin/AdminCockpit';
import TechnicalDashboard from './admin/TechnicalDashboard';
import CommissionModule from './CommissionModule';
import { CommissionType } from '../types';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, activeTab }) => {
  const { user } = useAuth();
  
  // 1. DÉTECTION VUE COMMISSION MÉTIER
  if (activeTab.startsWith('comm_')) {
    const typeStr = activeTab.replace('comm_', '');
    // Mapping manuel des types (nécessaire car les keys de l'enum sont différentes des labels)
    const type = Object.values(CommissionType).find(t => t.toLowerCase() === typeStr) || CommissionType.CULTURELLE;
    return <CommissionModule defaultView={type} />;
  }

  // 2. VUE PILOTAGE SG
  if (activeTab === 'admin_dashboard') {
    return <AdminCockpit setActiveTab={setActiveTab} onSwitchView={() => setActiveTab('dashboard')} />;
  }

  // 3. VUE CONSOLE SYSTÈME
  if (activeTab === 'admin_system') {
    return <TechnicalDashboard onSwitchView={() => setActiveTab('dashboard')} />;
  }

  // 4. PAR DÉFAUT : DASHBOARD MEMBRE (Tout le monde y a accès)
  return <MemberDashboard setActiveTab={setActiveTab} />;
};

export default Dashboard;