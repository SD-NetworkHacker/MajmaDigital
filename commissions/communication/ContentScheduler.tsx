import React, { useState } from 'react';
import { Calendar, Clock, Facebook, Instagram, MessageCircle, MoreHorizontal, Plus, ChevronLeft, ChevronRight, Zap, Target, CheckCircle, X, Save, Share2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { SocialPost } from '../../types';
import { formatDate } from '../../utils/date';

const ContentScheduler: React.FC = () => {
  const { socialPosts, addSocialPost } = useData(); // Utilisation contexte
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState<Partial<SocialPost>>({
    status: 'Planifié',
    platforms: ['Facebook']
  });

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title) return;

    addSocialPost({
      title: newPost.title,
      date: newPost.date,
      time: newPost.time || '10:00',
      status: newPost.status || 'Planifié',
      platforms: newPost.platforms || ['Facebook']
    });

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

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
           <h3 className="text-2xl font-black text-slate-900 tracking-tight">Calendrier Éditorial</h3>
           <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
              <Calendar size={14} className="text-amber-500" /> Planification des contenus
           </p>
        </div>
        <button 
           onClick={() => setShowModal(true)}
           className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all"
        >
           <Plus size={18} /> Nouveau Post
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-6">
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-fit">
               <button className="px-6 py-3 bg-white text-amber-700 shadow-sm rounded-xl text-[10px] font-black uppercase tracking-widest">Vue Liste</button>
               <button className="px-6 py-3 text-slate-500 hover:text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Vue Calendrier</button>
            </div>

            <div className="glass-card p-0 overflow-hidden bg-white border-slate-100">
               {socialPosts.length > 0 ? (
                  <div className="divide-y divide-slate-50">
                     {socialPosts.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(post => (
                        <div key={post.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all group cursor-pointer">
                           <div className="flex items-center gap-4">
                              <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-100 rounded-xl border border-slate-200 text-slate-500">
                                 <span className="text-[10px] font-black uppercase">{new Date(post.date).toLocaleDateString(undefined, {month: 'short'})}</span>
                                 <span className="text-lg font-black leading-none">{new Date(post.date).getDate()}</span>
                              </div>
                              <div>
                                 <h4 className="text-sm font-black text-slate-800">{post.title}</h4>
                                 <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                       <Clock size={10}/> {post.time}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                                       post.status === 'Publié' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                       {post.status}
                                    </span>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="flex -space-x-2">
                                 {post.platforms.map((p, i) => (
                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-500 text-[10px]" title={p}>
                                       {p[0]}
                                    </div>
                                 ))}
                              </div>
                              <ChevronRight size={16} className="text-slate-300 group-hover:text-amber-500 transition-colors"/>
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                     <Calendar size={32} className="mb-3 opacity-20"/>
                     <p className="text-xs font-bold uppercase">Aucun post planifié</p>
                  </div>
               )}
            </div>
         </div>

         <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-8 bg-slate-900 text-white relative overflow-hidden">
               <div className="relative z-10">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 opacity-60">Prochaine Publication</h4>
                  {socialPosts.length > 0 ? (
                     <div>
                        <h3 className="text-xl font-black mb-2">{socialPosts[0].title}</h3>
                        <p className="text-xs opacity-70 mb-6">{formatDate(socialPosts[0].date)} à {socialPosts[0].time}</p>
                        <button className="w-full py-3 bg-amber-500 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all">
                           Voir Aperçu
                        </button>
                     </div>
                  ) : (
                     <p className="text-xs italic opacity-50">Rien à venir</p>
                  )}
               </div>
               <div className="absolute -bottom-6 -right-6 opacity-10"><Zap size={100}/></div>
            </div>

            <div className="glass-card p-8 bg-white border-slate-100">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Canaux Actifs</h4>
               <div className="space-y-4">
                  {[
                     { l: 'Facebook', s: 'Connecté', c: 'text-blue-600' },
                     { l: 'Instagram', s: 'Connecté', c: 'text-pink-600' },
                     { l: 'WhatsApp', s: 'Connecté', c: 'text-emerald-600' },
                  ].map((ch, i) => (
                     <div key={i} className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-700">{ch.l}</span>
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                           <span className={`text-[9px] font-black uppercase ${ch.c}`}>{ch.s}</span>
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