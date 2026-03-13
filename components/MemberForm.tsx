
import React, { useState, useEffect } from 'react';
import { X, Save, Phone, User, Mail, Plus, MapPin, Crosshair, Loader2, Trash2, Briefcase, GraduationCap } from 'lucide-react';
import { MemberCategory, GlobalRole, CommissionType } from '../types';

interface MemberFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const COMMISSION_ROLES = [
  'Dieuwrine', 'Dieuwrine Adjoint', 'Secrétaire', 'Trésorier', 
  'Chargé d\'Organisation', 'Chargé de Com.', 'Chauffeur', 
  'Animateur', 'Bibliothécaire', 'Membre Actif', 'Observateur'
];

const MemberForm: React.FC<MemberFormProps> = ({ onClose, onSubmit, initialData }) => {
  const [isLocating, setIsLocating] = useState(false);
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    category: initialData?.category || MemberCategory.ETUDIANT,
    role: initialData?.role || GlobalRole.MEMBRE,
    address: initialData?.address || '',
    coordinates: {
      lat: initialData?.coordinates?.lat || 14.7167,
      lng: initialData?.coordinates?.lng || -17.4677
    },
    birthDate: initialData?.birthDate || '',
    gender: initialData?.gender || 'Homme',
    
    academicInfo: initialData?.academicInfo || { establishment: '', level: '', field: '' },
    professionalInfo: initialData?.professionalInfo || { company: '', position: '', sector: '' },
    
    commissionAssignments: initialData?.commissions || [] as { type: CommissionType, role_commission: string }[]
  });

  const [tempComm, setTempComm] = useState<CommissionType>(CommissionType.COMMUNICATION);
  const [tempRole, setTempRole] = useState('');

  const addCommission = () => {
    if (tempRole && !formData.commissionAssignments.some((c: any) => c.type === tempComm)) {
      setFormData({
        ...formData,
        commissionAssignments: [...formData.commissionAssignments, { type: tempComm, role_commission: tempRole }]
      });
      setTempRole('');
    }
  };

  const removeCommission = (type: CommissionType) => {
    setFormData({
      ...formData,
      commissionAssignments: formData.commissionAssignments.filter((c: any) => c.type !== type)
    });
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          coordinates: {
            lat: parseFloat(position.coords.latitude.toFixed(6)),
            lng: parseFloat(position.coords.longitude.toFixed(6))
          }
        }));
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLocating(false);
        alert("Impossible de récupérer votre position.");
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };
    if (formData.category === MemberCategory.TRAVAILLEUR) {
        delete (dataToSubmit as any).academicInfo;
    } else {
        delete (dataToSubmit as any).professionalInfo;
    }
    onSubmit(dataToSubmit);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 my-8" role="dialog" aria-modal="true">
        {/* Hidden for accessibility but present for compliance */}
        <h2 className="sr-only">Formulaire d'inscription membre</h2>
        
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-emerald-50">
          <div>
            <h3 className="text-xl font-bold text-[#2E8B57]">Inscription au Dahira</h3>
            <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">
               {initialData ? 'Modification Membre' : 'Nouveau Membre'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-emerald-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Prénom</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input required type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E8B57]" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Nom</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input required type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E8B57]" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E8B57]" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Téléphone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E8B57]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Catégorie</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as MemberCategory })} className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E8B57]">
                {Object.values(MemberCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Rôle Global</label>
              <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as GlobalRole })} className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E8B57]">
                {Object.values(GlobalRole).map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Date de Naissance</label>
              <input type="date" value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E8B57]" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Genre</label>
              <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })} className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E8B57]">
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Adresse</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-gray-300" />
              <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E8B57] h-20 resize-none" placeholder="Adresse complète..." />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Géolocalisation</label>
              <button type="button" onClick={handleLocateMe} disabled={isLocating} className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1 hover:underline">
                {isLocating ? <Loader2 size={12} className="animate-spin" /> : <Crosshair size={12} />}
                {isLocating ? 'Localisation...' : 'Me localiser'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <p className="text-[8px] font-bold text-slate-400 uppercase">Latitude</p>
                <p className="text-xs font-mono font-bold">{formData.coordinates.lat}</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <p className="text-[8px] font-bold text-slate-400 uppercase">Longitude</p>
                <p className="text-xs font-mono font-bold">{formData.coordinates.lng}</p>
              </div>
            </div>
          </div>

          {/* Academic Info (Conditional) */}
          {(formData.category === MemberCategory.ETUDIANT || formData.category === MemberCategory.ELEVE) && (
            <div className="space-y-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
              <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                <GraduationCap size={14} /> Informations Académiques
              </h4>
              <div className="space-y-3">
                <input type="text" placeholder="Établissement" value={formData.academicInfo.establishment} onChange={(e) => setFormData({ ...formData, academicInfo: { ...formData.academicInfo, establishment: e.target.value } })} className="w-full px-4 py-2 bg-white border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Niveau" value={formData.academicInfo.level} onChange={(e) => setFormData({ ...formData, academicInfo: { ...formData.academicInfo, level: e.target.value } })} className="w-full px-4 py-2 bg-white border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                  <input type="text" placeholder="Filière" value={formData.academicInfo.field} onChange={(e) => setFormData({ ...formData, academicInfo: { ...formData.academicInfo, field: e.target.value } })} className="w-full px-4 py-2 bg-white border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
          )}

          {/* Professional Info (Conditional) */}
          {formData.category === MemberCategory.TRAVAILLEUR && (
            <div className="space-y-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <Briefcase size={14} /> Informations Professionnelles
              </h4>
              <div className="space-y-3">
                <input type="text" placeholder="Entreprise" value={formData.professionalInfo.company} onChange={(e) => setFormData({ ...formData, professionalInfo: { ...formData.professionalInfo, company: e.target.value } })} className="w-full px-4 py-2 bg-white border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Poste" value={formData.professionalInfo.position} onChange={(e) => setFormData({ ...formData, professionalInfo: { ...formData.professionalInfo, position: e.target.value } })} className="w-full px-4 py-2 bg-white border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500" />
                  <input type="text" placeholder="Secteur" value={formData.professionalInfo.sector} onChange={(e) => setFormData({ ...formData, professionalInfo: { ...formData.professionalInfo, sector: e.target.value } })} className="w-full px-4 py-2 bg-white border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
            </div>
          )}

          {/* Commissions */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Commissions</h4>
            <div className="flex gap-2">
              <select value={tempComm} onChange={(e) => setTempComm(e.target.value as CommissionType)} className="flex-1 px-3 py-2 bg-white border-none rounded-xl text-xs">
                {Object.values(CommissionType).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={tempRole} onChange={(e) => setTempRole(e.target.value)} className="flex-1 px-3 py-2 bg-white border-none rounded-xl text-xs">
                <option value="">Rôle...</option>
                {COMMISSION_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <button type="button" onClick={addCommission} className="p-2 bg-slate-900 text-white rounded-xl hover:bg-black transition-colors">
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.commissionAssignments.map((c: any) => (
                <div key={c.type} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                  <span className="text-[10px] font-black text-slate-700 uppercase">{c.type}</span>
                  <span className="text-[9px] text-slate-400 font-bold">{c.role_commission}</span>
                  <button type="button" onClick={() => removeCommission(c.type)} className="text-rose-400 hover:text-rose-600">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3 sticky bottom-0 bg-white pb-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-colors">Annuler</button>
            <button type="submit" className="flex-1 px-4 py-3 bg-[#2E8B57] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
              <Save size={18} /> Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;
