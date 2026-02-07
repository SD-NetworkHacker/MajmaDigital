
import React, { useState, useMemo, useRef } from 'react';
import { 
  X, Phone, Mail, MapPin, Shield, Calendar, Hash, User, 
  Wallet, Download, Edit, Save, Lock, QrCode, Share2, Camera, ArrowLeft, BookOpen, FileText, Users,
  CheckCircle, Plus, Trash2, Bell, Eye, EyeOff, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Member, GlobalRole, MemberDocument } from '../../types';
import SectorBadge from '../shared/SectorBadge';
import { exportToCSV } from '../../services/analyticsEngine';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface UserProfileProps {
  targetId?: string | null; // If null/undefined, shows current authenticated user
  onBack?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ targetId, onBack }) => {
  const { user } = useAuth();
  const { members, contributions, events, khassaideModules, updateMember, updateMemberStatus } = useData();
  
  // Resolve Member to Display
  const profileMember = useMemo(() => {
    if (targetId) return members.find(m => m.id === targetId);
    if (user?.email) return members.find(m => m.email === user.email);
    return null;
  }, [members, targetId, user]);

  // Permissions
  const canEdit = useMemo(() => {
    if (!user || !profileMember) return false;
    if (user.role === 'ADMIN' || user.role === 'SG') return true;
    if (user.email === profileMember.email) return true;
    return false;
  }, [user, profileMember]);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SG';

  // Local State
  const [activeTab, setActiveTab] = useState('infos');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Member>>({});
  const [showMemberCard, setShowMemberCard] = useState(false);
  
  // Documents State
  const [newDocName, setNewDocName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Preferences State (local copy for editing)
  const [localPrefs, setLocalPrefs] = useState(profileMember?.preferences || {
      notifications: { email: true, push: true, sms: false },
      privacy: { showPhone: false, showAddress: false }
  });

  // Initialize form data when editing starts
  const startEditing = () => {
    if (profileMember) {
      setFormData({ ...profileMember });
      setIsEditing(true);
    }
  };

  const saveChanges = () => {
    if (profileMember && formData) {
      updateMember(profileMember.id, formData);
      setIsEditing(false);
    }
  };

  // --- STATS COMPUTATION ---
  
  // Finances
  const financeStats = useMemo(() => {
    if (!profileMember) return { total: 0, count: 0, history: [] };
    const myContribs = contributions.filter(c => c.memberId === profileMember.id);
    const history = myContribs.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6).reverse().map(c => ({
        name: new Date(c.date).toLocaleDateString(undefined, {month:'short'}),
        amount: c.amount
    }));
    return {
      total: myContribs.reduce((acc, c) => acc + c.amount, 0),
      count: myContribs.length,
      history
    };
  }, [profileMember, contributions]);

  // Spiritual
  const spiritualStats = useMemo(() => {
     // Simulation: user progress is tracked in khassaideModules context globally for simplicity in this demo, 
     // but ideally we'd have a user-specific progress table. 
     // Here we assume modules have a 'progress' field that applies to the current user context or generic.
     // For a real app, we'd filter by userId in a specific 'progress' table.
     const completedModules = khassaideModules.filter(m => m.progress === 100).length;
     const inProgress = khassaideModules.filter(m => m.progress > 0 && m.progress < 100).length;
     return { completed: completedModules, inProgress, total: khassaideModules.length };
  }, [khassaideModules]);

  // Activities
  const activityStats = useMemo(() => {
     // Simulation: random participation for demo
     return events.filter(e => new Date(e.date) < new Date()).slice(0, 5);
  }, [events]);

  const handleExport = () => {
    if (!profileMember) return;
    exportToCSV(`profil_${profileMember.matricule}.csv`, [{
      ...profileMember,
      contributions_total: financeStats.total
    }]);
  };

  // --- HANDLERS ---

  const handleAddDocument = () => {
      if(!newDocName.trim() || !profileMember) return;
      setIsUploading(true);
      
      // Simulate upload delay
      setTimeout(() => {
          const newDoc: MemberDocument = {
              id: Date.now().toString(),
              name: newDocName,
              type: 'PDF',
              date: new Date().toLocaleDateString(),
              verified: false
          };
          
          const updatedDocs = [...(profileMember.documents || []), newDoc];
          updateMember(profileMember.id, { documents: updatedDocs });
          
          setNewDocName('');
          setIsUploading(false);
      }, 1000);
  };

  const handleDeleteDocument = (docId: string) => {
      if(!profileMember) return;
      if(confirm('Supprimer ce document ?')) {
          const updatedDocs = (profileMember.documents || []).filter(d => d.id !== docId);
          updateMember(profileMember.id, { documents: updatedDocs });
      }
  };

  const handleUpdatePrefs = (section: 'notifications' | 'privacy', key: string, value: boolean) => {
      if(!profileMember) return;
      
      const newPrefs = { ...localPrefs };
      // @ts-ignore
      newPrefs[section][key] = value;
      setLocalPrefs(newPrefs);
      
      // Auto-save for better UX
      updateMember(profileMember.id, { preferences: newPrefs });
  };

  if (!profileMember) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <User size={64} className="mb-4 opacity-20"/>
        <h3 className="text-xl font-bold">Profil introuvable</h3>
        <button onClick={onBack} className="mt-4 text-emerald-600 hover:underline">Retour</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* MODALE CARTE DE MEMBRE - STYLE PREMIUM */}
      {showMemberCard && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in">
             <div className="w-full max-w-sm animate-in zoom-in duration-300 relative">
                 <button onClick={() => setShowMemberCard(false)} className="absolute -top-12 right-0 text-white hover:text-slate-300 transition-colors"><X size={24}/></button>
                 
                 {/* CARD VISUAL */}
                 <div className="bg-slate-900 rounded-[1.5rem] overflow-hidden shadow-2xl relative border-2 border-slate-700 aspect-[1.586/1] text-white select-none">
                     <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-10 pointer-events-none"></div>
                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>
                     <div className="absolute top-[-50%] right-[-20%] w-[100%] h-[200%] bg-emerald-600/20 blur-3xl rotate-12 pointer-events-none"></div>
                     <div className="absolute top-4 right-6 opacity-10 font-arabic text-8xl pointer-events-none rotate-6">م</div>

                     <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-white text-slate-900 rounded-lg flex items-center justify-center font-arabic text-lg pb-1 shadow-lg border border-white">م</div>
                           <div>
                              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">MajmaDigital</h3>
                              <p className="text-[6px] opacity-70 uppercase tracking-widest font-medium">Carte de Membre Officielle</p>
                           </div>
                        </div>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fd/Flag_of_Senegal.svg" alt="Flag" className="w-6 h-4 rounded shadow-sm opacity-90" loading="lazy" />
                     </div>

                     <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
                        <div>
                           <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest mb-1">{profileMember.category}</p>
                           <h2 className="text-xl font-black uppercase tracking-tight leading-none text-white text-shadow-sm">{profileMember.firstName} <br/> {profileMember.lastName}</h2>
                           <p className="text-[10px] font-mono text-slate-400 mt-2 tracking-widest">{profileMember.matricule}</p>
                        </div>
                        <div className="bg-white p-1.5 rounded-lg">
                           <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=MEMBER:${profileMember.matricule}`} className="w-12 h-12" alt="QR" loading="lazy" />
                        </div>
                     </div>
                 </div>

                 <div className="flex gap-3 mt-6">
                     <button className="flex-1 py-3 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                         <Download size={16}/> Sauvegarder
                     </button>
                     <button className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all">
                         <Share2 size={16}/> Partager
                     </button>
                 </div>
             </div>
         </div>
      )}

      {/* 1. HEADER PROFILE */}
      <div className="relative bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl overflow-hidden group">
         <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-r from-slate-900 to-slate-800"></div>
         <div className="absolute top-0 right-0 p-10 opacity-5 font-arabic text-9xl text-white pointer-events-none select-none">م</div>

         <div className="relative z-10 flex flex-col md:flex-row items-end gap-8 pt-12 px-4">
            <div className="relative">
               <div className="w-40 h-40 rounded-[2.5rem] border-4 border-white shadow-2xl bg-white flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl font-black text-slate-300">
                     {profileMember.firstName[0]}{profileMember.lastName[0]}
                  </div>
               </div>
               {canEdit && (
                 <button className="absolute bottom-2 right-2 p-3 bg-emerald-600 text-white rounded-2xl shadow-lg hover:bg-emerald-500 transition-all">
                    <Camera size={18} />
                 </button>
               )}
            </div>

            <div className="flex-1 mb-2">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                     <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">{profileMember.firstName} {profileMember.lastName}</h1>
                     <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{profileMember.matricule}</span>
                        <SectorBadge category={profileMember.category} level={profileMember.level} size="sm" />
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${profileMember.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${profileMember.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                           {profileMember.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                     </div>
                  </div>

                  <div className="flex gap-2">
                     {onBack && <button onClick={onBack} className="p-3 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-all border border-slate-200"><ArrowLeft size={20} /></button>}
                     <button onClick={() => setShowMemberCard(true)} className="px-4 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-lg"><QrCode size={16} /> Ma Carte</button>
                     {canEdit && !isEditing && <button onClick={startEditing} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-slate-300 transition-all shadow-sm flex items-center gap-2"><Edit size={16} /> Modifier</button>}
                     {isEditing && (
                       <div className="flex gap-2">
                          <button onClick={() => setIsEditing(false)} className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200"><X size={20} /></button>
                          <button onClick={saveChanges} className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg flex items-center gap-2"><Save size={16} /> Enregistrer</button>
                       </div>
                     )}
                     <button onClick={handleExport} className="p-3 bg-white border border-slate-200 text-slate-500 rounded-xl hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"><Download size={20} /></button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* 2. MAIN CONTENT (LEFT) */}
         <div className="lg:col-span-8 space-y-6">
            
            {/* Tabs Navigation */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
               {[
                 { id: 'infos', label: 'Informations', icon: User },
                 { id: 'spirituel', label: 'Spirituel', icon: BookOpen },
                 { id: 'activites', label: 'Activités', icon: Calendar },
                 { id: 'finances', label: 'Finances', icon: Wallet },
                 { id: 'docs', label: 'Documents', icon: FileText },
                 { id: 'params', label: 'Paramètres', icon: Shield },
               ].map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                     activeTab === tab.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-50'
                   }`}
                 >
                    <tab.icon size={14} /> {tab.label}
                 </button>
               ))}
            </div>

            {/* TAB CONTENT */}
            <div className="glass-card p-8 bg-white min-h-[500px]">
               
               {/* INFOS */}
               {activeTab === 'infos' && (
                  <div className="space-y-8 animate-in fade-in">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Identité</h4>
                           <div className="space-y-4">
                              <div className="space-y-1">
                                 <label className="text-[10px] text-slate-400 font-bold uppercase">Prénom</label>
                                 {isEditing ? (
                                    <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full p-2 bg-slate-50 rounded-lg text-sm font-bold border border-slate-200 outline-none focus:border-emerald-500" />
                                 ) : <p className="text-sm font-bold text-slate-800">{profileMember.firstName}</p>}
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[10px] text-slate-400 font-bold uppercase">Nom</label>
                                 {isEditing ? (
                                    <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full p-2 bg-slate-50 rounded-lg text-sm font-bold border border-slate-200 outline-none focus:border-emerald-500" />
                                 ) : <p className="text-sm font-bold text-slate-800">{profileMember.lastName}</p>}
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[10px] text-slate-400 font-bold uppercase">Email</label>
                                 <p className="text-sm font-bold text-slate-800">{profileMember.email}</p>
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[10px] text-slate-400 font-bold uppercase">Téléphone</label>
                                 {isEditing ? (
                                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 bg-slate-50 rounded-lg text-sm font-bold border border-slate-200 outline-none focus:border-emerald-500" />
                                 ) : <p className="text-sm font-bold text-slate-800">{profileMember.phone}</p>}
                              </div>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Localisation</h4>
                           <div className="space-y-4">
                              <div className="space-y-1">
                                 <label className="text-[10px] text-slate-400 font-bold uppercase">Adresse</label>
                                 {isEditing ? (
                                    <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-2 bg-slate-50 rounded-lg text-sm font-bold border border-slate-200 outline-none focus:border-emerald-500" />
                                 ) : <p className="text-sm font-bold text-slate-800">{profileMember.address}</p>}
                              </div>
                              <div className="h-32 w-full bg-slate-100 rounded-xl overflow-hidden relative group">
                                 <div className="absolute inset-0 flex items-center justify-center text-slate-400"><MapPin size={32} /></div>
                                 <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-[9px] font-mono font-bold">
                                    {profileMember.coordinates.lat.toFixed(4)}, {profileMember.coordinates.lng.toFixed(4)}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* SPIRITUEL */}
               {activeTab === 'spirituel' && (
                  <div className="space-y-8 animate-in fade-in">
                     <div className="flex gap-4">
                        <div className="flex-1 p-6 bg-cyan-50 rounded-2xl border border-cyan-100">
                           <p className="text-[10px] font-black text-cyan-600 uppercase">Modules Validés</p>
                           <p className="text-3xl font-black text-cyan-900">{spiritualStats.completed}/{spiritualStats.total}</p>
                        </div>
                        <div className="flex-1 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                           <p className="text-[10px] font-black text-slate-400 uppercase">En Cours</p>
                           <p className="text-3xl font-black text-slate-800">{spiritualStats.inProgress}</p>
                        </div>
                     </div>

                     <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Parcours Pédagogique</h4>
                        <div className="space-y-3">
                           {khassaideModules.map(module => (
                              <div key={module.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl">
                                 <div className={`p-3 rounded-xl ${module.progress === 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                    <BookOpen size={20} />
                                 </div>
                                 <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                       <span className="text-sm font-bold text-slate-800">{module.title}</span>
                                       <span className="text-xs font-bold text-slate-500">{module.progress}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                       <div className={`h-full ${module.progress === 100 ? 'bg-emerald-500' : 'bg-cyan-500'}`} style={{width: `${module.progress}%`}}></div>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

               {/* ACTIVITES */}
               {activeTab === 'activites' && (
                  <div className="space-y-6 animate-in fade-in">
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Historique de Participation</h4>
                     {activityStats.length > 0 ? (
                        activityStats.map(event => (
                           <div key={event.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Calendar size={20} /></div>
                              <div>
                                 <p className="text-sm font-bold text-slate-800">{event.title}</p>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
                              </div>
                              <span className="ml-auto text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded uppercase">Présent</span>
                           </div>
                        ))
                     ) : (
                        <p className="text-center text-slate-400 text-xs italic py-10">Aucune activité récente.</p>
                     )}
                  </div>
               )}

               {/* FINANCES */}
               {activeTab === 'finances' && (
                  <div className="space-y-8 animate-in fade-in">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                           <p className="text-[10px] font-black text-emerald-600 uppercase">Total Versé</p>
                           <p className="text-3xl font-black text-emerald-900">{financeStats.total.toLocaleString()} F</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                           <p className="text-[10px] font-black text-slate-400 uppercase">Transactions</p>
                           <p className="text-3xl font-black text-slate-800">{financeStats.count}</p>
                        </div>
                     </div>
                     
                     <div className="h-48 w-full border border-slate-100 rounded-2xl p-4">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={financeStats.history}>
                              <defs>
                                <linearGradient id="colorFin" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                   <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <Tooltip />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                              <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="url(#colorFin)" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
               )}

               {/* DOCUMENTS */}
               {activeTab === 'docs' && (
                  <div className="space-y-6 animate-in fade-in">
                     <div className="flex gap-2">
                        <input 
                           type="text" 
                           placeholder="Nom du document (ex: Attestation)" 
                           className="flex-1 p-3 bg-slate-50 rounded-xl text-sm border-none outline-none"
                           value={newDocName}
                           onChange={e => setNewDocName(e.target.value)}
                        />
                        <button 
                           onClick={handleAddDocument} 
                           disabled={isUploading || !newDocName}
                           className="px-4 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase disabled:opacity-50"
                        >
                           {isUploading ? 'Ajout...' : 'Ajouter'}
                        </button>
                     </div>

                     <div className="space-y-3">
                        {profileMember.documents && profileMember.documents.length > 0 ? (
                           profileMember.documents.map((doc, i) => (
                              <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                                 <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FileText size={20} /></div>
                                    <div>
                                       <p className="text-sm font-bold text-slate-800">{doc.name}</p>
                                       <p className="text-[10px] text-slate-400 font-bold uppercase">{doc.date} • {doc.type}</p>
                                    </div>
                                 </div>
                                 <div className="flex gap-2">
                                    <button className="p-2 text-slate-400 hover:text-emerald-600"><Download size={16}/></button>
                                    {canEdit && <button onClick={() => handleDeleteDocument(doc.id)} className="p-2 text-slate-400 hover:text-rose-600"><Trash2 size={16}/></button>}
                                 </div>
                              </div>
                           ))
                        ) : (
                           <p className="text-center text-slate-400 text-xs italic py-10">Coffre-fort vide.</p>
                        )}
                     </div>
                  </div>
               )}

               {/* PARAMETRES */}
               {activeTab === 'params' && (
                  <div className="space-y-8 animate-in fade-in">
                     <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Notifications</h4>
                        <div className="space-y-4">
                           <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                              <div className="flex items-center gap-3">
                                 <Mail size={16} className="text-slate-500" />
                                 <span className="text-sm font-bold text-slate-700">Emails</span>
                              </div>
                              <button 
                                 onClick={() => handleUpdatePrefs('notifications', 'email', !localPrefs.notifications.email)}
                                 className={`w-10 h-5 rounded-full relative transition-colors ${localPrefs.notifications.email ? 'bg-emerald-500' : 'bg-slate-300'}`}
                              >
                                 <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${localPrefs.notifications.email ? 'left-6' : 'left-1'}`}></div>
                              </button>
                           </div>
                           <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                              <div className="flex items-center gap-3">
                                 <Bell size={16} className="text-slate-500" />
                                 <span className="text-sm font-bold text-slate-700">Push Mobile</span>
                              </div>
                              <button 
                                 onClick={() => handleUpdatePrefs('notifications', 'push', !localPrefs.notifications.push)}
                                 className={`w-10 h-5 rounded-full relative transition-colors ${localPrefs.notifications.push ? 'bg-emerald-500' : 'bg-slate-300'}`}
                              >
                                 <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${localPrefs.notifications.push ? 'left-6' : 'left-1'}`}></div>
                              </button>
                           </div>
                        </div>
                     </div>

                     <div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Confidentialité</h4>
                        <div className="space-y-4">
                           <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                              <div className="flex items-center gap-3">
                                 <Phone size={16} className="text-slate-500" />
                                 <span className="text-sm font-bold text-slate-700">Afficher mon numéro aux autres membres</span>
                              </div>
                              <button 
                                 onClick={() => handleUpdatePrefs('privacy', 'showPhone', !localPrefs.privacy.showPhone)}
                                 className={`w-10 h-5 rounded-full relative transition-colors ${localPrefs.privacy.showPhone ? 'bg-emerald-500' : 'bg-slate-300'}`}
                              >
                                 <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${localPrefs.privacy.showPhone ? 'left-6' : 'left-1'}`}></div>
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

            </div>
         </div>

         {/* 3. SIDEBAR (RIGHT) - NETWORK */}
         <div className="lg:col-span-4 space-y-8">
            <div className="glass-card p-8 bg-white border-slate-100">
               <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Users size={16} className="text-indigo-500" /> Mon Réseau
               </h4>
               <div className="space-y-4">
                  {/* Simulation */}
                  <div className="flex justify-between items-center text-xs text-slate-600 border-b border-slate-50 pb-2">
                     <span>Même Secteur</span>
                     <span className="font-black">12 membres</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-600 border-b border-slate-50 pb-2">
                     <span>Même Commission</span>
                     <span className="font-black">8 membres</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default UserProfile;
