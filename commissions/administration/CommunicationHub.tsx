
import React, { useState } from 'react';
import { 
  Megaphone, MessageSquare, Plus, Search, 
  BarChart3, X, Trash2, CheckCircle, Vote
} from 'lucide-react';

interface Announcement {
  id: number;
  title: string;
  author: string;
  date: string;
  urgent: boolean;
  content: string;
  readCount: number;
}

interface Poll {
  id: number;
  question: string;
  options: { label: string; votes: number }[];
  totalVotes: number;
  status: 'Open' | 'Closed';
  endDate: string;
}

const CommunicationHub: React.FC = () => {
  const [activeView, setActiveView] = useState<'annonces' | 'sondages'>('annonces');
  const [showModal, setShowModal] = useState<'none' | 'create_annonce' | 'create_poll'>('none');

  // DONNÉES VIDES
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);

  // Forms
  const [newAnnonce, setNewAnnonce] = useState({ title: '', content: '', urgent: false });
  const [newPoll, setNewPoll] = useState({ question: '', option1: '', option2: '' });

  const handleCreateAnnonce = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Announcement = {
      id: Date.now(),
      title: newAnnonce.title,
      content: newAnnonce.content,
      urgent: newAnnonce.urgent,
      author: 'Admin',
      date: 'À l\'instant',
      readCount: 0
    };
    setAnnouncements([created, ...announcements]);
    setNewAnnonce({ title: '', content: '', urgent: false });
    setShowModal('none');
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Poll = {
      id: Date.now(),
      question: newPoll.question,
      options: [{ label: newPoll.option1, votes: 0 }, { label: newPoll.option2, votes: 0 }],
      totalVotes: 0,
      status: 'Open',
      endDate: 'Dans 7 jours'
    };
    setPolls([created, ...polls]);
    setNewPoll({ question: '', option1: '', option2: '' });
    setShowModal('none');
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 relative">
      
      {/* Modals */}
      {showModal !== 'none' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900">
                {showModal === 'create_annonce' ? 'Nouvelle Annonce' : 'Nouveau Sondage'}
              </h3>
              <button onClick={() => setShowModal('none')} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            </div>

            {showModal === 'create_annonce' && (
              <form onSubmit={handleCreateAnnonce} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400">Titre</label>
                  <input required type="text" className="w-full p-3 bg-slate-50 rounded-xl font-bold text-sm" value={newAnnonce.title} onChange={e => setNewAnnonce({...newAnnonce, title: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400">Contenu</label>
                  <textarea required rows={4} className="w-full p-3 bg-slate-50 rounded-xl text-sm" value={newAnnonce.content} onChange={e => setNewAnnonce({...newAnnonce, content: e.target.value})} />
                </div>
                <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg">Publier</button>
              </form>
            )}

            {showModal === 'create_poll' && (
              <form onSubmit={handleCreatePoll} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400">Question</label>
                  <input required type="text" className="w-full p-3 bg-slate-50 rounded-xl font-bold text-sm" value={newPoll.question} onChange={e => setNewPoll({...newPoll, question: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <input required type="text" placeholder="Option 1" className="w-full p-3 bg-slate-50 rounded-xl text-sm" value={newPoll.option1} onChange={e => setNewPoll({...newPoll, option1: e.target.value})} />
                  <input required type="text" placeholder="Option 2" className="w-full p-3 bg-slate-50 rounded-xl text-sm" value={newPoll.option2} onChange={e => setNewPoll({...newPoll, option2: e.target.value})} />
                </div>
                <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg">Lancer</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Communication Interne</h3>
        </div>
        <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200">
           <button onClick={() => setActiveView('annonces')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase ${activeView === 'annonces' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400'}`}>
             <Megaphone size={16} /> Annonces
           </button>
           <button onClick={() => setActiveView('sondages')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase ${activeView === 'sondages' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400'}`}>
             <BarChart3 size={16} /> Sondages
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
           {activeView === 'annonces' && (
             <div className="space-y-6">
                <button onClick={() => setShowModal('create_annonce')} className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-emerald-300 hover:text-emerald-600 transition-all flex items-center justify-center gap-2">
                  <Plus size={16}/> Rédiger une annonce
                </button>
                {announcements.length === 0 && <p className="text-center text-xs text-slate-400 italic">Aucune annonce publiée.</p>}
                {announcements.map(item => (
                  <div key={item.id} className="glass-card p-8">
                     <h4 className="text-xl font-black text-slate-900 mb-2">{item.title}</h4>
                     <p className="text-sm text-slate-500 mb-4">{item.content}</p>
                     <div className="text-[10px] text-slate-400 font-bold uppercase">{item.date} • Par {item.author}</div>
                  </div>
                ))}
             </div>
           )}

           {activeView === 'sondages' && (
             <div className="space-y-6">
               <button onClick={() => setShowModal('create_poll')} className="w-full py-4 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-emerald-300 hover:text-emerald-600 transition-all flex items-center justify-center gap-2">
                  <Plus size={16}/> Créer un sondage
               </button>
               {polls.length === 0 && <p className="text-center text-xs text-slate-400 italic">Aucun sondage en cours.</p>}
               {polls.map(poll => (
                 <div key={poll.id} className="glass-card p-8">
                    <h4 className="text-lg font-black text-slate-900 mb-4">{poll.question}</h4>
                    <div className="space-y-2">
                       {poll.options.map((opt, i) => (
                         <div key={i} className="flex justify-between text-xs font-bold text-slate-600 bg-slate-50 p-3 rounded-lg">
                            <span>{opt.label}</span>
                            <span>{opt.votes} votes</span>
                         </div>
                       ))}
                    </div>
                 </div>
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default CommunicationHub;
