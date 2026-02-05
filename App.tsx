
import React, { useState, Suspense, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';

// Lazy Components
const MemberModule = React.lazy(() => import('@/components/MemberModule'));
const MemberMapModule = React.lazy(() => import('@/components/MemberMapModule'));
const CommissionModule = React.lazy(() => import('@/components/CommissionModule'));
const FinanceModule = React.lazy(() => import('@/components/FinanceModule'));
const EventModule = React.lazy(() => import('@/components/EventModule'));
const MessagesModule = React.lazy(() => import('@/components/MessagesModule'));
const AdminModule = React.lazy(() => import('@/components/AdminModule'));
const SettingsModule = React.lazy(() => import('@/components/SettingsModule'));
const PedagogicalModule = React.lazy(() => import('@/components/PedagogicalModule'));
const HealthModule = React.lazy(() => import('@/components/HealthModule'));
const SocialModule = React.lazy(() => import('@/components/SocialModule'));
const AIChatBot = React.lazy(() => import('@/components/AIChatBot'));
const WarRoomLayout = React.lazy(() => import('@/components/bureau/WarRoomLayout'));
const UserProfile = React.lazy(() => import('@/components/profile/UserProfile'));
const TransportDashboard = React.lazy(() => import('@/commissions/transport/TransportDashboard'));
const CulturalDashboard = React.lazy(() => import('@/commissions/culturelle/CulturalDashboard'));
// Dashboards spécifiques demandés
const AdminDashboard = React.lazy(() => import('@/components/admin/AdminDashboard'));
const MemberDashboard = React.lazy(() => import('@/components/member/MemberDashboard'));

import GuestDashboard from '@/components/GuestDashboard';

import { Menu, Power, Eye, VenetianMask, Loader2 } from 'lucide-react';
import { DataProvider, useData } from '@/contexts/DataContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { LoadingProvider } from '@/context/LoadingContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase'; // Import direct pour le realtime

// Fallback Loader (Gold Color #D4AF37)
const PageLoader = () => (
  <div className="h-full w-full flex items-center justify-center bg-slate-50">
     <div className="flex flex-col items-center gap-4">
        <Loader2 size={48} className="animate-spin text-[#D4AF37]" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Chargement MajmaDigital...</p>
     </div>
  </div>
);

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewProfileId, setViewProfileId] = useState<string | null>(null);
  
  const { members, events, contributions, isLoading } = useData();
  const { user, isImpersonating, stopImpersonation, updateUser } = useAuth();

  // --- SUPABASE REALTIME ROLE LISTENER ---
  useEffect(() => {
    if (!user) return;

    // Écoute les changements sur la table 'profiles' pour l'utilisateur courant
    const channel = supabase
      .channel('public:profiles')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`, // Filtre sur l'ID de l'utilisateur connecté
        },
        (payload) => {
          console.log("⚡ Changement de rôle détecté en temps réel :", payload.new);
          // Mise à jour immédiate du contexte Auth
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

  // --- LOGIQUE DE ROUTING AUTOMATIQUE ---
  // Si l'utilisateur n'est pas connecté
  if (!user) {
    return <GuestDashboard />;
  }

  // Dashboard Switching Logic (Facebook Style)
  const getDashboardComponent = () => {
     // Normalisation pour éviter les erreurs de casse
     const role = (user.role || '').toUpperCase();
     
     if (['SG', 'ADMIN', 'ADJOINT_SG', 'DIEUWRINE'].includes(role)) {
         return <AdminDashboard setActiveTab={setActiveTab} members={members} events={events} contributions={contributions} />;
     } else {
         // Par défaut pour MEMBRE et tout autre rôle
         return <MemberDashboard setActiveTab={setActiveTab} />;
     }
  };

  const role = (user.role || '').toUpperCase();
  const isAdminOrManager = ['ADMIN', 'SG', 'ADJOINT_SG', 'DIEUWRINE'].includes(role);

  const navigateToProfile = (id: string | null) => {
    setViewProfileId(id);
    setActiveTab('profile');
  };

  const renderContent = () => {
    // Vue Bureau Exécutif (War Room)
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
            case 'admin': return isAdminOrManager ? <AdminModule /> : getDashboardComponent();
            case 'settings': return <SettingsModule onBack={() => setActiveTab('dashboard')} />;
            case 'profile': return <UserProfile targetId={viewProfileId} onBack={() => { setViewProfileId(null); setActiveTab('members'); }} />;
            default: return getDashboardComponent();
          }
        })()}
      </Suspense>
    );
  };

  if (isLoading) {
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
