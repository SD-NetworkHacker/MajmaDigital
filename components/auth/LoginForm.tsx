
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';

interface LoginFormProps {
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onRegisterClick, onForgotPasswordClick }) => {
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Email ou mot de passe incorrect.");
    }
  };

  return (
    <AuthLayout 
      title="Espace Membre" 
      subtitle="Connectez-vous pour accéder à vos services"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in fade-in">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-xs font-bold">{error}</p>
          </div>
        )}

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-800 focus:border-emerald-500/20 focus:bg-white focus:shadow-xl focus:shadow-emerald-900/5 outline-none transition-all"
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mot de passe</label>
              <button 
                type="button" 
                onClick={onForgotPasswordClick}
                className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 hover:underline uppercase tracking-wide"
              >
                Oublié ?
              </button>
            </div>
            <div className="relative group">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-800 focus:border-emerald-500/20 focus:bg-white focus:shadow-xl focus:shadow-emerald-900/5 outline-none transition-all"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-emerald-600 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95 group"
        >
          <LogIn size={16} className="group-hover:translate-x-1 transition-transform" /> Se connecter
        </button>

        <div className="pt-8 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Nouveau dans le Dahira ?{' '}
            <button 
              type="button" 
              onClick={onRegisterClick}
              className="text-emerald-600 font-black hover:text-emerald-700 underline underline-offset-4"
            >
              Créer un compte
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginForm;
