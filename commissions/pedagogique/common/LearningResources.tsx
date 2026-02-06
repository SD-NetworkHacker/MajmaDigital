
import React from 'react';
import { Search, Filter, Plus, Book, FileText, Video, Headphones, Download } from 'lucide-react';
import { useData } from '../../../contexts/DataContext';

interface Props { sector: string; }

const LearningResources: React.FC<Props> = ({ sector }) => {
  const { library } = useData();

  // Filter resources relevant to pedagogy or specific category
  const resources = library.filter(r => 
    r.category === 'Pédagogie' || r.category === 'Khassaid' || r.category === 'Coran'
  );

  const getIcon = (type: string) => {
      switch (type) {
          case 'video': return <Video size={20} />;
          case 'audio': return <Headphones size={20} />;
          default: return <Book size={20} />;
      }
  };

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
          <button className="px-8 py-4 bg-cyan-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all">
            <Plus size={18} /> Soumettre Ressource
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {resources.length > 0 ? resources.map((res) => (
          <div key={res.id} className="glass-card p-6 flex flex-col justify-between group hover:border-cyan-200 transition-all">
             <div className="flex justify-between items-start mb-4">
                 <div className="p-3 bg-slate-50 text-slate-500 rounded-2xl group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-all">
                    {getIcon(res.type)}
                 </div>
                 <span className="text-[9px] font-bold uppercase bg-slate-50 px-2 py-1 rounded text-slate-400">{res.type}</span>
             </div>
             <div>
                <h4 className="font-black text-slate-800 text-sm leading-tight mb-1">{res.title}</h4>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{res.author}</p>
             </div>
             <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                 <button className="text-[10px] font-black text-cyan-600 uppercase flex items-center gap-2 hover:underline">Voir</button>
                 <Download size={14} className="text-slate-300 hover:text-cyan-600 cursor-pointer"/>
             </div>
          </div>
        )) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-[2rem]">
             <Book size={48} className="mb-4 opacity-20"/>
             <p className="text-xs font-bold uppercase">Médiathèque pédagogique vide</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningResources;
