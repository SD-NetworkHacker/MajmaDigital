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
      <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Initialisation Majma OS</p>
    </div>
  );

  if (!user) return <GuestDashboard />;

  const renderModule = () => {
    if (activeTab === 'dashboard' || activeTab === 'admin_dashboard') return <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
    if (activeTab === 'members') return <MemberModule />;
    if (activeTab === 'map') return <MemberMapModule members={[]} />;
    if (activeTab === 'profile') return <UserProfile onBack={() => setActiveTab('dashboard')} />;
    if (activeTab === 'finance_perso') return <FinanceModule />;
    if (activeTab === 'commissions') return <CommissionModule />;
    if (activeTab.startsWith('comm_')) return <CommissionModule defaultView={null} />;
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
        <main className={`flex-1 overflow-y-auto ${isMobile ? 'pb-24' : 'p-8'}`}>
          <ErrorBoundary>
            <Suspense fallback={<Loader2 className="animate-spin m-auto" />}>
              <div className="max-w-[1600px] mx-auto p-4">
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