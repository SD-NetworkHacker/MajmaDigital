
import React from 'react';
import { GraduationCap, Briefcase, Globe, Search, Plus, MapPin, ChevronRight, History, Award, BookOpen, Star, Compass } from 'lucide-react';

const UniversitySectorHub: React.FC = () => {
  return (
    <div className="space-y-8 animate-in zoom-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* University Mentoring */}
        <div className="lg:col-span-8 glass-card p-10 bg-white relative overflow-hidden group">
           <div className="flex justify-between items-center mb-12 relative z-10">
              <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                 <Compass size={24} className="text-emerald-500" /> Mentorat Universitaire & Recherche
              </h4>
              <button className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100"><Plus size={18}/></button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-6">
                 <p className="text-sm font-medium text-slate-600 leading-relaxed italic border-l-4 border-emerald-200 pl-6">
                   "Le savoir est une lumière qu'Allah projette dans le cœur. Couplez votre excellence académique à la profondeur spirituelle."
                 </p>
                 <div className="space-y-4">
                    <p className="text-xs text-slate-400 italic">Aucun projet de recherche en cours.</p>
                 </div>
              </div>
              <div className="aspect-square bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center p-10 text-center group-hover:bg-emerald-50 transition-all cursor-pointer">
                 <div className="p-5 bg-white rounded-3xl shadow-xl text-emerald-600 mb-6 transition-transform group-hover:rotate-12 duration-500"><GraduationCap size={40} /></div>
                 <h5 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">Bourses & Orientations</h5>
                 <p className="text-[10px] text-slate-400 font-medium">Consultez les dernières opportunités de bourses d'études et stages exclusifs pour le Dahira.</p>
                 <button className="mt-8 px-6 py-3 bg-white border border-emerald-100 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm">Accéder au Portail</button>
              </div>
           </div>
           <div className="absolute -right-10 -bottom-10 opacity-[0.02] font-arabic text-[20rem] rotate-12 pointer-events-none text-emerald-900">ع</div>
        </div>

        {/* Career Side Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-slate-900 text-white flex flex-col h-full">
              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-10 flex items-center gap-3">
                 <Briefcase size={18} /> Career Guidance Hub
              </h4>
              <div className="space-y-6 flex-1">
                 <p className="text-xs text-slate-500 italic">Aucun meetup planifié.</p>
                 
                 <div className="space-y-4 pt-10">
                    <h5 className="text-[9px] font-black uppercase opacity-30 border-b border-white/5 pb-2">Mentors Disponibles</h5>
                    <p className="text-[10px] text-slate-500 italic">Aucun mentor inscrit.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UniversitySectorHub;
