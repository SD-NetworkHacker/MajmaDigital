
import React, { useState } from 'react';
import { Mail, Send, ChevronLeft } from 'lucide-react';
import { useLoading } from '../../context/LoadingContext';
import { useNotification } from '../../context/NotificationContext';
import AuthLayout from './AuthLayout';

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const { showLoading, hideLoading } = useLoading();
  const { addNotification } = useNotification();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    showLoading();
    // Simulation API
    setTimeout(() => {
      hideLoading();
      setIsSent(true);
      addNotification("Email de récupération envoyé !", "success");
    }, 1500);
  };

  return (
    <AuthLayout 
      title="Mot de passe oublié" 
      subtitle="Récupérez l'accès à votre compte Dahira"
    >
      {!isSent ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm text-slate-500 leading-relaxed">
            Entrez l'adresse email associée à votre compte. Nous vous enverrons un lien sécurisé pour réinitialiser votre mot de passe.
          </p>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                placeholder="nom@exemple.com"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-black hover:shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <Send size={16} /> Envoyer le lien
          </button>

          <button 
            type="button" 
            onClick={onBackToLogin}
            className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-2 mt-4"
          >
            <ChevronLeft size={14} /> Retour à la connexion
          </button>
        </form>
      ) : (
        <div className="text-center space-y-6 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900">Email Envoyé !</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Vérifiez votre boîte de réception (et vos spams) pour l'email de réinitialisation envoyé à <strong>{email}</strong>.
          </p>
          <button 
            onClick={onBackToLogin}
            className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
          >
            Retour à la connexion
          </button>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordForm;
