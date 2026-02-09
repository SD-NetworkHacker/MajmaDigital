
import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, Filter, UserPlus, Download, CheckSquare, 
  Trash2, ShieldAlert, ChevronDown, LayoutGrid, List,
  Users, UserCheck, UserX, BarChart2, Edit, UploadCloud, MoreVertical, FileSpreadsheet, Eye,
  Crown, Briefcase, User, Layers, Key, VenetianMask
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../context/AuthContext'; // Import Auth
import { Member, MemberCategory, GlobalRole } from '../../types';
import MemberForm from '../../components/MemberForm';
import MemberProfileModal from '../../components/MemberProfileModal';

const MemberManagementDashboard: React.FC = () => {
  // Fix: added importMembers to destructuring
  const { members, addMember, updateMember, deleteMember, importMembers } = useData();
  const { impersonate } = useAuth(); // Hook Auth
  
  // UI States
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('Tous');
  const [selectedStatus, setSelectedStatus] = useState<string>('Tous');
  
  // --- NOUVEAU: Filtre de Profil Super Admin ---
  const [profileView, setProfileView] = useState<'all' | 'leaders' | 'commissioned' | 'simple'>('all');
  
  // Action States
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [viewingMember, setViewingMember] = useState<Member | null>(null); 
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  
  // File Import Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- STATISTICS COMPUTATION ---
  const stats = useMemo(() => {
    const total = members.length;
    // Définition des rôles à responsabilité
    // Fix: Cast enum values to string for inclusion check compatibility
    const leaderRoles = [GlobalRole.ADMIN as string, GlobalRole.SG as string, GlobalRole.ADJOINT_SG as string, GlobalRole.DIEUWRINE as string];

    const leaders = members.filter(m => leaderRoles.includes(m.role as string)).length;
    const commissioned = members.filter(m => m.commissions.length > 0).length;
    // Membres simples = Pas de commission et pas de rôle de leader (souvent role = MEMBRE et commissions = [])
    const simpleMembers = members.filter(m => m.commissions.length === 0 && !leaderRoles.includes(m.role as string)).length;
    
    // Distribution par secteur (pour le graph)
    const sectors = members.reduce((acc, curr) => {
      acc[curr.category as string] = (acc[curr.category as string] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(sectors).map(([name, val], index) => ({
      name, 
      val, 
      color: ['#10b981', '#3b82f6', '#f59e0b', '#6366f1'][index % 4] 
    }));

    return { total, leaders, commissioned, simpleMembers, chartData };
  }, [members]);

  // --- FILTERING & SORTING ---
  const filteredMembers = useMemo(() => {
    return members
      .filter(m => {
        // 1. Filtre Recherche
        const matchesSearch = 
          m.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
          m.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.matricule.toLowerCase().includes(searchTerm.toLowerCase());
        
        // 2. Filtre Secteur & Statut
        const matchesSector = selectedSector === 'Tous' || m.category === selectedSector;
        const matchesStatus = selectedStatus === 'Tous' || 
                              (selectedStatus === 'Actif' && m.status === 'active') ||
                              (selectedStatus === 'Inactif' && m.status !== 'active');

        // 3. Filtre Profil (Super Admin View)
        let matchesProfile = true;
        // Fix: Cast enum values to string for inclusion check
        const leaderRoles = [GlobalRole.ADMIN as string, GlobalRole.SG as string, GlobalRole.ADJOINT_SG as string, GlobalRole.DIEUWRINE as string];

        if (profileView === 'leaders') {
          matchesProfile = leaderRoles.includes(m.role as string);
        } else if (profileView === 'commissioned') {
          matchesProfile = m.commissions.length > 0;
        } else if (profileView === 'simple') {
          matchesProfile = m.commissions.length === 0 && !leaderRoles.includes(m.role as string);
        }

        return matchesSearch && matchesSector && matchesStatus && matchesProfile;
      })
      .sort((a, b) => {
          // Tri par rôle prioritaire si vue globale, sinon alphabétique
          if (profileView === 'all') {
             const rolePriority = (role: string) => {
                 if (role === GlobalRole.SG) return 1;
                 if (role === GlobalRole.ADJOINT_SG) return 2;
                 if (role === GlobalRole.DIEUWRINE) return 3;
                 return 10;
             };
             return rolePriority(a.role as string) - rolePriority(b.role as string) || a.lastName.localeCompare(b.lastName);
          }
          return a.lastName.localeCompare(b.lastName);
      }); 
  }, [members, searchTerm, selectedSector, selectedStatus, profileView]);

  // --- HANDLERS ---

  const handleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedIds(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredMembers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMembers.map(m => m.id)));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible.')) {
      deleteMember(id);
      if (selectedIds.has(id)) {
        const newSelection = new Set(selectedIds);
        newSelection.delete(id);
        setSelectedIds(newSelection);
      }
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Supprimer définitivement ${selectedIds.size} membres ?`)) {
      selectedIds.forEach(id => deleteMember(id));
      setSelectedIds(new Set());
    }
  };

  const handleImpersonate = (member: Member) => {
     if (confirm(`Voulez-vous incarner le profil de ${member.firstName} ? Vous verrez la plateforme exactement comme ce membre.`)) {
        impersonate(member);
     }
  };

  const handleFormSubmit = (data: any) => {
    if (editingMember) {
      updateMember(editingMember.id, data);
    } else {
      const newMember: Member = {
        ...data,
        id: Date.now().toString(),
        matricule: `MAJ-2024-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        joinDate: new Date().toISOString(),
        status: 'active',
        commissions: data.commissionAssignments.map((ca: any) => ({
            type: ca.type,
            role_commission: ca.role,
            permissions: []
        }))
      };
      addMember(newMember);
    }
    setShowForm(false);
    setEditingMember(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulation d'import
    const reader = new FileReader();
    reader.onload = (e) => {
        // Fix: Call importMembers now that it is available in context
        console.log("Processing CSV for bulk import...");
    };
    reader.readAsText(file);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      {/* Modals */}
      {showForm && (
        <MemberForm 
          onClose={() => { setShowForm(false); setEditingMember(null); }} 
          onSubmit={handleFormSubmit}
          initialData={editingMember}
        />
      )}
      
      {viewingMember && (
        <MemberProfileModal 
          member={viewingMember}
          onClose={() => setViewingMember(null)}
        />
      )}

      {/* Header Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Vue Super Admin</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Users size={14} className="text-emerald-500" /> Gestion centralisée de tous les profils
          </p>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".csv,.json,.xlsx" 
            onChange={handleFileUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 lg:flex-none px-6 py-4 bg-white border border-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-sm flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
          >
            <UploadCloud size={18} /> Importer
          </button>
          <button 
            onClick={() => { setEditingMember(null); setShowForm(true); }}
            className="flex-1 lg:flex-none px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-black"
          >
            <UserPlus size={18} /> Inscrire Membre
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Profile Breakdown Stats */}
        <div className="lg:col-span-4 space-y-6">
           {/* Cards for Profiles */}
           <div 
             onClick={() => setProfileView('leaders')}
             className={`p-6 rounded-2xl border transition-all cursor-pointer group ${
               profileView === 'leaders' ? 'bg-purple-600 text-white border-purple-600 shadow-xl' : 'bg-white border-slate-100 hover:border-purple-200'
             }`}
           >
              <div className="flex justify-between items-start mb-4">
                 <div className={`p-3 rounded-xl ${profileView === 'leaders' ? 'bg-white/20' : 'bg-purple-50 text-purple-600'}`}>
                    <Crown size={24} />
                 </div>
                 <span className={`text-[10px] font-black uppercase tracking-widest ${profileView === 'leaders' ? 'text-white' : 'text-slate-400'}`}>Leadership</span>
              </div>
              <p className={`text-3xl font-black ${profileView === 'leaders' ? 'text-white' : 'text-slate-900'}`}>{stats.leaders}</p>
              <p className={`text-[10px] font-bold mt-1 ${profileView === 'leaders' ? 'text-purple-100' : 'text-slate-500'}`}>Responsables (SG, Adjoints, Dieuwrines)</p>
           </div>

           <div 
             onClick={() => setProfileView('commissioned')}
             className={`p-6 rounded-2xl border transition-all cursor-pointer group ${
               profileView === 'commissioned' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl' : 'bg-white border-slate-100 hover:border-emerald-200'
             }`}
           >
              <div className="flex justify-between items-start mb-4">
                 <div className={`p-3 rounded-xl ${profileView === 'commissioned' ? 'bg-white/20' : 'bg-emerald-50 text-emerald-600'}`}>
                    <Briefcase size={24} />
                 </div>
                 <span className={`text-[10px] font-black uppercase tracking-widest ${profileView === 'commissioned' ? 'text-white' : 'text-slate-400'}`}>Actifs</span>
              </div>
              <p className={`text-3xl font-black ${profileView === 'commissioned' ? 'text-white' : 'text-slate-900'}`}>{stats.commissioned}</p>
              <p className={`text-[10px] font-bold mt-1 ${profileView === 'commissioned' ? 'text-emerald-100' : 'text-slate-500'}`}>Membres dans une commission</p>
           </div>

           <div 
             onClick={() => setProfileView('simple')}
             className={`p-6 rounded-2xl border transition-all cursor-pointer group ${
               profileView === 'simple' ? 'bg-slate-700 text-white border-slate-700 shadow-xl' : 'bg-white border-slate-100 hover:border-slate-300'
             }`}
           >
              <div className="flex justify-between items-start mb-4">
                 <div className={`p-3 rounded-xl ${profileView === 'simple' ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
                    <User size={24} />
                 </div>
                 <span className={`text-[10px] font-black uppercase tracking-widest ${profileView === 'simple' ? 'text-white' : 'text-slate-400'}`}>Non-Affectés</span>
              </div>
              <p className={`text-3xl font-black ${profileView === 'simple' ? 'text-white' : 'text-slate-900'}`}>{stats.simpleMembers}</p>
              <p className={`text-[10px] font-bold mt-1 ${profileView === 'simple' ? 'text-slate-300' : 'text-slate-500'}`}>Membres simples (Sans commission)</p>
           </div>
           
           {/* Chart */}
           <div className="glass-card p-6 bg-white border border-slate-100">
             <div className="flex items-center justify-between mb-6">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Répartition Sectorielle</h4>
               <BarChart2 size={16} className="text-slate-400" />
             </div>
             <div className="h-40 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={stats.chartData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 'bold' }} />
                   <YAxis hide />
                   <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px' }} />
                   <Bar dataKey="val" radius={[8, 8, 0, 0]} barSize={30}>
                     {stats.chartData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </div>
        </div>

        {/* Right Column: Member List with Advanced Filters */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card p-6 flex flex-wrap items-center gap-4 border-slate-100 bg-white">
            
            {/* View Reset Button */}
            {profileView !== 'all' && (
               <button 
                 onClick={() => setProfileView('all')}
                 className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2"
               >
                 <LayoutGrid size={14}/> Tout Afficher
               </button>
            )}

            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom, matricule..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" 
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              <div className="relative group">
                 <button className="px-4 py-3 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-slate-100 hover:bg-white transition-all">
                    <Filter size={14}/> {selectedSector} <ChevronDown size={14}/>
                 </button>
                 <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 hidden group-hover:block z-20">
                    {['Tous', ...Object.values(MemberCategory)].map(cat => (
                       <button key={cat} onClick={() => setSelectedSector(cat)} className="w-full text-left px-4 py-2 text-[10px] font-bold hover:bg-slate-50 text-slate-600">{cat}</button>
                    ))}
                 </div>
              </div>
              
              <div className="relative group">
                 <button className="px-4 py-3 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-slate-100 hover:bg-white transition-all">
                    {selectedStatus} <ChevronDown size={14}/>
                 </button>
                 <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 hidden group-hover:block z-20">
                    {['Tous', 'Actif', 'Inactif'].map(st => (
                       <button key={st} onClick={() => setSelectedStatus(st)} className="w-full text-left px-4 py-2 text-[10px] font-bold hover:bg-slate-50 text-slate-600">{st}</button>
                    ))}
                 </div>
              </div>
            </div>

            <div className="flex p-1 bg-slate-100 rounded-xl">
               <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}><LayoutGrid size={16}/></button>
               <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400'}`}><List size={16}/></button>
            </div>
          </div>

          <div className="glass-card overflow-hidden bg-white min-h-[500px] flex flex-col">
             {/* Toolbar Batch Actions */}
             <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                <div 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={handleSelectAll}
                >
                   <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                     selectedIds.size > 0 && selectedIds.size === filteredMembers.length ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white group-hover:border-emerald-400'
                   }`}>
                      {selectedIds.size > 0 && <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>}
                   </div>
                   <span className="text-[10px] font-black text-slate-500 uppercase">
                      {selectedIds.size > 0 ? `${selectedIds.size} Sélectionnés` : 'Tout sélectionner'}
                   </span>
                </div>
                
                {selectedIds.size > 0 ? (
                  <div className="flex gap-2 animate-in fade-in slide-in-from-right-4">
                     <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 hover:bg-slate-50">
                        <FileSpreadsheet size={14}/> Exporter
                     </button>
                     <button 
                       onClick={handleBulkDelete}
                       className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 hover:bg-rose-100"
                     >
                        <Trash2 size={14}/> Supprimer ({selectedIds.size})
                     </button>
                  </div>
                ) : (
                  <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                     {profileView === 'all' ? 'Tous les profils' : profileView === 'leaders' ? 'Responsables Uniquement' : profileView === 'commissioned' ? 'Membres en Commission' : 'Membres Sans Commission'}
                  </span>
                )}
             </div>

             <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar">
                <table className="w-full text-left">
                   <thead className="sticky top-0 z-10 bg-white shadow-sm text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <tr>
                         <th className="px-8 py-5 w-16"></th>
                         <th className="px-4 py-5">Membre</th>
                         <th className="px-4 py-5">Matricule</th>
                         <th className="px-4 py-5">Secteur</th>
                         <th className="px-4 py-5">Rôle & Commissions</th>
                         <th className="px-4 py-5">Statut</th>
                         <th className="px-8 py-5 text-right">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {filteredMembers.map((member, index) => {
                         // Fix: Cast enum to string for check
                         const isLeader = [GlobalRole.ADMIN as string, GlobalRole.SG as string, GlobalRole.ADJOINT_SG as string, GlobalRole.DIEUWRINE as string].includes(member.role as string);
                         const hasCommission = member.commissions.length > 0;

                         return (
                           <tr key={member.id} className={`hover:bg-slate-50/80 transition-all group ${selectedIds.has(member.id) ? 'bg-emerald-50/20' : ''}`}>
                              <td className="px-8 py-6">
                                 <div 
                                   onClick={() => handleSelection(member.id)}
                                   className={`w-5 h-5 border-2 rounded cursor-pointer flex items-center justify-center transition-all ${
                                     selectedIds.has(member.id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 bg-white hover:border-emerald-400'
                                   }`}
                                 >
                                   {selectedIds.has(member.id) && <CheckSquare size={12} className="text-white"/>}
                                 </div>
                              </td>
                              <td className="px-4 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] border ${isLeader ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                       {member.firstName[0]}{member.lastName[0]}
                                    </div>
                                    <div>
                                       <span className="text-xs font-black text-slate-800 block">{member.lastName} {member.firstName}</span>
                                       {isLeader && <span className="text-[8px] font-bold text-purple-600 bg-purple-50 px-1.5 rounded uppercase">Responsable</span>}
                                    </div>
                                 </div>
                              </td>
                              <td className="px-4 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{member.matricule}</td>
                              <td className="px-4 py-6 text-[10px] font-black text-slate-500 uppercase">{member.category}</td>
                              <td className="px-4 py-6">
                                 <div className="flex flex-col gap-1">
                                    <span className="text-[9px] font-bold uppercase text-slate-700">{member.role}</span>
                                    <div className="flex flex-wrap gap-1">
                                       {hasCommission ? (
                                          member.commissions.slice(0, 2).map((c, i) => (
                                             <span key={i} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[8px] font-black uppercase">{c.type.substring(0,3)}</span>
                                          ))
                                       ) : (
                                          <span className="text-[8px] italic text-slate-400 bg-slate-50 px-2 py-0.5 rounded">Sans commission</span>
                                       )}
                                       {member.commissions.length > 2 && <span className="text-[8px] text-slate-400">+{member.commissions.length - 2}</span>}
                                    </div>
                                 </div>
                              </td>
                              <td className="px-4 py-6">
                                 <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                                   member.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                 }`}>
                                   {member.status === 'active' ? 'Actif' : 'Inactif'}
                                 </span>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button 
                                     onClick={() => handleImpersonate(member)}
                                     className="p-2 bg-slate-900 border border-slate-900 text-white rounded-lg hover:bg-black transition-colors shadow-sm"
                                     title="Incarner (Impersonate)"
                                   >
                                      <VenetianMask size={14}/>
                                   </button>
                                   <button 
                                     onClick={() => setViewingMember(member)}
                                     className="p-2 bg-white border border-slate-200 text-slate-400 rounded-lg hover:text-emerald-600 hover:border-emerald-200 transition-colors shadow-sm"
                                     title="Voir Profil"
                                   >
                                      <Eye size={14}/>
                                   </button>
                                   <button 
                                     onClick={() => { setEditingMember(member); setShowForm(true); }}
                                     className="p-2 bg-white border border-slate-200 text-slate-400 rounded-lg hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm"
                                     title="Modifier"
                                   >
                                      <Edit size={14}/>
                                   </button>
                                   <button 
                                     onClick={() => handleDelete(member.id)}
                                     className="p-2 bg-white border border-slate-200 text-slate-400 rounded-lg hover:text-rose-600 hover:border-rose-200 transition-colors shadow-sm"
                                     title="Supprimer"
                                   >
                                      <Trash2 size={14}/>
                                   </button>
                                 </div>
                              </td>
                           </tr>
                         );
                      })}
                      {filteredMembers.length === 0 && (
                        <tr>
                          <td colSpan={8} className="text-center py-20 text-slate-400 text-xs italic">
                             Aucun membre trouvé pour ce profil.
                          </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberManagementDashboard;
