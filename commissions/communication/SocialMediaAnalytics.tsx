
import React from 'react';
import { TrendingUp, Users, Share2, MessageCircle, Heart, Eye, ArrowUpRight, ArrowDownRight, Globe, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const SocialMediaAnalytics: React.FC = () => {
  // Données vides
  const demographics: any[] = [];
  const contentPerformance: any[] = [];

  const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#6366f1'];

  return (
    <div className="space-y-8 animate-in zoom-in duration-700 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { l: 'Engag. Global', v: '0%', trend: 'Stable', icon: Heart, color: 'text-rose-500' },
          { l: 'Impressions', v: '0', trend: '-', icon: Eye, color: 'text-amber-500' },
          { l: 'Partages', v: '0', trend: '-', icon: Share2, color: 'text-blue-500' },
          { l: 'Mentions', v: '0', trend: '-', icon: MessageCircle, color: 'text-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 group hover:-translate-y-1 transition-all duration-300">
             <div className="flex justify-between items-start mb-6">
                <div className={`p-3 bg-slate-50 rounded-2xl group-hover:bg-white transition-colors ${stat.color}`}><stat.icon size={20} /></div>
                <div className={`flex items-center gap-1 text-[10px] font-black text-slate-400`}>
                   -
                </div>
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.l}</p>
             <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.v}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-card p-10">
          <h3 className="text-xl font-black text-slate-900 mb-10 flex items-center gap-3">
             <BarChart2 size={22} className="text-amber-500" /> Efficacité par Type de Contenu
          </h3>
          <div className="h-[400px] w-full flex items-center justify-center bg-slate-50/50 rounded-3xl border border-slate-100">
             {contentPerformance.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={contentPerformance}>
                      <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                      <YAxis hide />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', fontSize: '11px', fontWeight: 'bold' }} />
                      <Bar dataKey="engagement" radius={[12, 12, 0, 0]} barSize={60}>
                         {contentPerformance.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                         ))}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
             ) : (
                <p className="text-xs text-slate-400 font-bold uppercase">Aucune donnée disponible</p>
             )}
          </div>
        </div>

        <div className="lg:col-span-4 glass-card p-10">
           <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
             <Users size={18} className="text-blue-500" /> Démographie Audience
           </h3>
           <div className="h-[250px] w-full flex items-center justify-center bg-slate-50/50 rounded-3xl border border-slate-100">
             {demographics.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={demographics}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {demographics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
             ) : (
                <p className="text-xs text-slate-400 font-bold uppercase">Données insuffisantes</p>
             )}
           </div>
        </div>
      </div>

      <div className="glass-card p-10 bg-emerald-50/50 border-emerald-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
         <div className="p-5 bg-white rounded-[2rem] shadow-xl text-emerald-600 shrink-0 border border-emerald-50"><Globe size={40}/></div>
         <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-black text-emerald-900 mb-2">Recommandations Stratégiques (IA)</h4>
            <p className="text-sm font-medium text-emerald-700/80 leading-relaxed max-w-2xl">
               Connectez vos comptes sociaux pour permettre à l'IA d'analyser vos performances et de vous fournir des conseils personnalisés pour augmenter l'engagement de la communauté.
            </p>
         </div>
         <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-200">Connecter API</button>
         <div className="absolute -right-10 -bottom-10 opacity-5 font-arabic text-[12rem] rotate-12 text-emerald-900">س</div>
      </div>
    </div>
  );
};

export default SocialMediaAnalytics;
