import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { initViewportHeight } from './utils/viewport';
import { useMediaQuery } from './hooks/useMediaQuery';

// Imports Statiques (Anti-bug Vercel)
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MobileNav from './components/Navigation/MobileNav';
import ErrorBoundary from './components/ErrorBoundary';
import GuestDashboard from './components/GuestDashboard';
import MemberModule from './components/MemberModule';
import FinanceModule from './components/FinanceModule';
import UserProfile from './components/profile/UserProfile';
import SettingsModule from './components/SettingsModule';
import CommissionModule from './components/CommissionModule';
import AIChatBot from './components/AIChatBot';

const AppContent = () => {
  const { user, loading } = useAuth();
  const { isMobile } = useMediaQuery();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    initViewportHeight();
  }, []);

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950">
      <Loader2 className="text-emerald-500 animate-spin mb-4" size={48} />
      <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Initialisation Majma OS...</p>
    </div>
  );

  if (!user) return <GuestDashboard />;

  const renderModule = () => {
    const tab = activeTab.toLowerCase();
    
    switch (tab) {
      case 'dashboard':
      case 'admin_dashboard':
        return <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'members':
        return <MemberModule />;
      case 'profile':
        return <UserProfile onBack={() => setActiveTab('dashboard')} />;
      case 'finance_perso':
        return <FinanceModule />;
      case 'commissions':
        return <CommissionModule />;
      case 'settings':
        return <SettingsModule onBack={() => setActiveTab('dashboard')} />;
      default:
        if (tab.startsWith('comm_')) return <CommissionModule />;
        return <Dashboard activeTab="dashboard" setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-full w-full bg-[#f8fafc] overflow-hidden">
      {!isMobile && (
        <aside className="w-80 h-full shrink-0 border-r border-white/5 bg-[#030712]">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </aside>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <main className={`flex-1 overflow-y-auto ${isMobile ? 'pb-24 pt-4 px-4' : 'p-8'}`}>
          <ErrorBoundary>
            <div className="max-w-[1600px] mx-auto">
              {renderModule()}
            </div>
          </ErrorBoundary>
        </main>
        <AIChatBot />
      </div>

      {isMobile && <MobileNav activeTab={activeTab} onNavigate={setActiveTab} />}
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <DataProvider>
      <AppContent />
    </DataProvider>
  </AuthProvider>
);

export default App;