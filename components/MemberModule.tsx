
import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, MapPin, Phone, Mail, ChevronRight, Filter, Users, Share2, 
  ShieldCheck, Activity, LayoutGrid, List, Download, Trash2, CheckCircle, 
  FileSpreadsheet, MoreHorizontal, Briefcase, GraduationCap, School, Eye
} from 'lucide-react';
import { MemberCategory, GlobalRole, Member } from '../types';
import MemberForm from './MemberForm';
import { useData } from '../contexts/DataContext';
import { exportToCSV } from '../services/analyticsEngine';

// Modified Props to accept navigation handler
interface MemberModuleProps {
  onViewProfile?: (memberId: string) => void;
}

const MemberModule: React.FC<MemberModuleProps> = ({ onViewProfile }) => {
  const { members, addMember, deleteMember, updateMemberStatus } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  // View & Selection States
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState('Tous les secteurs');
  const [roleFilter, setRoleFilter] = useState('Tous les rôles');
  const [statusFilter, setStatusFilter] = useState('Tous les statuts');

  // --- STATS COMPUTATION ---
  const stats = useMemo(() => {
    const total = members.length;
    const active = members.filter(m => m.status === 'active').length;
    const students = members.filter(m => m.category === MemberCategory.ETUDIANT).length;
    const workers = members.filter(m => m.category === MemberCategory.TRAVAILLEUR).length;
    
    return { total, active, students, workers };
  }, [members]);

  // --- FILTERING ---
  const filteredMembers = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();

    return members.filter(member => {
      // 1. Apply Filters
      const matchesCategory = categoryFilter === 'Tous les secteurs' || member.category === categoryFilter;
      const matchesRole = roleFilter === 'Tous les rôles' || member.role === roleFilter;
      
      let matchesStatus = true;
      if (statusFilter !== 'Tous les statuts') {
        if (statusFilter === 'Actif') matchesStatus = member.status === 'active';
        else if (statusFilter === 'En attente') matchesStatus = member.status === 'pending';
        else if (statusFilter === 'Inactif') matchesStatus = member.status === 'inactive';
      }

      if (!matchesCategory || !matchesRole || !matchesStatus) return false;

      // 2. Apply Search
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
  }, [searchTerm, categoryFilter, roleFilter, statusFilter, members]);

  // --- HANDLERS ---

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredMembers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMembers.map(m => m.id)));
    }
  };

  const handleBatchDelete = () => {
    if (confirm(`Supprimer définitivement ${selectedIds.size} membres sélectionné(s) ?`)) {
      selectedIds.forEach(id => deleteMember(id));
      setSelectedIds(new Set());
    }
  };

  const handleBatchExport = () => {
    const dataToExport = members.filter(m => selectedIds.has(m.id)).map(m => ({
        Matricule: m.matricule,
        Prenom: m.firstName,
        Nom: m.lastName,
        Email: m.email,
        Telephone: m.phone,
        Categorie: m.category,
        Role: m.role,
        Status: m.status,
        Adresse: m.address
    }));
    exportToCSV(`majma_export_membres_${new Date().toISOString().slice(0, 10)}.csv`, dataToExport);
    setSelectedIds(new Set());
  };

  const handleViewProfile = (id: string) => {
    if (onViewProfile) {
      onViewProfile(id);
    }
  };

  const getCategoryIcon = (cat: string) => {
      switch(cat) {
          case MemberCategory.ETUDIANT: return <GraduationCap size={14}/>;
          case MemberCategory.ELEVE: return <School size={14}/>;
          default: return <Briefcase size={14}/>;
      }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {showForm && (
        <MemberForm 
          onClose={() => setShowForm(false)} 
          onSubmit={(data) => {
            const newMember: Member = {
              ...data,
              id: Date.now().toString(),
              matricule: `MAJ-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
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

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Registre des Membres</h2>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Users size={14} className="text-emerald-500" /> Annuaire unifié du Dahira
          </p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => setShowForm(true)}
             className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-black transition-all flex items-center gap-3 active:scale-95"
           >
             <Plus size={16} /> Inscrire Membre
           </button>
        </div>
      </div>

      {/* KPI STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Inscrits</p>
               <p className="text-2xl font-black text-slate-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-slate-50 text-slate-400 rounded-xl"><Users size={20}/></div>
         </div>
         <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Membres Actifs</p>
               <p className="text-2xl font-black text-emerald-900">{stats.active}</p>
            </div>
            <div className="p-3 bg-white text-emerald-600 rounded-xl"><Activity size={20}/></div>
         </div>
         <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Travailleurs</p>
               <p className="text-2xl font-black text-blue-900">{stats.workers}</p>
            </div>
            <div className="p-3 bg-white text-blue-600 rounded-xl"><Briefcase size={20}/></div>
         </div>
         <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Étudiants</p>
               <p className="text-2xl font-black text-amber-900">{stats.students}</p>
            </div>
            <div className="p-3 bg-white text-amber-600 rounded-xl"><GraduationCap size={20}/></div>
         </div>
      </div>

      {/* TOOLBAR & FILTERS */}
      <div className="glass-card p-4 flex flex-col xl:flex-row gap-4 items-center bg-white border-slate-100">
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
        
        {/* Actions de masse si sélection */}
        {selectedIds.size > 0 ? (
           <div className="flex items-center gap-2 w-full xl:w-auto animate-in slide-in-from-right-4 bg-slate-900 text-white p-1.5 rounded-2xl px-4">
              <span className="text-[10px] font-black uppercase tracking-widest mr-2">{selectedIds.size} Sélectionnés</span>
              <div className="h-4 w-px bg-white/20 mx-2"></div>
              <button onClick={handleBatchExport} className="p-2 hover:bg-white/20 rounded-lg transition-all" title="Exporter CSV"><FileSpreadsheet size={16}/></button>
              <button onClick={handleBatchDelete} className="p-2 hover:bg-rose-500 rounded-lg transition-all text-rose-300 hover:text-white" title="Supprimer"><Trash2 size={16}/></button>
              <button onClick={() => setSelectedIds(new Set())} className="ml-2 text-[9px] font-bold hover:underline">Annuler</button>
           </div>
        ) : (
           <div className="flex gap-2 w-full xl:w-auto overflow-x-auto pb-1 xl:pb-0 no-scrollbar">
              <div className="relative min-w-[140px]">
                <select 
                  value={roleFilter} 
                  onChange={(e) => setRoleFilter(e.target.value)} 
                  className="w-full px-4 py-3.5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase text-slate-600 outline-none hover:border-emerald-200 cursor-pointer appearance-none"
                >
                  <option>Tous les rôles</option>
                  {Object.values(GlobalRole).map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
              <div className="relative min-w-[140px]">
                <select 
                  value={categoryFilter} 
                  onChange={(e) => setCategoryFilter(e.target.value)} 
                  className="w-full px-4 py-3.5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase text-slate-600 outline-none hover:border-emerald-200 cursor-pointer appearance-none"
                >
                  <option>Tous les secteurs</option>
                  {Object.values(MemberCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                 <button 
                   onClick={() => setViewMode('grid')}
                   className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    <LayoutGrid size={18} />
                 </button>
                 <button 
                   onClick={() => setViewMode('list')}
                   className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                    <List size={18} />
                 </button>
              </div>
           </div>
        )}
      </div>

      {/* CONTENT: GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
          {filteredMembers.map((member) => (
            <div 
              key={member.id} 
              onClick={() => handleViewProfile(member.id)}
              className={`group relative bg-white border rounded-[2rem] hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer ${selectedIds.has(member.id) ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-100 hover:border-emerald-200'}`}
            >
              <div className="p-7 flex-1 flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 text-emerald-700 flex items-center justify-center font-black text-lg border border-slate-100 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 relative">
                      {member.firstName[0]}{member.lastName[0]}
                      {selectedIds.has(member.id) && (
                         <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1 border-2 border-white"><CheckCircle size={12}/></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-lg leading-tight group-hover:text-emerald-700 transition-colors">{member.firstName} {member.lastName}</h3>
                      <div className="flex items-center gap-2 mt-1.5">
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{member.matricule}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                     <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${
                       member.role === GlobalRole.DIEUWRINE ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                     }`}>
                       {member.role}
                     </span>
                     <button 
                       onClick={(e) => { e.stopPropagation(); toggleSelection(member.id); }}
                       className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                         selectedIds.has(member.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 text-transparent hover:border-emerald-300'
                       }`}
                     >
                        <CheckCircle size={14} className="fill-current"/>
                     </button>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                   <div className="flex items-center gap-3 text-slate-500 text-xs font-medium">
                      {getCategoryIcon(member.category)} {member.category}
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><MapPin size={12}/></div>
                      <span className="text-xs font-bold text-slate-600 truncate">{member.address}</span>
                   </div>
                </div>
              </div>

              <div className="px-7 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center mt-auto">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  <span className="text-[10px] font-black uppercase text-slate-400">{member.status === 'active' ? 'Actif' : 'Inactif'}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleViewProfile(member.id); }} className="text-slate-400 hover:text-emerald-600 transition-colors p-1.5 hover:bg-white rounded-lg flex items-center gap-1 text-[10px] font-bold uppercase">
                  <Eye size={14} /> Profil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CONTENT: LIST VIEW */}
      {viewMode === 'list' && (
         <div className="glass-card bg-white overflow-hidden border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-slate-50/80 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                     <tr>
                        <th className="px-6 py-4 w-12 text-center">
                           <button onClick={handleSelectAll} className={`w-4 h-4 rounded border transition-all ${selectedIds.size === filteredMembers.length && filteredMembers.length > 0 ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}></button>
                        </th>
                        <th className="px-6 py-4">Membre</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Secteur & Rôle</th>
                        <th className="px-6 py-4">Commissions</th>
                        <th className="px-6 py-4">Statut</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {filteredMembers.map(member => (
                        <tr key={member.id} onClick={() => handleViewProfile(member.id)} className={`hover:bg-slate-50/80 transition-all group cursor-pointer ${selectedIds.has(member.id) ? 'bg-emerald-50/30' : ''}`}>
                           <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                              <button 
                                onClick={() => toggleSelection(member.id)} 
                                className={`w-4 h-4 rounded border transition-all ${selectedIds.has(member.id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 hover:border-emerald-400'}`}
                              >
                                 {selectedIds.has(member.id) && <CheckCircle size={12} className="text-white"/>}
                              </button>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-500 border border-slate-200">
                                    {member.firstName[0]}{member.lastName[0]}
                                 </div>
                                 <div>
                                    <p className="text-xs font-black text-slate-800">{member.firstName} {member.lastName}</p>
                                    <p className="text-[9px] text-slate-400 font-mono">{member.matricule}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <p className="text-xs font-bold text-slate-600">{member.phone}</p>
                              <p className="text-[9px] text-slate-400 truncate max-w-[150px]">{member.email}</p>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                 <span className="text-[10px] font-bold uppercase text-slate-600 flex items-center gap-1">
                                    {getCategoryIcon(member.category)} {member.category}
                                 </span>
                                 <span className="text-[9px] text-slate-400">{member.role}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex gap-1 flex-wrap">
                                 {member.commissions.length > 0 ? member.commissions.map((c, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-[8px] font-bold text-slate-500 uppercase border border-slate-200">{c.type.substring(0, 3)}</span>
                                 )) : <span className="text-[9px] text-slate-300 italic">Aucune</span>}
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                                 member.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                              }`}>
                                 {member.status === 'active' ? 'Actif' : 'Inactif'}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button onClick={(e) => { e.stopPropagation(); handleViewProfile(member.id); }} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm">
                                    <ChevronRight size={14}/>
                                 </button>
                                 <button onClick={(e) => { e.stopPropagation(); if(confirm('Supprimer ce membre ?')) deleteMember(member.id); }} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm">
                                    <Trash2 size={14}/>
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      )}
    </div>
  );
};

export default MemberModule;
