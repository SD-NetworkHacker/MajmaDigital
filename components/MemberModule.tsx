
import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, MapPin, Phone, Mail, ChevronRight, Filter, Users, Share2, ShieldCheck
} from 'lucide-react';
import { MemberCategory, GlobalRole, Member } from '../types';
import MemberForm from './MemberForm';
import { useData } from '../contexts/DataContext';

const MemberModule: React.FC = () => {
  const { members, addMember } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('Tous les secteurs');
  const [roleFilter, setRoleFilter] = useState('Tous les rôles');

  const filteredMembers = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();

    return members.filter(member => {
      // 1. Apply Filters first (faster checks)
      const matchesCategory = categoryFilter === 'Tous les secteurs' || member.category === categoryFilter;
      const matchesRole = roleFilter === 'Tous les rôles' || member.role === roleFilter;

      if (!matchesCategory || !matchesRole) return false;

      // 2. Apply Search if term exists
      if (!lowerSearchTerm) return true;

      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      const matricule = member.matricule.toLowerCase();
      const address = member.address.toLowerCase();

      return (
        fullName.includes(lowerSearchTerm) || 
        matricule.includes(lowerSearchTerm) || 
        address.includes(lowerSearchTerm)
      );
    });
  }, [searchTerm, categoryFilter, roleFilter, members]);

  const handleShare = async (member: Member, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Profil Majma: ${member.firstName} ${member.lastName}`,
          text: `Dahira Majmahoun Nourayni\nMatricule: ${member.matricule}\nRole: ${member.role}\nSecteur: ${member.category}`,
          url: window.location.href
        });
      } catch (err) {
        console.error("Erreur de partage:", err);
      }
    } else {
      alert("Le partage n'est pas supporté sur cet appareil.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {showForm && (
        <MemberForm 
          onClose={() => setShowForm(false)} 
          onSubmit={(data) => {
            const newMember: Member = {
              ...data,
              id: Date.now().toString(),
              matricule: `MAJ-2024-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
              joinDate: new Date().toISOString(),
              status: 'active',
              commissions: data.commissionAssignments.map((ca: any) => ({
                type: ca.type,
                role_commission: ca.role,
                permissions: []
              }))
            };
            addMember(newMember);
            setShowForm(false);
          }}
        />
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Registre des Membres</h2>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Users size={14} className="text-emerald-500" /> Gestion unifiée • {members.length} inscrits
          </p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="w-full md:w-auto flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-black transition-all active:scale-95"
        >
          <Plus size={18} />
          Inscrire un Membre
        </button>
      </div>

      {/* Filters bar */}
      <div className="glass-card p-4 flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom, matricule ou quartier..." 
            className="w-full pl-14 pr-6 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-semibold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none min-w-[160px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)} 
              className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase text-slate-600 outline-none hover:border-emerald-200 transition-colors appearance-none cursor-pointer"
            >
              <option>Tous les rôles</option>
              {Object.values(GlobalRole).map(role => <option key={role} value={role}>{role}</option>)}
            </select>
          </div>
          <div className="relative flex-1 lg:flex-none min-w-[160px]">
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)} 
              className="w-full px-5 py-3.5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase text-slate-600 outline-none hover:border-emerald-200 transition-colors appearance-none cursor-pointer"
            >
              <option>Tous les secteurs</option>
              {Object.values(MemberCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
        {filteredMembers.map((member) => (
          <div 
            key={member.id} 
            className="member-card glass-card flex flex-col group overflow-hidden border border-slate-100/50 hover:border-emerald-500/60 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 relative"
          >
            <div className="absolute top-0 left-0 w-0 h-1 bg-emerald-500 transition-all duration-500 group-hover:w-full z-30"></div>

            <div className="p-8 flex-1 relative overflow-hidden">
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-700 font-black text-xl shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                  {member.firstName[0]}{member.lastName[0]}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    member.role === GlobalRole.DIEUWRINE ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {member.role}
                  </span>
                  <span className="text-[9px] font-black text-emerald-600 uppercase bg-emerald-50/50 border border-emerald-100/50 px-2 py-1 rounded-lg">
                    {member.category}
                  </span>
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-xl font-extrabold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">{member.firstName} {member.lastName}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">{member.matricule}</p>
                
                {/* Display Commission Roles Inline */}
                {member.commissions.length > 0 && (
                  <div className="mb-6 flex flex-wrap gap-1.5">
                    {member.commissions.slice(0, 3).map((c, i) => (
                       <span key={i} className="text-[8px] font-bold px-2 py-1 bg-slate-50 rounded border border-slate-100 text-slate-600 flex items-center gap-1" title={`${c.type} : ${c.role_commission}`}>
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                         <span className="truncate max-w-[80px]">{c.type.substring(0, 10)}.</span> 
                         <span className="text-emerald-600 uppercase">{c.role_commission}</span>
                       </span>
                    ))}
                    {member.commissions.length > 3 && (
                      <span className="text-[8px] font-bold px-2 py-1 bg-slate-50 rounded border border-slate-100 text-slate-400">+{member.commissions.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-3.5 relative z-10 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex items-center gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-100 transition-colors group-hover:bg-white group-hover:border-emerald-100">
                  <MapPin size={14} className="text-emerald-500 shrink-0" />
                  <p className="text-[11px] font-bold text-slate-600 truncate">{member.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold">
                      <Phone size={12} className="text-emerald-400" /> <span>{member.phone}</span>
                   </div>
                   <div className="flex items-center gap-2 text-slate-500 text-[11px] font-bold truncate">
                      <Mail size={12} className="text-emerald-400" /> <span className="truncate">{member.email}</span>
                   </div>
                </div>
              </div>

              {/* Contextual Overlay for Full Commission List (Visible on Hover if many) */}
              <div className="absolute inset-x-0 bottom-0 top-[190px] bg-white/95 backdrop-blur-md p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20 border-t border-emerald-100/50 flex flex-col">
                 <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldCheck size={14} /> Tous les Rôles
                 </h4>
                 <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 -mr-4 pr-4">
                    {member.commissions.length > 0 ? member.commissions.map((comm, idx) => (
                       <div key={idx} className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors">
                          <span className="text-[10px] font-bold text-slate-700">{comm.type}</span>
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[8px] font-black uppercase shadow-sm">{comm.role_commission}</span>
                       </div>
                    )) : (
                       <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                          <ShieldCheck size={24} className="mb-2" />
                          <p className="text-[10px] font-medium">Aucune affectation</p>
                       </div>
                    )}
                 </div>
              </div>
            </div>

            <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center group-hover:bg-white relative z-30 transition-all duration-500">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                <span className={`text-[10px] font-black uppercase ${member.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {member.status === 'active' ? 'Opérationnel' : 'Inactif'}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => handleShare(member, e)}
                  className="text-slate-400 hover:text-emerald-600 transition-colors p-1"
                  title="Partager"
                >
                  <Share2 size={16} />
                </button>
                <a 
                  href={`#member-${member.id}`}
                  className="text-emerald-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:gap-3 transition-all"
                >
                  Fiche Profil <ChevronRight size={14} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberModule;
