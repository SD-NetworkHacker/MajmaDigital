
import React, { useState, useMemo, useRef } from 'react';
import { 
  X, Phone, Mail, MapPin, Shield, Calendar, Hash, User, 
  Wallet, Download, Edit, Save, Lock, QrCode, Share2, Camera, ArrowLeft, BookOpen, FileText, Users,
  CheckCircle, Plus, Trash2, Bell, Eye, EyeOff, AlertCircle, GraduationCap, Briefcase, Loader2
} from 'lucide-react';
// Fix: Corrected path for AuthContext
import { useAuth } from '../../contexts/AuthContext';
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
    if (targetId) return (members || []).find(m => m.id === targetId);
    if (user?.email) return (members || []).find(m => m.email === user.email);
    return null;
  }, [members, targetId, user]);

  // Permissions
  const canEdit = useMemo(() => {
    return true;
  }, []);

  const isAdmin = true;

  // Local State
  const [activeTab, setActiveTab] = useState('infos');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Member>>({});
  const [showMemberCard, setShowMemberCard] = useState(false);
  
  // Documents State
  const [newDocName, setNewDocName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Preferences State
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
    const myContribs = (contributions || []).filter(c => c.memberId === profileMember.id);
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
     const completedModules = (khassaideModules || []).filter(m => m.progress === 100).length;
     const inProgress = (khassaideModules || []).filter(m => m.progress > 0 && m.progress < 100).length;
     return { completed: completedModules, inProgress, total: (khassaideModules || []).length };
  }, [khassaideModules]);

  // Activities
  const activityStats = useMemo(() => {
     return (events || []).filter(e => new Date(e.date) < new Date()).slice(0, 5);
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
      
      {/* MODALE CARTE DE MEMBRE */}
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

      {/* 2. TABS NAVIGATION */}
      <div className="flex overflow-x-auto custom-scrollbar gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
         {[
            { id: 'infos', label: 'Informations', icon: User },
            { id: 'finance', label: 'Finances', icon: Wallet },
            { id: 'spiritual', label: 'Spirituel', icon: BookOpen },
            { id: 'activities', label: 'Activités', icon: Calendar },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'settings', label: 'Paramètres', icon: Shield }
         ].map(tab => (
            <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
               }`}
            >
               <tab.icon size={16} /> {tab.label}
            </button>
         ))}
      </div>

      {/* 3. TAB CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* LEFT COLUMN - MAIN CONTENT */}
         <div className="lg:col-span-2 space-y-8">
            {activeTab === 'infos' && (
               <div className="glass-card p-8 bg-white border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                        <User size={20} className="text-emerald-500" /> Informations Personnelles
                     </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <div>
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Prénom</label>
                           {isEditing ? (
                              <input type="text" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-emerald-500/20 outline-none" value={formData.firstName || ''} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                           ) : (
                              <div className="flex items-center gap-3 text-slate-800 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                                 <User size={18} className="text-slate-400" /> {profileMember.firstName || 'Non renseigné'}
                              </div>
                           )}
                        </div>
                        <div>
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Nom</label>
                           {isEditing ? (
                              <input type="text" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-emerald-500/20 outline-none" value={formData.lastName || ''} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                           ) : (
                              <div className="flex items-center gap-3 text-slate-800 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                                 <User size={18} className="text-slate-400" /> {profileMember.lastName || 'Non renseigné'}
                              </div>
                           )}
                        </div>
                        <div>
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Téléphone</label>
                           {isEditing ? (
                              <input type="tel" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-emerald-500/20 outline-none" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
                           ) : (
                              <div className="flex items-center gap-3 text-slate-800 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                                 <Phone size={18} className="text-slate-400" /> {profileMember.phone || 'Non renseigné'}
                              </div>
                           )}
                        </div>
                        <div>
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Email</label>
                           {isEditing ? (
                              <input type="email" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-emerald-500/20 outline-none" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
                           ) : (
                              <div className="flex items-center gap-3 text-slate-800 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                                 <Mail size={18} className="text-slate-400" /> {profileMember.email || 'Non renseigné'}
                              </div>
                           )}
                        </div>
                        <div>
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Date de Naissance</label>
                           {isEditing ? (
                              <input type="date" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-emerald-500/20 outline-none" value={formData.birthDate || ''} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
                           ) : (
                              <div className="flex items-center gap-3 text-slate-800 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                                 <Calendar size={18} className="text-slate-400" /> {profileMember.birthDate ? new Date(profileMember.birthDate).toLocaleDateString() : 'Non renseignée'}
                              </div>
                           )}
                        </div>
                        <div>
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Genre</label>
                           {isEditing ? (
                              <select className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-emerald-500/20 outline-none" value={formData.gender || 'Homme'} onChange={e => setFormData({...formData, gender: e.target.value as any})}>
                                 <option value="Homme">Homme</option>
                                 <option value="Femme">Femme</option>
                              </select>
                           ) : (
                              <div className="flex items-center gap-3 text-slate-800 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                                 <User size={18} className="text-slate-400" /> {profileMember.gender || 'Non renseigné'}
                              </div>
                           )}
                        </div>
                     </div>
                     
                     <div className="space-y-6">
                        <div>
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Adresse</label>
                           {isEditing ? (
                              <textarea className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none h-24" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} />
                           ) : (
                              <div className="flex items-start gap-3 text-slate-800 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100 h-24">
                                 <MapPin size={18} className="text-slate-400 shrink-0 mt-0.5" /> 
                                 <span className="line-clamp-3">{profileMember.address || 'Non renseignée'}</span>
                              </div>
                           )}
                        </div>
                        <div>
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Biographie</label>
                           {isEditing ? (
                              <textarea className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none h-32" value={formData.bio || ''} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="Quelques mots sur vous..." />
                           ) : (
                              <div className="flex items-start gap-3 text-slate-800 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100 h-32 overflow-y-auto custom-scrollbar">
                                 <FileText size={18} className="text-slate-400 shrink-0 mt-0.5" /> 
                                 <span className="text-sm">{profileMember.bio || 'Aucune biographie renseignée.'}</span>
                              </div>
                           )}
                        </div>

                        {/* Academic Info */}
                        {(profileMember.category === 'Étudiant' || profileMember.category === 'Élève') && (
                           <div>
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Informations Académiques</label>
                              {isEditing ? (
                                 <div className="space-y-2">
                                    <input type="text" placeholder="Établissement" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-emerald-500/20 outline-none" value={formData.academicInfo?.establishment || ''} onChange={e => setFormData({...formData, academicInfo: {...(formData.academicInfo || {establishment:'', level:'', field:''}), establishment: e.target.value}})} />
                                    <div className="flex gap-2">
                                       <input type="text" placeholder="Niveau" className="w-1/2 p-3 bg-slate-50 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-emerald-500/20 outline-none" value={formData.academicInfo?.level || ''} onChange={e => setFormData({...formData, academicInfo: {...(formData.academicInfo || {establishment:'', level:'', field:''}), level: e.target.value}})} />
                                       <input type="text" placeholder="Filière" className="w-1/2 p-3 bg-slate-50 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-emerald-500/20 outline-none" value={formData.academicInfo?.field || ''} onChange={e => setFormData({...formData, academicInfo: {...(formData.academicInfo || {establishment:'', level:'', field:''}), field: e.target.value}})} />
                                    </div>
                                 </div>
                              ) : (
                                 <div className="flex items-start gap-3 text-slate-800 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <GraduationCap size={18} className="text-slate-400 shrink-0 mt-0.5" /> 
                                    <div className="text-sm">
                                       <p className="font-bold">{profileMember.academicInfo?.establishment || 'Non renseigné'}</p>
                                       <p className="text-xs text-slate-500">{profileMember.academicInfo?.level} - {profileMember.academicInfo?.field}</p>
                                    </div>
                                 </div>
                              )}
                           </div>
                        )}

                        {/* Professional Info */}
                        {profileMember.category === 'Travailleur' && (
                           <div>
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Informations Professionnelles</label>
                              {isEditing ? (
                                 <div className="space-y-2">
                                    <input type="text" placeholder="Entreprise" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-emerald-500/20 outline-none" value={formData.professionalInfo?.company || ''} onChange={e => setFormData({...formData, professionalInfo: {...(formData.professionalInfo || {company:'', position:'', sector:''}), company: e.target.value}})} />
                                    <div className="flex gap-2">
                                       <input type="text" placeholder="Poste" className="w-1/2 p-3 bg-slate-50 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-emerald-500/20 outline-none" value={formData.professionalInfo?.position || ''} onChange={e => setFormData({...formData, professionalInfo: {...(formData.professionalInfo || {company:'', position:'', sector:''}), position: e.target.value}})} />
                                       <input type="text" placeholder="Secteur" className="w-1/2 p-3 bg-slate-50 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-emerald-500/20 outline-none" value={formData.professionalInfo?.sector || ''} onChange={e => setFormData({...formData, professionalInfo: {...(formData.professionalInfo || {company:'', position:'', sector:''}), sector: e.target.value}})} />
                                    </div>
                                 </div>
                              ) : (
                                 <div className="flex items-start gap-3 text-slate-800 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <Briefcase size={18} className="text-slate-400 shrink-0 mt-0.5" /> 
                                    <div className="text-sm">
                                       <p className="font-bold">{profileMember.professionalInfo?.company || 'Non renseigné'}</p>
                                       <p className="text-xs text-slate-500">{profileMember.professionalInfo?.position} - {profileMember.professionalInfo?.sector}</p>
                                    </div>
                                 </div>
                              )}
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'finance' && (
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-2">Total Cotisé</h4>
                           <p className="text-4xl font-black tracking-tighter">{financeStats.total.toLocaleString()} F</p>
                           <p className="text-[10px] uppercase font-bold tracking-widest mt-4 opacity-80">{financeStats.count} transactions</p>
                        </div>
                        <Wallet className="absolute -right-6 -bottom-6 opacity-10 rotate-12" size={120} />
                     </div>
                     <div className="glass-card p-8 bg-white border border-slate-100 flex flex-col justify-center">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Derniers versements</h4>
                        <div className="h-32 w-full">
                           <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={financeStats.history}>
                                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                                 <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                 <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                                    {financeStats.history.map((entry, index) => (
                                       <Cell key={`cell-${index}`} fill={index === financeStats.history.length - 1 ? '#10b981' : '#cbd5e1'} />
                                    ))}
                                 </Bar>
                              </BarChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'spiritual' && (
               <div className="glass-card p-8 bg-white border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 mb-8">
                     <BookOpen size={20} className="text-amber-500" /> Parcours Spirituel
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                     <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <p className="text-3xl font-black text-slate-900 mb-1">{spiritualStats.completed}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Modules Validés</p>
                     </div>
                     <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                        <p className="text-3xl font-black text-amber-600 mb-1">{spiritualStats.inProgress}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-amber-500">En Cours</p>
                     </div>
                     <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <p className="text-3xl font-black text-slate-900 mb-1">{spiritualStats.total}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Inscrits</p>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'activities' && (
               <div className="glass-card p-8 bg-white border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 mb-8">
                     <Calendar size={20} className="text-blue-500" /> Historique des Activités
                  </h3>
                  <div className="space-y-4">
                     {activityStats.length > 0 ? activityStats.map(event => (
                        <div key={event.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                           <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black text-sm">
                              {new Date(event.date).getDate()}
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-800">{event.title}</h4>
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{event.type}</p>
                           </div>
                           <div className="ml-auto">
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                 <CheckCircle size={12} /> Présent
                              </span>
                           </div>
                        </div>
                     )) : (
                        <div className="text-center py-12 text-slate-400">
                           <Calendar size={32} className="mx-auto mb-3 opacity-20" />
                           <p className="text-xs font-bold uppercase tracking-widest">Aucune activité récente</p>
                        </div>
                     )}
                  </div>
               </div>
            )}

            {activeTab === 'documents' && (
               <div className="glass-card p-8 bg-white border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-center mb-8">
                     <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                        <FileText size={20} className="text-purple-500" /> Documents Officiels
                     </h3>
                     {canEdit && (
                        <div className="flex gap-2">
                           <input 
                              type="text" 
                              placeholder="Nom du doc..." 
                              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-purple-500"
                              value={newDocName}
                              onChange={e => setNewDocName(e.target.value)}
                           />
                           <button 
                              onClick={handleAddDocument}
                              disabled={isUploading || !newDocName.trim()}
                              className="px-4 py-2 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                           >
                              {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                              Ajouter
                           </button>
                        </div>
                     )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {(profileMember.documents || []).length > 0 ? (profileMember.documents || []).map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                           <div className="flex items-center gap-3">
                              <div className="p-3 bg-white rounded-xl shadow-sm text-purple-600"><FileText size={18} /></div>
                              <div>
                                 <h4 className="font-bold text-slate-800 text-sm">{doc.name}</h4>
                                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{doc.date} • {doc.type}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                              {doc.verified && <Shield size={16} className="text-emerald-500" />}
                              {canEdit && (
                                 <button onClick={() => handleDeleteDocument(doc.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                    <Trash2 size={16} />
                                 </button>
                              )}
                           </div>
                        </div>
                     )) : (
                        <div className="col-span-2 text-center py-12 text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
                           <FileText size={32} className="mx-auto mb-3 opacity-20" />
                           <p className="text-xs font-bold uppercase tracking-widest">Aucun document</p>
                        </div>
                     )}
                  </div>
               </div>
            )}

            {activeTab === 'settings' && (
               <div className="glass-card p-8 bg-white border border-slate-100 animate-in fade-in slide-in-from-bottom-4 space-y-8">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                     <Shield size={20} className="text-slate-700" /> Paramètres & Confidentialité
                  </h3>
                  
                  <div className="space-y-6">
                     <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 mb-6 flex items-center gap-2"><Bell size={16}/> Notifications</h4>
                        <div className="space-y-4">
                           <label className="flex items-center justify-between cursor-pointer">
                              <span className="text-sm font-bold text-slate-600">Emails importants</span>
                              <input type="checkbox" className="toggle" checked={localPrefs.notifications.email} onChange={e => handleUpdatePrefs('notifications', 'email', e.target.checked)} disabled={!canEdit} />
                           </label>
                           <label className="flex items-center justify-between cursor-pointer">
                              <span className="text-sm font-bold text-slate-600">Push Mobile</span>
                              <input type="checkbox" className="toggle" checked={localPrefs.notifications.push} onChange={e => handleUpdatePrefs('notifications', 'push', e.target.checked)} disabled={!canEdit} />
                           </label>
                           <label className="flex items-center justify-between cursor-pointer">
                              <span className="text-sm font-bold text-slate-600">SMS (Urgences)</span>
                              <input type="checkbox" className="toggle" checked={localPrefs.notifications.sms} onChange={e => handleUpdatePrefs('notifications', 'sms', e.target.checked)} disabled={!canEdit} />
                           </label>
                        </div>
                     </div>

                     <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 mb-6 flex items-center gap-2"><Eye size={16}/> Visibilité du Profil</h4>
                        <div className="space-y-4">
                           <label className="flex items-center justify-between cursor-pointer">
                              <span className="text-sm font-bold text-slate-600">Afficher le numéro de téléphone</span>
                              <input type="checkbox" className="toggle" checked={localPrefs.privacy.showPhone} onChange={e => handleUpdatePrefs('privacy', 'showPhone', e.target.checked)} disabled={!canEdit} />
                           </label>
                           <label className="flex items-center justify-between cursor-pointer">
                              <span className="text-sm font-bold text-slate-600">Afficher l'adresse</span>
                              <input type="checkbox" className="toggle" checked={localPrefs.privacy.showAddress} onChange={e => handleUpdatePrefs('privacy', 'showAddress', e.target.checked)} disabled={!canEdit} />
                           </label>
                        </div>
                     </div>
                     
                     {isAdmin && (
                        <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
                           <h4 className="text-xs font-black uppercase tracking-widest text-rose-800 mb-2 flex items-center gap-2"><AlertCircle size={16}/> Zone Dangereuse</h4>
                           <p className="text-[10px] text-rose-600 mb-4">Actions irréversibles sur le compte membre.</p>
                           <div className="flex gap-3">
                              <button 
                                 onClick={() => updateMemberStatus(profileMember.id, profileMember.status === 'active' ? 'inactive' : 'active')}
                                 className="px-4 py-2 bg-white text-rose-600 border border-rose-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-colors"
                              >
                                 {profileMember.status === 'active' ? 'Désactiver le compte' : 'Réactiver le compte'}
                              </button>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            )}
         </div>

         {/* RIGHT COLUMN - SIDEBAR */}
         <div className="space-y-6">
            <div className="glass-card p-6 bg-slate-900 text-white rounded-[2rem] shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10"><Shield size={64} /></div>
               <div className="relative z-10">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Statut Administratif</h4>
                  <div className="space-y-4">
                     <div>
                        <p className="text-[9px] font-bold uppercase text-slate-500 mb-1">Date d'adhésion</p>
                        <p className="font-mono text-sm">{new Date(profileMember.joinDate).toLocaleDateString('fr-FR')}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-bold uppercase text-slate-500 mb-1">Dernière connexion</p>
                        <p className="font-mono text-sm">{profileMember.lastActive ? new Date(profileMember.lastActive).toLocaleDateString('fr-FR') : 'Inconnue'}</p>
                     </div>
                     <div className="pt-4 border-t border-slate-800">
                        <p className="text-[9px] font-bold uppercase text-slate-500 mb-2">Commissions</p>
                        <div className="flex flex-wrap gap-2">
                           {(profileMember.commissions || []).map((c, index) => {
                              const cName = typeof c === 'string' ? c : c.type;
                              return (
                                 <span key={`${cName}-${index}`} className="px-2 py-1 bg-slate-800 rounded text-[9px] font-black uppercase tracking-widest text-slate-300 border border-slate-700">
                                    {cName}
                                 </span>
                              );
                           })}
                           {(!profileMember.commissions || profileMember.commissions.length === 0) && (
                              <span className="text-[10px] text-slate-500 italic">Aucune commission</span>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default UserProfile;
