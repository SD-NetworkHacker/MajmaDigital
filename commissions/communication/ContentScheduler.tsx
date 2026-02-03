
import React, { useState } from 'react';
import { Calendar, Clock, Facebook, Instagram, MessageCircle, MoreHorizontal, Plus, ChevronLeft, ChevronRight, Zap, Target, CheckCircle, X, Save, Share2 } from 'lucide-react';

interface SocialPost {
  id: string;
  title: string;
  date: string;
  time: string;
  status: string;
  platforms: string[];
}

const ContentScheduler: React.FC = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState<Partial<SocialPost>>({
    status: 'Planifié',
    platforms: ['Facebook']
  });

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title) return;

    const post: SocialPost = {
      id: Date.now().toString(),
      title: newPost.title,
      date: new Date(newPost.date!).toLocaleString('fr-FR', { month: 'long', day: 'numeric' }),
      time: newPost.time || '10:00',
      status: newPost.status || 'Planifié',
      platforms: newPost.platforms || ['Facebook']
    };

    setPosts([...posts, post]);
    setShowModal(false);
    setNewPost({ status: 'Planifié', platforms: ['Facebook'] });
  };

  const togglePlatform = (p: string) => {
    const current = newPost.platforms || [];
    if (current.includes(p)) {
      setNewPost({...newPost, platforms: current.filter(x => x !== p)});
    } else {
      setNewPost({...newPost, platforms: [...current, p]});
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-700 relative">
      
      {/* ADD POST MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <Share2 size={24} className="text-amber-500"/> Planifier Post
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleAddPost} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Sujet / Titre</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500/20"
                  value={newPost.title || ''}
                  onChange={e => setNewPost({...newPost, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Date</label>
                  <input 
                    required 
                    type="date" 
                    className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none"
                    value={newPost.date || ''}
                    onChange={e => setNewPost({...newPost, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Heure</label>
                  <input 
                    required 
                    type="time" 
                    className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold outline-none"
                    value={newPost.time || ''}
                    onChange={e => setNewPost({...newPost, time: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400">Canaux de diffusion</label>
                 <div className="flex gap-2">
                    {['Facebook', 'Instagram', 'WhatsApp', 'YouTube'].map(p => (
                       <button
                         key={p}
                         type="button"
                         onClick={() => togglePlatform(p)}
                         className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${
                           newPost.platforms?.includes(p) ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-slate-400 border-slate-200'
                         }`}
                       >
                         {p}
                       </button>
                    ))}
                 </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Save size={16} /> Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Calendrier Éditorial</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Calendar size={14} className="text-amber-500" /> Planification des prises de parole institutionnelles
          </p>
        </div>
        <div className="flex gap-4">
           <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200">
              <button className="p-3 hover:bg-white text-slate-400 hover:text-slate-900 rounded-xl transition-all"><ChevronLeft size={16} /></button>
              <div className="px-6 flex items-center font-black text-[10px] uppercase text-slate-600 tracking-widest">
                  {new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
              </div>
              <button className="p-3 hover:bg-white text-slate-400 hover:text-slate-900 rounded-xl transition-all"><ChevronRight size={16} /></button>
           </div>
           <button 
             onClick={() => setShowModal(true)}
             className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all"
           >
              <Plus size={18} /> Programmer
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
           {posts.length > 0 ? posts.map(post => (
             <div key={post.id} className="glass-card p-8 flex flex-col md:flex-row items-center gap-8 group hover:border-amber-100 transition-all bg-white">
                <div className="flex flex-col items-center text-center">
                   <p className="text-xl font-black text-slate-900 leading-none">{post.date.split(' ')[1]}</p>
                   <p className="text-[10px] font-black text-amber-600 uppercase mt-1">{post.date.split(' ')[0]}</p>
                </div>
                <div className="w-px h-12 bg-slate-100 hidden md:block"></div>
                <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-4 mb-2">
                      <span className="text-[10px] font-black text-slate-300 flex items-center gap-2 uppercase tracking-widest"><Clock size={12} /> {post.time}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                        post.status === 'Planifié' ? 'bg-emerald-50 text-emerald-600' : post.status === 'Urgent' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-400'
                      }`}>{post.status}</span>
                   </div>
                   <h4 className="text-base font-black text-slate-800 leading-none mb-4">{post.title}</h4>
                   <div className="flex gap-2">
                      {post.platforms.map((p: string, idx: number) => (
                        <span key={idx} className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[8px] font-black uppercase tracking-widest group-hover:bg-white group-hover:border-amber-100 border border-transparent transition-all">
                           {p}
                        </span>
                      ))}
                   </div>
                </div>
                <div className="flex gap-2">
                   <button className="p-3 bg-slate-50 text-slate-400 hover:text-amber-600 rounded-xl transition-all shadow-sm"><MoreHorizontal size={18} /></button>
                   <button className="p-3 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-200"><CheckCircle size={18} /></button>
                </div>
             </div>
           )) : (
             <div className="flex flex-col items-center justify-center h-64 bg-slate-50/50 rounded-[2rem] text-slate-400 border-2 border-dashed border-slate-200">
                <Calendar size={48} className="opacity-20 mb-4"/>
                <p className="text-xs font-bold uppercase">Aucune publication programmée</p>
                <button onClick={() => setShowModal(true)} className="mt-4 text-amber-500 text-[10px] font-black uppercase hover:underline">Créer un post</button>
             </div>
           )}
        </div>

        <div className="space-y-8">
           <div className="glass-card p-10 bg-gradient-to-br from-amber-500 to-orange-600 text-white relative overflow-hidden group">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-70">Heure de Pointe IA</h4>
              <div className="relative z-10 flex flex-col gap-6">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10"><Zap size={32} /></div>
                    <div>
                       <p className="text-2xl font-black">-- : --</p>
                       <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">En attente de données</p>
                    </div>
                 </div>
                 <p className="text-[11px] leading-relaxed italic opacity-80">
                    "Publiez régulièrement pour permettre à l'IA d'analyser les meilleurs créneaux d'engagement."
                 </p>
              </div>
              <div className="absolute -right-10 -bottom-10 text-white/5 font-arabic text-[12rem] rotate-12">و</div>
           </div>

           <div className="glass-card p-10 bg-white">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                <Target size={18} className="text-amber-500" /> Objectifs de Publication
              </h4>
              <div className="space-y-6">
                 {[
                   { l: 'Posts Hebdo', c: 0, t: 5 },
                   { l: 'Stories FB/IG', c: 0, t: 10 },
                   { l: 'Newsletters', c: 0, t: 1 },
                 ].map((obj, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase">
                        <span>{obj.l}</span>
                        <span className="text-amber-600">{Math.round((obj.c/obj.t)*100)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                         <div className="h-full bg-amber-500" style={{ width: `${(obj.c/obj.t)*100}%` }}></div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ContentScheduler;
