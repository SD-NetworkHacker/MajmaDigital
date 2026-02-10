import React, { useState } from 'react';
import { BookOpen, Search, Filter, Headphones, Video, FileText, Star, Download, Play, Plus, X, Save, UploadCloud, Trash2 } from 'lucide-react';
import { LibraryResource, LibraryResourceType } from '../../types';
import { useData } from '../../contexts/DataContext';

const DigitalLibrary: React.FC = () => {
  const { library, addResource, deleteResource } = useData();
  const [activeType, setActiveType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newResource, setNewResource] = useState<Partial<LibraryResource>>({
    type: 'livre',
    accessLevel: 'public',
    rating: 5,
    views: 0
  });
  
  // Use library from context directly
  const resources = library || [];

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.title || !newResource.author) return;

    const resource: LibraryResource = {
      id: Date.now().toString(), // Will be overwritten by DB usually, but okay for opt UI
      title: newResource.title,
      author: newResource.author,
      type: newResource.type as LibraryResourceType,
      category: newResource.category || 'Général',
      accessLevel: newResource.accessLevel || 'public',
      views: 0,
      rating: 5,
      url: '#'
    };

    addResource(resource);
    
    setShowModal(false);
    setNewResource({ type: 'livre', accessLevel: 'public', rating: 5, views: 0 });
  };

  const handleDeleteResource = (id: string) => {
    if(confirm("Supprimer cette ressource de la bibliothèque ?")) {
      deleteResource(id);
    }
  };

  const filteredResources = resources.filter(r => {
    const matchesType = activeType === 'all' || r.type === activeType;
    const matchesSearch = (r.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (r.author || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'audio': return <Headphones size={24} />;
      case 'video': return <Video size={24} />;
      case 'livre': return <BookOpen size={24} />;
      default: return <FileText size={24} />;
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* ADD RESOURCE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <UploadCloud size={24} className="text-indigo-500"/> Ajouter Ressource
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleAddResource} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Titre de l'oeuvre</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={newResource.title || ''}
                  onChange={e => setNewResource({...newResource, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Auteur / Conférencier</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={newResource.author || ''}
                  onChange={e => setNewResource({...newResource, author: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Type</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none"
                    value={newResource.type}
                    onChange={e => setNewResource({...newResource, type: e.target.value as LibraryResourceType})}
                  >
                    <option value="livre">Livre / PDF</option>
                    <option value="audio">Audio / MP3</option>
                    <option value="video">Vidéo</option>
                    <option value="document">Document</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Catégorie</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none"
                    value={newResource.category}
                    onChange={e => setNewResource({...newResource, category: e.target.value})}
                  >
                    <option value="Khassaid">Khassaid</option>
                    <option value="Coran">Coran</option>
                    <option value="Conférence">Conférence</option>
                    <option value="Histoire">Histoire</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Save size={16} /> Publier dans la Médiathèque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex-1 w-full relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un ouvrage, un auteur..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] text-sm font-bold shadow-sm focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
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
           <button 
             onClick={() => setShowModal(true)}
             className="px-6 py-4 bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all active:scale-95"
           >
             <Plus size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredResources.length > 0 ? filteredResources.map(resource => (
          <div key={resource.id} className="glass-card p-6 group hover:border-indigo-200 transition-all flex flex-col relative overflow-hidden">
             <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
             
             <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                   {getIcon(resource.type)}
                </div>
                <div className="flex flex-col items-end gap-1">
                   <div className="flex items-center gap-1 text-[10px] font-black text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                      <Star size={10} className="fill-current" /> {resource.rating}
                   </div>
                   <button onClick={() => handleDeleteResource(resource.id)} className="p-1 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={12}/></button>
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
        )) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
             <BookOpen size={48} className="mb-4 opacity-20"/>
             <p className="text-xs font-bold uppercase">Médiathèque vide</p>
             <button onClick={() => setShowModal(true)} className="mt-4 text-indigo-600 text-[10px] font-black uppercase hover:underline">Ajouter un premier contenu</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalLibrary;