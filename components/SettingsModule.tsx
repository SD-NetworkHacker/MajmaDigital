import React, { useState, useRef } from 'react';
import { 
  User, Bell, Lock, Globe, Moon, ChevronRight, Save, 
  Loader2, CheckCircle, ShieldCheck, Camera, Power, 
  Mail, MessageSquare, Smartphone, Palette, ArrowLeft, Book
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SettingsModuleProps {
  onBack: () => void;
}

const SettingsModule: React.FC<SettingsModuleProps> = ({ onBack }) => {
  const { user, updateUser, logout } = useAuth();
  
  // Init avec données réelles
  const [formData, setFormData] = useState({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      bio: user?.bio || '',
      avatar: user?.avatarUrl || '',
      role: user?.role || '',
      matricule: user?.matricule || ''
  });
  
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'preferences' | 'statutes'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Security State
  const [passwordState, setPasswordState] = useState({ old: '', new: '', confirm: '' });
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Notifications State (Local simulation for now)
  const [notifSettings, setNotifSettings] = useState({
     email: true, push: true, sms: false,
     meetings: true, contributions: true, events: true, security: true
  });

  // Local state for preferences
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('Français (Sénégal)');

  const handleSave = async () => {
    setIsSaving(true);
    
    // Appel réel à Supabase via AuthContext
    await updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        avatarUrl: formData.avatar
    });

    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const navigationItems = [
    { id: 'profile', label: 'Mon Profil', icon: User, desc: 'Infos personnelles & Bio' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Canaux & Alertes' },
    { id: 'security', label: 'Sécurité', icon: ShieldCheck, desc: 'Mot de passe & 2FA' },
    { id: 'preferences', label: 'Préférences', icon: Palette, desc: 'Langue & Apparence' },
    { id: 'statutes', label: 'Règlement & Statuts', icon: Book, desc: 'Textes fondateurs du Dahira' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="group flex items-center justify-center p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-900 hover:shadow-md active:scale-95 transition-all duration-300"
            title="Retour au Tableau de Bord"
          >
            <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform duration-300" />
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Paramètres du Compte</h2>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
              <Lock size={14} className="text-emerald-500" /> Gestion centralisée de votre identité numérique
            </p>
          </div>
        </div>
        
        {showSuccess && (
          <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl border border-emerald-100 shadow-sm animate-in slide-in-from-top-4">
            <CheckCircle size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Modifications enregistrées</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: NAVIGATION & PROFILE CARD */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* User Profile Card */}
          <div className="bg-white rounded-[2.5rem] p-2 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden group">
            <div className="relative bg-slate-900 rounded-[2rem] p-8 text-center overflow-hidden">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
               <div className="absolute top-0 right-0 p-10 opacity-5 font-arabic text-9xl pointer-events-none rotate-12 text-white">م</div>
               
               <div className="relative z-10 flex flex-col items-center">
                  <div className="relative mb-6 group-hover:scale-105 transition-transform duration-500">
                    <div className="w-28 h-28 rounded-full border-4 border-white/10 shadow-2xl overflow-hidden bg-slate-800 relative">
                        {formData.avatar ? (
                          <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-emerald-500 font-black text-4xl">
                            {formData.firstName[0]}{formData.lastName[0]}
                          </div>
                        )}
                        {/* Overlay Edit */}
                        <div 
                          onClick={handleAvatarClick}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Camera size={20} className="text-white" />
                        </div>
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>
                  
                  <h3 className="text-xl font-black text-white mb-1">{formData.firstName} {formData.lastName}</h3>
                  <div className="flex items-center gap-2 mb-6">
                     <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[9px] font-black uppercase tracking-widest border border-emerald-500/30">
                        {formData.role}
                     </span>
                     <span className="text-[10px] text-slate-400 font-mono">{formData.matricule || 'N/A'}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100">
             <div className="space-y-1">
                {navigationItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center p-4 rounded-2xl transition-all duration-300 group ${
                      activeTab === item.id 
                        ? 'bg-slate-900 text-white shadow-lg' 
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                     <div className={`p-3 rounded-xl mr-4 transition-colors ${
                        activeTab === item.id ? 'bg-white/10 text-emerald-400' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-slate-600'
                     }`}>
                        <item.icon size={20} />
                     </div>
                     <div className="flex-1 text-left">
                        <p className={`text-sm font-black ${activeTab === item.id ? 'text-white' : 'text-slate-800'}`}>{item.label}</p>
                        <p className={`text-[10px] font-medium ${activeTab === item.id ? 'text-slate-400' : 'text-slate-400'}`}>{item.desc}</p>
                     </div>
                     {activeTab === item.id && <ChevronRight size={16} className="text-emerald-500" />}
                  </button>
                ))}
             </div>
             
             <div className="mt-4 pt-4 border-t border-slate-100 px-2">
                <button 
                  onClick={() => logout()}
                  className="w-full flex items-center justify-center gap-2 p-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-rose-100"
                >
                   <Power size={14} /> Déconnexion
                </button>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTENT AREA */}
        <div className="lg:col-span-8 space-y-6">
           
           {/* TAB 1: PROFILE */}
           {activeTab === 'profile' && (
             <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><User size={24}/></div>
                      <h3 className="text-xl font-black text-slate-900">Informations Personnelles</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom</label>
                         <input 
                           type="text" 
                           value={formData.firstName}
                           onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                           className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                         <input 
                           type="text" 
                           value={formData.lastName}
                           onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                           className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                         />
                      </div>
                   </div>

                   <div className="space-y-2 mb-6">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email (Lecture Seule)</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        disabled
                        className="w-full p-4 bg-slate-100 border-none rounded-2xl text-sm font-bold text-slate-500 outline-none cursor-not-allowed"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bio / Vocation</label>
                      <textarea 
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none leading-relaxed"
                        placeholder="Décrivez votre rôle et votre mission..."
                      />
                   </div>
                </div>

                <div className="flex justify-end">
                   <button 
                     onClick={handleSave} 
                     disabled={isSaving}
                     className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-black transition-all flex items-center gap-3 disabled:opacity-70 active:scale-95"
                   >
                      {isSaving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>}
                      {isSaving ? 'Enregistrement...' : 'Sauvegarder les modifications'}
                   </button>
                </div>
             </div>
           )}

           {/* Autres Tabs restent identiques à la structure précédente */}
           {/* ... */}
        </div>
      </div>
    </div>
  );
};

export default SettingsModule;