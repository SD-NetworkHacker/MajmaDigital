
import React, { useState } from 'react';
import { Heart, HandHelping, Users, TrendingUp, Gift, ChevronRight, Plus, MapPin, Target, Sparkles, AlertCircle, PieChart as PieIcon, ArrowUpRight } from 'lucide-react';

const SocialModule: React.FC = () => {
  const actions = [
    { id: 1, title: 'Aide Scolaire - Famille Diop', amount: '75,000 FCFA', date: 'Hier', type: 'Education', status: 'Versé' },
    { id: 2, title: 'Soutien Médical Urgence', amount: '120,000 FCFA', date: '08 Mai', type: 'Sante', status: 'En cours' },
    { id: 3, title: 'Panier Ramadan Communautaire', amount: '450,000 FCFA', date: 'Avril', type: 'Alimentation', status: 'Terminé' },
  ];

  const projects = [
    { name: 'Kurel des Mariés', progress: 85, target: '1.2M', current: '1M', icon: Gift, color: 'emerald', theme: 'Nid de bonheur pour nos jeunes couples' },
    { name: 'Gott Touba 2024', progress: 30, target: '5M', current: '1.5M', icon: MapPin, color: 'amber', theme: 'Hébergement et restauration pour le Magal' },
    { name: 'Rénovation Mosquée', progress: 55, target: '2.5M', current: '1.3M', icon: Target, color: 'blue', theme: 'Amélioration du cadre de prière local' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight leading-none">Action Sociale & Solidarité</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Ndimbal ak khéwéul ci talibé bi • Commission Sociale</p>
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
              <p className="text-5xl font-black mb-2 tracking-tighter">1,850K</p>
              <p className="text-[10px] font-black uppercase opacity-60 mb-10 tracking-widest">Reliquat Disponible (FCFA)</p>
              <div className="flex items-center gap-3 text-[10px] font-black bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
                <TrendingUp size={16} className="text-rose-300" />
                <span>+12.5% de collectes ce mois</span>
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
                { label: 'Santé & Urgences', p: 45, c: 'bg-rose-500' },
                { label: 'Soutien Scolaire', p: 35, c: 'bg-blue-500' },
                { label: 'Projets Com.', p: 20, c: 'bg-emerald-500' }
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
            {projects.map((p, i) => (
              <div key={i} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm group hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative overflow-hidden">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner transition-transform group-hover:scale-110 ${
                  p.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
                  p.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  <p.icon size={28} />
                </div>
                <h4 className="font-black text-gray-800 text-lg mb-2">{p.name}</h4>
                <p className="text-[11px] text-gray-400 font-medium italic mb-10 line-clamp-2 leading-relaxed">"{p.theme}"</p>
                
                <div className="mt-auto space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                       <p className="text-[9px] font-black uppercase text-gray-400 mb-1">Cible</p>
                       <p className="text-sm font-black text-gray-800">{p.target} <span className="opacity-30">FCFA</span></p>
                    </div>
                    <span className={`text-xs font-black ${
                      p.color === 'emerald' ? 'text-emerald-600' : p.color === 'amber' ? 'text-amber-600' : 'text-blue-600'
                    }`}>{p.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden border border-gray-50 shadow-inner">
                    <div className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      p.color === 'emerald' ? 'bg-emerald-500' : p.color === 'amber' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} style={{ width: `${p.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
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
              {actions.map((action) => (
                <div key={action.id} className="p-8 hover:bg-emerald-50/20 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-100 shadow-sm group-hover:bg-rose-500 group-hover:text-white transition-all">
                      <Heart size={24} />
                    </div>
                    <div>
                      <p className="text-base font-black text-gray-800 mb-1 group-hover:text-rose-700 transition-colors">{action.title}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{action.date}</span>
                        <span className="px-3 py-1 bg-gray-100 rounded-lg text-[9px] font-black text-gray-500 uppercase">{action.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="text-right">
                      <p className="text-xl font-black text-gray-800 leading-none mb-1">{action.amount}</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${action.status === 'Versé' || action.status === 'Terminé' ? 'text-emerald-500' : 'text-amber-500'}`}>{action.status}</p>
                    </div>
                    <button className="p-3 bg-gray-50 text-gray-300 rounded-xl group-hover:bg-rose-50 group-hover:text-rose-500 transition-all">
                      <ChevronRight size={20} />
                    </button>
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

export default SocialModule;
