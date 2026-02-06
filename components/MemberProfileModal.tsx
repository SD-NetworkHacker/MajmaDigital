
import React, { useState, useMemo } from 'react';
import { 
  X, Phone, Mail, MapPin, Shield, Calendar, Hash, User, 
  Wallet, Download, Edit, Save, Lock, QrCode
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../contexts/DataContext';
import { Member, GlobalRole } from '../types';
import SectorBadge from './shared/SectorBadge';
import { exportToCSV } from '../services/analyticsEngine';

interface MemberProfileModalProps {
  member: Member;
  onClose: () => void;
}

type TabType = 'infos' | 'finance' | 'activities';

const MemberProfileModal: React.FC<MemberProfileModalProps> = ({ member, onClose }) => {
  const { user } = useAuth();
  const { contributions, updateMember, updateMemberStatus } = useData();
  const [activeTab, setActiveTab] = useState<TabType>('infos');

  // --- DATA COMPUTATION ---

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

  // Permissions
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SG' || user?.role === 'DIEUWRINE' || user?.role === 'admin';
  const canEdit = isAdmin || user?.email === member.email;

  // Local State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Member>>({});
  const [showMemberCard, setShowMemberCard] = useState(false);

  // Initialize form data
  const startEditing = () => {
    setFormData({ 
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone,
        address: member.address,
        role: member.role, // Pour la promotion (admin)
        category: member.category
    });
    setIsEditing(true);
  };

  const saveChanges = () => {
    if (formData) {
      updateMember(member.id, formData);
      setIsEditing(false);
    }
  };

  // --- ACTIONS ---
  const handleCall = () => window.location.href = `tel:${member.phone}`;
  const handleEmail = () => window.location.href = `mailto:${member.email}`;
  const handleExport = () => {
    exportToCSV(`profil_${member.matricule}.csv`, [{ ...member, contributions_total: financeStats.total }]);
  };

  if (!member) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        
        {/* HEADER PROFILE */}
        <div className="relative bg-slate-900 p-8 text-white shrink-0 overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 font-arabic text-9xl pointer-events-none rotate-12">م</div>
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white/80 z-20"><X size={20} /></button>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-28 h-28 bg-white/10 backdrop-blur-xl rounded-[2rem] border-2 border-white/20 flex items-center justify-center text-white font-black text-4xl shadow-2xl">
              {member.firstName[0]}{member.lastName[0]}
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none mb-2">{member.firstName} {member.lastName}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                <span className="px-3 py-1 bg-emerald-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 flex items-center gap-2 text-emerald-300"><Hash size={12}/> {member.matricule}</span>
                <SectorBadge category={member.category} level={member.level} size="sm" />
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${member.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div> {member.status}
                </span>
              </div>
              <div className="flex gap-2 justify-center md:justify-start">
                 <button onClick={handleCall} className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 hover:text-white transition-all"><Phone size={14}/> Appeler</button>
                 <button onClick={handleEmail} className="p-2 bg-white/10 text-white border border-white/10 rounded-xl hover:bg-blue-500 hover:border-blue-500 transition-all"><Mail size={16}/></button>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="bg-white border-b border-slate-100 px-8 flex overflow-x-auto no-scrollbar">
           {[{ id: 'infos', label: 'Général', icon: User }, { id: 'finance', label: 'Trésorerie', icon: Wallet }].map(tab => (
             <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)} className={`flex items-center gap-2 px-6 py-5 text-xs font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                <tab.icon size={16} /> {tab.label}
             </button>
           ))}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/50">
          {activeTab === 'infos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4">
               <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Identité & Contact</h4>
                     {canEdit && !isEditing && (
                        <button onClick={startEditing} className="text-[10px] font-black text-emerald-600 hover:underline uppercase flex items-center gap-1"><Edit size={12} /> Modifier</button>
                     )}
                     {isEditing && (
                        <div className="flex gap-2">
                           <button onClick={() => setIsEditing(false)} className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase">Annuler</button>
                           <button onClick={saveChanges} className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase flex items-center gap-1"><Save size={12} /> Enregistrer</button>
                        </div>
                     )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Nom Complet</label>
                        {isEditing ? (
                           <div className="flex gap-2">
                              <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-1/2 p-2 bg-slate-50 rounded-lg text-sm font-bold border border-slate-200 outline-none focus:border-emerald-500" placeholder="Prénom"/>
                              <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-1/2 p-2 bg-slate-50 rounded-lg text-sm font-bold border border-slate-200 outline-none focus:border-emerald-500" placeholder="Nom"/>
                           </div>
                        ) : <p className="text-sm font-bold text-slate-800">{member.firstName} {member.lastName}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Email</label>
                        {isEditing ? (
                            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 bg-slate-50 rounded-lg text-sm font-bold border border-slate-200 outline-none focus:border-emerald-500" />
                        ) : <p className="text-sm font-bold text-slate-800">{member.email}</p>}
                    </div>

                    {/* SECTION PROMOTION (ADMIN ONLY) */}
                    <div className="space-y-1 pt-4 border-t border-slate-100">
                        <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-2">
                           <Shield size={12}/> Rôle (Promotion)
                        </label>
                        {isEditing && isAdmin ? (
                            <div className="bg-amber-50 p-2 rounded-xl border border-amber-100">
                               <select 
                                   value={formData.role} 
                                   onChange={(e) => setFormData({...formData, role: e.target.value as GlobalRole})} 
                                   className="w-full p-2 bg-white rounded-lg text-sm font-black text-amber-900 border border-amber-200 outline-none focus:ring-2 focus:ring-amber-500/20"
                               >
                                   {Object.values(GlobalRole).map(role => (
                                       <option key={role} value={role}>{role}</option>
                                   ))}
                               </select>
                               <p className="text-[9px] text-amber-700 mt-1 pl-1">⚠ La modification du rôle accorde des privilèges d'administration.</p>
                            </div>
                        ) : (
                            <p className={`text-sm font-black uppercase ${member.role === 'ADMIN' ? 'text-purple-600' : 'text-slate-800'}`}>{member.role}</p>
                        )}
                    </div>
                  </div>
               </div>
               
               {/* Commissions */}
               <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Responsabilités</h4>
                  {member.commissions.length > 0 ? member.commissions.map((comm, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                         <Shield size={16} className="text-emerald-600"/>
                         <div>
                            <p className="text-xs font-black text-slate-800">{comm.type}</p>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase">{comm.role_commission}</p>
                         </div>
                      </div>
                    </div>
                  )) : <p className="text-xs text-slate-400 italic">Aucune commission assignée.</p>}
                  
                  {isAdmin && (
                     <div className="pt-4 mt-auto">
                        <button 
                           onClick={() => { if(confirm('Désactiver ce compte ?')) updateMemberStatus(member.id, 'inactive'); }}
                           className="w-full py-3 border-2 border-rose-100 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                        >
                           <Lock size={14} /> Désactiver le Compte
                        </button>
                     </div>
                  )}
               </div>
            </div>
          )}

          {activeTab === 'finance' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-3 gap-4">
                   <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Versé</p>
                      <p className="text-xl font-black text-emerald-900">{financeStats.total.toLocaleString()} F</p>
                   </div>
                   <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                      <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Sass</p>
                      <p className="text-xl font-black text-blue-900">{financeStats.sass.toLocaleString()} F</p>
                   </div>
                   <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                      <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Adiyas</p>
                      <p className="text-xl font-black text-amber-900">{financeStats.adiyas.toLocaleString()} F</p>
                   </div>
                </div>
                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                   <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><Wallet size={16}/> Historique</h4>
                      <button className="text-[10px] font-black text-emerald-600 hover:underline uppercase flex items-center gap-1"><Download size={12}/> Relevé</button>
                   </div>
                   <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                      {memberContributions.length > 0 ? (
                         <table className="w-full text-left">
                            <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                               <tr><th className="px-6 py-4">Date</th><th className="px-6 py-4">Type</th><th className="px-6 py-4 text-right">Montant</th></tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                               {memberContributions.map(c => (
                                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                     <td className="px-6 py-4 text-xs font-bold text-slate-600">{new Date(c.date).toLocaleDateString()}</td>
                                     <td className="px-6 py-4"><span className="px-2 py-1 rounded text-[9px] font-black uppercase bg-slate-100 text-slate-600">{c.type}</span></td>
                                     <td className="px-6 py-4 text-right font-black text-slate-800">{c.amount.toLocaleString()} F</td>
                                  </tr>
                               ))}
                            </tbody>
                         </table>
                      ) : <div className="py-12 text-center text-slate-400"><p className="text-xs font-bold uppercase">Aucune transaction</p></div>}
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
