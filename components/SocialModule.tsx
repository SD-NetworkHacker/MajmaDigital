
import React, { useState, useMemo } from 'react';
import { Heart, HeartHandshake, Users, TrendingUp, Gift, ChevronRight, Plus, MapPin, Target, Sparkles, AlertCircle, PieChart as PieIcon, ArrowUpRight, ArrowLeft, Smartphone, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SocialModule: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'Super Admin';
  
  // States internes pour navigation Membre
  const [view, setView] = useState<'dashboard' | 'projects' | 'donate' | 'request'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Données mock pour l'exemple
  const projects = [
      { id: 1, name: 'Soutien Scolaire', theme: 'Éducation', target: 500000, current: 120000, progress: 24, color: 'blue' },
      { id: 2, name: 'Ndogou Solidaire', theme: 'Social', target: 1000000, current: 850000, progress: 85, color: 'emerald' },
      { id: 3, name: 'Urgence Santé', theme: 'Santé', target: 300000, current: 45000, progress: 15, color: 'rose' }
  ];
  
  const myContributions = [
      { id: 'c1', project: 'Ndogou Solidaire', amount: 5000, date: '12 Mars 2024' },
      { id: 'c2', project: 'Soutien Scolaire', amount: 2000, date: '05 Fév 2024' }
  ];

  const handleDonate = (project: any) => {
      setSelectedProject(project);
      setView('donate');
  };

  const submitDonation = (e: React.FormEvent) => {
      e.preventDefault();
      alert("Merci pour votre générosité ! (Simulation de paiement)");
      setView('dashboard');
      setSelectedProject(null);
  };
  
  const submitRequest = (e: React.FormEvent) => {
      e.preventDefault();
      alert("Votre demande d'assistance sociale a été enregistrée. La commission vous contactera en toute confidentialité.");
      setView('dashboard');
  };

  // --- VUE MEMBRE ---
  if (!isAdmin) {
      if (view === 'donate' && selectedProject) {
          return (
              <div className="max-w-xl mx-auto animate-in slide-in-from-right-4">
                  <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold uppercase text-xs tracking-widest mb-6 transition-colors">
                      <ArrowLeft size={16} /> Retour
                  </button>
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
                      <div className="text-center mb-8">
                          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${selectedProject.color === 'rose' ? 'bg-rose-100 text-rose-600' : selectedProject.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                              <Heart size={32} className="fill-current"/>
                          </div>
                          <h3 className="text-2xl font-black text-slate-900">{selectedProject.name}</h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Soutien Initiative {selectedProject.theme}</p>
                      </div>
                      <form onSubmit={submitDonation} className="space-y-6">
                          <div>
                              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Montant du Don (FCFA)</label>
                              <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl text-xl font-black text-slate-800 outline-none focus:ring-2 focus:ring-rose-500/20" placeholder="Ex: 5000" required />
                          </div>
                          <button className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg hover:bg-rose-700 transition-all active:scale-95">
                              Confirmer le don
                          </button>
                      </form>
                  </div>
              </div>
          );
      }
      
      if (view === 'request') {
          return (
              <div className="max-w-xl mx-auto animate-in slide-in-from-right-4">
                  <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold uppercase text-xs tracking-widest mb-6 transition-colors">
                      <ArrowLeft size={16} /> Retour
                  </button>
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
                      <h3 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-3">
                         <HeartHandshake size={24} className="text-rose-600"/> Demande d'Assistance
                      </h3>
                      <p className="text-sm text-slate-500 mb-8">Votre demande sera traitée en toute confidentialité par le responsable social.</p>
                      
                      <form onSubmit={submitRequest} className="space-y-6">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Type de besoin</label>
                              <select className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-800 outline-none">
                                 <option>Soutien Médical</option>
                                 <option>Appui Scolaire / Universitaire</option>
                                 <option>Urgence Sociale</option>
                                 <option>Autre</option>
                              </select>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Description (Optionnel)</label>
                              <textarea className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-medium text-slate-600 outline-none h-32 resize-none" placeholder="Expliquez brièvement votre situation..."></textarea>
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
                    <button onClick={() => setView('request')} className="px-6 py-3 bg-white border border-rose-100 text-rose-600 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-sm hover:bg-rose-50 transition-all">
                        Besoin d'aide ?
                    </button>
                    <div className="px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase text-slate-400">Total Donné</span>
                        <span className="text-lg font-black text-rose-600">7 000 F</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {projects.map((p) => (
                    <div key={p.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                    p.color === 'rose' ? 'bg-rose-100 text-rose-600' : p.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                }`}>{p.theme}</span>
                                <div className="p-2 bg-slate-50 rounded-full text-slate-300"><Target size={16}/></div>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">{p.name}</h3>
                            
                            <div className="mt-6 space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                    <span>Progression</span>
                                    <span>{p.progress}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-1000 ${
                                        p.color === 'rose' ? 'bg-rose-500' : p.color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'
                                    }`} style={{ width: `${p.progress}%` }}></div>
                                </div>
                                <p className="text-[10px] text-right font-medium text-slate-400 mt-1">{p.current.toLocaleString()} / {p.target.toLocaleString()} F</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleDonate(p)}
                            className="w-full mt-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                        >
                            <Heart size={14} className="fill-current"/> Participer
                        </button>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-slate-100">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Mes Derniers Dons</h3>
                <div className="space-y-4">
                    {myContributions.map(c => (
                        <div key={c.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm"><Heart size={18}/></div>
                                <div>
                                    <p className="text-xs font-black text-slate-800">{c.project}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">{c.date}</p>
                                </div>
                            </div>
                            <span className="text-sm font-black text-slate-900">{c.amount.toLocaleString()} F</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      );
  }

  // --- VUE ADMIN (Legacy) ---
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
        <button className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-black transition-all active:scale-95 group">
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          Nouvelle Initiative
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-rose-600 via-rose-700 to-rose-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-black text-[10px] uppercase tracking-[0.3em] mb-4 opacity-70">Caisse de Solidarité</h3>
              <p className="text-5xl font-black mb-2 tracking-tighter">0</p>
              <p className="text-[10px] font-black uppercase opacity-60 mb-10 tracking-widest">Reliquat Disponible (FCFA)</p>
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
                { label: 'Santé & Urgences', p: 0, c: 'bg-rose-500' },
                { label: 'Soutien Scolaire', p: 0, c: 'bg-blue-500' },
                { label: 'Projets Com.', p: 0, c: 'bg-emerald-500' }
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
                <HeartHandshake size={22} className="text-rose-500" />
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
