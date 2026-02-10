import React, { useState, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

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
import { Menu, X, Command, Sparkles } from 'lucide-react';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LoadingProvider } from './context/LoadingContext';
import { ThemeProvider } from './context/ThemeContext';

const PageLoader = ({ message = "Initialisation Platinum..." }) => (
    <div className="h-full w-full flex items-center justify-center bg-[#030712] flex-col fixed inset-0 z-[2000] overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-32 h-32 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)] mb-10 transform -rotate-6 animate-pulse">
                <span className="font-arabic text-8xl text-white pb-4 drop-shadow-2xl">م</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter">Majma<span className="text-emerald-500">Digital</span></h1>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-200"></div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">{message}</p>
            </div>
        </div>
    </div>
);

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading: isAuthLoading } = useAuth();

  if (isAuthLoading) return <PageLoader message="Session sécurisée..." />;
  if (!user) return <GuestDashboard />;

  const renderContent = () => {
    return (
      <div className="page-transition min-h-full">
        <Suspense fallback={<PageLoader message="Module en cours..." />}>
          {(() => {
            switch (activeTab) {
              case 'dashboard':
              case 'admin_dashboard':
                return <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
              case 'members': return <MemberModule />;
              case 'map': return <MemberMapModule members={[]} />;
              case 'commissions': return <CommissionModule />;
              case 'pedagogy': return <PedagogicalModule />;
              case 'social': return <SocialModule />;
              case 'health': return <HealthModule />;
              case 'finance': return <FinanceModule />;
              case 'events': return <EventModule />;
              case 'admin': return <AdminModule />;
              case 'settings': return <SettingsModule onBack={() => setActiveTab('dashboard')} />;
              case 'profile': return <UserProfile onBack={() => setActiveTab('dashboard')} />;
              default: 
                if (activeTab.startsWith('comm_')) return <Dashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
                return <Dashboard activeTab="dashboard" setActiveTab={setActiveTab} />;
            }
          })()}
        </Suspense>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden relative">
      {/* Sidebar Desktop/Mobile */}
      <div className={`fixed inset-y-0 left-0 z-[1000] w-80 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setIsMobileMenuOpen(false); }} />
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[900] lg:hidden animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#f1f5f9]">
         {/* Top Mobile Bar */}
         <div className="lg:hidden flex items-center justify-between p-5 bg-white border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-arabic text-lg pb-1 shadow-md">م</div>
               <span className="font-black text-sm uppercase tracking-tighter">MajmaDigital</span>
            </div>
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 bg-slate-100 rounded-xl text-slate-600 active:scale-90 transition-all"
            >
                {isMobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
         </div>

         {/* Content Wrapper */}
         <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 relative">
            <div className="max-w-[1600px] mx-auto">
               {renderContent()}
            </div>
         </div>
      </div>

      {/* Floating UI Elements */}
      <Suspense fallback={null}><AIChatBot /></Suspense>
    </div>
  );
};

const App = () => (
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
);

export default App;