
import React, { useState } from 'react';
import { MessageSquare, FileText, Send, Plus, ChevronRight, Share2, Globe, Sparkles, Wand2, Archive, Newspaper, ShieldCheck } from 'lucide-react';

const InstitutionalComm: React.FC = () => {
  const [activeComm, setActiveComm] = useState('releases');

  const releases: any[] = [];

  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Comm Editor & List */}
        <div className="lg:col-span-8 space-y-8">
           <div className="glass-card p-10 bg-white">
              <div className="flex justify-between items-center mb-12">
                 <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <Newspaper size={24} className="text-slate-800" /> Espace Presse & Communiqués
                 </h4>
                 <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl hover:bg-black transition-all active:scale-95">
                    <Plus size={14}/> Rédiger Note
                 </button>
              </div>

              <div className="space-y-4">
                 {releases.length > 0 ? releases.map((release, i) => (
                   <div key={i}></div>
                 )) : (
                   <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl">
                      <Newspaper size={40} className="mb-4 opacity-20"/>
                      <p className="text-xs font-bold uppercase">Aucun communiqué publié</p>
                   </div>
                 )}
              </div>
           </div>

           <div className="glass-card p-10 bg-gradient-to-br from-slate-800 to-black text-white relative overflow-hidden group shadow-2xl">
              <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10 text-emerald-400">
                       <Wand2 size={32} />
                    </div>
                    <h4 className="font-black text-sm uppercase tracking-[0.15em]">Majma AI Diplomat</h4>
                 </div>
                 <h2 className="text-3xl font-black mb-4 tracking-tight">Rédaction Intelligente</h2>
                 <p className="text-sm font-medium leading-relaxed italic opacity-80 mb-10 max-w-xl">
                   "Générez instantanément des lettres de créance, des remerciements post-ziar ou des propositions de jumelage avec un ton spirituel et formel parfait."
                 </p>
                 <div className="flex gap-4">
                    <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-slate-100 transition-all flex items-center gap-3">
                       <Sparkles size={16}/> Lancer l'Assistant
                    </button>
                    <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/20 transition-all flex items-center gap-3">
                       <Archive size={16}/> Templates
                    </button>
                 </div>
              </div>
              <div className="absolute top-1/2 right-0 -translate-y-1/2 p-10 opacity-[0.05] font-arabic text-[15rem] rotate-12 pointer-events-none">خ</div>
           </div>
        </div>

        {/* Public Image & Media Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-white">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 flex items-center gap-3">
                 <Globe size={18} className="text-slate-800" /> Kit Média Officiel
              </h4>
              <div className="space-y-4">
                 <p className="text-xs text-slate-400 italic text-center">Aucun fichier média disponible.</p>
              </div>
              <button className="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                 <Send size={16}/> Envoyer aux Médias
              </button>
           </div>

           <div className="glass-card p-8 border-emerald-100 bg-emerald-50/20">
              <div className="flex items-center gap-3 mb-6 text-emerald-700">
                 <ShieldCheck size={22} />
                 <h4 className="font-black text-xs uppercase tracking-widest">Veille Réputationnelle</h4>
              </div>
              <p className="text-[12px] font-medium text-slate-700 leading-relaxed italic">
                "Aucune donnée de veille disponible."
              </p>
              <button className="mt-6 text-[10px] font-black text-emerald-600 hover:underline uppercase tracking-widest">Voir le rapport d'e-reputation</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionalComm;
