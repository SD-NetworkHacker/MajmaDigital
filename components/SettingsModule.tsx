
import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Bell, Lock, Globe, Moon, ChevronRight, Save, 
  Loader2, CheckCircle, ShieldCheck, Camera, Power, 
  Mail, MessageSquare, Smartphone, Calendar, Wallet, 
  Megaphone, AlertTriangle, Key, Eye, EyeOff, Smartphone as PhoneIcon,
  LogOut, Laptop, MapPin, RefreshCcw
} from 'lucide-react';
import { useData } from '../contexts/DataContext';

const SettingsModule: React.FC = () => {
  const { userProfile, updateUserProfile, resetData } = useData();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [formData, setFormData] = useState(userProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Avatar Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Security State
  const [passwordState, setPasswordState] = useState({ old: '', new: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    setFormData(userProfile);
  }, [userProfile]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    updateUserProfile(formData);
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // --- IDENTITY HANDLERS ---

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

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

  const cycleLanguage = () => {
    const languages = ['Français (Sénégal)', 'Wolof', 'Arabe', 'Anglais'];
    const currentIndex = languages.indexOf(formData.preferences.language);
    const nextIndex = (currentIndex + 1) % languages.length;
    
    const updated = {
      ...formData,
      preferences: { ...formData.preferences, language: languages[nextIndex] }
    };
    setFormData(updated);
    // Optionnel : sauvegarde auto ou attendre le bouton Enregistrer
  };

  const toggleDarkMode = () => {
    const updated = { ...formData, preferences: { ...formData.preferences, darkMode: !formData.preferences.darkMode } };
    setFormData(updated);
    updateUserProfile(updated); // Immediate effect for theme
  };

  // --- NOTIFICATION HANDLERS ---

  const toggleNotificationChannel = (channel: keyof typeof formData.notifications.channels) => {
    const updated = {
      ...formData,
      notifications: {
        ...formData.notifications,
        channels: {
          ...formData.notifications.channels,
          [channel]: !formData.notifications.channels[channel]
        }
      }
    };
    setFormData(updated);
    updateUserProfile(updated);
  };

  const toggleNotificationType = (type: keyof typeof formData.notifications.types) => {
    const updated = {
      ...formData,
      notifications: {
        ...formData.notifications,
        types: {
          ...formData.notifications.types,
          [type]: !formData.notifications.types[type]
        }
      }
    };
    setFormData(updated);
    updateUserProfile(updated);
  };

  // --- SECURITY HANDLERS ---

  const handlePasswordUpdate = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordState.new.length < 6) {
        setPasswordError("Le mot de passe doit contenir au moins 6 caractères.");
        return;
    }
    if (passwordState.new !== passwordState.confirm) {
        setPasswordError("Les nouveaux mots de passe ne correspondent pas.");
        return;
    }

    setIsSaving(true);
    // Simule API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update last password change date
    const updatedSecurity = {
        ...userProfile.security,
        lastPasswordUpdate: new Date().toISOString()
    };
    updateUserProfile({ security: updatedSecurity });
    
    setPasswordState({ old: '', new: '', confirm: '' });
    setPasswordSuccess("Mot de passe mis à jour avec succès.");
    setIsSaving(false);
  };

  const toggle2FA = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    const updatedSecurity = {
        ...userProfile.security,
        twoFactorEnabled: !userProfile.security.twoFactorEnabled
    };
    updateUserProfile({ security: updatedSecurity });
    setFormData(prev => ({...prev, security: updatedSecurity}));
    setIsSaving(false);
  };

  const getLastPasswordUpdateText = () => {
      const date = new Date(userProfile.security.lastPasswordUpdate);
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Configuration Système</h2>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" /> Profil Administrateur & Préférences
          </p>
        </div>
        {showSuccess && (
          <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl border border-emerald-100 animate-in slide-in-from-top-4">
            <CheckCircle size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Modifications enregistrées</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation latérale */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-10 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 font-arabic text-8xl pointer-events-none">م</div>
            
            <div className="relative mx-auto w-32 h-32 mb-6 group-hover:scale-105 transition-transform duration-500">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Profile" className="w-full h-full rounded-[2.5rem] object-cover border-4 border-white shadow-2xl" />
              ) : (
                <div className="w-full h-full bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-700 font-black text-4xl border-4 border-white shadow-2xl">
                  {formData.firstName[0]}{formData.lastName[0]}
                </div>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              <button 
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 p-3 bg-slate-900 text-white rounded-2xl shadow-xl hover:scale-110 hover:bg-emerald-600 transition-all border-4 border-white cursor-pointer"
                title="Changer la photo"
              >
                <Camera size={16} />
              </button>
            </div>

            <h3 className="text-xl font-black text-slate-900">{formData.firstName} {formData.lastName}</h3>
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em] mb-6 mt-1">{formData.matricule}</p>
            <div className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">Accès : {formData.role}</div>
          </div>

          <nav className="glass-card overflow-hidden divide-y divide-slate-50">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full p-6 flex items-center justify-between group transition-colors ${activeTab === 'profile' ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}
            >
              <div className={`flex items-center gap-4 ${activeTab === 'profile' ? 'text-emerald-700' : 'text-slate-500'}`}>
                <div className={`p-2 rounded-xl shadow-sm transition-colors ${activeTab === 'profile' ? 'bg-white' : 'bg-slate-50'}`}><User size={20} /></div>
                <span className="text-xs font-black uppercase tracking-widest">Identité Digitale</span>
              </div>
              <ChevronRight size={16} className={activeTab === 'profile' ? 'text-emerald-600' : 'text-slate-300'} />
            </button>
            
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`w-full p-6 flex items-center justify-between group transition-colors ${activeTab === 'notifications' ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}
            >
              <div className={`flex items-center gap-4 ${activeTab === 'notifications' ? 'text-emerald-700' : 'text-slate-500'}`}>
                <div className={`p-2 rounded-xl shadow-sm transition-colors ${activeTab === 'notifications' ? 'bg-white' : 'bg-slate-50'}`}><Bell size={20} /></div>
                <span className="text-xs font-black uppercase tracking-widest">Alertes & Rappels</span>
              </div>
              <ChevronRight size={16} className={activeTab === 'notifications' ? 'text-emerald-600' : 'text-slate-300'} />
            </button>
            
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full p-6 flex items-center justify-between group transition-colors ${activeTab === 'security' ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}
            >
              <div className={`flex items-center gap-4 ${activeTab === 'security' ? 'text-emerald-700' : 'text-slate-500'}`}>
                <div className={`p-2 rounded-xl shadow-sm transition-colors ${activeTab === 'security' ? 'bg-white' : 'bg-slate-50'}`}><Lock size={20} /></div>
                <span className="text-xs font-black uppercase tracking-widest">Clés de Sécurité</span>
              </div>
              <ChevronRight size={16} className={activeTab === 'security' ? 'text-emerald-600' : 'text-slate-300'} />
            </button>
          </nav>
          
          <div className="pt-4">
             <button 
               onClick={resetData}
               className="w-full p-4 border-2 border-dashed border-rose-200 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
             >
                <Power size={14} /> Réinitialiser Système
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* TAB 1: GENERAL PROFILE */}
          {activeTab === 'profile' && (
            <div className="animate-in slide-in-from-right-4 duration-500 space-y-8">
              <div className="glass-card p-10 space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><User size={24} /></div>
                  <h3 className="font-black text-slate-900 uppercase text-sm tracking-[0.15em]">Informations Générales</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom du Talibé</label>
                    <input 
                      type="text" 
                      value={formData.firstName} 
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom de famille</label>
                    <input 
                      type="text" 
                      value={formData.lastName} 
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adresse Email Institutionnelle</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vocation Spirituelle (Bio)</label>
                  <textarea 
                    rows={4} 
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-[2rem] px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white resize-none outline-none leading-relaxed italic"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full md:w-auto px-10 py-5 bg-[#2E8B57] text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-emerald-900/20 hover:bg-emerald-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-4 disabled:opacity-70 disabled:translate-y-0 active:scale-95"
                  >
                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    {isSaving ? 'Synchronisation...' : 'Enregistrer le Profil'}
                  </button>
                </div>
              </div>

              <div className="glass-card p-10 space-y-6">
                <h3 className="font-black text-slate-900 uppercase text-sm tracking-[0.15em] border-b border-slate-50 pb-6">Préférences de l'Espace</h3>
                
                <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-[1.5rem] border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-400"><Globe size={20} /></div>
                    <div>
                      <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Langue de l'Interface</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{formData.preferences.language}</p>
                    </div>
                  </div>
                  <button 
                    onClick={cycleLanguage}
                    className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-emerald-50 hover:border-emerald-200 transition-all flex items-center gap-2"
                  >
                    <RefreshCcw size={12} /> Modifier
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-[1.5rem] border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl shadow-sm transition-colors ${formData.preferences.darkMode ? 'bg-slate-900 text-amber-400' : 'bg-white text-slate-400'}`}>
                      <Moon size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800 uppercase tracking-widest">Mode Sérénité (Sombre)</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{formData.preferences.darkMode ? 'Actif' : 'Inactif'}</p>
                    </div>
                  </div>
                  <div 
                    onClick={toggleDarkMode}
                    className={`w-14 h-7 rounded-full relative cursor-pointer transition-all duration-300 ${formData.preferences.darkMode ? 'bg-emerald-500' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${formData.preferences.darkMode ? 'left-8' : 'left-1'}`}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALERTS & REMINDERS */}
          {activeTab === 'notifications' && (
            <div className="animate-in slide-in-from-right-4 duration-500 space-y-8">
              <div className="glass-card p-10 bg-white">
                 <div className="flex items-center gap-4 border-b border-slate-50 pb-6 mb-8">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Bell size={24} /></div>
                    <div>
                       <h3 className="font-black text-slate-900 uppercase text-sm tracking-[0.15em]">Canaux de Diffusion</h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Choisissez comment vous souhaitez être contacté</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-4">
                    {[
                      { key: 'email', label: 'Notifications Email', desc: 'Rapports, bilans et annonces officielles.', icon: Mail, color: 'text-blue-500' },
                      { key: 'push', label: 'Push Mobile (App)', desc: 'Alertes en temps réel et rappels urgents.', icon: Smartphone, color: 'text-emerald-500' },
                      { key: 'sms', label: 'SMS Prioritaires', desc: 'Uniquement pour les situations de crise.', icon: MessageSquare, color: 'text-rose-500' },
                    ].map((channel: any) => (
                      <div key={channel.key} className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-slate-200 transition-all">
                         <div className="flex items-center gap-5">
                            <div className={`p-3 bg-white rounded-2xl shadow-sm ${channel.color}`}>
                               <channel.icon size={20} />
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-800">{channel.label}</p>
                               <p className="text-[10px] text-slate-400 font-bold mt-1">{channel.desc}</p>
                            </div>
                         </div>
                         <div 
                           onClick={() => toggleNotificationChannel(channel.key)}
                           className={`w-14 h-7 rounded-full relative cursor-pointer transition-all duration-300 ${formData.notifications.channels[channel.key as keyof typeof formData.notifications.channels] ? 'bg-emerald-500' : 'bg-slate-200'}`}
                         >
                           <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${formData.notifications.channels[channel.key as keyof typeof formData.notifications.channels] ? 'left-8' : 'left-1'}`}></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="glass-card p-10 bg-white">
                 <div className="flex items-center gap-4 border-b border-slate-50 pb-6 mb-8">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Megaphone size={24} /></div>
                    <div>
                       <h3 className="font-black text-slate-900 uppercase text-sm tracking-[0.15em]">Sujets d'Alerte</h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Personnalisez votre flux d'information</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { key: 'meetings', label: 'Réunions & Instances', icon: Calendar },
                      { key: 'contributions', label: 'Appels de Fonds', icon: Wallet },
                      { key: 'events', label: 'Grands Événements', icon: Megaphone },
                      { key: 'security', label: 'Sécurité & Crises', icon: AlertTriangle },
                    ].map((type: any) => (
                      <div key={type.key} 
                        className={`p-6 rounded-[2rem] border transition-all cursor-pointer flex flex-col justify-between h-32 ${
                          formData.notifications.types[type.key as keyof typeof formData.notifications.types] 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                        }`}
                        onClick={() => toggleNotificationType(type.key)}
                      >
                         <div className="flex justify-between items-start">
                            <type.icon size={24} className={formData.notifications.types[type.key as keyof typeof formData.notifications.types] ? 'text-emerald-400' : 'text-slate-300'} />
                            <div className={`w-4 h-4 rounded-full border-2 ${
                               formData.notifications.types[type.key as keyof typeof formData.notifications.types] 
                                 ? 'bg-emerald-500 border-emerald-500' 
                                 : 'border-slate-200'
                            }`}></div>
                         </div>
                         <p className="text-xs font-black uppercase tracking-widest">{type.label}</p>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY */}
          {activeTab === 'security' && (
            <div className="animate-in slide-in-from-right-4 duration-500 space-y-8">
               <div className="glass-card p-10 bg-white">
                  <div className="flex items-center gap-4 border-b border-slate-50 pb-6 mb-8">
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><Key size={24} /></div>
                    <div>
                       <h3 className="font-black text-slate-900 uppercase text-sm tracking-[0.15em]">Mot de Passe</h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                         Dernière modification : {getLastPasswordUpdateText()}
                       </p>
                    </div>
                  </div>

                  <div className="space-y-6 max-w-lg">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe actuel</label>
                        <div className="relative">
                           <input 
                             type={showPassword ? "text" : "password"} 
                             className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold outline-none focus:ring-2 focus:ring-rose-500/20" 
                             value={passwordState.old} 
                             onChange={e => setPasswordState({...passwordState, old: e.target.value})} 
                           />
                           <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                              {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                           </button>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
                        <input 
                          type="password" 
                          className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold outline-none focus:ring-2 focus:ring-rose-500/20" 
                          value={passwordState.new} 
                          onChange={e => setPasswordState({...passwordState, new: e.target.value})} 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmer nouveau mot de passe</label>
                        <input 
                          type="password" 
                          className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold outline-none focus:ring-2 focus:ring-rose-500/20" 
                          value={passwordState.confirm} 
                          onChange={e => setPasswordState({...passwordState, confirm: e.target.value})} 
                        />
                     </div>
                     
                     {passwordError && (
                       <div className="flex items-center gap-2 text-[10px] font-bold text-rose-500 bg-rose-50 p-3 rounded-xl">
                         <AlertTriangle size={14} /> {passwordError}
                       </div>
                     )}
                     
                     {passwordSuccess && (
                       <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 p-3 rounded-xl">
                         <CheckCircle size={14} /> {passwordSuccess}
                       </div>
                     )}

                     <button 
                       onClick={handlePasswordUpdate}
                       disabled={isSaving || !passwordState.old || !passwordState.new}
                       className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-black transition-all w-full flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                     >
                       {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Mettre à jour'}
                     </button>
                  </div>
               </div>

               <div className={`glass-card p-10 border transition-all ${userProfile.security.twoFactorEnabled ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
                  <div className="flex items-start justify-between">
                     <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-2xl ${userProfile.security.twoFactorEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                           <PhoneIcon size={24} />
                        </div>
                        <div>
                           <h4 className={`text-sm font-black uppercase mb-2 ${userProfile.security.twoFactorEnabled ? 'text-emerald-800' : 'text-rose-800'}`}>
                             Authentification à Double Facteur (2FA)
                           </h4>
                           <p className="text-xs text-slate-600 leading-relaxed mb-4 max-w-md">
                              La double authentification ajoute une couche de sécurité supplémentaire à votre compte. 
                              {userProfile.security.twoFactorEnabled ? ' Votre compte est actuellement protégé.' : ' Une fois activée, un code SMS sera requis à chaque connexion.'}
                           </p>
                           <button 
                             onClick={toggle2FA}
                             disabled={isSaving}
                             className={`px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all border-2 flex items-center gap-2 active:scale-95 ${
                               userProfile.security.twoFactorEnabled 
                                 ? 'bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50' 
                                 : 'bg-white border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white'
                             }`}
                           >
                              {isSaving ? <Loader2 size={14} className="animate-spin" /> : (userProfile.security.twoFactorEnabled ? 'Désactiver' : 'Activer maintenant')}
                           </button>
                        </div>
                     </div>
                     <div className={`w-3 h-3 rounded-full ${userProfile.security.twoFactorEnabled ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'} animate-pulse`}></div>
                  </div>
               </div>

               {/* Login History */}
               <div className="glass-card p-10 bg-white">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <Laptop size={14} /> Appareils Connectés Récemment
                  </h4>
                  <div className="space-y-4">
                     {userProfile.security.loginHistory.map((login) => (
                       <div key={login.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${login.status === 'current' ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-400 border border-slate-200'}`}>
                                {login.device.includes('iPhone') ? <PhoneIcon size={18} /> : <Laptop size={18} />}
                             </div>
                             <div>
                                <p className="text-xs font-bold text-slate-800">{login.device} {login.status === 'current' && <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded ml-2 uppercase font-black">Actuel</span>}</p>
                                <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                                   <MapPin size={10} /> {login.location} • {login.ip}
                                </p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-[9px] font-bold text-slate-500">{new Date(login.date).toLocaleDateString()}</p>
                             {login.status !== 'current' && (
                               <button className="text-[9px] font-black text-rose-500 hover:underline uppercase mt-1">Déconnecter</button>
                             )}
                          </div>
                       </div>
                     ))}
                  </div>
                  <button className="w-full mt-6 py-3 border-2 border-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-rose-200 hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center gap-2">
                     <LogOut size={14} /> Déconnecter toutes les autres sessions
                  </button>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsModule;
