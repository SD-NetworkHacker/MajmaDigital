
import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, School, 
  CheckCircle, ArrowRight, ChevronLeft, Calendar, Lock, Loader2, AlertCircle, 
  RefreshCw, UserRound, UserRoundSearch, History
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from './AuthLayout';
import { MemberCategory } from '../../types';

interface RegisterFormProps {
  onLoginClick: () => void;
  onSuccess: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onLoginClick, onSuccess }) => {
  const { register, resendConfirmation } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [rememberJoinDate, setRememberJoinDate] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    category: MemberCategory.ETUDIANT,
    gender: 'M' as 'M' | 'F',
    joinDate: '',
    birthDate: ''
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const isStep1Valid = () => {
    return formData.firstName.trim().length >= 2 && 
           formData.lastName.trim().length >= 2 && 
           /\S+@\S+\.\S+/.test(formData.email) && 
           formData.password.length >= 6 &&
           formData.password === formData.confirmPassword;
  };

  const isStep2Valid = () => {
    return formData.phone.trim().length >= 9 && 
           formData.birthDate !== '' &&
           (rememberJoinDate ? formData.joinDate !== '' : true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep2Valid() || isSubmitting) return;

    setError('');
    setIsSubmitting(true);
    try {
      await register({
         ...formData,
         joinDate: rememberJoinDate ? formData.joinDate : new Date().toISOString().split('T')[0]
      });
      setIsRegistered(true);
    } catch (err: any) {
       // Extraction du message pour éviter l'affichage de {}
       const message = err?.message || err?.error_description || "Une erreur est survenue lors de l'inscription.";
       setError(message);
       setIsSubmitting(false);
    }
  };

  if (isRegistered) {
    return (
      <AuthLayout title="Vérifiez vos emails" subtitle="Un lien de confirmation a été envoyé">
        <div className="text-center space-y-8 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto border border-emerald-100 shadow-inner">
            <Mail size={48} className="text-emerald-600" />
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Nous avons envoyé un lien à <strong className="text-slate-900">{formData.email}</strong>.<br/>
            Veuillez cliquer dessus pour activer votre compte.
          </p>
          <div className="pt-6 space-y-4">
            <button 
              type="button"
              onClick={() => resendConfirmation(formData.email)}
              className="w-full py-4 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
            >
              <RefreshCw size={16} /> Renvoyer le mail
            </button>
            <button 
              type="button"
              onClick={onLoginClick}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl"
            >
              Retour à la connexion
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Rejoindre Majma" 
      subtitle={step === 1 ? "Étape 1 : Identité & Sécurité" : "Étape 2 : Détails d'adhésion"}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in fade-in">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-xs font-bold leading-tight">{error}</p>
          </div>
        )}

        {step === 1 ? (
          <div className="space-y-5 animate-in slide-in-from-right-8 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom</label>
                <input required type="text" value={formData.firstName} onChange={e => handleChange('firstName', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Prénom" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                <input required type="text" value={formData.lastName} onChange={e => handleChange('lastName', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Nom" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <input required type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="votre@email.com" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mot de passe</label>
                <input required type="password" value={formData.password} onChange={e => handleChange('password', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="••••••" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmer</label>
                <input required type="password" value={formData.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="••••••" />
              </div>
            </div>

            <button 
              type="button"
              disabled={!isStep1Valid()}
              onClick={() => setStep(2)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
            >
              Suivant <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-5 animate-in slide-in-from-right-8 duration-300">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sexe</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleChange('gender', 'M')}
                      className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${formData.gender === 'M' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md' : 'bg-white border-slate-100 text-slate-400'}`}
                    >
                      <UserRound size={16} /> <span className="text-[10px] font-black uppercase">G (H)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChange('gender', 'F')}
                      className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${formData.gender === 'F' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md' : 'bg-white border-slate-100 text-slate-400'}`}
                    >
                      <UserRoundSearch size={16} /> <span className="text-[10px] font-black uppercase">S (F)</span>
                    </button>
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Téléphone</label>
                  <input required type="tel" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="77 000 00 00" />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date Naissance</label>
                  <input required type="date" value={formData.birthDate} onChange={e => handleChange('birthDate', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secteur</label>
                  <select 
                    value={formData.category} 
                    onChange={e => handleChange('category', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none"
                  >
                     {Object.values(MemberCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
               </div>
            </div>

            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <History size={14}/> Date d'Adhésion au Dahira
               </label>
               <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${rememberJoinDate ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-slate-300'}`}>
                      <input type="checkbox" className="hidden" checked={rememberJoinDate} onChange={() => setRememberJoinDate(!rememberJoinDate)} />
                      {rememberJoinDate && <CheckCircle size={12} className="text-white"/>}
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Je connais la date</span>
                  </label>

                  {rememberJoinDate ? (
                    <div className="relative animate-in slide-in-from-top-2">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                      <input required type="date" value={formData.joinDate} onChange={e => handleChange('joinDate', e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
                    </div>
                  ) : (
                    <p className="text-[9px] text-slate-400 italic">La date d'aujourd'hui sera utilisée.</p>
                  )}
               </div>
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => setStep(1)} className="p-4 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all"><ChevronLeft size={20} /></button>
              <button 
                type="submit"
                disabled={!isStep2Valid() || isSubmitting}
                className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle size={18} /> S'inscrire</>}
              </button>
            </div>
          </div>
        )}

        <div className="pt-8 text-center border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium">
            Déjà membre ?{' '}
            <button type="button" onClick={onLoginClick} className="text-slate-900 font-black hover:underline">Se connecter</button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RegisterForm;
