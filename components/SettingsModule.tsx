
import React, { useState, useRef } from 'react';
import { 
  User, Bell, Lock, Globe, Moon, ChevronRight, Save, 
  Loader2, CheckCircle, ShieldCheck, Camera, Power, 
  Mail, MessageSquare, Smartphone, Calendar, Wallet, 
  Megaphone, AlertTriangle, Key, Eye, EyeOff, Smartphone as PhoneIcon,
  LogOut, Laptop, MapPin, Clock, Palette, ArrowLeft, PenTool, Book
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../contexts/DataContext';

interface SettingsModuleProps {
  onBack: () => void;
}

const SettingsModule: React.FC<SettingsModuleProps> = ({ onBack }) => {
  const { user, updateUser, logout } = useAuth();
  // On utilise un état local initialisé avec les données du user context
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
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Notifications State (Local simulation)
  const [notifSettings, setNotifSettings] = useState({
     email: true, push: true, sms: false,
     meetings: true, contributions: true, events: true, security: true
  });

  // Local state for preferences
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('Français (Sénégal)');

  const handleSave = async () => {
    setIsSaving(true);
    // Simulation délai réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mise à jour du contexte Auth (qui persiste dans localStorage)
    updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
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
                          <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
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
                          <PenTool size={20} className="text-white" />
                        </div>
                    </div>
                    <button 
                      onClick={handleAvatarClick}
                      className="absolute bottom-0 right-0 p-2.5 bg-emerald-500 text-white rounded-xl shadow-lg border-4 border-slate-900 hover:bg-emerald-400 transition-colors"
                    >
                      <Camera size={14} />
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>
                  
                  <h3 className="text-xl font-black text-white mb-1">{formData.firstName} {formData.lastName}</h3>
                  <div className="flex items-center gap-2 mb-6">
                     <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[9px] font-black uppercase tracking-widest border border-emerald-500/30">
                        {formData.role}
                     </span>
                     <span className="text-[10px] text-slate-400 font-mono">{formData.matricule || 'N/A'}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 w-full pt-6 border-t border-white/10">
                     <div className="text-center">
                        <p className="text-lg font-black text-white">4</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Années</p>
                     </div>
                     <div className="text-center border-l border-white/10 border-r">
                        <p className="text-lg font-black text-white">12</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Activités</p>
                     </div>
                     <div className="text-center">
                        <p className="text-lg font-black text-emerald-400">98%</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Fiabilité</p>
                     </div>
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
                  onClick={() => logout('Déconnexion utilisateur')}
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
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Institutionnel</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
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

           {/* TAB 2: NOTIFICATIONS */}
           {activeTab === 'notifications' && (
             <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Bell size={24}/></div>
                      <div>
                         <h3 className="text-xl font-black text-slate-900">Canaux de Réception</h3>
                         <p className="text-xs text-slate-400 font-medium mt-1">Où souhaitez-vous recevoir vos alertes ?</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      {[
                        { id: 'email', label: 'Email', icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { id: 'push', label: 'Push Mobile', icon: Smartphone, color: 'text-purple-500', bg: 'bg-purple-50' },
                        { id: 'sms', label: 'SMS (Urgence)', icon: MessageSquare, color: 'text-rose-500', bg: 'bg-rose-50' },
                      ].map((channel: any) => (
                        <div key={channel.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                           <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-xl ${channel.bg} ${channel.color}`}>
                                 <channel.icon size={20} />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-700 text-sm">{channel.label}</span>
                              </div>
                           </div>
                           <div 
                             onClick={() => setNotifSettings(prev => ({...prev, [channel.id]: !prev[channel.id as keyof typeof notifSettings]}))}
                             className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 ${notifSettings[channel.id as keyof typeof notifSettings] ? 'bg-emerald-500' : 'bg-slate-200'}`}
                           >
                              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${notifSettings[channel.id as keyof typeof notifSettings] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           )}

           {/* TAB 3: SECURITY */}
           {activeTab === 'security' && (
             <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><Key size={24}/></div>
                      <div>
                         <h3 className="text-xl font-black text-slate-900">Mot de Passe</h3>
                         <p className="text-xs text-slate-400 font-medium mt-1">Dernière modification : {new Date().toLocaleDateString()}</p>
                      </div>
                   </div>

                   <div className="space-y-4 max-w-lg">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nouveau</label>
                         <input 
                           type="password" 
                           className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-rose-200 focus:ring-4 focus:ring-rose-500/10 transition-all" 
                           value={passwordState.new} 
                           onChange={e => setPasswordState({...passwordState, new: e.target.value})} 
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmer</label>
                         <input 
                           type="password" 
                           className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent text-sm font-bold text-slate-800 outline-none focus:bg-white focus:border-rose-200 focus:ring-4 focus:ring-rose-500/10 transition-all" 
                           value={passwordState.confirm} 
                           onChange={e => setPasswordState({...passwordState, confirm: e.target.value})} 
                         />
                      </div>

                      <button 
                        onClick={() => { setIsSaving(true); setTimeout(() => { setIsSaving(false); setPasswordSuccess('Mot de passe mis à jour'); }, 1000); }}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                      >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Mettre à jour le mot de passe'}
                      </button>
                      {passwordSuccess && <p className="text-emerald-600 text-xs font-bold text-center mt-2">{passwordSuccess}</p>}
                   </div>
                </div>
             </div>
           )}

           {/* TAB 4: PREFERENCES */}
           {activeTab === 'preferences' && (
             <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Palette size={24}/></div>
                      <h3 className="text-xl font-black text-slate-900">Apparence & Région</h3>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-between">
                         <div>
                            <div className="flex items-center gap-3 mb-2 text-slate-800">
                               <Globe size={18} />
                               <span className="font-bold text-sm">Langue</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium">Langue de l'interface et des documents.</p>
                         </div>
                         <select 
                           value={language}
                           onChange={(e) => setLanguage(e.target.value)}
                           className="mt-6 w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-purple-400"
                         >
                            <option>Français (Sénégal)</option>
                            <option>Wolof</option>
                            <option>Arabe</option>
                            <option>English</option>
                         </select>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-between">
                         <div>
                            <div className="flex items-center gap-3 mb-2 text-slate-800">
                               <Moon size={18} />
                               <span className="font-bold text-sm">Thème</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium">Apparence visuelle de l'application.</p>
                         </div>
                         <div className="mt-6 flex bg-white p-1 rounded-xl border border-slate-200">
                            <button 
                              onClick={() => setDarkMode(false)}
                              className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${!darkMode ? 'bg-slate-100 text-slate-800 shadow-sm' : 'text-slate-400'}`}
                            >
                               Clair
                            </button>
                            <button 
                              onClick={() => setDarkMode(true)}
                              className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${darkMode ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400'}`}
                            >
                               Sombre
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {/* TAB 5: STATUTS & RÈGLEMENT */}
           {activeTab === 'statutes' && (
             <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
               <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                 <div className="flex items-center gap-4 mb-6">
                   <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg"><Book size={24}/></div>
                   <div>
                     <h3 className="text-xl font-black text-slate-900">Textes Fondateurs</h3>
                     <p className="text-xs text-slate-400 font-medium">Statuts et Règlement Intérieur du Dahira Madjmahoun Noreyni</p>
                   </div>
                 </div>

                 <div className="prose prose-sm prose-slate max-w-none text-slate-600 bg-slate-50 p-8 rounded-3xl border border-slate-200 max-h-[500px] overflow-y-auto custom-scrollbar">
                   <h3 className="text-slate-800 font-black mb-4">A: STATUT DU DAHIRA MADJMAHOUN NOREYNI LSLL</h3>
                   
                   <h4 className="font-bold text-slate-700 mt-4">TITRE I : HISTORIQUE ET OBJECTIFS</h4>
                   <p className="text-xs mb-2"><strong>Article I : Historique</strong><br/>
                   Le dahira Madjmahoun Noreyni signifie littéralement la fusion des deux lumières. En effet, il existait au départ deux(2) dahiras : Diyaa u Douri installé au Lycée Seydina Limamou Laye (LSLL) depuis 1994... fusionnés en 2005 sous l'égide de Serigne Saliou Mbacké.</p>
                   
                   <p className="text-xs mb-2"><strong>Article II : Objectifs</strong><br/>
                   Le dahira se fixe pour objectifs de regrouper les musulmans, vulgariser l’enseignement de Cheikhoul Khadim, contribuer à la formation morale et religieuse, et bannir l’obscurantisme.</p>

                   <h4 className="font-bold text-slate-700 mt-4">TITRE III : COMPOSITION ET STRUCTURES</h4>
                   <p className="text-xs mb-2"><strong>Article X : Le Comité Directeur (CD)</strong><br/>
                   Instance suprême du dahira, dirigée par le Diewrigne et le Secrétaire Général. Il veille au bon fonctionnement et à l’application du statut.</p>

                   <h4 className="font-bold text-slate-700 mt-4">TITRE IV : FONCTIONNEMENT</h4>
                   <p className="text-xs mb-2"><strong>Article XIV</strong><br/>
                   Le secteur élève se réunit toutes les semaines. Les secteurs étudiants et travailleurs selon leur propre calendrier.</p>

                   <hr className="my-6 border-slate-300"/>

                   <h3 className="text-slate-800 font-black mb-4">B: LE RÈGLEMENT INTÉRIEUR</h3>
                   
                   <h4 className="font-bold text-slate-700 mt-4">Article V : LES COMMISSIONS</h4>
                   <ul className="list-disc pl-5 text-xs space-y-1">
                     <li><strong>Commission Administrative :</strong> Gère l'adhésion, l'information et le contrôle de présence.</li>
                     <li><strong>Commission d'Organisation :</strong> Responsable de la logistique, restauration, collation et hygiène lors des événements.</li>
                     <li><strong>Commission des Finances :</strong> Gère la trésorerie, le Sass, le Gott et les Adiyas.</li>
                     <li><strong>Commission Culturelle :</strong> Chargée de l'enseignement religieux et de la déclamation des Xacidas.</li>
                     <li><strong>Commission Sociale :</strong> Raffermit les liens par l'entraide et l'assistance.</li>
                   </ul>

                   <p className="text-xs mt-4 italic text-slate-400">Ce document est une version numérique simplifiée. La version physique signée fait foi.</p>
                 </div>
               </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default SettingsModule;
