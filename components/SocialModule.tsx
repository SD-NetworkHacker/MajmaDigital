
import React, { useState } from 'react';
import { Heart, HandHelping, Users, TrendingUp, ChevronRight, Plus, Target, PieChart as PieIcon, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../contexts/DataContext';
import { SocialProject } from '../types';

const SocialModule: React.FC = () => {
  const { user } = useAuth();
  const { socialProjects, addSocialCase, addSocialProject, contributions } = useData();
  const isAdmin = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'Super Admin';
  
  // States internes pour navigation Membre
  const [view, setView] = useState<'dashboard' | 'request' | 'new-project'>('dashboard');
  
  // Form State
  const [newRequest, setNewRequest] = useState({
     type: 'Soutien Médical',
     description: ''
  });

  const [newProject, setNewProject] = useState<Partial<SocialProject>>({
    title: '',
    theme: 'Social',
    targetAmount: 0,
    currentAmount: 0,
    color: 'emerald',
    status: 'actif'
  });

  // Calcul du solde social (Diayanté + Gott)
  const socialFunds = contributions
    .filter(c => c.type === 'Diayanté' || c.type === 'Gott')
    .reduce((acc, c) => acc + c.amount, 0);

  const submitRequest = (e: React.FormEvent) => {
      e.preventDefault();
      addSocialCase({
          type: newRequest.type as any,
          description: newRequest.description,
          status: 'nouveau'
      });
      setNewRequest({ type: 'Soutien Médical', description: '' });
      setView('dashboard');
  };

  const submitProject = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newProject.title || !newProject.targetAmount) return;

      addSocialProject({
         title: newProject.title,
         theme: newProject.theme as any,
         description: newProject.description || 'Projet solidaire',
         targetAmount: Number(newProject.targetAmount),
         currentAmount: 0,
         status: 'actif',
         color: newProject.color
      });
      setView('dashboard');
  };

  // --- VUE MEMBRE ---
  if (!isAdmin) {
      if (view === 'request') {
          return (
              <div className="max-w-xl mx-auto animate-in slide-in-from-right-4">
                  <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold uppercase text-xs tracking-widest mb-6 transition-colors">
                      <ArrowLeft size={16} /> Retour
                  </button>
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
                      <h3 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-3">
                         <HandHelping size={24} className="text-rose-600"/> Demande d'Assistance
                      </h3>
                      <p className="text-sm text-slate-500 mb-8">Votre demande sera traitée en toute confidentialité par le responsable social.</p>
                      
                      <form onSubmit={submitRequest} className="space-y-6">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Type de besoin</label>
                              <select 
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 outline-none"
                                value={newRequest.type}
                                onChange={e => setNewRequest({...newRequest, type: e.target.value})}
                              >
                                 <option>Soutien Médical</option>
                                 <option>Appui Scolaire / Universitaire</option>
                                 <option>Urgence Sociale</option>
                                 <option>Autre</option>
                              </select>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Description (Optionnel)</label>
                              <textarea 
                                className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-medium text-slate-600 outline-none h-32 resize-none" 
                                placeholder="Expliquez brièvement votre situation..."
                                value={newRequest.description}
                                onChange={e => setNewRequest({...newRequest, description: e.target.value})}
                              ></textarea>
                          </div>
                          <button className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-rose-700 transition-all active:scale-95">
                              Envoyer la demande
                          </button>
                      </form>
                  </div>
              </div>
          );
      }

      return (
        <div className="space-y-8 animate-in fade-in pb-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Solidarité & Entraide</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                        <Heart size={14} className="text-rose-500" /> "On n'est jamais heureux tout seul"
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setView('request')} className="px-6 py-3 bg-rose-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-rose-700 transition-all">
                        Solliciter une Aide
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* PROJETS ACTIFS */}
                {socialProjects.length > 0 ? socialProjects.map(proj => (
                    <div key={proj.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all">
                        <div>
                             <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-${proj.color}-50 text-${proj.color}-600`}>{proj.theme}</span>
                             </div>
                             <h3 className="text-lg font-black text-slate-900 mb-2">{proj.title}</h3>
                             <p className="text-xs text-slate-500 line-clamp-2">{proj.description}</p>
                             
                             <div className="mt-6 space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                    <span>Progression</span>
                                    <span>{Math.round((proj.currentAmount/proj.targetAmount)*100)}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full bg-${proj.color}-500 transition-all`} style={{ width: `${(proj.currentAmount/proj.targetAmount)*100}%` }}></div>
                                </div>
                                <p className="text-[10px] text-right font-medium text-slate-400 mt-1">{proj.currentAmount.toLocaleString()} / {proj.targetAmount.toLocaleString()} F</p>
                            </div>
                        </div>
                        <button className={`w-full mt-6 py-3 bg-${proj.color}-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90`}>
                            Participer
                        </button>
                    </div>
                )) : (
                    <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <Heart size={32} className="mx-auto mb-2 opacity-20"/>
                        <p className="text-xs font-bold uppercase">Aucun projet solidaire en cours</p>
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center justify-center min-h-[300px]">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-6">
                        <HandHelping size={40} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Besoin d'un soutien ?</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8">La commission sociale est là pour vous accompagner dans les moments difficiles.</p>
                    <button onClick={() => setView('request')} className="text-rose-600 font-black text-xs uppercase tracking-widest hover:underline">Faire une demande</button>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center justify-center min-h-[300px]">
                     <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6">
                        <Users size={40} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Réseau d'Entraide</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto">Connectez-vous avec d'autres membres pour du mentorat ou de l'échange de services.</p>
                </div>
            </div>
        </div>
      );
  }

  // --- VUE ADMIN ---
  
  if (view === 'new-project') {
     return (
        <div className="max-w-xl mx-auto animate-in slide-in-from-right-4">
             <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold uppercase text-xs tracking-widest mb-6 transition-colors">
                 <ArrowLeft size={16} /> Retour
             </button>
             <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
                 <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <Target size={24} className="text-emerald-500"/> Créer Projet Solidaire
                 </h3>
                 <form onSubmit={submitProject} className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Titre</label>
                        <input required type="text" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} placeholder="Ex: Caisse Santé" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Thème</label>
                        <select className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none" value={newProject.theme} onChange={e => setNewProject({...newProject, theme: e.target.value as any})}>
                           <option>Santé</option>
                           <option>Éducation</option>
                           <option>Social</option>
                           <option>Infrastructure</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Objectif Financier</label>
                        <input required type="number" className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold" value={newProject.targetAmount} onChange={e => setNewProject({...newProject, targetAmount: Number(e.target.value)})} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Couleur Thème</label>
                        <select className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold outline-none" value={newProject.color} onChange={e => setNewProject({...newProject, color: e.target.value})}>
                           <option value="emerald">Vert (Standard)</option>
                           <option value="rose">Rouge (Urgence)</option>
                           <option value="blue">Bleu (Education)</option>
                        </select>
                     </div>
                     <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg mt-4">Lancer le projet</button>
                 </form>
             </div>
        </div>
     )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight leading-none">Action Sociale & Solidarité</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Commission Sociale • Vue Administrateur</p>
          </div>
        </div>
        <button 
           onClick={() => setView('new-project')}
           className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-black transition-all active:scale-95 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          Nouvelle Initiative
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-rose-600 via-rose-700 to-rose-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-black text-[10px] uppercase tracking-[0.3em] mb-4 opacity-70">Caisse de Solidarité</h3>
              <p className="text-4xl font-black mb-2 tracking-tighter">{socialFunds.toLocaleString()} F</p>
              <p className="text-[10px] font-black uppercase opacity-60 mb-10 tracking-widest">Cumul Diayanté & Gott</p>
              <div className="flex items-center gap-3 text-[10px] font-black bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
                <TrendingUp size={16} className="text-rose-300" />
                <span>État des fonds</span>
              </div>
            </div>
            <Heart className="absolute -right-10 -bottom-10 text-white/5 group-hover:scale-110 transition-transform duration-1000" size={180} />
          </div>
          
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-gray-800 text-[10px] uppercase tracking-widest flex items-center gap-3">
                <PieIcon size={18} className="text-rose-600" />
                Répartition des Fonds
              </h3>
            </div>
            <div className="space-y-6">
              {[
                { label: 'Santé & Urgences', p: 40, c: 'bg-rose-500' },
                { label: 'Soutien Scolaire', p: 30, c: 'bg-blue-500' },
                { label: 'Projets Com.', p: 30, c: 'bg-emerald-500' }
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-gray-800">{item.p}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                    <div className={`${item.c} h-full transition-all duration-1000 ease-out`} style={{ width: `${item.p}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Admin Projects View */}
             <div className="col-span-3 flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-[3rem]">
                 <Target size={48} className="mb-4 opacity-20"/>
                 <p className="text-xs font-bold uppercase">Aucune intervention active</p>
                 <button className="mt-4 text-rose-600 text-[10px] font-black uppercase hover:underline">Créer un dossier</button>
             </div>
          </div>

          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <h3 className="font-black text-gray-800 flex items-center gap-3">
                <HandHelping size={22} className="text-rose-500" />
                Dernières Interventions Sociales
              </h3>
              <button className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline flex items-center gap-2">
                Tout l'historique <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="divide-y divide-gray-50">
               <div className="py-12 text-center text-slate-400 text-xs italic">
                   Aucune intervention récente.
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialModule;
