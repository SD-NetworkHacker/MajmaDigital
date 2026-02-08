
import React, { useState, Suspense, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

// Added missing imports for dashboards
import AdminDashboard from './components/admin/AdminDashboard';
import MemberDashboard from './components/member/MemberDashboard';

// Lazy Components
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
const ProfileCompletion = React.lazy(() => import('./components/auth/ProfileCompletion'));

import GuestDashboard from './components/GuestDashboard';
import { Menu, Power, Eye, RefreshCcw, Mail, RefreshCw, CheckCircle } from 'lucide-react';
import { DataProvider, useData } from './contexts/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LoadingProvider } from './context/LoadingContext';
import { ThemeProvider } from './context/ThemeContext';
import AuthLayout from './components/auth/AuthLayout';

const PageLoader = () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-50 flex-col fixed inset-0 z-50 overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-28 h-28 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-900/20 mb-8 animate-in zoom-in duration-500">
                <span className="font-arabic text-7xl text-emerald-500 pb-3 drop-shadow-lg relative z-10 select-none animate-pulse-slow">م</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Majma<span className="text-emerald-600">Digital</span></h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 animate-pulse mt-2">Initialisation...</p>
        </div>
    </div>
);

const EmailVerificationView: React.FC = () => {
    const { user, resendConfirmation, logout, refreshProfile } = useAuth();
    const [checking, setChecking] = useState(false);

    const handleManualCheck = async () => {
        setChecking(true);
        await refreshProfile();
        setChecking(false);
    };

    return (
        <AuthLayout title="Confirmez votre email" subtitle="Accès restreint temporairement">
            <div className="text-center space-y-8 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto border border-emerald-100 shadow-inner">
                    <Mail size={40} className="text-emerald-600" />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                    Bonjour <strong className="text-slate-900">{user?.firstName}</strong>. <br/>
                    Votre compte a été créé, mais vous devez confirmer votre adresse <strong>{user?.email}</strong> pour continuer.
                </p>
                <div className="space-y-4">
                    <button 
                        onClick={handleManualCheck}
                        disabled={checking}
                        className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all"
                    >
                        {checking ? <RefreshCw size={16} className="animate-spin"/> : <CheckCircle size={16}/>}
                        J'ai cliqué sur le lien de confirmation
                    </button>
                    <button 
                        onClick={() => user?.email && resendConfirmation(user.email)}
                        className="w-full py-4 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                    >
                        <RefreshCw size={16}/> Renvoyer le mail
                    </button>
                    <button 
                        onClick={() => logout()}
                        className="w-full py-2 text-rose-500 font-bold text-[10px] uppercase tracking-widest hover:underline"
                    >
                        Déconnexion
                    </button>
                </div>
            </div>
        </AuthLayout>
    );
};

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewProfileId, setViewProfileId] = useState<string | null>(null);
  
  const { user, loading: isAuthLoading } = useAuth();
  const { isLoading: isDataLoading } = useData();

  if (isAuthLoading) return <PageLoader />;
  if (!user) return <GuestDashboard />;

  // Force Email Verification
  if (!user.emailConfirmed) {
      return <EmailVerificationView />;
  }

  const role = (user.role || '').toUpperCase();
  const isAdminOrManager = ['ADMIN', 'SG', 'ADJOINT_SG', 'DIEUWRINE'].includes(role);

  const renderContent = () => {
    if (activeTab === 'bureau' && isAdminOrManager) return <Suspense fallback={<PageLoader />}><WarRoomLayout /></Suspense>;
    
    return (
      <Suspense fallback={<PageLoader />}>
        {(() => {
          switch (activeTab) {
            case 'dashboard': return isAdminOrManager ? <AdminDashboard setActiveTab={setActiveTab} members={[]} events={[]} contributions={[]} /> : <MemberDashboard setActiveTab={setActiveTab} />;
            case 'members': return <MemberModule onViewProfile={(id) => { setViewProfileId(id); setActiveTab('profile'); }} />;
            case 'map': return <MemberMapModule members={[]} />;
            case 'commissions': return <CommissionModule members={[]} events={[]} />;
            case 'pedagogy': return <PedagogicalModule />;
            case 'social': return <SocialModule />;
            case 'health': return <HealthModule />;
            case 'finance': return <FinanceModule />;
            case 'events': return <EventModule />;
            case 'transport': return <TransportDashboard />;
            case 'culturelle': return <CulturalDashboard />;
            case 'messages': return <MessagesModule />;
            case 'admin': return isAdminOrManager ? <AdminModule /> : <MemberDashboard setActiveTab={setActiveTab} />;
            case 'settings': return <SettingsModule onBack={() => setActiveTab('dashboard')} />;
            case 'profile': return <UserProfile targetId={viewProfileId} onBack={() => { setViewProfileId(null); setActiveTab('members'); }} />;
            default: return <MemberDashboard setActiveTab={setActiveTab} />;
          }
        })()}
      </Suspense>
    );
  };

  if (isDataLoading) return <PageLoader />;

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden relative">
      <div className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setIsMobileMenuOpen(false); }} />
      </div>
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
         <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 relative">
            {renderContent()}
         </div>
      </div>
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
