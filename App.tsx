
import React, { useState, Suspense, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

// Lazy Components with relative paths
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

// Dashboards spécifiques demandés
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard'));
const MemberDashboard = React.lazy(() => import('./components/member/MemberDashboard'));

import GuestDashboard from './components/GuestDashboard';

import { Menu, Power, Eye, VenetianMask, RefreshCcw, LogOut } from 'lucide-react';
import { DataProvider, useData } from './contexts/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LoadingProvider } from './context/LoadingContext';
import { ThemeProvider } from './context/ThemeContext';
import { supabase } from './lib/supabase';

// Enhanced Loader with Brand Identity
const PageLoader = () => {
    const [showRetry, setShowRetry] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowRetry(true);
        }, 8000); // Délai un peu plus long pour l'intro
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="h-full w-full flex items-center justify-center bg-slate-50 flex-col fixed inset-0 z-50 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-50 via-slate-50 to-slate-100 opacity-50"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                {/* Logo Animation */}
                <div className="relative w-28 h-28 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-900/20 mb-8 animate-in zoom-in duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem]"></div>
                    <span className="font-arabic text-7xl text-emerald-500 pb-3 drop-shadow-lg relative z-10 select-none animate-pulse-slow">م</span>
                    
                    {/* Orbiting Dot */}
                    <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full absolute top-2 left-1/2 -translate-x-1/2 shadow-[0_0_10px_#34d399]"></div>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Majma<span className="text-emerald-600">Digital</span></h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 animate-pulse">Initialisation...</p>
                </div>
            </div>
            
            {showRetry && (
                <div className="absolute bottom-10 animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center gap-3 z-20">
                    <p className="text-[10px] text-slate-400 font-medium">La connexion semble lente.</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 hover:text-emerald-600 transition-all flex items-center gap-2"
                    >
                        <RefreshCcw size={14} /> Recharger
                    </button>
                </div>
            )}
        </div>
    );
};

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewProfileId, setViewProfileId] = useState<string | null>(null);
  
  const { isLoading: isDataLoading } = useData();
  const { user, isImpersonating, stopImpersonation, updateUser, loading: isAuthLoading } = useAuth();

  // --- SUPABASE REALTIME ROLE LISTENER ---
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('public:profiles')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log("⚡ Changement de rôle détecté en temps réel :", payload.new);
          updateUser({ 
              role: payload.new.role,
              firstName: payload.new.first_name,
              lastName: payload.new.last_name,
              matricule: payload.new.matricule
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, updateUser]);

  // Priority to Auth Loading
  if (isAuthLoading) {
      return <PageLoader />;
  }

  // --- 1. GESTION DES VISITEURS ---
  if (!user) {
    return <GuestDashboard />;
  }

  // --- 2. ROUTAGE INTELLIGENT SELON LE RÔLE ---
  const role = (user.role || '').toUpperCase();

  // Cas : Profil incomplet ou Sympathisant
  if (role === 'SYMPATHISANT' || role === 'NEW_USER') {
      return (
        <Suspense fallback={<PageLoader />}>
            <ProfileCompletion onComplete={() => window.location.reload()} />
        </Suspense>
      );
  }

  // Dashboard Switching Logic
  const getDashboardComponent = () => {
     if (['SG', 'ADMIN', 'ADJOINT_SG', 'DIEUWRINE'].includes(role)) {
         return <AdminDashboard setActiveTab={setActiveTab} members={[]} events={[]} contributions={[]} />;
     } else {
         return <MemberDashboard setActiveTab={setActiveTab} />;
     }
  };

  const isAdminOrManager = ['ADMIN', 'SG', 'ADJOINT_SG', 'DIEUWRINE'].includes(role);

  const navigateToProfile = (id: string | null) => {
    setViewProfileId(id);
    setActiveTab('profile');
  };

  const renderContent = () => {
    // Vue Bureau Exécutif (War Room) - Réservé
    if (activeTab === 'bureau' && isAdminOrManager) {
      return (
        <Suspense fallback={<PageLoader />}>
           <WarRoomLayout />
        </Suspense>
      );
    }

    return (
      <Suspense fallback={<PageLoader />}>
        {(() => {
          switch (activeTab) {
            case 'dashboard': return getDashboardComponent();
            case 'members': return <MemberModule onViewProfile={navigateToProfile} />;
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
            case 'admin': return isAdminOrManager ? <AdminModule /> : getDashboardComponent();
            case 'settings': return <SettingsModule onBack={() => setActiveTab('dashboard')} />;
            case 'profile': return <UserProfile targetId={viewProfileId} onBack={() => { setViewProfileId(null); setActiveTab('members'); }} />;
            default: return getDashboardComponent();
          }
        })()}
      </Suspense>
    );
  };

  if (isDataLoading) {
      return <PageLoader />;
  }

  return (
    <div className={`flex h-screen w-full bg-[#f8fafc] overflow-hidden relative transition-all duration-500 ${isImpersonating ? 'border-[8px] border-amber-500/50' : ''}`}>
      
      {/* SIMULATION HUD */}
      {isImpersonating && (
        <div className="fixed top-0 left-0 right-0 h-14 bg-slate-900 text-amber-500 px-6 flex justify-between items-center z-[100] shadow-2xl">
          <div className="flex items-center gap-4">
             <div className="p-2 bg-amber-500/10 rounded-lg animate-pulse border border-amber-500/30">
                <VenetianMask size={18} />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Mode Simulation</span>
                <span className="text-xs font-bold font-mono text-amber-400 flex items-center gap-2">
                   <Eye size={12}/> {user?.firstName} {user?.lastName} ({user?.role})
                </span>
             </div>
          </div>
          <button onClick={stopImpersonation} className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
             <Power size={14} /> Terminer
          </button>
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

      {/* MAIN AREA */}
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
            {renderContent()}
         </div>
      </div>
      
      <Suspense fallback={null}>
         <AIChatBot />
      </Suspense>
    </div>
  );
};

const App = () => {
  return (
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
};

export default App;
