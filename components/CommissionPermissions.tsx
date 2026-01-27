
import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, User, Settings, CheckCircle, Plus, Info, Lock, BellRing, AlertCircle } from 'lucide-react';
import { CommissionType, Member } from '../types';
import { MOCK_MEMBERS } from '../constants';

interface PredefinedRole {
  name: string;
  permissions: string[];
}

const GENERIC_ROLES: PredefinedRole[] = [
  { name: 'Secrétaire Général', permissions: ['Rédiger PV', 'Gérer Agenda', 'Convoquer Réunion'] },
  { name: 'Trésorier', permissions: ['Voir historique complet', 'Générer reçus', 'Approuver dépenses < 50k'] },
  { name: 'Chargé de Com.', permissions: ['Valider posts', 'Gérer canaux', 'Répondre membres'] },
];

const TRANSPORT_ROLES: PredefinedRole[] = [
  { name: 'Chef de Parc', permissions: ['Gérer maintenance', 'Assigner véhicule', 'Suivi assurances'] },
  { name: 'Chauffeur Titulaire', permissions: ['Voir planning', 'Signaler incident', 'Accès fiche véhicule'] },
  { name: 'Régulateur Convoi', permissions: ['Créer itinéraire', 'Valider départ', 'Suivi GPS'] },
];

const CULTURAL_ROLES: PredefinedRole[] = [
  { name: 'Archiviste', permissions: ['Numériser contenu', 'Cataloguer œuvres', 'Gérer emprunts'] },
  { name: 'Animateur Pédagogique', permissions: ['Créer cours', 'Évaluer progression', 'Gérer classe'] },
  { name: 'Responsable Khassaide', permissions: ['Planifier Récital', 'Sélectionner Textes', 'Gérer Audio'] },
];

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info';
}

interface CommissionPermissionsProps {
  commissionType: CommissionType;
  onClose: () => void;
}

const CommissionPermissions: React.FC<CommissionPermissionsProps> = ({ commissionType, onClose }) => {
  const [activeTab, setActiveTab] = useState<'members' | 'roles'>('members');
  const [customPermInput, setCustomPermInput] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const getRolesForCommission = () => {
    switch (commissionType) {
      case CommissionType.TRANSPORT:
        return [...TRANSPORT_ROLES, ...GENERIC_ROLES];
      case CommissionType.CULTURELLE:
        return [...CULTURAL_ROLES, ...GENERIC_ROLES];
      default:
        return GENERIC_ROLES;
    }
  };

  const availableRoles = getRolesForCommission();

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleRoleChange = (memberName: string, newRole: string) => {
    showToast(`Rôle mis à jour pour ${memberName} : ${newRole}`);
  };

  const handleAddPermission = (memberName: string) => {
    if (customPermInput.trim()) {
      showToast(`Permission "${customPermInput}" ajoutée pour ${memberName}`, 'info');
      setCustomPermInput('');
    }
  };

  const handleRemovePermission = (memberName: string, perm: string) => {
    showToast(`Permission "${perm}" révoquée pour ${memberName}`, 'info');
  };

  const handleApplyTemplate = (roleName: string) => {
    showToast(`Template "${roleName}" appliqué à la commission`, 'success');
  };

  const membersInCommission = MOCK_MEMBERS.filter(m => 
    m.commissions.some(c => c.type === commissionType)
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      {/* Toast Notification Container */}
      <div className="fixed top-8 right-8 z-[200] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl shadow-2xl border border-emerald-100 animate-in slide-in-from-right-8 duration-300 pointer-events-auto"
          >
            <div className={`p-2 rounded-xl ${toast.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
              {toast.type === 'success' ? <CheckCircle size={18} /> : <BellRing size={18} />}
            </div>
            <p className="text-xs font-black text-slate-800">{toast.message}</p>
          </div>
        ))}
      </div>

      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300 flex flex-col h-[90vh]">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-emerald-800 to-[#2E8B57] text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black">Administration : {commissionType}</h3>
              <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest opacity-80">Contrôle d'accès et hiérarchie</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('members')} 
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'members' ? 'text-[#2E8B57] border-b-2 border-[#2E8B57]' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Membres & Accès
          </button>
          <button 
            onClick={() => setActiveTab('roles')} 
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'roles' ? 'text-[#2E8B57] border-b-2 border-[#2E8B57]' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Rôles Prédéfinis & Templates
          </button>
        </div>

        <div className="flex-1 p-8 overflow-y-auto bg-gray-50/30">
          {activeTab === 'members' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-gray-800 uppercase text-xs tracking-widest">Gérer les droits individuels</h4>
                <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase flex items-center gap-2">
                  <Info size={12} /> Modifications en attente de synchro
                </div>
              </div>

              <div className="space-y-4">
                {membersInCommission.length > 0 ? membersInCommission.map(member => {
                  const assignment = member.commissions.find(c => c.type === commissionType)!;
                  return (
                    <div key={member.id} className="p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm flex flex-col md:flex-row gap-6">
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#2E8B57] font-black text-xl border border-emerald-100 shadow-inner">
                          {member.firstName[0]}{member.lastName[0]}
                        </div>
                        <div>
                          <p className="font-black text-gray-800 leading-tight">{member.firstName} {member.lastName}</p>
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-[8px] font-black text-gray-500 uppercase">{member.matricule}</span>
                        </div>
                      </div>

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block">Rôle au sein de la commission</label>
                          <select 
                            onChange={(e) => handleRoleChange(`${member.firstName} ${member.lastName}`, e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-1 focus:ring-emerald-500 appearance-none cursor-pointer"
                          >
                            <option>{assignment.role_commission}</option>
                            {availableRoles.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-emerald-800 uppercase tracking-widest block">Permissions Granulaires</label>
                          <div className="flex flex-wrap gap-1.5">
                            {assignment.permissions.map((p, i) => (
                              <span key={i} className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[9px] font-black flex items-center gap-1 group">
                                {p} <X size={10} className="cursor-pointer group-hover:text-red-500" onClick={() => handleRemovePermission(`${member.firstName} ${member.lastName}`, p)} />
                              </span>
                            ))}
                            <div className="flex gap-1 flex-1">
                              <input 
                                type="text" 
                                placeholder="Ajouter permission..." 
                                value={customPermInput}
                                onChange={(e) => setCustomPermInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddPermission(`${member.firstName} ${member.lastName}`)}
                                className="bg-gray-100 border-none rounded-lg px-2 py-1 text-[9px] flex-1 outline-none focus:ring-1 focus:ring-emerald-500"
                              />
                              <button 
                                onClick={() => handleAddPermission(`${member.firstName} ${member.lastName}`)}
                                className="p-1.5 bg-[#2E8B57] text-white rounded-lg hover:bg-emerald-700 transition-colors"
                              >
                                <Plus size={10} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <p className="text-xs font-bold uppercase">Aucun membre assigné à cette commission.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableRoles.map((role, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-12 -mt-12 group-hover:w-32 group-hover:h-32 transition-all"></div>
                  <div className="relative">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-black text-emerald-800">{role.name}</h4>
                      <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600"><Lock size={16} /></div>
                    </div>
                    <div className="space-y-2 mb-6">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ensemble de permissions :</p>
                      <div className="flex flex-wrap gap-1.5">
                        {role.permissions.map((p, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-50 text-gray-500 rounded-md text-[9px] font-bold border border-gray-100">{p}</span>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleApplyTemplate(role.name)}
                      className="w-full py-2.5 bg-[#2E8B57] text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-md hover:bg-emerald-700 transition-colors"
                    >
                      Utiliser ce template
                    </button>
                  </div>
                </div>
              ))}
              <div className="bg-dashed border-2 border-dashed border-gray-200 p-6 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4 hover:border-emerald-300 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
                  <Plus size={24} />
                </div>
                <div>
                  <p className="text-xs font-black text-gray-600 uppercase tracking-widest">Créer un nouveau rôle</p>
                  <p className="text-[10px] text-gray-400">Configurez un ensemble personnalisé de droits réutilisables.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-white border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">Changements sauvegardés en temps réel</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-8 py-3 bg-gray-50 border border-gray-100 text-gray-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100">Fermer la console</button>
            <button 
              onClick={() => showToast('Toutes les permissions ont été synchronisées avec succès')}
              className="px-8 py-3 bg-[#2E8B57] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-emerald-700 flex items-center gap-2"
            >
              <CheckCircle size={14} /> Confirmer les accès
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionPermissions;
