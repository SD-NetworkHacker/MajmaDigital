
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
          {/* Reste du formulaire inchangé */}
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
