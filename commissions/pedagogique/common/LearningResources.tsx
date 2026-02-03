
import React from 'react';
import { Search, Filter, Play, FileText, Download, Languages, Book, ChevronRight, Zap, Library, Plus } from 'lucide-react';

interface Props { sector: string; }

const LearningResources: React.FC<Props> = ({ sector }) => {
  // Liste vide
  const resources: any[] = [];

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
        {resources.length > 0 ? resources.map((res, i) => (
          <div key={i}></div>
        )) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
             <Library size={48} className="mb-4 opacity-20"/>
             <p className="text-xs font-bold uppercase">Médiathèque vide</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningResources;
