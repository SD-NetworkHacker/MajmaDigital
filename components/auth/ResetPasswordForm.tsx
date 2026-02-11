
import React, { useState } from 'react';
import { Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useLoading } from '../../context/LoadingContext';
// Fix: Removed NotificationContext import as it is obsolete
import AuthLayout from './AuthLayout';

interface ResetPasswordFormProps {
  onSuccess: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSuccess }) => {
  const { showLoading, hideLoading } = useLoading();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      // Fix: Replaced addNotification with alert
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    if (password.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    showLoading();
    // Simulate API
    setTimeout(() => {
      hideLoading();
      alert("Mot de passe réinitialisé avec succès");
      onSuccess();
    }, 1500);
  };

  return (
    <AuthLayout 
      title="Nouveau Mot de Passe" 
      subtitle="Sécurisez votre compte avec un nouveau mot de passe"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                placeholder="••••••••"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmer mot de passe</label>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-800 focus:ring-2 outline-none transition-all ${
                  confirmPassword && password !== confirmPassword ? 'focus:ring-rose-500/20 border border-rose-200' : 'focus:ring-emerald-500/20'
                }`}
                placeholder="••••••••"
                required
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <CheckCircle size={16} /> Réinitialiser
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordForm;
