
import React, { useState, useEffect, Suspense } from 'react';
// Components
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

// Lazy Imports for Modules to improve TTI (Time to Interactive)
const MemberModule = React.lazy(() => import('./components/MemberModule'));
const MemberMapModule = React.lazy(() => import('./components/MemberMapModule'));
const CommissionModule = React.lazy(() => import('./components/CommissionModule'));
const FinanceModule = React.lazy(() => import('./components/FinanceModule'));
const EventModule = React.lazy(() => import('./components/EventModule'));
const MessagesModule = React.lazy(() => import('./components/MessagesModule'));
const AdminModule = React.lazy(() => import('./components/AdminModule'));
const SettingsModule = React.lazy(() => import('./components/SettingsModule'));
const PedagogicalModule = React.lazy(() => import('./components/PedagogicalModule'));
const HealthModule = React.lazy(() => import('./components/HealthModule'));
const SocialModule = React.lazy(() => import('./components/SocialModule'));
const AIChatBot = React.lazy(() => import('./components/AIChatBot'));
const WarRoomLayout = React.lazy(() => import('./components/bureau/WarRoomLayout'));
const UserProfile = React.lazy(() => import('./components/profile/UserProfile'));
const TransportDashboard = React.lazy(() => import('./commissions/transport/TransportDashboard'));
const CulturalDashboard = React.lazy(() => import('./commissions/culturelle/CulturalDashboard'));

// Auth Components (Static for fast initial load)
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import ProfileCompletion from './components/auth/ProfileCompletion';

// Shared Components
import OfflineBanner from './components/shared/OfflineBanner';
import { SkeletonCard } from './components/shared/Skeleton';

import { Menu, ChevronDown, VenetianMask, Loader2, Fingerprint, Eye, Power } from 'lucide-react';
import { DataProvider, useData } from './contexts/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LoadingProvider } from './context/LoadingContext';
import { ThemeProvider } from './context/ThemeContext';
import { GlobalRole } from './types';

// Loading Fallback Component
const PageLoader = () => (
  <div className="h-full w-full p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </div>
);

// Identity Switch Screen
const IdentitySwitchScreen = () => (
   <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center text-emerald-500 font-mono">
      <div className="relative">
         <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
         <Fingerprint size={80} className="relative z-10 animate-pulse" />
      </div>
      <h2 className="mt-8 text-2xl font-black uppercase tracking-[0.3em] animate-pulse">Changement d'Identité</h2>
      <p className="mt-2 text-xs text-emerald-700 font-bold uppercase">Décryptage du profil en cours...</p>
      
      <div className="mt-8 w-64 h-1 bg-emerald-900 rounded-full overflow-hidden">
         <div className="h-full bg-emerald-500 animate-[width_1.5s_ease-in-out_infinite]" style={{width: '30%'}}></div>
      </div>
      
      <div className="absolute bottom-10 font-mono text-[10px] text-emerald-800">
         SECURE_PROTOCOL_INIT_V3.1
      </div>
   </div>
);

// Main Layout Component (Dashboard)
const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewProfileId, setViewProfileId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { members, events, contributions } = useData();
  const { user, isImpersonating, isSwitching, stopImpersonation } = useAuth();

  // Liste des rôles à privilèges élevés
  const adminRoles = [GlobalRole.ADMIN, GlobalRole.SG, GlobalRole.ADJOINT_SG, GlobalRole.DIEUWRINE];
  const isAdminOrManager = user && (adminRoles.includes(user.role as GlobalRole) || user.role === 'admin' || user.role === 'Super Admin');

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 1200);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const navigateToProfile = (id: string | null) => {
    setViewProfileId(id);
    setActiveTab('profile');
  };

  const renderContent = () => {
    // Protection de la route Bureau Exécutif
    if (activeTab === 'bureau') {
      if (isAdminOrManager) {
        return (
          <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-slate-950 text-white"><Loader2 className="animate-spin mr-2"/> Chargement War Room...</div>}>
             <WarRoomLayout />
          </Suspense>
        );
      } else {
        // Redirection silencieuse si non autorisé
        setActiveTab('dashboard');
        return null;
      }
    }

    const commonProps = { members, events, contributions };
    
    return (
      <Suspense fallback={<PageLoader />}>
        {(() => {
          switch (activeTab) {
            case 'dashboard': return <Dashboard {...commonProps} setActiveTab={setActiveTab} />;
            case 'members': return <MemberModule onViewProfile={navigateToProfile} />;
            case 'map': return <MemberMapModule members={members} />;
            case 'commissions': return <CommissionModule members={members} events={events} />;
            case 'pedagogy': return <PedagogicalModule />;
            case 'social': return <SocialModule />;
            case 'health': return <HealthModule />;
            case 'finance': return <FinanceModule />;
            case 'events': return <EventModule />;
            case 'transport': return <TransportDashboard />;
            case 'culturelle': return <CulturalDashboard />;
            case 'messages': return <MessagesModule />;
            // Admin Module accessible seulement aux admins
            case 'admin': return isAdminOrManager ? <AdminModule /> : <Dashboard {...commonProps} setActiveTab={setActiveTab} />;
            case 'settings': return <SettingsModule onBack={() => setActiveTab('dashboard')} />;
            case 'profile': return <UserProfile targetId={viewProfileId} onBack={() => { setViewProfileId(null); setActiveTab('members'); }} />;
            default: return <Dashboard {...commonProps} setActiveTab={setActiveTab} />;
          }
        })()}
      </Suspense>
    );
  };

  if (isSwitching) return <IdentitySwitchScreen />;

  return (
    <div className={`flex h-screen w-full bg-[#f8fafc] overflow-hidden relative transition-all duration-500 ${isImpersonating ? 'border-[8px] border-amber-500/50' : ''}`}>
      
      {/* HUD MODE INCARNATION (GLOBAL OVERLAY) */}
      {isImpersonating && (
        <div className="fixed top-0 left-0 right-0 h-14 bg-slate-900 text-amber-500 px-6 flex justify-between items-center z-[100] shadow-2xl shadow-amber-900/20 border-b-2 border-amber-500">
          <div className="flex items-center gap-4">
             <div className="p-2 bg-amber-500/10 rounded-lg animate-pulse border border-amber-500/30">
                <VenetianMask size={18} />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Simulation Active</span>
                <span className="text-xs font-bold font-mono text-amber-400 flex items-center gap-2">
                   <Eye size={12}/> Vue actuelle : {user?.firstName} {user?.lastName} ({user?.role})
                </span>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col text-right mr-4">
                <span className="text-[9px] text-slate-500 font-mono">SESSION ID</span>
                <span className="text-[10px] text-slate-400 font-mono">SIM-{Math.floor(Date.now()/1000)}</span>
             </div>
             <button 
               onClick={stopImpersonation}
               className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 active:scale-95"
             >
               <Power size={14} /> Terminer
             </button>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isImpersonating ? 'mt-14' : ''}`}>
         <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setIsMobileMenuOpen(false); }} />
      </div>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
         <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className={`flex-1 flex flex-col min-w-0 overflow-hidden relative ${isImpersonating ? 'pt-14' : ''}`}>
         
         {/* Mobile Header */}
         <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-emerald-500 font-arabic text-lg pb-1">م</div>
               <span className="font-black text-slate-900">Majma</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg"><Menu size={20}/></button>
         </div>

         <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 relative">
            {/* Simulation Watermark */}
            {isImpersonating && (
               <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.03] z-0">
                  <div className="text-[15vw] font-black uppercase text-slate-900 -rotate-45 select-none">
                     Simulation
                  </div>
               </div>
            )}
            
            <div className="relative z-10">
               {renderContent()}
            </div>
         </div>
      </div>
      
      <OfflineBanner />
      <Suspense fallback={null}>
         <AIChatBot />
      </Suspense>
    </div>
  );
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot' | 'reset' | 'profile-completion'>('login');
  
  if (!isAuthenticated) {
    switch (authView) {
      case 'register': return <RegisterForm onLoginClick={() => setAuthView('login')} onSuccess={() => setAuthView('login')} />;
      case 'forgot': return <ForgotPasswordForm onBackToLogin={() => setAuthView('login')} />;
      case 'reset': return <ResetPasswordForm onSuccess={() => setAuthView('login')} />;
      default: return <LoginForm onRegisterClick={() => setAuthView('register')} onForgotPasswordClick={() => setAuthView('forgot')} />;
    }
  }

  return <MainContent />;
};

const App = () => {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <NotificationProvider>
          <AuthProvider>
            <DataProvider>
              <AppContent />
            </DataProvider>
          </AuthProvider>
        </NotificationProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
};

export default App;
