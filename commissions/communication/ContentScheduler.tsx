
import React, { useState } from 'react';
import { Calendar, Clock, Facebook, Instagram, MessageCircle, MoreHorizontal, Plus, ChevronLeft, ChevronRight, Zap, Target, CheckCircle } from 'lucide-react';

const ContentScheduler: React.FC = () => {
  const posts = [
    { id: 1, date: '15 Mai', time: '10:00', title: 'Hadith du jour', platforms: ['Facebook', 'WhatsApp'], status: 'Planifié' },
    { id: 2, date: '16 Mai', time: '14:30', title: 'Vidéo Récap Magal Gott', platforms: ['Instagram', 'YouTube'], status: 'Brouillon' },
    { id: 3, date: '18 Mai', time: '09:00', title: 'Annonce Ziar Annuelle', platforms: ['Tous'], status: 'Urgent' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Calendrier Éditorial</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <Calendar size={14} className="text-amber-500" /> Planification des prises de parole institutionnelles
          </p>
        </div>
        <div className="flex gap-4">
           <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100">
              <button className="p-3 hover:bg-white text-slate-400 hover:text-slate-900 rounded-xl transition-all"><ChevronLeft size={16} /></button>
              <div className="px-6 flex items-center font-black text-[10px] uppercase text-slate-600 tracking-widest">Mai 2024</div>
              <button className="p-3 hover:bg-white text-slate-400 hover:text-slate-900 rounded-xl transition-all"><ChevronRight size={16} /></button>
           </div>
           <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3">
              <Plus size={18} /> Programmer
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
           {posts.map(post => (
             <div key={post.id} className="glass-card p-8 flex flex-col md:flex-row items-center gap-8 group hover:border-amber-100 transition-all">
                <div className="flex flex-col items-center text-center">
                   <p className="text-xl font-black text-slate-900 leading-none">{post.date.split(' ')[0]}</p>
                   <p className="text-[10px] font-black text-amber-600 uppercase mt-1">{post.date.split(' ')[1]}</p>
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
                      {post.platforms.map((p, idx) => (
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
           ))}
        </div>

        <div className="space-y-8">
           <div className="glass-card p-10 bg-gradient-to-br from-amber-500 to-orange-600 text-white relative overflow-hidden group">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-70">Heure de Pointe IA</h4>
              <div className="relative z-10 flex flex-col gap-6">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10"><Zap size={32} /></div>
                    <div>
                       <p className="text-2xl font-black">18h30 - 21h00</p>
                       <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Engagement maximal prédit</p>
                    </div>
                 </div>
                 <p className="text-[11px] leading-relaxed italic opacity-80">
                    "Publier durant ces créneaux augmente la portée organique de 45% selon nos données historiques."
                 </p>
              </div>
              <div className="absolute -right-10 -bottom-10 text-white/5 font-arabic text-[12rem] rotate-12">و</div>
           </div>

           <div className="glass-card p-10">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                <Target size={18} className="text-amber-500" /> Objectifs de Publication
              </h4>
              <div className="space-y-6">
                 {[
                   { l: 'Posts Hebdo', c: 12, t: 15 },
                   { l: 'Stories FB/IG', c: 24, t: 30 },
                   { l: 'Newsletters', c: 2, t: 4 },
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
