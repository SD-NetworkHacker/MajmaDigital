import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, Briefcase, School, User, Target, 
  MessageSquare, AlertTriangle, Search, ChevronRight, 
  Phone, Mail, Zap, UserPlus, X, Send, CheckCircle, 
  Loader2, Users, FileText
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { MemberCategory, Member } from '../../types';
import MemberProfileModal from '../../components/MemberProfileModal';

const SectorCoordinator: React.FC = () => {
  const { members } = useData();
  
  // États de navigation et données
  const [activeSectorId, setActiveSectorId] = useState<'Eleves' | 'Etudiants' | 'Travailleurs'>('Etudiants');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  // États pour la gestion des campagnes et messages
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignType, setCampaignType] = useState<'sms' | 'email'>('sms');
  const [campaignMode, setCampaignMode] = useState<'broadcast' | 'single'>('broadcast');
  const [targetMember, setTargetMember] = useState<Member | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Configuration visuelle et logique des secteurs
  const sectorsConfig = {
    Eleves: { 
      label: 'Élèves & Jeunesse', 
      category: MemberCategory.ELEVE, 
      icon: School, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      gradient: 'from-amber-500 to-orange-600'
    },
    Etudiants: { 
      label: 'Étudiants & Kurels', 
      category: MemberCategory.ETUDIANT, 
      icon: GraduationCap, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      gradient: 'from-emerald-500 to-teal-600'
    },
    Travailleurs: { 
      label: 'Professionnels', 
      category: MemberCategory.TRAVAILLEUR, 
      icon: Briefcase, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      gradient: 'from-blue-500 to-indigo-600'
    },
  };

  const currentConfig = sectorsConfig[activeSectorId];

  // --- FILTRAGE ET CALCULS ---
  
  const sectorMembers = useMemo(() => {
    return members.filter(m => m.category === currentConfig.category);
  }, [members, currentConfig]);

  const filteredMembers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return sectorMembers.filter(m => 
      (m.firstName || '').toLowerCase().includes(term) || 
      (m.lastName || '').toLowerCase().includes(term) || 
      (m.email || '').toLowerCase().includes(term) || 
      (m.matricule || '').toLowerCase().includes(term)
    );
  }, [sectorMembers, searchTerm]);

  const stats = useMemo(() => ({
    count: sectorMembers.length,
    presenceRate: sectorMembers.length > 0 ? Math.round((sectorMembers.filter(m => m.status === 'active').length / sectorMembers.length) * 100) : 0,
    cotisationRate: 0, 
    participation: 0 
  }), [sectorMembers]);

  // --- ACTIONS ---

  const handleOpenBroadcast = (type: 'sms' | 'email') => {
    setCampaignMode('broadcast');
    setTargetMember(null);
    setCampaignType(type);
    setMessageContent('');
    setSendSuccess(false);
    setShowCampaignModal(true);
  };

  const handleOpenIndividual = (e: React.MouseEvent, member: Member, type: 'sms' | 'email') => {
    e.stopPropagation(); 
    setCampaignMode('single');
    setTargetMember(member);
    setCampaignType(type);
    setMessageContent('');
    setSendSuccess(false);
    setShowCampaignModal(true);
  };

  const handleSendMessage = () => {
    if (!messageContent.trim()) return;
    setIsSending(true);
    
    // Simulation d'envoi réseau
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
      setTimeout(() => setShowCampaignModal(false), 2000);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in zoom-in duration-700 relative">
      
      {/* --- MODALE PROFIL MEMBRE --- */}
      {selectedMember && (
        <MemberProfileModal 
          member={selectedMember} 
          onClose={() => setSelectedMember(null)} 
        />
      )}

      {/* --- MODALE MESSAGERIE / CAMPAGNE --- */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className={`p-6 border-b border-slate-100 flex justify-between items-center ${currentConfig.bg}`}>
              <div>
                <h3 className={`text-lg font-black ${currentConfig.color} flex items-center gap-2`}>
                  {campaignType === 'sms' ? <MessageSquare size={18}/> : <Mail size={18}/>}
                  {campaignMode === 'broadcast' ? 'Campagne Groupée' : 'Message Individuel'}
                </h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                  {campaignMode === 'broadcast' 
                    ? `Cible : ${activeSectorId} (${filteredMembers.length} destinataires)`
                    : `Destinataire : ${targetMember?.firstName} ${targetMember?.lastName}`
                  }
                </p>
              </div>
              <button onClick={() => setShowCampaignModal(false)} className="p-2 bg-white/50 hover:bg-white rounded-full transition-all text-slate-500 hover:text-slate-800">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {!sendSuccess ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Contenu du {campaignType.toUpperCase()}
                    </label>
                    <textarea 
                      className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none placeholder-slate-400"
                      placeholder={campaignMode === 'broadcast' 
                        ? `Rédigez votre annonce pour le secteur ${activeSectorId}...` 
                        : `Écrivez votre message pour ${targetMember?.firstName}...`
                      }
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      autoFocus
                    />
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                      <span>{messageContent.length} caractères</span>
                      {campaignType === 'sms' && <span>~{Math.ceil(messageContent.length / 160)} SMS</span>}
                    </div>
                  </div>
                  
                  {campaignMode === 'broadcast' && (
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                      <Zap size={16} className="text-blue-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-blue-800 leading-relaxed">
                        Astuce : Utilisez <strong>{`{prenom}`}</strong> pour personnaliser automatiquement le message.
                      </p>
                    </div>
                  )}

                  <button 
                    onClick={handleSendMessage}
                    disabled={isSending || !messageContent.trim()}
                    className={`w-full py-4 rounded-xl text-white font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all ${
                      isSending ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-black active:scale-95'
                    }`}
                  >
                    {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {isSending ? 'Envoi en cours...' : `Envoyer ${campaignType === 'sms' ? 'SMS' : 'Email'}`}
                  </button>
                </>
              ) : (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-in zoom-in">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900">Message Envoyé !</h4>
                    <p className="text-sm text-slate-500 mt-2">
                      {campaignMode === 'broadcast' 
                        ? 'La diffusion est en cours de traitement.' 
                        : 'Le destinataire recevra votre message instantanément.'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER NAVIGATION --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Coordination Sectorielle</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Target size={14} className="text-emerald-500" /> Segmentation opérationnelle par catégorie de membres
          </p>
        </div>
        <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
           {(Object.keys(sectorsConfig) as Array<keyof typeof sectorsConfig>).map(key => {
              const conf = sectorsConfig[key];
              return (
                <button 
                  key={key} 
                  onClick={() => { setActiveSectorId(key); setSearchTerm(''); }}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeSectorId === key ? 'bg-white text-emerald-700 shadow-xl shadow-emerald-900/5' : 'text-slate-400 hover:text-emerald-600'
                  }`}
                >
                  <conf.icon size={16} />
                  <span className="hidden lg:inline">{key}</span>
                </button>
              );
            })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: STATS & INSIGHTS --- */}
        <div className="lg:col-span-4 space-y-8">
          {/* Main Stat Card */}
          <div className="glass-card p-10 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-40 h-40 opacity-10 -mr-16 -mt-16 rounded-full transition-transform group-hover:scale-150 duration-1000 ${currentConfig.bg}`}></div>
            <div className="relative z-10">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Focus Secteur : {activeSectorId}</h4>
               <div className="flex items-center gap-6 mb-12">
                  <div className={`p-5 rounded-[2rem] shadow-xl ${currentConfig.bg} ${currentConfig.color}`}>
                    {React.createElement(currentConfig.icon, { size: 40 })}
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{stats.count}</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Membres Inscrits</p>
                  </div>
               </div>
               <div className="space-y-6">
                  {[
                    { label: 'Taux Présence Dahira', val: stats.presenceRate, c: 'bg-emerald-500' },
                    { label: 'Cotisations à Jour', val: stats.cotisationRate, c: 'bg-blue-500' },
                    { label: 'Participation Magal', val: stats.participation, c: 'bg-purple-500' },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                          <span className="text-slate-400">{stat.label}</span>
                          <span className="text-slate-800">{stat.val}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                          <div className={`h-full ${stat.c} transition-all duration-1000`} style={{ width: `${stat.val}%` }}></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* Needs & Alerts */}
          <div className="glass-card p-10 bg-rose-50/50 border-rose-100/50">
             <h4 className="text-[10px] font-black text-rose-800 uppercase tracking-widest mb-8 flex items-center gap-3">
               <AlertTriangle size={18} /> Besoins Prioritaires
             </h4>
             <div className="space-y-4">
                {activeSectorId === 'Etudiants' && [
                  'Aide financière inscriptions',
                  'Soutien orientation bacheliers',
                  'Organisation cours Xassaid du soir'
                ].map((need, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-white border border-rose-100 rounded-2xl shadow-sm">
                     <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 animate-pulse shrink-0"></div>
                     <p className="text-[11px] font-bold text-slate-700 leading-relaxed uppercase">{need}</p>
                  </div>
                ))}
                {activeSectorId === 'Eleves' && [
                  'Cours de renforcement',
                  'Kits scolaires rentrée',
                  'Sorties pédagogiques'
                ].map((need, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-white border border-rose-100 rounded-2xl shadow-sm">
                     <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 animate-pulse shrink-0"></div>
                     <p className="text-[11px] font-bold text-slate-700 leading-relaxed uppercase">{need}</p>
                  </div>
                ))}
                {activeSectorId === 'Travailleurs' && [
                  'Networking professionnel',
                  'Digitalisation cotisations',
                  'Séminaires Leadership'
                ].map((need, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-white border border-rose-100 rounded-2xl shadow-sm">
                     <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 animate-pulse shrink-0"></div>
                     <p className="text-[11px] font-bold text-slate-700 leading-relaxed uppercase">{need}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: MEMBER DIRECTORY & TOOLS --- */}
        <div className="lg:col-span-8 space-y-8">
           <div className="glass-card p-10 overflow-hidden bg-white min-h-[700px] flex flex-col">
              <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                 <h4 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <Zap size={22} className="text-amber-500" /> Annuaire Ciblé
                 </h4>
                 
                 <div className="flex gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => handleOpenBroadcast('sms')}
                      className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border transition-all active:scale-95 ${currentConfig.bg} ${currentConfig.color} ${currentConfig.border} hover:brightness-95`}
                    >
                      <MessageSquare size={14}/> <span className="hidden sm:inline">SMS Collectif</span>
                    </button>
                    <div className="relative flex-1 md:w-64 group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16}/>
                      <input 
                        type="text" 
                        placeholder="Rechercher un membre..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 text-slate-600 rounded-xl border border-slate-100 focus:ring-2 focus:ring-emerald-500/20 outline-none text-xs font-bold transition-all"
                      />
                    </div>
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 mb-6">
                 {filteredMembers.length > 0 ? filteredMembers.map(member => (
                   <div 
                    key={member.id} 
                    className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 group hover:bg-white hover:border-emerald-100 hover:shadow-lg transition-all cursor-pointer relative"
                    onClick={() => setSelectedMember(member)}
                   >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-5 mb-4">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-emerald-700 text-base shadow-sm border border-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                             {(member.firstName || 'U')[0]}{(member.lastName || '')[0]}
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-800 leading-none mb-1.5">{member.firstName} {member.lastName}</p>
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{member.matricule}</p>
                              </div>
                           </div>
                        </div>
                        
                        {/* Actions Rapides Individuelles */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                           <button 
                             onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${member.phone}`; }}
                             className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-600 hover:text-white transition-colors" 
                             title="Appeler"
                           >
                             <Phone size={16}/>
                           </button>
                           <button 
                             onClick={(e) => handleOpenIndividual(e, member, 'sms')}
                             className="p-2.5 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-600 hover:text-white transition-colors"
                             title="SMS Individuel"
                           >
                             <MessageSquare size={16}/>
                           </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100/50">
                         <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                           <Phone size={12} className="text-emerald-500"/> {member.phone}
                         </div>
                         <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest truncate">
                           <Mail size={12} className="text-emerald-500"/> <span className="truncate">{member.email}</span>
                         </div>
                      </div>
                   </div>
                 )) : (
                   <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-slate-50/50 rounded-[2rem]">
                      <Users size={32} className="opacity-20 mb-2"/>
                      <p className="text-xs font-bold uppercase">Aucun membre trouvé</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SectorCoordinator;