
import React, { useState } from 'react';
import { Search, Filter, Image as ImageIcon, Video, FolderOpen, Download, Share2, MoreVertical, Eye, Heart, Tag, Plus, Grid, List } from 'lucide-react';

const MultimediaLibrary: React.FC = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  const assets = [
    { id: 1, title: 'Portrait Cheikh Bamba', type: 'image', size: '2.4 MB', date: 'Hier', tag: 'Spirituel' },
    { id: 2, title: 'Drone Touba Magal 2023', type: 'video', size: '450 MB', date: 'Il y a 2j', tag: 'Magal' },
    { id: 3, title: 'Infographie Cotisations', type: 'image', size: '1.1 MB', date: 'Semaine dernière', tag: 'Admin' },
    { id: 4, title: 'Interview Dieuwrine SG', type: 'video', size: '120 MB', date: 'Janvier 2024', tag: 'Portrait' },
    { id: 5, title: 'Photo Famille Majma', type: 'image', size: '5.8 MB', date: '2023', tag: 'Social' },
    { id: 6, title: 'Teaser Prochain Thiant', type: 'video', size: '85 MB', date: 'En cours', tag: 'Event' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex-1 w-full relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher une photo, vidéo ou archive..." 
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] text-sm font-bold shadow-sm focus:ring-4 focus:ring-amber-500/5 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-amber-600 transition-all shadow-sm"><Filter size={20} /></button>
          <div className="flex p-1.5 bg-slate-100/50 rounded-2xl border border-slate-100">
             <button onClick={() => setView('grid')} className={`p-2.5 rounded-xl transition-all ${view === 'grid' ? 'bg-white text-amber-600 shadow-md' : 'text-slate-400'}`}><Grid size={18} /></button>
             <button onClick={() => setView('list')} className={`p-2.5 rounded-xl transition-all ${view === 'list' ? 'bg-white text-amber-600 shadow-md' : 'text-slate-400'}`}><List size={18} /></button>
          </div>
          <button className="px-8 py-4 bg-amber-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 active:scale-95">
            <Plus size={18} /> Importer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-10">
        {assets.map(asset => (
          <div key={asset.id} className="glass-card group flex flex-col overflow-hidden border-transparent hover:border-amber-100 transition-all duration-500">
            <div className="h-48 bg-slate-100 relative overflow-hidden">
               <img 
                src={`https://picsum.photos/seed/media-${asset.id}/800/600`} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                alt={asset.title} 
              />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div className="flex gap-2 w-full">
                    <button className="flex-1 py-2.5 bg-white/20 backdrop-blur-md text-white rounded-xl text-[10px] font-black uppercase hover:bg-white/30 transition-all flex items-center justify-center gap-2"><Eye size={12} /> Voir</button>
                    <button className="p-2.5 bg-white/20 backdrop-blur-md text-white rounded-xl hover:bg-white/30 transition-all"><Download size={14} /></button>
                  </div>
               </div>
               <div className="absolute top-4 right-4 flex gap-2">
                  <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-white rounded-full text-[8px] font-black uppercase tracking-widest">{asset.tag}</span>
                  <div className={`p-1.5 rounded-lg backdrop-blur-md bg-white/20 text-white`}>
                     {asset.type === 'video' ? <Video size={14} /> : <ImageIcon size={14} />}
                  </div>
               </div>
            </div>
            <div className="p-6">
              <h4 className="text-sm font-black text-slate-800 truncate mb-1 leading-none">{asset.title}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{asset.date} • {asset.size}</p>
              
              <div className="pt-4 mt-4 border-t border-slate-50 flex justify-between items-center">
                 <div className="flex items-center gap-4 text-slate-300">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase"><Heart size={12} className="text-rose-400" /> 124</div>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase"><Tag size={12} className="text-amber-400" /> Public</div>
                 </div>
                 <button className="p-2 text-slate-200 hover:text-amber-500 transition-colors"><MoreVertical size={16} /></button>
              </div>
            </div>
          </div>
        ))}
        <div className="border-2 border-dashed border-slate-200 rounded-[2rem] h-full min-h-[300px] flex flex-col items-center justify-center text-center p-10 group hover:border-amber-300 transition-all cursor-pointer">
           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-amber-50 group-hover:text-amber-500 transition-all mb-6">
              <Plus size={32} />
           </div>
           <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2">Ajouter un dossier</h4>
           <p className="text-[10px] text-slate-400 font-medium">Glissez-déposez vos fichiers ici pour l'archivage sécurisé.</p>
        </div>
      </div>
    </div>
  );
};

export default MultimediaLibrary;
