import React, { useState, Suspense, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MobileNav from './components/Navigation/MobileNav';
import ErrorBoundary from './components/ErrorBoundary';
import { useMediaQuery } from './hooks/useMediaQuery';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import GuestDashboard from './components/GuestDashboard';
import { Loader2 } from 'lucide-react';
import { initViewportHeight } from './utils/viewport';

// Lazy Modules
const MemberModule = React.lazy(() => import('./components/MemberModule'));
const MemberMapModule = React.lazy(() => import('./components/MemberMapModule'));
const CommissionModule = React.lazy(() => import('./components/CommissionModule'));
const FinanceModule = React.lazy(() => import('./components/FinanceModule'));
const UserProfile = React.lazy(() => import('./components/profile/UserProfile'));
const SettingsModule = React.lazy(() => import('./components/SettingsModule'));

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
      <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Majma OS • Initialisation</p>
    </div>
  );

  if (!user) return <GuestDashboard />;

  const renderModule = () => {
    const tab = activeTab.toLowerCase();
    
    if (tab === 'dashboard' || tab === 'admin_dashboard') {
      return <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
    }
    if (tab === 'members') return <MemberModule />;
    if (tab === 'map') return <MemberMapModule members={[]} />;
    if (tab === 'profile') return <UserProfile onBack={() => setActiveTab('dashboard')} />;
    if (tab === 'settings') return <SettingsModule onBack={() => setActiveTab('dashboard')} />;
    if (tab === 'finance_perso') return <FinanceModule />;
    if (tab === 'commissions') return <CommissionModule />;
    
    // Gestion dynamique des préfixes de commission
    if (tab.startsWith('comm_')) {
      return <CommissionModule defaultView={null} />;
    }
    
    return <Dashboard activeTab="dashboard" setActiveTab={setActiveTab} />;
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
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-emerald-500 opacity-20" size={40} />
              </div>
            }>
              <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
                {renderModule()}
              </div>
            </Suspense>
          </ErrorBoundary>
        </main>
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