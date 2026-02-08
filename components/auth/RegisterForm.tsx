
import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, School, 
  CheckCircle, ArrowRight, ChevronLeft, Calendar, Lock, Loader2, AlertCircle, RefreshCw 
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
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    category: MemberCategory.ETUDIANT,
    address: '',
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
           formData.address.trim().length >= 3 && 
           formData.birthDate !== '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep2Valid() || isSubmitting) return;

    setError('');
    setIsSubmitting(true);
    try {
      await register({
         firstName: formData.firstName.trim(),
         lastName: formData.lastName.trim(),
         email: formData.email.trim(),
         password: formData.password,
         phone: formData.phone.trim(),
         category: formData.category,
         address: formData.address.trim()
      });
      setIsRegistered(true);
    } catch (err: any) {
       // S'assurer que l'erreur est bien une chaîne de caractères
       setError(typeof err === 'string' ? err : err.message || "Échec de l'inscription.");
       setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    setIsRegistered(false);
    onLoginClick();
  };

  if (isRegistered) {
    return (
      <AuthLayout title="Vérifiez vos emails" subtitle="Une dernière étape pour rejoindre le Dahira">
        <div className="text-center space-y-8 animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
            <Mail size={48} className="text-emerald-600" />
          </div>
          
          <div className="space-y-4">
             <p className="text-sm text-slate-600 leading-relaxed">
               Nous avons envoyé un lien de confirmation à l'adresse <br/> 
               <strong className="text-slate-900 font-black">{formData.email}</strong>.
             </p>
             <p className="text-xs text-slate-400 font-medium">
               Vérifiez votre dossier de courriers indésirables (spams) si vous ne trouvez pas l'email.
             </p>
          </div>

          <div className="pt-6 space-y-4">
            <button 
              type="button"
              onClick={() => resendConfirmation(formData.email)}
              className="w-full py-4 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-emerald-200 hover:bg-emerald-50 transition-all flex items-center justify-center gap-3"
            >
              <RefreshCw size={16} /> Renvoyer le lien
            </button>
            <button 
              type="button"
              onClick={handleBackToLogin}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95"
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
      subtitle={step === 1 ? "Étape 1 : Identifiants & Sécurité" : "Étape 2 : Profil & Contact"}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in fade-in">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-xs font-bold leading-tight">{error}</p>
          </div>
        )}

        <div className="flex items-center gap-2 mb-8">
          <div className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${step >= 1 ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>
          <div className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>
        </div>

        {step === 1 && (
          <div className="space-y-5 animate-in slide-in-from-right-8 duration-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom</label>
                <div className="relative">
                   <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                   <input required type="text" value={formData.firstName} onChange={e => handleChange('firstName', e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Prénom" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                <input required type="text" value={formData.lastName} onChange={e => handleChange('lastName', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Nom" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"/>
                <input required type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="nom@exemple.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sécurité</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"/>
                  <input required type="password" value={formData.password} onChange={e => handleChange('password', e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Mot de passe" />
                </div>
                <div className="relative group">
                  <input required type="password" value={formData.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)} className={`w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'focus:ring-rose-500/20 ring-2 ring-rose-200' : 'focus:ring-emerald-500/20'}`} placeholder="Confirmer" />
                </div>
              </div>
              <p className="text-[9px] text-slate-400 ml-1">Min. 6 caractères</p>
            </div>

            <button 
              type="button"
              disabled={!isStep1Valid()}
              onClick={() => setStep(2)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-4 active:scale-95"
            >
              Suivant <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-in slide-in-from-right-8 duration-300">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secteur</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: MemberCategory.ETUDIANT, icon: GraduationCap, label: 'Étudiant' },
                  { id: MemberCategory.TRAVAILLEUR, icon: Briefcase, label: 'Pro' },
                  { id: MemberCategory.ELEVE, icon: School, label: 'Élève' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleChange('category', cat.id)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                      formData.category === cat.id 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200'
                    }`}
                  >
                    <cat.icon size={20} />
                    <span className="text-[9px] font-black uppercase">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Téléphone</label>
              <div className="relative group">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"/>
                <input required type="tel" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="77 000 00 00" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date Naissance</label>
                  <div className="relative group">
                    <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"/>
                    <input required type="date" value={formData.birthDate} onChange={e => handleChange('birthDate', e.target.value)} className="w-full pl-10 pr-2 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adresse / Quartier</label>
                  <div className="relative group">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"/>
                    <input required type="text" value={formData.address} onChange={e => handleChange('address', e.target.value)} className="w-full pl-10 pr-3 py-3 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Zone..." />
                  </div>
               </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-xs hover:bg-slate-200 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                type="submit"
                disabled={!isStep2Valid() || isSubmitting}
                className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle size={18} /> S'inscrire</>}
              </button>
            </div>
          </div>
        )}

        <div className="pt-8 text-center border-t border-slate-100">
          <p className="text-xs text-slate-500 font-medium">
            Déjà membre ?{' '}
            <button 
              type="button" 
              onClick={handleBackToLogin}
              className="text-slate-900 font-black hover:underline"
            >
              Se connecter
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RegisterForm;
