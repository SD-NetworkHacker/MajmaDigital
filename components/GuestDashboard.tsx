
import React, { useState, useEffect, useRef } from 'react';
import { 
  LogIn, Heart, BookOpen, Calendar, ArrowRight, Info, Shield, 
  Users, Zap, Globe, MessageSquare, CheckCircle, Mail, Phone, 
  MapPin, Facebook, Instagram, Twitter, ChevronRight, Award, 
  Activity, Star, Wallet, Quote, Sparkles, ShieldCheck, ArrowUpRight
} from 'lucide-react';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import ForgotPasswordForm from './auth/ForgotPasswordForm';

const LandingNavbar: React.FC<{ onAction: (view: any) => void }> = ({ onAction }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 px-6 py-4 ${
      isScrolled ? 'glass-nav py-3' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="flex items-center gap-3 group cursor-pointer" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-arabic text-xl pb-1 transition-all duration-500 shadow-lg ${
            isScrolled ? 'bg-slate-900 text-emerald-400' : 'bg-white/10 text-[#D4AF37] border border-white/20'
          }`}>
            م
          </div>
          <div className="flex flex-col">
            <h1 className={`text-lg font-black tracking-tight leading-none transition-colors duration-500 ${
              isScrolled ? 'text-slate-900' : 'text-white'
            }`}>
              Majma<span className="text-emerald-500">Digital</span>
            </h1>
            <p className={`text-[8px] font-bold uppercase tracking-[0.2em] mt-0.5 transition-opacity ${
              isScrolled ? 'text-slate-400 opacity-100' : 'text-emerald-100/60 opacity-0'
            }`}>Dahira Management</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {['Piliers', 'Mission', 'Valeurs', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className={`text-[11px] font-black uppercase tracking-widest transition-all relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-emerald-500 after:transition-all hover:after:w-full ${
                isScrolled ? 'text-slate-600 hover:text-emerald-600' : 'text-white/80 hover:text-white'
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => onAction('login')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
              isScrolled 
                ? 'bg-slate-900 text-white hover:bg-emerald-600' 
                : 'bg-[#D4AF37] text-white hover:bg-white hover:text-slate-900'
            }`}
          >
            Se connecter
          </button>
        </div>
      </div>
    </nav>
  );
};

const SectionHeader: React.FC<{ tag: string, title: string, subtitle?: string, centered?: boolean }> = ({ tag, title, subtitle, centered = true }) => (
  <div className={`${centered ? 'text-center' : 'text-left'} max-w-3xl ${centered ? 'mx-auto' : ''} mb-20 space-y-4`}>
     <div className={`inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100 ${centered ? '' : 'ml-[-4px]'}`}>
        <Sparkles size={12} className="text-emerald-600" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">{tag}</span>
     </div>
     <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-[1.1]">{title}</h2>
     {subtitle && <p className="text-lg text-slate-500 font-medium leading-relaxed">{subtitle}</p>}
  </div>
);

const GuestDashboard: React.FC = () => {
  const [view, setView] = useState<'landing' | 'login' | 'register' | 'forgot-password'>('landing');

  // Animation on scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [view]);

  if (view === 'login') return <LoginForm onRegisterClick={() => setView('register')} onForgotPasswordClick={() => setView('forgot-password')} />;
  if (view === 'register') return <RegisterForm onLoginClick={() => setView('login')} onSuccess={() => setView('login')} />;
  if (view === 'forgot-password') return <ForgotPasswordForm onBackToLogin={() => setView('login')} />;

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar onAction={setView} />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 pointer-events-none scale-110"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#064e3b]/80 via-slate-950/90 to-black/95"></div>
        
        {/* Animated Mesh Blobs */}
        <div className="mesh-blob w-[700px] h-[700px] -top-20 -left-20 opacity-30 animate-blob"></div>
        <div className="mesh-blob w-[600px] h-[600px] -bottom-40 -right-40 opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="text-center lg:text-left space-y-10 animate-in fade-in slide-in-from-left-10 duration-1000">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Ramadan 2024 • Phase de déploiement</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
              L'excellence par la <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-amber-200 to-emerald-400">Dévotion</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 opacity-90">
              Découvrez la plateforme unifiée du Dahira Majmahoun Nourayni. Une gestion spirituelle, sociale et administrative repensée.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-6">
              <button 
                onClick={() => setView('register')}
                className="group px-12 py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-emerald-900/40 hover:bg-emerald-500 hover:-translate-y-2 transition-all flex items-center justify-center gap-4 active:scale-95"
              >
                Rejoindre maintenant <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
              <button 
                onClick={() => setView('login')}
                className="px-12 py-6 bg-white/10 border border-white/20 backdrop-blur-md text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-white hover:text-slate-900 hover:-translate-y-2 transition-all flex items-center justify-center gap-4 active:scale-95 shadow-xl"
              >
                Espace Membre
              </button>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-12 pt-12 border-t border-white/10">
              <div>
                <p className="text-4xl font-black text-white">2.5k+</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Membres Actifs</p>
              </div>
              <div>
                <p className="text-4xl font-black text-white">10</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pôles d'Action</p>
              </div>
              <div>
                <p className="text-4xl font-black text-white">100%</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Transparent</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block relative animate-in zoom-in duration-1000 delay-300">
             <div className="relative z-10 bg-slate-900/40 backdrop-blur-3xl rounded-[4rem] border border-white/10 p-6 shadow-3xl transform rotate-2 hover:rotate-0 transition-transform duration-1000 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-1000"></div>
                <div className="bg-slate-950 rounded-[3rem] overflow-hidden aspect-square flex items-center justify-center relative">
                   <span className="font-arabic text-[18rem] text-emerald-500/10 select-none drop-shadow-2xl">م</span>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-6 p-10">
                         {[Shield, Wallet, Calendar, BookOpen].map((Icon, i) => (
                           <div key={i} className={`w-28 h-28 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-emerald-400 animate-pulse-slow shadow-2xl backdrop-blur-md`} style={{ animationDelay: `${i * 400}ms` }}>
                             <Icon size={40} />
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
             {/* Decorative floating badges */}
             <div className="absolute -top-12 -right-12 p-8 bg-[#D4AF37] rounded-[2.5rem] shadow-3xl animate-bounce-slow z-20 border-4 border-slate-950">
                <Award size={48} className="text-white" />
             </div>
             <div className="absolute -bottom-10 -left-12 p-8 bg-blue-600 rounded-[2.5rem] shadow-3xl animate-pulse z-20 border-4 border-slate-950">
                <Users size={48} className="text-white" />
             </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 animate-bounce cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Explorer</span>
           <ChevronRight size={20} className="rotate-90 text-emerald-500" />
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <div className="relative z-20 -mt-20 max-w-6xl mx-auto px-6 section-reveal">
        <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl border border-slate-100 grid grid-cols-2 lg:grid-cols-4 gap-12">
           {[
             { label: 'Impact Social', value: '45+', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
             { label: 'Mobilisation', value: '12M+', icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-50' },
             { label: 'Ouvrages', icon: BookOpen, value: '200+', color: 'text-indigo-500', bg: 'bg-indigo-50' },
             { label: 'Engagement', icon: Activity, value: '94%', color: 'text-blue-500', bg: 'bg-blue-50' },
           ].map((stat, i) => (
             <div key={stat.label} className="flex flex-col items-center text-center group">
               <div className={`p-5 rounded-[2rem] ${stat.bg} ${stat.color} mb-5 shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                 <stat.icon size={32} />
               </div>
               <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
             </div>
           ))}
        </div>
      </div>

      {/* --- VALEURS SECTION --- */}
      <section id="valeurs" className="py-40 px-6 bg-slate-50/50 section-reveal">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            tag="L'Esprit Majma" 
            title="Nos Valeurs Fondamentales" 
            subtitle="Le travail bien fait est une forme d'adoration divine. Nous cultivons l'excellence à chaque étape."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { t: 'Discipline', d: 'Rigueur dans l\'action et respect total des horaires communautaires.', i: ShieldCheck, c: 'emerald' },
              { t: 'Fraternité', d: 'Un seul cœur battant pour le bien de tous, sans distinction.', i: Heart, c: 'rose' },
              { t: 'Savoir', d: 'L\'éducation comme levier unique de progression spirituelle.', i: BookOpen, c: 'indigo' },
              { t: 'Service', d: 'Se dévouer humblement pour la réussite de chaque membre.', i: Sparkles, c: 'amber' },
            ].map((val, i) => (
              <div key={val.t} className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-emerald-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                <div className={`p-4 bg-${val.c}-50 text-${val.c}-600 rounded-2xl w-fit mb-8 group-hover:bg-${val.c}-600 group-hover:text-white transition-colors duration-500`}>
                   <val.i size={32} />
                </div>
                <h4 className="font-black text-slate-900 text-xl mb-4">{val.t}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{val.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PILLIERS SECTION --- */}
      <section id="piliers" className="py-40 px-6 section-reveal">
        <div className="max-w-7xl mx-auto">
          <SectionHeader 
            tag="Structure" 
            title="Les 3 Piliers du Dahira" 
            subtitle="Une organisation optimisée pour répondre aux besoins spirituels, matériels et éducatifs."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                title: 'Vie Spirituelle', 
                desc: 'Apprentissage des Xassaids, médiathèque numérique et éducation religieuse structurée.', 
                icon: BookOpen, 
                color: 'indigo',
                features: ['Académie Xassaid', 'Audio HQ', 'Cours de Fiqh']
              },
              { 
                title: 'Solidarité Active', 
                desc: 'Un système d\'entraide confidentiel et efficace pour les cas sociaux et le mentorat.', 
                icon: Heart, 
                color: 'rose',
                features: ['Caisse Sociale', 'Visites Fraternelles', 'Mentorat Pro']
              },
              { 
                title: 'Gestion Administrative', 
                desc: 'Transparence totale des fonds, planification logistique et pilotage stratégique.', 
                icon: Shield, 
                color: 'emerald',
                features: ['Trésorerie Live', 'Logistique Convoi', 'Vote Numérique']
              },
            ].map((pillar, i) => (
              <div key={pillar.title} className="group relative bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm hover:shadow-3xl transition-all duration-700 hover:-translate-y-4 overflow-hidden">
                <div className={`absolute top-0 right-0 w-40 h-40 bg-${pillar.color}-50 rounded-bl-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000`}></div>
                <div className={`p-6 bg-${pillar.color}-50 text-${pillar.color}-600 rounded-[2rem] w-fit mb-10 relative z-10`}>
                   <pillar.icon size={40} />
                </div>
                <h4 className="text-3xl font-black text-slate-900 mb-6 relative z-10 leading-tight">{pillar.title}</h4>
                <p className="text-base text-slate-500 leading-relaxed mb-10 relative z-10 font-medium">{pillar.desc}</p>
                
                <ul className="space-y-4 relative z-10">
                   {pillar.features.map((f) => (
                     <li key={f} className="flex items-center gap-4 text-xs font-black text-slate-700 uppercase tracking-widest">
                        <div className={`w-2 h-2 rounded-full bg-${pillar.color}-500 shadow-[0_0_8px_rgba(0,0,0,0.1)]`}></div> {f}
                     </li>
                   ))}
                </ul>
                
                <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                   <span className="text-[10px] font-black uppercase text-slate-400">En savoir plus</span>
                   <ArrowUpRight size={20} className={`text-${pillar.color}-500`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="py-40 px-6 bg-slate-950 text-white overflow-hidden relative section-reveal">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] font-arabic text-[40rem] pointer-events-none select-none">ن</div>
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
               <div className="max-w-2xl space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    <Sparkles size={12} className="text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Paroles de membres</span>
                  </div>
                  <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]">Impact & <br/> <span className="text-emerald-400">Expérience</span></h3>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {[
                  { n: 'Moussa D.', r: 'Membre Étudiant', q: 'La digitalisation de la trésorerie a renforcé ma confiance. Je sais exactement où va mon Sass chaque mois.' },
                  { n: 'Fatou N.', r: 'Commission Sociale', q: 'Grâce à MajmaDigital, nous traitons les cas sociaux deux fois plus vite. L\'entraide n\'a jamais été aussi fluide.' },
                  { n: 'Ibrahima S.', r: 'Professionnel', q: 'L\'accès aux Xassaids en haute définition partout dans le monde me permet de rester connecté à ma spiritualité.' }
               ].map((t, i) => (
                  <div key={t.n} className="bg-white/5 border border-white/10 p-12 rounded-[4rem] backdrop-blur-xl group hover:bg-white/10 transition-all duration-700">
                     <Quote className="text-emerald-500 mb-10 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all" size={56} />
                     <p className="text-xl font-medium leading-relaxed mb-12 italic opacity-90 group-hover:opacity-100">"{t.q}"</p>
                     <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-emerald-900/20">
                           {t.n[0]}
                        </div>
                        <div>
                           <p className="font-black text-lg">{t.n}</p>
                           <p className="text-[10px] text-emerald-400 uppercase font-black tracking-[0.2em] mt-1">{t.r}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- MISSION SECTION --- */}
      <section id="mission" className="py-40 bg-white relative overflow-hidden section-reveal">
        <div className="absolute top-0 right-0 p-20 opacity-5 font-arabic text-[35rem] rotate-12 pointer-events-none select-none text-slate-200">خ</div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
           <div className="space-y-10">
              <SectionHeader 
                tag="Vision" 
                title="Vers une communauté 100% connectée" 
                subtitle="Notre mission est de digitaliser les processus du Dahira pour libérer du temps à la spiritualité."
                centered={false}
              />
              
              <div className="space-y-8">
                 {[
                   { t: 'Transparence Radicale', d: 'Chaque franc versé est tracé et visible par les auditeurs en temps réel.', i: Zap, c: 'amber' },
                   { t: 'Accessibilité Globale', d: 'Où que vous soyez (Dakar, Touba, Diaspora), gardez le lien avec le Dahira.', i: Globe, c: 'blue' },
                   { t: 'Sécurité Maximale', d: 'Données protégées et échanges chiffrés pour garantir votre vie privée.', i: Shield, c: 'emerald' },
                 ].map((m) => (
                    <div key={m.t} className="flex gap-8 group">
                       <div className={`shrink-0 w-16 h-16 bg-${m.c}-50 rounded-2xl flex items-center justify-center text-${m.c}-600 shadow-sm border border-${m.c}-100 group-hover:bg-${m.c}-600 group-hover:text-white transition-all duration-500`}>
                          <m.i size={28}/>
                       </div>
                       <div>
                          <h5 className="font-black text-slate-900 text-lg uppercase tracking-widest">{m.t}</h5>
                          <p className="text-base text-slate-500 mt-2 font-medium leading-relaxed">{m.d}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="relative">
              <div className="bg-slate-200 aspect-[4/5] rounded-[5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)]">
                 <img src="https://images.unsplash.com/photo-1517245318773-a78d5d99ca19?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="Community" loading="lazy" />
              </div>
              <div className="absolute -bottom-12 -right-12 bg-white p-12 rounded-[4rem] shadow-4xl border border-slate-100 animate-in zoom-in duration-1000 max-w-sm">
                 <p className="text-lg italic font-medium text-slate-700 leading-relaxed">
                   "La force du groupe réside dans sa capacité à s'organiser autour du savoir."
                 </p>
                 <div className="mt-8 flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-black text-xl shadow-inner border border-emerald-200">SS</div>
                    <div>
                       <p className="text-sm font-black">Sidy Sow</p>
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Admin Platform</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-40 px-6">
         <div className="max-w-6xl mx-auto bg-slate-950 rounded-[5rem] p-16 md:p-32 text-center text-white relative overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,0.4)]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 via-transparent to-transparent"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] font-arabic text-[40rem] select-none pointer-events-none">م</div>
            
            <div className="relative z-10 space-y-14">
               <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">Faites partie de <br/> l'histoire du Dahira</h2>
               <p className="text-xl md:text-2xl text-emerald-100/70 max-w-3xl mx-auto font-medium leading-relaxed">
                  Créez votre compte en quelques instants et accédez à l'ensemble des services communautaires sécurisés.
               </p>
               <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
                  <button 
                    onClick={() => setView('register')}
                    className="px-14 py-7 bg-white text-slate-950 rounded-[2.5rem] font-black uppercase text-sm tracking-[0.2em] shadow-2xl hover:scale-105 transition-all active:scale-95"
                  >
                     Démarrer l'inscription
                  </button>
                  <button 
                    onClick={() => setView('login')}
                    className="px-14 py-7 bg-white/10 border border-white/20 backdrop-blur-xl text-white rounded-[2.5rem] font-black uppercase text-sm tracking-[0.2em] hover:bg-white/20 transition-all active:scale-95"
                  >
                     Déjà membre ?
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* --- FOOTER COMPLET --- */}
      <footer id="contact" className="bg-slate-50 border-t border-slate-200 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
            
            <div className="space-y-8">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-emerald-500 font-arabic text-4xl pb-2 shadow-2xl">م</div>
                  <h3 className="text-2xl font-black text-slate-900 leading-none">Majma<span className="text-emerald-600">Digital</span></h3>
               </div>
               <p className="text-base text-slate-500 leading-relaxed font-medium">
                 La plateforme officielle du Dahira Majmahoun Nourayni. Propulsée par l'innovation pour servir la foi.
               </p>
               <div className="flex gap-5">
                  <a href="#" className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"><Facebook size={24}/></a>
                  <a href="#" className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"><Instagram size={24}/></a>
                  <a href="#" className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"><Twitter size={24}/></a>
               </div>
            </div>

            <div>
               <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-10 border-l-4 border-emerald-500 pl-5">Raccourcis</h4>
               <ul className="space-y-6">
                  {['Piliers d\'action', 'Notre Mission', 'Règlement Intérieur', 'Calendrier Annuel', 'Faire un Don'].map(item => (
                    <li key={item}>
                       <a href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-all flex items-center gap-3 group">
                          <ChevronRight size={16} className="text-emerald-300 group-hover:translate-x-2 transition-transform" /> {item}
                       </a>
                    </li>
                  ))}
               </ul>
            </div>

            <div>
               <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-10 border-l-4 border-emerald-500 pl-5">Support Pôles</h4>
               <ul className="space-y-6">
                  {['Administration', 'Communication', 'Finances & Dons', 'Organisation', 'Affaires Sociales'].map(item => (
                    <li key={item}>
                       <a href="#" className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-all flex items-center gap-3 group">
                          <ChevronRight size={16} className="text-emerald-300 group-hover:translate-x-2 transition-transform" /> {item}
                       </a>
                    </li>
                  ))}
               </ul>
            </div>

            <div>
               <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] mb-10 border-l-4 border-emerald-500 pl-5">Contact Officiel</h4>
               <ul className="space-y-8">
                  <li className="flex items-start gap-5 group">
                     <div className="p-3 bg-white border border-slate-200 rounded-xl text-emerald-500 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all"><MapPin size={20}/></div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Siège Social</p>
                        <p className="text-sm font-bold text-slate-700 mt-1">Médina, Dakar, Sénégal</p>
                     </div>
                  </li>
                  <li className="flex items-start gap-5 group">
                     <div className="p-3 bg-white border border-slate-200 rounded-xl text-emerald-500 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all"><Mail size={20}/></div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Email</p>
                        <p className="text-sm font-bold text-slate-700 mt-1">contact@majma.sn</p>
                     </div>
                  </li>
                  <li className="flex items-start gap-5 group">
                     <div className="p-3 bg-white border border-slate-200 rounded-xl text-emerald-500 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all"><Phone size={20}/></div>
                     <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Secrétariat</p>
                        <p className="text-sm font-bold text-slate-700 mt-1">+221 77 000 00 00</p>
                     </div>
                  </li>
               </ul>
            </div>

          </div>

          <div className="pt-16 border-t border-slate-200 flex flex-col lg:flex-row justify-between items-center gap-8">
             <div className="flex flex-col lg:flex-row items-center gap-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">© 2024 MajmaDigital • Édition Platinum</p>
                <div className="flex items-center gap-8">
                   <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">Mentions Légales</a>
                   <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">Politique de Cookies</a>
                   <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">RGPD</a>
                </div>
             </div>
             <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 px-6 py-2 bg-slate-100 rounded-full">
                Fait avec <Heart size={14} className="text-rose-500 fill-current animate-pulse" /> par la Commission Communication
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestDashboard;
