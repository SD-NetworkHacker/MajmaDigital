
import React, { useState } from 'react';
import { X, Save, Calendar, MapPin, Tag, AlignLeft, Users } from 'lucide-react';
import { CommissionType } from '../types';

interface EventFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const EventForm: React.FC<EventFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Magal',
    date: new Date().toISOString().split('T')[0],
    location: '',
    organizingCommission: CommissionType.ORGANISATION,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-emerald-50 text-[#2E8B57]">
          <div>
            <h3 className="text-xl font-bold">Planifier un Événement</h3>
            <p className="text-xs font-medium uppercase tracking-wider">Agenda du Dahira</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Titre de l'événement</label>
            <div className="relative">
              <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                required
                type="text"
                placeholder="Ex: Conférence annuelle..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E8B57]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E8B57]"
              >
                {['Magal', 'Ziar', 'Gott', 'Thiant', 'Réunion'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E8B57]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Lieu</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                required
                type="text"
                placeholder="Ville, Adresse..."
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E8B57]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Commission Organisatrice</label>
            <div className="relative">
              <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={formData.organizingCommission}
                onChange={(e) => setFormData({ ...formData, organizingCommission: e.target.value as CommissionType })}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E8B57] appearance-none"
              >
                {Object.values(CommissionType).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Description</label>
            <div className="relative">
              <AlignLeft size={16} className="absolute left-3 top-3 text-gray-400" />
              <textarea
                rows={3}
                placeholder="Détails de l'événement..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E8B57] resize-none"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#2E8B57] text-white rounded-xl font-bold text-sm shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
