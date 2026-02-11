
import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, X, Bell, User, LogOut, Settings, 
  ChevronDown, Search, LayoutGrid, Shield 
} from 'lucide-react';
// Fix: Corrected path for AuthContext
import { useAuth } from '../../contexts/AuthContext';
// Fix: Removed NotificationContext as it is obsolete
import { useTheme } from '../../context/ThemeContext';

interface MainNavbarProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

const MainNavbar: React.FC<MainNavbarProps> = ({ onNavigate, currentView }) => {
  const { user, logout } = useAuth();
  const { theme } = useTheme(); 
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fix: Set unreadNotifications to 0 since context is missing
  const unreadNotifications = 0;

  // Fermer le menu utilisateur si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'dashboard', label: 'Tableau de Bord', role: 'all' },
    { id: 'commissions', label: 'Commissions', role: 'all' },
    { id: 'finance', label: 'Finance', role: 'admin' }, // Exemple restriction
    { id: 'members', label: 'Membres', role: 'all' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm transition-all duration-300">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 1. LOGO & BRAND */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleNavClick('dashboard')}>
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-500 font-arabic text-2xl pb-1 shadow-lg shadow-emerald-900/20">
              م
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                Majma<span className="text-emerald-600">Digital</span>
              </h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Dahira Majmahoun Nourayni</p>
            </div>
          </div>

          {/* 2. DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
            {navLinks.map((link) => {
              if (link.role === 'admin' && user?.role !== 'admin' && user?.role !== 'manager') return null;
              
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                    isActive 
                      ? 'bg-white text-emerald-700 shadow-md shadow-slate-200 scale-105' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* 3. RIGHT ACTIONS */}
          <div className="flex items-center gap-3 md:gap-6">
            
            {/* Search (Desktop) */}
            <div className="hidden md:flex relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-none">
                <Search size={14} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl text-xs font-medium w-48 focus:w-64 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all duration-300 outline-none"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all active:scale-95">
              <Bell size={20} />
              {unreadNotifications > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-slate-200 hover:border-emerald-200 bg-white hover:shadow-md transition-all group"
              >
                <div className="hidden md:flex flex-col items-end mr-1">
                  <span className="text-xs font-black text-slate-800 leading-tight group-hover:text-emerald-700">
                    {user?.firstName || 'Invité'}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">
                    {user?.role || 'Visiteur'}
                  </span>
                </div>
                <div className="w-9 h-9 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                  )}
                </div>
                <ChevronDown size={14} className={`text-slate-400 mr-2 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                  <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                    <p className="text-xs font-black text-slate-800">Mon Compte</p>
                    <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button onClick={() => handleNavClick('profile')} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors text-left">
                      <User size={16} /> Profil & Bio
                    </button>
                    <button onClick={() => handleNavClick('settings')} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors text-left">
                      <Settings size={16} /> Paramètres
                    </button>
                    {user?.role === 'admin' && (
                      <button onClick={() => handleNavClick('admin')} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors text-left">
                        <Shield size={16} /> Administration
                      </button>
                    )}
                  </div>
                  <div className="p-2 border-t border-slate-50">
                    <button 
                      onClick={() => logout()}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left"
                    >
                      <LogOut size={16} /> Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2.5 bg-slate-100 rounded-xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 shadow-xl p-4 animate-in slide-in-from-top-10 z-40">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-bold transition-all ${
                  currentView === link.id 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${currentView === link.id ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                {link.label}
              </button>
            ))}
            <div className="h-px bg-slate-100 my-2"></div>
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default MainNavbar;
