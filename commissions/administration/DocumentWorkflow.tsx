
import React, { useState, useMemo } from 'react';
import { 
  FileText, Search, Filter, Plus, FileCheck, Clock, 
  Archive, Download, Eye, MoreHorizontal, History, 
  CheckCircle, AlertCircle, Share2, UploadCloud, X,
  FileBadge, PenTool, Trash2, ChevronRight, Lock
} from 'lucide-react';

// --- TYPES ---
type DocStatus = 'draft' | 'review' | 'published' | 'archived';
type DocType = 'PV' | 'Financier' | 'Juridique' | 'Opérationnel' | 'Autre';

interface Document {
  id: string;
  title: string;
  type: DocType;
  version: string;
  author: string;
  date: string;
  size: string;
  status: DocStatus;
  description: string;
  workflow: { step: string; date: string; actor: string }[];
}

// --- MOCK DATA ---
const INITIAL_DOCS: Document[] = [
  { 
    id: '1', title: 'Règlement Intérieur 2024', type: 'Juridique', version: 'v2.1', author: 'Fatou Sylla', date: '2024-05-14', size: '2.4 MB', status: 'published',
    description: "Version finale amendée après l'AG du 10 Mai. Inclut les nouvelles clauses sur les cotisations.",
    workflow: [
      { step: 'Création', date: '2024-05-01', actor: 'Fatou Sylla' },
      { step: 'Validation Bureau', date: '2024-05-12', actor: 'Modou Diop' },
      { step: 'Publication', date: '2024-05-14', actor: 'Admin' }
    ]
  },
  { 
    id: '2', title: 'PV Réunion Bureau Exécutif', type: 'PV', version: 'v1.0', author: 'Saliou Diop', date: '2024-05-15', size: '1.1 MB', status: 'review',
    description: "Compte rendu de la réunion mensuelle de coordination. En attente de validation par le SG.",
    workflow: [
      { step: 'Rédaction', date: '2024-05-15', actor: 'Saliou Diop' },
      { step: 'Soumission', date: '2024-05-15', actor: 'Saliou Diop' }
    ]
  },
  { 
    id: '3', title: 'Budget Prévisionnel Magal', type: 'Financier', version: 'v3.4', author: 'Comm. Finance', date: '2024-05-10', size: '4.5 MB', status: 'draft',
    description: "Brouillon de travail pour les allocations budgétaires du prochain Magal.",
    workflow: [
      { step: 'Initialisation', date: '2024-05-01', actor: 'Moussa Ndiaye' }
    ]
  },
  { 
    id: '4', title: 'Liste Gott Touba (Zone A)', type: 'Opérationnel', version: 'v1.2', author: 'Comm. Organisation', date: '2024-05-01', size: '850 KB', status: 'archived',
    description: "Liste des participants et affectations pour la zone A. Archivé suite à la mise à jour v2.0.",
    workflow: []
  },
  { 
    id: '5', title: 'Contrat Location Bâches', type: 'Juridique', version: 'v1.0', author: 'Comm. Organisation', date: '2024-05-16', size: '3.2 MB', status: 'review',
    description: "Contrat à signer avec le prestataire EventPro.",
    workflow: [{ step: 'Import', date: '2024-05-16', actor: 'Omar Gueye' }]
  },
];

const DocumentWorkflow: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'review' | 'draft' | 'archived'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // --- FILTERS ---
  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || doc.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'all' ? doc.status !== 'archived' : doc.status === activeFilter;
      if (activeFilter === 'archived' && doc.status === 'archived') return matchesSearch; // Special case for archive view
      return matchesSearch && matchesFilter;
    });
  }, [documents, searchTerm, activeFilter]);

  // --- ACTIONS ---
  const handleStatusChange = (id: string, newStatus: DocStatus) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === id) {
        const newEntry = { 
          step: newStatus === 'published' ? 'Validation & Publication' : newStatus === 'archived' ? 'Archivage' : 'Révision', 
          date: new Date().toISOString().split('T')[0], 
          actor: 'Admin' 
        };
        return { ...d, status: newStatus, workflow: [...d.workflow, newEntry] };
      }
      return d;
    }));
    if (selectedDoc && selectedDoc.id === id) setSelectedDoc(null); // Close modal
  };

  const handleDelete = (id: string) => {
    if(confirm("Supprimer ce document ?")) {
      setDocuments(prev => prev.filter(d => d.id !== id));
      setSelectedDoc(null);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation upload
    const newDoc: Document = {
      id: Date.now().toString(),
      title: 'Nouveau Document Scanné',
      type: 'Autre',
      version: 'v1.0',
      author: 'Admin',
      date: new Date().toISOString().split('T')[0],
      size: '1.5 MB',
      status: 'draft',
      description: 'Document importé récemment.',
      workflow: [{ step: 'Importation', date: new Date().toISOString().split('T')[0], actor: 'Admin' }]
    };
    setDocuments([newDoc, ...documents]);
    setShowUploadModal(false);
  };

  // --- UI HELPERS ---
  const getStatusColor = (status: DocStatus) => {
    switch (status) {
      case 'published': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'review': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'draft': return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'archived': return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  const getStatusLabel = (status: DocStatus) => {
    switch (status) {
      case 'published': return 'Publié';
      case 'review': return 'En Validation';
      case 'draft': return 'Brouillon';
      case 'archived': return 'Archivé';
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700 relative">
      
      {/* --- MODAL DETAILS --- */}
      {selectedDoc && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
              <div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border mb-3 ${getStatusColor(selectedDoc.status)}`}>
                  {getStatusLabel(selectedDoc.status)}
                </div>
                <h3 className="text-2xl font-black text-slate-800 leading-tight">{selectedDoc.title}</h3>
                <p className="text-xs font-medium text-slate-500 mt-2 flex items-center gap-2">
                  <FileBadge size={14}/> {selectedDoc.type} • {selectedDoc.size} • {selectedDoc.version}
                </p>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="p-2 bg-white hover:bg-rose-50 hover:text-rose-500 rounded-full border border-slate-200 transition-all">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedDoc.description}
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workflow & Historique</h4>
                <div className="relative pl-4 space-y-6 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedDoc.workflow.map((step, i) => (
                    <div key={i} className="relative flex items-center gap-4">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full ring-4 ring-white relative z-10"></div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{step.step}</p>
                        <p className="text-[10px] text-slate-400">{step.date} • par {step.actor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center gap-4">
              <div className="flex gap-2">
                 <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm" title="Télécharger"><Download size={18}/></button>
                 <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm" title="Partager"><Share2 size={18}/></button>
              </div>
              
              <div className="flex gap-3">
                {selectedDoc.status === 'review' && (
                  <>
                    <button 
                      onClick={() => handleStatusChange(selectedDoc.id, 'draft')}
                      className="px-5 py-3 bg-white border border-rose-200 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all"
                    >
                      Rejeter
                    </button>
                    <button 
                      onClick={() => handleStatusChange(selectedDoc.id, 'published')}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2"
                    >
                      <CheckCircle size={14}/> Valider & Publier
                    </button>
                  </>
                )}
                {selectedDoc.status === 'draft' && (
                  <button 
                    onClick={() => handleStatusChange(selectedDoc.id, 'review')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    <Clock size={14}/> Soumettre Validation
                  </button>
                )}
                {selectedDoc.status === 'published' && (
                  <button 
                    onClick={() => handleStatusChange(selectedDoc.id, 'archived')}
                    className="px-6 py-3 bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-300 transition-all flex items-center gap-2"
                  >
                    <Archive size={14}/> Archiver
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL UPLOAD --- */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl animate-in zoom-in duration-200">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                 <UploadCloud size={24} className="text-emerald-600"/> Importer Document
              </h3>
              <form onSubmit={handleUpload} className="space-y-4">
                 <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer">
                    <UploadCloud size={40} className="text-slate-300 mb-4"/>
                    <p className="text-xs font-bold text-slate-600">Glisser-déposer ou cliquer</p>
                    <p className="text-[10px] text-slate-400 mt-1">PDF, DOCX, JPG (Max 10MB)</p>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Titre du document</label>
                    <input type="text" className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Ex: Rapport mensuel..." required />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Catégorie</label>
                    <select className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none">
                       <option>PV de Réunion</option>
                       <option>Juridique</option>
                       <option>Financier</option>
                       <option>Autre</option>
                    </select>
                 </div>
                 <div className="flex gap-3 pt-4">
                    <button type="button" onClick={() => setShowUploadModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-widest">Annuler</button>
                    <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg">Confirmer</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Gestion Documentaire (GED)</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <FileText size={14} className="text-emerald-500" /> Archivage sécurisé et cycle de validation
          </p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all hover:bg-emerald-600"
        >
          <UploadCloud size={18} /> Nouveau Document
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT SIDEBAR (Filters) --- */}
        <div className="lg:col-span-3 space-y-6">
           <div className="glass-card overflow-hidden bg-white">
              <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Explorateur</h4>
                 <Archive size={16} className="text-slate-300" />
              </div>
              <div className="p-2 space-y-1">
                 {[
                   { id: 'all', label: 'Tous les fichiers', icon: FileText, count: documents.filter(d => d.status !== 'archived').length },
                   { id: 'review', label: 'À Valider', icon: Clock, count: documents.filter(d => d.status === 'review').length },
                   { id: 'draft', label: 'Brouillons', icon: PenTool, count: documents.filter(d => d.status === 'draft').length },
                   { id: 'archived', label: 'Archives', icon: Lock, count: documents.filter(d => d.status === 'archived').length },
                 ].map((folder) => (
                   <button 
                    key={folder.id} 
                    onClick={() => setActiveFilter(folder.id as any)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-xl transition-all group ${
                      activeFilter === folder.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/10' : 'text-slate-500 hover:bg-emerald-50'
                    }`}
                   >
                      <div className="flex items-center gap-3">
                         <folder.icon size={18} className={activeFilter === folder.id ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'} />
                         <span className="text-[11px] font-black uppercase tracking-widest">{folder.label}</span>
                      </div>
                      <span className={`text-[10px] font-black ${activeFilter === folder.id ? 'text-white/60' : 'text-slate-300'}`}>{folder.count}</span>
                   </button>
                 ))}
              </div>
           </div>

           <div className="glass-card p-8 bg-slate-900 text-white">
              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6">Capacité Cloud</h4>
              <div className="space-y-4">
                 <div className="flex justify-between text-[10px] font-black uppercase">
                    <span>Espace Utilisé</span>
                    <span className="text-emerald-400">12.4 GB</span>
                 </div>
                 <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: '12%' }}></div>
                 </div>
                 <p className="text-[9px] font-medium text-slate-400 leading-relaxed opacity-70">
                   Synchronisation automatique activée. Sauvegarde quotidienne à 02:00.
                 </p>
              </div>
           </div>
        </div>

        {/* --- MAIN CONTENT (Grid) --- */}
        <div className="lg:col-span-9 space-y-6">
           <div className="glass-card p-4 flex flex-wrap items-center gap-4 border-slate-100 bg-white">
              <div className="relative flex-1 group">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   placeholder="Rechercher par titre, type, mot-clé..." 
                   className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold shadow-sm focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none" 
                 />
              </div>
              <div className="flex gap-2">
                 <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 transition-all shadow-sm"><Filter size={20}/></button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
              {filteredDocs.map(doc => (
                <div 
                  key={doc.id} 
                  onClick={() => setSelectedDoc(doc)}
                  className={`glass-card p-8 group flex flex-col relative cursor-pointer border-2 hover:shadow-xl transition-all duration-300 ${
                    doc.status === 'review' ? 'border-amber-100 bg-amber-50/10' : 'border-transparent hover:border-slate-200'
                  }`}
                >
                   {doc.status === 'review' && (
                     <span className="absolute top-4 right-4 flex h-3 w-3">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                     </span>
                   )}

                   <div className="flex justify-between items-start mb-8">
                      <div className="p-4 bg-slate-50 text-slate-400 rounded-[1.5rem] group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all duration-500">
                         <FileText size={32} />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(doc.status)}`}>
                           {getStatusLabel(doc.status)}
                         </span>
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Vers. {doc.version}</span>
                      </div>
                   </div>
                   
                   <h4 className="text-base font-black text-slate-800 leading-tight mb-2 group-hover:text-emerald-700 transition-colors line-clamp-1">{doc.title}</h4>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">{doc.type} • {doc.date}</p>
                   
                   <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                      <div className="flex -space-x-2">
                         <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-500" title={doc.author}>
                            {doc.author[0]}
                         </div>
                      </div>
                      <button className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1 group-hover:text-emerald-600 transition-colors">
                         Ouvrir <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform"/>
                      </button>
                   </div>
                </div>
              ))}
              
              {/* Add New Card */}
              <div 
                onClick={() => setShowUploadModal(true)}
                className="border-2 border-dashed border-slate-200 rounded-[2rem] h-full min-h-[250px] flex flex-col items-center justify-center text-center p-10 group hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer"
              >
                 <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all mb-6">
                    <Plus size={32} />
                 </div>
                 <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2 group-hover:text-emerald-700">Ajouter un document</h4>
                 <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-xs">Glissez-déposez vos fichiers officiels ici pour validation par le Bureau Exécutif.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentWorkflow;
