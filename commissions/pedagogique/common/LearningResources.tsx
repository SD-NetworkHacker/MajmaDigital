
import React from 'react';
import { Search, Filter, Play, FileText, Download, Languages, Book, ChevronRight, Zap, Library, Plus } from 'lucide-react';

interface Props { sector: string; }

const LearningResources: React.FC<Props> = ({ sector }) => {
  const resources = [
    { title: 'Explication Sindidi', type: 'Vidéo', duration: '45 min', category: 'Xassaid', color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { title: 'Guide de la Prière', type: 'PDF', size: '2.4 MB', category: 'Fiqh', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Quiz Histoire du Mouridisme', type: 'Interactif', q: '20 Questions', category: 'Culture', color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Audio Récitation Kore', type: 'Audio', length: '12:45', category: 'Audio', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-8 animate-in zoom-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex-1 w-full relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-cyan-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un texte, un cours, une vidéo..." 
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] text-sm font-bold shadow-sm focus:ring-4 focus:ring-cyan-500/5 transition-all outline-none"
          />
        </div>
        <div className="flex gap-3">
          <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-cyan-600 transition-all shadow-sm"><Filter size={20}/></button>
          <button className="px-8 py-4 bg-cyan-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3">
            <Plus size={18} /> Soumettre Ressource
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {resources.map((res, i) => (
          <div key={i} className="glass-card p-8 group hover:border-cyan-100 transition-all flex flex-col justify-between relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                   <div className={`p-4 rounded-2xl shadow-inner ${res.bg} ${res.color} group-hover:scale-110 transition-transform duration-500`}>
                      {res.type === 'Vidéo' ? <Play size={24} className="fill-current" /> : res.type === 'PDF' ? <FileText size={24} /> : res.type === 'Interactif' ? <Zap size={24} /> : <Book size={24} />}
                   </div>
                   <span className="text-[8px] font-black uppercase bg-white border border-slate-100 px-2 py-1 rounded-lg text-slate-400">{res.type}</span>
                </div>
                <h4 className="text-base font-black text-slate-800 leading-tight mb-2">{res.title}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10">{res.category} • {res.duration || res.size || res.q || res.length}</p>
             </div>
             
             <div className="relative z-10 pt-6 border-t border-slate-50 flex justify-between items-center">
                <div className="flex gap-2">
                   <button className="p-2 text-slate-300 hover:text-cyan-600 transition-colors"><Languages size={16} /></button>
                   <button className="p-2 text-slate-300 hover:text-cyan-600 transition-colors"><Download size={16} /></button>
                </div>
                <button className="text-[9px] font-black text-cyan-600 uppercase flex items-center gap-2 hover:gap-4 transition-all">Démarrer <ChevronRight size={14}/></button>
             </div>
             <div className={`absolute -right-6 -bottom-6 opacity-5 rotate-12 transition-transform duration-1000 group-hover:scale-150 ${res.color}`}><Library size={100} /></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningResources;
