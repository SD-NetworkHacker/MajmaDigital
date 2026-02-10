import React, { useState, Suspense, useEffect, useTransition } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BottomNav from './components/layout/BottomNav';
import PullToRefresh from './components/shared/PullToRefresh';
import ErrorBoundary from './components/ErrorBoundary';
import { useMediaQuery } from './hooks/useMediaQuery';
import { usePWA } from './hooks/usePWA';
import { initViewportHeight } from './utils/viewport';
import { safeLower } from './utils/string';

// Lazy Modules
const MemberModule = React.lazy(() => import('./components/MemberModule'));
const MemberMapModule = React.lazy(() => import('./components/MemberMapModule'));
const CommissionModule = React.lazy(() => import('./components/CommissionModule'));
const FinanceModule = React.lazy(() => import('./components/FinanceModule'));
const EventModule = React.lazy(() => import('./components/EventModule'));
const AdminModule = React.lazy(() => import('./components/AdminModule'));
const SettingsModule = React.lazy(() => import('./components/SettingsModule'));
const PedagogicalModule = React.lazy(() => import('./components/PedagogicalModule'));
const HealthModule = React.lazy(() => import('./components/HealthModule'));
const SocialModule = React.lazy(() => import('./components/SocialModule'));
const AIChatBot = React.lazy(() => import('./components/AIChatBot'));
const UserProfile = React.lazy(() => import('./components/profile/UserProfile'));

import GuestDashboard from './components/GuestDashboard';
import { Command, Download, Loader2 } from 'lucide-react';
import { DataProvider, useData } from './contexts/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LoadingProvider } from './context/LoadingContext';
import { ThemeProvider } from './context/ThemeContext';

const PageLoader = ({ message = "Initialisation..." }) => (
    <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 p-12 min-h-[400px]">
        <div className="relative w-16 h-16 mb-6">
            <Loader2 className="w-full h-full text-emerald-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center font-arabic text-xl text-emerald-600 pb-1">م</div>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">{message}</p>
    </div>
);

const MainContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isPending, startTransition] = useTransition();
  const { user, loading: isAuthLoading } = useAuth();
  const { refreshAll } = useData();
  const { isMobile } = useMediaQuery();
  const { isInstallable, installApp } = usePWA();

  useEffect(() => {
    initViewportHeight();
  }, []);

  const handleNavigate = (tabId: string) => {
    startTransition(() => {
      setActiveTab(tabId || 'dashboard');
    });
  };

  if (isAuthLoading) return <PageLoader message="Vérification session..." />;
  if (!user) return <GuestDashboard />;

  const renderCurrentModule = () => {
    const safeTab = safeLower(activeTab);

    switch (safeTab) {
      case 'dashboard':
      case 'admin_dashboard':
        return <Dashboard activeTab={activeTab} setActiveTab={handleNavigate} />;
      case 'members': return <MemberModule />;
      case 'map': return <MemberMapModule members={[]} />;
      case 'commissions': return <CommissionModule />;
      case 'pedagogy': return <PedagogicalModule />;
      case 'social': return <SocialModule />;
      case 'health': return <HealthModule />;
      case 'finance':
      case 'finance_perso': return <FinanceModule />;
      case 'events': return <EventModule />;
      case 'admin': return <AdminModule />;
      case 'settings': return <SettingsModule onBack={() => handleNavigate('dashboard')} />;
      case 'profile': return <UserProfile onBack={() => handleNavigate('dashboard')} />;
      default: return <Dashboard activeTab="dashboard" setActiveTab={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden relative font-sans">
      {!isMobile && (
        <div className="w-80 h-full shrink-0 border-r border-slate-200/60 bg-white">
           <Sidebar activeTab={activeTab} setActiveTab={handleNavigate} />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#f1f5f9]">
         <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200/60 shrink-0 z-10">
            <div className="flex items-center gap-4">
               <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-arabic text-xl pb-1 shadow-lg">م</div>
               <div className="flex flex-col">
                  <span className="font-black text-sm uppercase tracking-widest text-slate-900">MajmaDigital</span>
                  <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">Platform Edition</span>
               </div>
            </div>
            
            <div className="flex items-center gap-2">
               {isInstallable && isMobile && (
                  <button onClick={installApp} className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
                    <Download size={14} /> Installer
                  </button>
               )}
               {isMobile && (
                  <button onClick={() => handleNavigate('settings')} className="p-2.5 bg-slate-100 text-slate-500 rounded-xl border border-slate-200">
                    <Command size={18}/>
                  </button>
               )}
            </div>
         </header>

         <div className={`flex-1 overflow-hidden relative ${isMobile ? 'pb-20' : ''}`}>
            <ErrorBoundary>
              <Suspense fallback={<PageLoader message="Chargement du module..." />}>
                {isMobile ? (
                  <PullToRefresh onRefresh={refreshAll}>
                    <div className={`max-w-[1600px] mx-auto p-4 md:p-10 transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                        {renderCurrentModule()}
                    </div>
                  </PullToRefresh>
                ) : (
                  <div className={`max-w-[1600px] mx-auto p-4 md:p-10 h-full overflow-y-auto scroll-content transition-opacity duration-300 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                      {renderCurrentModule()}
                  </div>
                )}
              </Suspense>
            </ErrorBoundary>
         </div>
      </div>

      {isMobile && <BottomNav activeTab={activeTab} setActiveTab={handleNavigate} />}
      
      {!isMobile && (
        <Suspense fallback={null}>
          <AIChatBot />
        </Suspense>
      )}
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <LoadingProvider>
        <NotificationProvider>
          <AuthProvider>
            <DataProvider>
              <MainContent />
            </DataProvider>
          </AuthProvider>
        </NotificationProvider>
      </LoadingProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;