
import React, { useState, useRef } from 'react';
import { Camera, User, Save, UploadCloud } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLoading } from '../../context/LoadingContext';
import { useNotification } from '../../context/NotificationContext';
import AuthLayout from './AuthLayout';

interface ProfileCompletionProps {
  onComplete: () => void;
}

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ onComplete }) => {
  const { user, refreshProfile } = useAuth(); // Assume update function exists or mocked
  const { showLoading, hideLoading } = useLoading();
  const { addNotification } = useNotification();
  
  const [bio, setBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoading();
    
    // Simulation Update Profile
    setTimeout(() => {
      // Ici on appellerait une fonction pour mettre à jour le profil
      console.log('Profile updated', { bio, avatar: avatarPreview });
      hideLoading();
      addNotification("Profil mis à jour !", "success");
      onComplete();
    }, 1500);
  };

  return (
    <AuthLayout 
      title="Bienvenue !" 
      subtitle={`Complétez votre profil, ${user?.firstName || 'Cher membre'}`}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="flex flex-col items-center">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-32 h-32 rounded-full border-4 border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center shadow-inner group-hover:border-emerald-200 transition-all">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <User size={48} className="text-slate-300" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 p-3 bg-slate-900 text-white rounded-full shadow-lg group-hover:bg-emerald-600 transition-colors">
              <Camera size={16} />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-4">Photo de profil</p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Biographie / Vocation</label>
          <textarea 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none h-32"
            placeholder="Décrivez votre rôle ou vos objectifs au sein du Dahira..."
          />
        </div>

        <div className="flex gap-4">
          <button 
            type="button" 
            onClick={onComplete}
            className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            Passer
          </button>
          <button 
            type="submit"
            className="flex-[2] py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
          >
            <Save size={16} /> Enregistrer & Accéder
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ProfileCompletion;
