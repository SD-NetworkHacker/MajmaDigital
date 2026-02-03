
import React, { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showBrand?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, showBrand = true }) => {
  return (
    <div className="min-h-screen w-full flex items-stretch overflow-hidden bg-slate-50">
      
      {/* LEFT COLUMN: Visual & Brand (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden items-center justify-center">
        {/* Background Image with Overlay */}
        <div 
            className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=2070&auto=format&fit=crop')" }} // Image Grande Mosquée générique ou Touba style
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 to-slate-950/90 z-10"></div>
        
        {/* Decorative Pattern */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 font-arabic text-[35rem] text-white z-0 pointer-events-none select-none animate-pulse-slow">
           م
        </div>

        {/* Brand Content */}
        <div className="relative z-20 text-center px-12 max-w-lg">
           <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 text-emerald-400 shadow-2xl mb-10">
              <span className="font-arabic text-5xl pb-3">م</span>
           </div>
           <h1 className="text-5xl font-black text-white tracking-tight mb-6">Majma<span className="text-emerald-400">Digital</span></h1>
           <p className="text-lg text-slate-300 font-medium leading-relaxed">
             "La plateforme unifiée pour la gestion spirituelle, administrative et sociale du Dahira Majmahoun Nourayni."
           </p>
           
           <div className="mt-12 flex justify-center gap-4">
              {['Gestion Membres', 'Trésorerie', 'Événements', 'Xassaids'].map((tag, i) => (
                <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/70">
                   {tag}
                </span>
              ))}
           </div>
        </div>

        {/* Footer Copyright */}
        <div className="absolute bottom-8 left-0 right-0 text-center z-20">
           <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">© 2024 Commission Communication</p>
        </div>
      </div>

      {/* RIGHT COLUMN: Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-24 bg-white relative">
        <div className="w-full max-w-md animate-in slide-in-from-bottom-8 duration-700">
           
           {/* Mobile Brand (Visible only on mobile) */}
           <div className="lg:hidden text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 text-emerald-500 shadow-xl mb-4">
                 <span className="font-arabic text-2xl pb-1">م</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">Majma<span className="text-emerald-600">Digital</span></h2>
           </div>

           <div className="mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">{title}</h2>
              {subtitle && <p className="text-slate-500 font-medium">{subtitle}</p>}
           </div>

           {children}

        </div>
      </div>

    </div>
  );
};

export default AuthLayout;
