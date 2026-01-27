
import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Headphones, Video, FileText, Star, Download, Play } from 'lucide-react';
import { LibraryResource } from '../../types';
import { getLibraryResources } from '../../services/cultureService';

const DigitalLibrary: React.FC = () => {
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [activeType, setActiveType] = useState('all');

  useEffect(() => {
    getLibraryResources().then(setResources);
  }, []);

  const filteredResources = activeType === 'all' ? resources : resources.filter(r => r.type === activeType);

  const getIcon = (type: string) => {
    switch (type) {
      case 'audio': return <Headphones size={24} />;
      case 'video': return <Video size={24} />;
      case 'livre': return <BookOpen size={24} />;
      default: return <FileText size={24} />;
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex-1 w-full relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un ouvrage, un auteur..." 
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] text-sm font-bold shadow-sm focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
          />
        </div>
        <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200">
           {['all', 'livre', 'audio', 'video'].map(t => (
              <button 
                key={t} 
                onClick={() => setActiveType(t)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeType === t ? 'bg-white text-indigo-700 shadow-md' : 'text-slate-400 hover:text-indigo-600'
                }`}
              >
                {t === 'all' ? 'Tout' : t}
              </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredResources.map(resource => (
          <div key={resource.id} className="glass-card p-6 group hover:border-indigo-200 transition-all flex flex-col relative overflow-hidden">
             <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
             
             <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                   {getIcon(resource.type)}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                   <Star size={10} className="fill-current" /> {resource.rating}
                </div>
             </div>

             <h4 className="text-sm font-black text-slate-800 leading-tight mb-1">{resource.title}</h4>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">{resource.author}</p>

             <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-50">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{resource.views} Vues</span>
                <div className="flex gap-2">
                   {resource.type === 'audio' || resource.type === 'video' ? (
                     <button className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"><Play size={14} className="fill-current"/></button>
                   ) : (
                     <button className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"><BookOpen size={14}/></button>
                   )}
                   <button className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"><Download size={14}/></button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DigitalLibrary;
