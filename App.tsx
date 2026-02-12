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
import MemberMapModule from './components/MemberMapModule';
import CommissionModule from './components/CommissionModule';
import FinanceModule from './components/FinanceModule';
import UserProfile from './components/profile/UserProfile';
import SettingsModule from './components/SettingsModule';
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
      <div className="relative">
        <Loader2 className="text-emerald-500 animate-spin mb-6" size={48} />
        <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse"></div>
      </div>
      <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Chargement Majma OS...</p>
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
      case 'map':
        return <MemberMapModule members={[]} />;
      case 'profile':
        return <UserProfile onBack={() => setActiveTab('dashboard')} />;
      case 'finance_perso':
        return <FinanceModule />;
      case 'commissions':
        return <CommissionModule />;
      case 'settings':
        return <SettingsModule onBack={() => setActiveTab('dashboard')} />;
      default:
        if (tab.startsWith('comm_')) return <CommissionModule defaultView={null} />;
        return <Dashboard activeTab="dashboard" setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden">
      {!isMobile && (
        <div className="w-80 h-full shrink-0">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <main className={`flex-1 overflow-y-auto ${isMobile ? 'pb-24 pt-4' : 'p-8'}`}>
          <ErrorBoundary>
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
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