
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MemberModule from './components/MemberModule';
import MemberMapModule from './components/MemberMapModule';
import CommissionModule from './components/CommissionModule';
import FinanceModule from './components/FinanceModule';
import EventModule from './components/EventModule';
import MessagesModule from './components/MessagesModule';
import AdminModule from './components/AdminModule';
import SettingsModule from './components/SettingsModule';
import PedagogicalModule from './components/PedagogicalModule';
import HealthModule from './components/HealthModule';
import SocialModule from './components/SocialModule';
import AIChatBot from './components/AIChatBot';
import WarRoomLayout from './components/bureau/WarRoomLayout';
import { Bell, Search, Cloud, Menu, ChevronDown, Command } from 'lucide-react';
import { DataProvider, useData } from './contexts/DataContext';

// Composant wrapper pour utiliser le hook useData
const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { members, events, contributions, userProfile } = useData();

  useEffect(() => {
    // Simulation sync silencieuse
    const interval = setInterval(() => {
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 800);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = (tab: string) => {
    switch(tab) {
        case 'dashboard': return 'Tableau de Bord';
        case 'members': return 'Annuaire des Membres';
        case 'map': return 'Cartographie';
        case 'commissions': return 'Commissions & Pôles';
        case 'finance': return 'Finance & Trésorerie';
        case 'events': return 'Agenda & Événements';
        case 'messages': return 'Messagerie Interne';
        case 'admin': return 'Administration Système';
        case 'settings': return 'Paramètres';
        case 'pedagogy': return 'Pôle Pédagogique';
        case 'social': return 'Action Sociale';
        case 'health': return 'Santé & Bien-être';
        case 'bureau': return 'Bureau Exécutif';
        default: return 'MajmaDigital Platform';
    }
  };

  const renderContent = () => {
    if (activeTab === 'bureau') {
      return <WarRoomLayout />;
    }

    const commonProps = { members, events, contributions };
    
    switch (activeTab) {
      case 'dashboard': return <Dashboard {...commonProps} />;
      case 'members': return <MemberModule />; 
      case 'map': return <MemberMapModule members={members} />;
      case 'commissions': return <CommissionModule members={members} events={events} />;
      case 'pedagogy': return <PedagogicalModule />;
      case 'social': return <SocialModule />;
      case 'health': return <HealthModule />;
      case 'finance': return <FinanceModule />;
      case 'events': return <EventModule />;
      case 'messages': return <MessagesModule />;
      case 'admin': return <AdminModule />;
      case 'settings': return <SettingsModule />;
      default: return <Dashboard {...commonProps} />;
    }
  };

  if (activeTab === 'bureau') {
    return (
      <div className="h-dvh w-screen overflow-hidden bg-slate-950">
        {renderContent()}
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className="fixed bottom-6 left-6 z-[100] px-4 py-2 bg-white/10 backdrop-blur text-white/50 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10 transition-all hover:bg-white/20"
        >
          Retour App
        </button>
      </div>
    );
  }

  return (
    // Structure App Shell optimisée
    <div className="flex h-dvh w-full bg-[#f8fafc] overflow-hidden relative selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Sidebar Desktop */}
      <aside className="hidden lg:block w-[280px] h-full border-r border-slate-200/60 bg-white/80 backdrop-blur-xl shrink-0 z-50 transition-all duration-300">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>

      {/* Main Layout Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative bg-[#f8fafc]">
        
        {/* Header Enhanced */}
        <header className="h-[88px] border-b border-slate-200/60 bg-white/80 backdrop-blur-xl flex items-center justify-between px-6 lg:px-10 shrink-0 z-40 sticky top-0 transition-all duration-300">
          
          <div className="flex items-center gap-6 flex-1 max-w-4xl">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-500 active:scale-95 transition-transform hover:text-emerald-600 hover:border-emerald-100">
              <Menu size={20} />
            </button>
            
            {/* Context Title & Breadcrumbs */}
            <div className="hidden lg:flex flex-col animate-in fade-in slide-in-from-left-2 duration-300 w-48" key={activeTab}>
               <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none truncate">{getPageTitle(activeTab)}</h1>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
               </p>
            </div>

            {/* Separator */}
            <div className="hidden lg:block h-8 w-px bg-slate-200 mx-2"></div>

            {/* Search Bar - Enhanced Visuals */}
            <div className="hidden md:flex items-center gap-3 bg-slate-50/50 border border-slate-200/80 rounded-2xl px-5 py-3 flex-1 max-w-md transition-all duration-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-500/30 focus-within:shadow-xl focus-within:shadow-emerald-900/5 group hover:border-slate-300 cursor-text">
              <Search size={18} className="text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Rechercher (Ctrl+K)" 
                className="bg-transparent border-none outline-none text-sm w-full font-bold text-slate-700 placeholder-slate-400/80" 
              />
              <div className="hidden xl:flex items-center gap-1 px-2 py-1 bg-white rounded-lg border border-slate-200 text-[9px] font-black text-slate-400 shadow-sm">
                <Command size={10} />K
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Live Sync Widget */}
            <div className={`hidden xl:flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-all duration-500 ${isSyncing ? 'bg-emerald-50 border-emerald-100 shadow-sm' : 'bg-transparent border-transparent'}`}>
              <Cloud size={16} className={isSyncing ? 'text-emerald-500 animate-bounce' : 'text-slate-300'} />
              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isSyncing ? 'text-emerald-700' : 'text-slate-400'}`}>
                {isSyncing ? 'Sync...' : 'Cloud Actif'}
              </span>
            </div>

            {/* Notifications */}
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 relative hover:text-emerald-600 hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-900/5 transition-all duration-300 active:scale-95 group">
              <Bell size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-sm"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-4 pl-5 border-l border-slate-200/60 ml-2">
              <div className="text-right hidden xl:block leading-tight">
                <p className="text-xs font-black text-slate-800">{userProfile.firstName} {userProfile.lastName}</p>
                <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">{userProfile.role}</p>
              </div>
              <button 
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-2 cursor-pointer group p-1 pr-2 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-xl shadow-slate-900/20 group-hover:scale-105 transition-transform border-2 border-white ring-2 ring-slate-100 group-hover:ring-emerald-200 overflow-hidden">
                  {userProfile.avatar ? (
                    <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{userProfile.firstName[0]}{userProfile.lastName[0]}</span>
                  )}
                </div>
                <ChevronDown size={14} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-transparent relative scroll-smooth">
          <div className="p-4 md:p-8 lg:p-10 max-w-[1920px] mx-auto min-h-full flex flex-col">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute left-0 w-80 h-full bg-white animate-in slide-in-from-left duration-300 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex justify-end p-4">
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-50 rounded-full"><ChevronDown className="rotate-90" size={20}/></button>
            </div>
            <Sidebar activeTab={activeTab} setActiveTab={(t) => { setActiveTab(t); setIsMobileMenuOpen(false); }} />
          </div>
        </div>
      )}
      
      <AIChatBot />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <MainContent />
    </DataProvider>
  );
};

export default App;
