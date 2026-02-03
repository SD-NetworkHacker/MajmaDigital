
import React, { useState } from 'react';
import { Vote, Plus, History, CheckCircle, XCircle, Clock, FileText, ChevronRight, AlertTriangle, Users, BarChart2, X, Save, Gavel } from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  description: string;
  author: string;
  type: 'Budget' | 'Nomination' | 'Stratégie' | 'Urgence';
  status: 'voting' | 'adopted' | 'rejected';
  votes: { for: number; against: number; abstain: number };
  deadline: string;
  totalVoters: number;
}

const DecisionHub: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([
    {
       id: 'RES-101',
       title: 'Augmentation du Budget Magal 2024',
       description: 'Allocation supplémentaire de 5M FCFA pour la logistique transport suite à la hausse du carburant.',
       author: 'Commission Finance',
       type: 'Budget',
       status: 'voting',
       votes: { for: 5, against: 1, abstain: 2 },
       deadline: '2h 15m',
       totalVoters: 12
    }
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [newProp, setNewProp] = useState({ title: '', description: '', type: 'Stratégie' });

  const handleVote = (id: string, choice: 'for' | 'against' | 'abstain') => {
    setProposals(prev => prev.map(p => {
       if(p.id === id) {
          // Simulation: incrémenter le vote et mettre à jour le total
          const newVotes = { ...p.votes, [choice]: p.votes[choice] + 1 };
          return { ...p, votes: newVotes };
       }
       return p;
    }));
  };

  const handleCreate = (e: React.FormEvent) => {
     e.preventDefault();
     const newId = `RES-${Math.floor(Math.random() * 1000)}`;
     setProposals([{
        id: newId,
        title: newProp.title,
        description: newProp.description,
        author: 'Présidence',
        type: newProp.type as any,
        status: 'voting',
        votes: { for: 0, against: 0, abstain: 0 },
        deadline: '24h 00m',
        totalVoters: 12
     }, ...proposals]);
     setShowModal(false);
     setNewProp({ title: '', description: '', type: 'Stratégie' });
  };

  const getProgress = (val: number, total: number) => {
     if (total === 0) return 0;
     return Math.round((val / total) * 100);
  };

  return (
    <div className="space-y-8 animate-in zoom-in duration-500 relative">
      
      {/* MODAL CREATION */}
      {showModal && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 w-full max-w-lg rounded-[2rem] p-8 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-8">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                     <Gavel size={24} className="text-emerald-500"/> Nouvelle Résolution
                  </h3>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-400"><X size={20}/></button>
               </div>
               
               <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type de décision</label>
                     <div className="flex gap-2">
                        {['Budget', 'Nomination', 'Stratégie', 'Urgence'].map(t => (
                           <button 
                              key={t}
                              type="button" 
                              onClick={() => setNewProp({...newProp, type: t})}
                              className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase border transition-all ${newProp.type === t ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                           >
                              {t}
                           </button>
                        ))}
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Titre</label>
                     <input 
                        required
                        type="text" 
                        value={newProp.title}
                        onChange={e => setNewProp({...newProp, title: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white font-bold text-sm focus:border-emerald-500 outline-none"
                        placeholder="Ex: Validation du projet X"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contexte & Enjeux</label>
                     <textarea 
                        required
                        value={newProp.description}
                        onChange={e => setNewProp({...newProp, description: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 text-sm focus:border-emerald-500 outline-none h-32 resize-none"
                        placeholder="Détaillez la proposition..."
                     />
                  </div>
                  
                  <div className="pt-4 flex gap-3">
                     <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-800 text-slate-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700">Annuler</button>
                     <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-900/20">Soumettre au vote</button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-slate-800">
         <div>
            <h3 className="text-3xl font-black text-slate-100 uppercase tracking-widest mb-2 flex items-center gap-3">
               <Vote size={32} className="text-emerald-500" /> Chambre de Décision
            </h3>
            <p className="text-xs text-slate-400 font-medium">Espace de vote sécurisé pour les résolutions du Bureau Exécutif.</p>
         </div>
         <div className="flex gap-3">
            <button className="px-6 py-3 bg-slate-900 border border-slate-700 text-slate-400 hover:text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all">
               Voir Archives
            </button>
            <button 
               onClick={() => setShowModal(true)}
               className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95"
            >
               <Plus size={16} /> Nouvelle Résolution
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Active Votes Column */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center mb-2">
               <h4 className="text-sm font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={16} className="text-amber-500"/> En Cours de Vote
               </h4>
               <span className="px-3 py-1 bg-slate-900 rounded-lg text-[10px] font-bold text-slate-500 uppercase border border-slate-800">{proposals.filter(p => p.status === 'voting').length} Actifs</span>
            </div>

            {proposals.length === 0 ? (
               <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-[2rem] p-16 text-center text-slate-500 flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 shadow-inner">
                     <Vote size={32} className="opacity-20"/>
                  </div>
                  <p className="text-sm font-black uppercase tracking-widest">Aucune proposition soumise au vote</p>
                  <p className="text-xs mt-2 opacity-60">Les nouvelles résolutions apparaîtront ici.</p>
               </div>
            ) : (
               proposals.map((p) => (
                  <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 relative overflow-hidden group">
                     {/* Background Glow based on status */}
                     <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                     
                     <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                 p.type === 'Urgence' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                                 p.type === 'Budget' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                                 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              }`}>
                                 {p.type}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">{p.id}</span>
                           </div>
                           <div className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                              <Clock size={12} /> {p.deadline}
                           </div>
                        </div>

                        <h3 className="text-xl font-black text-white mb-2">{p.title}</h3>
                        <p className="text-sm text-slate-400 mb-8 leading-relaxed max-w-3xl">
                           {p.description}
                           <br/>
                           <span className="text-[10px] opacity-50 mt-2 block">Proposé par {p.author}</span>
                        </p>

                        {/* Voting Bars */}
                        <div className="space-y-3 mb-8 bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50">
                           <div className="flex items-center gap-4">
                              <span className="text-[10px] font-black text-emerald-500 uppercase w-12">Pour</span>
                              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                 <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${getProgress(p.votes.for, p.totalVoters)}%` }}></div>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 w-8 text-right">{p.votes.for}</span>
                           </div>
                           <div className="flex items-center gap-4">
                              <span className="text-[10px] font-black text-red-500 uppercase w-12">Contre</span>
                              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                 <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${getProgress(p.votes.against, p.totalVoters)}%` }}></div>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 w-8 text-right">{p.votes.against}</span>
                           </div>
                           <div className="flex items-center gap-4">
                              <span className="text-[10px] font-black text-slate-500 uppercase w-12">Neutre</span>
                              <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                 <div className="h-full bg-slate-500 transition-all duration-500" style={{ width: `${getProgress(p.votes.abstain, p.totalVoters)}%` }}></div>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 w-8 text-right">{p.votes.abstain}</span>
                           </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                           <button onClick={() => handleVote(p.id, 'for')} className="flex-1 py-3 bg-emerald-900/30 border border-emerald-500/30 text-emerald-500 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2">
                              <CheckCircle size={14}/> Approuver
                           </button>
                           <button onClick={() => handleVote(p.id, 'against')} className="flex-1 py-3 bg-red-900/30 border border-red-500/30 text-red-500 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
                              <XCircle size={14}/> Rejeter
                           </button>
                           <button onClick={() => handleVote(p.id, 'abstain')} className="px-6 py-3 bg-slate-800 text-slate-400 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-all">
                              Abstention
                           </button>
                        </div>
                     </div>
                  </div>
               ))
            )}
         </div>

         {/* Stats Sidebar */}
         <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 h-fit">
               <div className="flex justify-between items-center mb-8">
                  <h4 className="text-sm font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                     <BarChart2 size={16} className="text-blue-500"/> Quorum
                  </h4>
               </div>
               
               <div className="flex items-center justify-center relative w-40 h-40 mx-auto mb-8">
                  {/* Circular Progress Mockup */}
                  <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent border-l-transparent -rotate-45"></div>
                  <div className="text-center">
                     <span className="text-3xl font-black text-white">12</span>
                     <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mt-1">Votants</p>
                  </div>
               </div>
               
               <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-slate-300">Présents</span>
                     </div>
                     <span className="text-xs font-bold text-white">85%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                        <span className="text-xs text-slate-300">Absents</span>
                     </div>
                     <span className="text-xs font-bold text-white">15%</span>
                  </div>
               </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8">
               <h4 className="text-sm font-black text-slate-300 uppercase tracking-widest flex items-center gap-2 mb-6">
                  <History size={16} className="text-slate-500"/> Historique Récent
               </h4>
               <div className="space-y-4">
                  <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50 opacity-60">
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-black text-slate-500 uppercase">12 Fév 2024</span>
                        <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1"><CheckCircle size={10}/> Adopté</span>
                     </div>
                     <h5 className="text-xs font-bold text-slate-300">Budget Magal 2023</h5>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DecisionHub;
