
import React, { ReactNode } from 'react';
import MainNavbar from './MainNavbar';
import Footer from './Footer';
import { ChevronRight, Home } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  activeView: string;
  onNavigate: (view: string) => void;
  sidebar?: ReactNode; // Sidebar optionnelle (pour les vues commissions)
  breadcrumbs?: { label: string; view?: string }[];
  fullWidth?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  activeView, 
  onNavigate, 
  sidebar, 
  breadcrumbs = [],
  fullWidth = false
}) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Fixed Navbar */}
      <MainNavbar onNavigate={onNavigate} currentView={activeView} />

      <div className="flex flex-1 relative max-w-[1920px] mx-auto w-full">
        
        {/* Optional Sidebar (Desktop) */}
        {sidebar && (
          <aside className="hidden lg:block sticky top-20 h-[calc(100vh-80px)] shrink-0 z-30">
            {sidebar}
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 flex flex-col min-w-0 ${fullWidth ? '' : 'px-4 sm:px-6 lg:px-8 py-8'}`}>
          
          {/* Breadcrumbs (Only if not full width/custom view) */}
          {!fullWidth && breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8 animate-in slide-in-from-left-2">
              <button 
                onClick={() => onNavigate('dashboard')} 
                className="hover:text-emerald-600 flex items-center gap-1 transition-colors"
              >
                <Home size={12} /> Accueil
              </button>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <ChevronRight size={10} className="text-slate-300" />
                  {crumb.view ? (
                    <button 
                      onClick={() => onNavigate(crumb.view!)}
                      className="hover:text-emerald-600 transition-colors"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="text-slate-800">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}

          {/* Page Content */}
          <div className="flex-1 animate-in fade-in duration-500">
            {children}
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
