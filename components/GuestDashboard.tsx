
import React from 'react';
import { LogIn, Calendar, Heart, BookOpen, Star, Info, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GuestDashboard: React.FC = () => {
  const { loginAsGuest } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      
      {/* HERO SECTION - VERT & OR */}
      <div className="relative bg-[#2E8B57] text-white overflow-hidden rounded-b-[3rem] shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 p-10 opacity-20 font-arabic text-9xl text-[#D4AF37] rotate-12 select-none">م</div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-[2rem] border-2 border-[#D4AF37]/50 flex items-center justify-center mb-8 shadow-lg shadow-[#2E8B57]/50">
             <span className="font-arabic text-6xl text-[#D4AF37] pb-2">م</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Dahira <span className="text-[#D4AF37]">Majmahoun Nourayni</span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl font-medium leading-relaxed">
            Plateforme numérique unifiée pour la gestion spirituelle, sociale et administrative de la communauté.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
             <button 
               onClick={loginAsGuest}
               className="px-8 py-4 bg-[#D4AF37] text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-[#c5a028] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3"
             >
                <LogIn size={18} /> Accès Membre / Démo
             </button>
             <button className="px-8 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-white/20 transition-all flex items-center justify-center gap-3">
                <Info size={18} /> En savoir plus
             </button>
          </div>
        </div>
      </div>

      {/* PUBLIC MODULES PREVIEW */}
      <div className="max-w-7xl mx-auto px-6 py-20">
         <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Piliers du Dahira</h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full"></div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* SOCIAL */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 hover:border-[#D4AF37]/50 transition-all group">
               <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6 group-hover:scale-110 transition-transform">
                  <Heart size={32} />
               </div>
               <h3 className="text-xl font-black text-slate-800 mb-3">Action Sociale</h3>
               <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Solidarité, entraide et soutien aux membres. Participez aux cagnottes et oeuvres caritatives.
               </p>
               <span className="text-xs font-bold text-rose-600 uppercase tracking-widest flex items-center gap-2">
                  Voir les projets <ArrowRight size={14}/>
               </span>
            </div>

            {/* CULTURE */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 hover:border-[#D4AF37]/50 transition-all group">
               <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen size={32} />
               </div>
               <h3 className="text-xl font-black text-slate-800 mb-3">Pédagogie & Xassaids</h3>
               <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Médiathèque numérique, académie d'apprentissage et ressources spirituelles accessibles à tous.
               </p>
               <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                  Explorer <ArrowRight size={14}/>
               </span>
            </div>

            {/* EVENTS */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 hover:border-[#D4AF37]/50 transition-all group">
               <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                  <Calendar size={32} />
               </div>
               <h3 className="text-xl font-black text-slate-800 mb-3">Grands Événements</h3>
               <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Magal, Ziar, et Thiants. Suivez le calendrier et organisez votre participation.
               </p>
               <span className="text-xs font-bold text-amber-600 uppercase tracking-widest flex items-center gap-2">
                  Calendrier <ArrowRight size={14}/>
               </span>
            </div>
         </div>
      </div>

      {/* FOOTER SIMPLE */}
      <footer className="bg-slate-900 text-white py-12 text-center">
         <div className="flex justify-center items-center gap-3 mb-6 opacity-80">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-[#D4AF37] font-arabic">م</div>
            <span className="font-bold tracking-widest uppercase">MajmaDigital</span>
         </div>
         <p className="text-[10px] text-slate-500 uppercase tracking-widest">© 2024 Commission Communication</p>
      </footer>

    </div>
  );
};

export default GuestDashboard;
