
import React, { useState, useMemo } from 'react';
import { 
  X, Phone, Mail, MapPin, Shield, Calendar, Hash, Briefcase, User, 
  Wallet, TrendingUp, Bus, Ticket, Music, BookOpen, Star, MessageCircle, 
  Send, ExternalLink, GraduationCap, Download
} from 'lucide-react';
import { Member } from '../types';
import { useData } from '../contexts/DataContext';

interface MemberProfileModalProps {
  member: Member;
  onClose: () => void;
}

type TabType = 'infos' | 'finance' | 'activities' | 'pedagogy';

const MemberProfileModal: React.FC<MemberProfileModalProps> = ({ member, onClose }) => {
  const { contributions, events } = useData();
  const [activeTab, setActiveTab] = useState<TabType>('infos');

  // --- DATA COMPUTATION ---

  // 1. Finance Data
  const memberContributions = useMemo(() => {
    return contributions
      .filter(c => c.memberId === member.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [contributions, member.id]);

  const financeStats = useMemo(() => {
    return {
      total: memberContributions.reduce((acc, c) => acc + c.amount, 0),
      sass: memberContributions.filter(c => c.type === 'Sass').reduce((acc, c) => acc + c.amount, 0),
      adiyas: memberContributions.filter(c => c.type === 'Adiyas').reduce((acc, c) => acc + c.amount, 0),
    };
  }, [memberContributions]);

  // 2. Mock Activities (Transport & Culture) - Simulation basée sur des données statiques pour l'instant
  const activitiesHistory = [
    { id: 1, type: 'transport', label: 'Magal Touba 2023', date: '2023-09-04', detail: 'Bus 4 - Siège 12', status: 'Effectué' },
    { id: 2, type: 'culture', label: 'Conférence Khassida', date: '2024-02-15', detail: 'Présent', status: 'Validé' },
    { id: 3, type: 'transport', label: 'Ziarra Générale', date: '2024-04-20', detail: 'Minibus 2', status: 'Réservé' },
  ];

  // 3. Mock Pedagogy
  const pedagogyStats = {
    level: 'Intermédiaire',
    modulesCompleted: 3,
    nextExam: 'Mawahibou - 15 Juin',
    attendance: '85%'
  };

  // --- ACTIONS ---
  
  const handleWhatsApp = () => {
    const cleanPhone = member.phone.replace(/\s+/g, '').replace(/\+/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const handleCall = () => window.location.href = `tel:${member.phone}`;
  const handleEmail = () => window.location.href = `mailto:${member.email}`;
  const handleSMS = () => window.location.href = `sms:${member.phone}`;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        
        {/* HEADER PROFILE */}
        <div className="relative bg-slate-900 p-8 text-white shrink-0 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 p-8 opacity-5 font-arabic text-9xl pointer-events-none rotate-12">م</div>
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white/80 z-20"
          >
            <X size={20} />
          </button>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-28 h-28 bg-white/10 backdrop-blur-xl rounded-[2rem] border-2 border-white/20 flex items-center justify-center text-white font-black text-4xl shadow-2xl">
              {member.firstName[0]}{member.lastName[0]}
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none mb-2">{member.firstName} {member.lastName}</h2>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                <span className="px-3 py-1 bg-emerald-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 flex items-center gap-2 text-emerald-300">
                  <Hash size={12}/> {member.matricule}
                </span>
                <span className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-300">
                  <Briefcase size={12}/> {member.category}
                </span>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                  member.status === 'active' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/20' : 'bg-slate-500 text-white'
                }`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                  {member.status === 'active' ? 'Membre Actif' : member.status}
                </span>
              </div>

              {/* CONTACT ACTIONS BAR */}
              <div className="flex gap-2 justify-center md:justify-start">
                 <button onClick={handleCall} className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 hover:text-white transition-all">
                    <Phone size={14}/> <span className="hidden sm:inline">Appeler</span>
                 </button>
                 <button onClick={handleWhatsApp} className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#25D366] hover:border-[#25D366] transition-all">
                    <MessageCircle size={14}/> WhatsApp
                 </button>
                 <button onClick={handleEmail} className="p-2 bg-white/10 text-white border border-white/10 rounded-xl hover:bg-blue-500 hover:border-blue-500 transition-all">
                    <Mail size={16}/>
                 </button>
                 <button onClick={handleSMS} className="p-2 bg-white/10 text-white border border-white/10 rounded-xl hover:bg-amber-500 hover:border-amber-500 transition-all">
                    <Send size={16}/>
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="bg-white border-b border-slate-100 px-8 flex overflow-x-auto no-scrollbar">
           {[
             { id: 'infos', label: 'Général', icon: User },
             { id: 'finance', label: 'Trésorerie', icon: Wallet },
             { id: 'activities', label: 'Activités', icon: Bus },
             { id: 'pedagogy', label: 'Pédagogie', icon: GraduationCap },
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as TabType)}
               className={`flex items-center gap-2 px-6 py-5 text-xs font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                 activeTab === tab.id 
                   ? 'border-slate-900 text-slate-900' 
                   : 'border-transparent text-slate-400 hover:text-slate-600'
               }`}
             >
                <tab.icon size={16} /> {tab.label}
             </button>
           ))}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/50">
          
          {/* TAB: INFOS GÉNÉRALES */}
          {activeTab === 'infos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4">
               {/* Coordonnées */}
               <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Coordonnées</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><MapPin size={18}/></div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase">Adresse</p>
                          <p className="text-sm font-bold text-slate-800">{member.address}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Phone size={18}/></div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase">Téléphone</p>
                          <p className="text-sm font-bold text-slate-800">{member.phone}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Mail size={18}/></div>
                       <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase">Email</p>
                          <p className="text-sm font-bold text-slate-800">{member.email}</p>
                       </div>
                    </div>
                  </div>
               </div>

               {/* Commissions */}
               <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Responsabilités</h4>
                  {member.commissions.length > 0 ? (
                    <div className="space-y-3">
                      {member.commissions.map((comm, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3">
                             <Shield size={16} className="text-slate-400"/>
                             <div>
                                <p className="text-xs font-black text-slate-800">{comm.type}</p>
                                <p className="text-[10px] text-emerald-600 font-bold uppercase">{comm.role_commission}</p>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Aucune commission assignée.</p>
                  )}
               </div>

               {/* Meta Info */}
               <div className="md:col-span-2 flex items-center justify-between p-6 bg-slate-100/50 rounded-3xl border border-slate-200 border-dashed">
                  <div className="flex items-center gap-3">
                     <Calendar size={18} className="text-slate-400"/>
                     <span className="text-xs font-bold text-slate-600">Membre depuis le {new Date(member.joinDate).toLocaleDateString()}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {member.id}</span>
               </div>
            </div>
          )}

          {/* TAB: FINANCE */}
          {activeTab === 'finance' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                   <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Versé</p>
                      <p className="text-xl font-black text-emerald-900">{financeStats.total.toLocaleString()} F</p>
                   </div>
                   <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                      <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Sass (Mensuel)</p>
                      <p className="text-xl font-black text-blue-900">{financeStats.sass.toLocaleString()} F</p>
                   </div>
                   <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                      <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Adiyas</p>
                      <p className="text-xl font-black text-amber-900">{financeStats.adiyas.toLocaleString()} F</p>
                   </div>
                </div>

                {/* History List */}
                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                   <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><Wallet size={16}/> Historique des transactions</h4>
                      <button className="text-[10px] font-black text-emerald-600 hover:underline uppercase flex items-center gap-1"><Download size={12}/> Relevé PDF</button>
                   </div>
                   <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                      {memberContributions.length > 0 ? (
                         <table className="w-full text-left">
                            <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                               <tr>
                                  <th className="px-6 py-4">Date</th>
                                  <th className="px-6 py-4">Type</th>
                                  <th className="px-6 py-4">Libellé</th>
                                  <th className="px-6 py-4 text-right">Montant</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                               {memberContributions.map(c => (
                                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                     <td className="px-6 py-4 text-xs font-bold text-slate-600">{new Date(c.date).toLocaleDateString()}</td>
                                     <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${c.type === 'Sass' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>{c.type}</span>
                                     </td>
                                     <td className="px-6 py-4 text-xs text-slate-500">{c.eventLabel || '-'}</td>
                                     <td className="px-6 py-4 text-right font-black text-slate-800">{c.amount.toLocaleString()} F</td>
                                  </tr>
                               ))}
                            </tbody>
                         </table>
                      ) : (
                         <div className="py-12 text-center text-slate-400">
                            <Wallet size={32} className="mx-auto mb-2 opacity-20"/>
                            <p className="text-xs font-bold uppercase">Aucune transaction enregistrée</p>
                         </div>
                      )}
                   </div>
                </div>
             </div>
          )}

          {/* TAB: ACTIVITÉS (Transport & Culture) */}
          {activeTab === 'activities' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 flex items-center justify-between">
                      <div>
                         <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Trajets Effectués</p>
                         <p className="text-3xl font-black text-orange-900">12</p>
                      </div>
                      <div className="p-4 bg-white rounded-2xl text-orange-500 shadow-sm"><Bus size={24}/></div>
                   </div>
                   <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex items-center justify-between">
                      <div>
                         <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Événements Culturels</p>
                         <p className="text-3xl font-black text-indigo-900">5</p>
                      </div>
                      <div className="p-4 bg-white rounded-2xl text-indigo-500 shadow-sm"><Ticket size={24}/></div>
                   </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                   <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2"><TrendingUp size={16}/> Chronologie d'Activité</h4>
                   <div className="space-y-4">
                      {activitiesHistory.map((act) => (
                         <div key={act.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:border-slate-300 transition-all">
                            <div className={`p-3 rounded-xl ${act.type === 'transport' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
                               {act.type === 'transport' ? <Bus size={18}/> : <Music size={18}/>}
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between">
                                  <h5 className="text-sm font-black text-slate-800">{act.label}</h5>
                                  <span className="text-[10px] text-slate-400 font-bold">{act.date}</span>
                               </div>
                               <div className="flex justify-between mt-1">
                                  <p className="text-xs text-slate-500">{act.detail}</p>
                                  <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{act.status}</span>
                               </div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          )}

          {/* TAB: PÉDAGOGIE */}
          {activeTab === 'pedagogy' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl">
                   <div className="flex items-center justify-between mb-6">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Niveau Académique</p>
                         <h3 className="text-2xl font-black">{pedagogyStats.level}</h3>
                      </div>
                      <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20"><GraduationCap size={32}/></div>
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-80">
                         <span>Progression Niveau</span>
                         <span>75%</span>
                      </div>
                      <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                         <div className="h-full bg-white w-3/4"></div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2"><BookOpen size={16}/> Modules Validés</h4>
                      <div className="space-y-3">
                         {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-3 text-slate-600 text-xs font-bold">
                               <Star size={14} className="text-amber-400 fill-current"/>
                               <span>Module Khassida Niveau {i}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                   <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2"><Calendar size={16}/> Prochain Examen</h4>
                      <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-lg font-black text-slate-900">{pedagogyStats.nextExam.split(' - ')[0]}</p>
                         <p className="text-xs text-emerald-600 font-bold uppercase mt-1">{pedagogyStats.nextExam.split(' - ')[1]}</p>
                      </div>
                      <button className="w-full mt-4 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Confirmer Présence</button>
                   </div>
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MemberProfileModal;
