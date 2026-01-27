
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { PieChart, TrendingUp, Download, FileText, Share2, Globe, Activity, Landmark, Sparkles, Filter } from 'lucide-react';

const FinancialReporting: React.FC = () => {
  const data = [
    { name: 'Jan', revenue: 450, expenses: 320 },
    { name: 'Fev', revenue: 520, expenses: 380 },
    { name: 'Mar', revenue: 680, expenses: 410 },
    { name: 'Avr', revenue: 590, expenses: 450 },
    { name: 'Mai', revenue: 840, expenses: 520 },
    { name: 'Juin', revenue: 950, expenses: 600 },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { l: 'Portée Annuelle', v: '18.4M', trend: '+22%', icon: TrendingUp, color: 'text-indigo-500' },
          { l: 'Taux de Recouvrement', v: '91.2%', trend: '+5.4%', icon: Activity, color: 'text-emerald-500' },
          { l: 'Dépenses Moyennes', v: '1.2M', trend: '-2.1%', icon: PieChart, color: 'text-rose-500' },
          { l: 'Réserves Cloud', v: '4.2M', trend: 'Sécurisé', icon: Landmark, color: 'text-blue-500' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 group hover:-translate-y-1 transition-all duration-300">
             <div className="flex justify-between items-start mb-6">
                <div className={`p-3 bg-slate-50 rounded-2xl group-hover:bg-white transition-colors ${stat.color}`}><stat.icon size={20} /></div>
                <div className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{stat.trend}</div>
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.l}</p>
             <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.v}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart Flow */}
        <div className="lg:col-span-8 glass-card p-10">
           <div className="flex justify-between items-center mb-12">
              <div>
                 <h3 className="text-xl font-black text-slate-900">Évolution Recettes vs Dépenses</h3>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Comparaison consolidée premier semestre 2024</p>
              </div>
              <div className="flex gap-2">
                 <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 border border-slate-100 transition-all"><Filter size={18}/></button>
              </div>
           </div>
           <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 'bold' }} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', fontSize: '11px', fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={4} fillOpacity={1} fill="url(#colorExp)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Predictive Analytics */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-indigo-900 text-white relative overflow-hidden group">
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-10">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10 text-indigo-400"><Sparkles size={24} /></div>
                    <h4 className="font-black text-xs uppercase tracking-widest">IA Finance Prediction</h4>
                 </div>
                 <h2 className="text-4xl font-black mb-4">94.8%</h2>
                 <p className="text-[11px] font-black uppercase tracking-widest opacity-50 mb-8">Indice de Santé Financière</p>
                 <p className="text-sm font-medium leading-relaxed italic opacity-80 mb-10">"Basé sur les flux actuels, le Dahira aura une réserve nette de 4.2M après le Magal, permettant de lancer le projet Infrastructure."</p>
                 <button className="w-full py-4 bg-white/10 hover:bg-white hover:text-indigo-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 active:scale-95">Voir Simulations</button>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-5 font-arabic text-[12rem] rotate-12 pointer-events-none">ص</div>
           </div>

           <div className="glass-card p-10 flex flex-col justify-center text-center space-y-6">
              <div className="p-5 bg-emerald-50 text-emerald-600 rounded-[2rem] w-fit mx-auto border border-emerald-100 shadow-xl shadow-emerald-900/5"><Globe size={40}/></div>
              <div>
                 <h4 className="text-xl font-black text-slate-900 leading-none mb-2">Export Réglementaire</h4>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Générer balance pour AG</p>
              </div>
              <div className="flex flex-col gap-3">
                 <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-xl"><Download size={18}/> Bilan PDF</button>
                 <button className="w-full py-4 bg-white border border-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3"><FileText size={18}/> Excel Global</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReporting;
