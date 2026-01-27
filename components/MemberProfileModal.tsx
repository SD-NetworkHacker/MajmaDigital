
import React from 'react';
import { X, Phone, Mail, MapPin, Shield, Calendar, Hash, Briefcase, User } from 'lucide-react';
import { Member, GlobalRole } from '../types';

interface MemberProfileModalProps {
  member: Member;
  onClose: () => void;
}

const MemberProfileModal: React.FC<MemberProfileModalProps> = ({ member, onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header avec Background Gradient */}
        <div className="relative bg-gradient-to-br from-emerald-800 to-slate-900 p-8 text-white shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white/80"
          >
            <X size={20} />
          </button>
          
          <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 flex items-center justify-center text-white font-black text-3xl shadow-inner">
              {member.firstName[0]}{member.lastName[0]}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-black tracking-tight leading-none mb-2">{member.firstName} {member.lastName}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <span className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2">
                  <Hash size={12}/> {member.matricule}
                </span>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                  member.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                }`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                  {member.status === 'active' ? 'Actif' : member.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Informations Personnelles */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Informations Générales</h4>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-xl text-emerald-600 shadow-sm"><Briefcase size={18}/></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Secteur / Catégorie</p>
                    <p className="text-sm font-black text-slate-800">{member.category}</p>
                    {member.level && <p className="text-xs text-slate-500 font-medium">{member.level}</p>}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm"><Shield size={18}/></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Rôle Global</p>
                    <p className="text-sm font-black text-slate-800">{member.role}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-xl text-amber-600 shadow-sm"><Calendar size={18}/></div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Date d'adhésion</p>
                    <p className="text-sm font-black text-slate-800">{new Date(member.joinDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coordonnées */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Coordonnées</h4>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                  <Phone size={16} className="text-slate-400"/>
                  <span className="text-sm font-bold text-slate-700">{member.phone}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                  <Mail size={16} className="text-slate-400"/>
                  <span className="text-sm font-bold text-slate-700">{member.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                  <MapPin size={16} className="text-slate-400"/>
                  <span className="text-sm font-bold text-slate-700">{member.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Commissions & Responsabilités */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <User size={16} /> Affectations aux Commissions
            </h4>
            
            {member.commissions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {member.commissions.map((comm, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div>
                      <p className="text-xs font-black text-slate-800">{comm.type}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mt-1">Rôle : {comm.role_commission}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                <p className="text-xs text-slate-400 font-medium italic">Aucune commission assignée pour le moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">Fermer</button>
        </div>
      </div>
    </div>
  );
};

export default MemberProfileModal;
