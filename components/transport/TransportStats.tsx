
import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Bus, Users, Ticket, Fuel, 
  Wrench, AlertTriangle, PieChart, BarChart2, Calculator, Save, 
  ArrowRight, Filter, Download
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart as RePieChart, Pie, Legend 
} from 'recharts';
import { useData } from '../../contexts/DataContext';

const TransportStats: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'simulator'>('overview');
  const [timeRange, setTimeRange] = useState('YTD'); // Year to Date

  // Data State from Context
  const { tickets, fleet } = useData();

  // --- CALCULS REELS ---

  // Chiffre d'Affaires Global
  const totalRevenue = useMemo(() => {
     return tickets.reduce((acc, t) => t.status === 'paye' ? acc + Number(t.amount) : acc, 0);
  }, [tickets]);

  // Estimation des Coûts (Fuel = approx 30% du CA, Maintenance = 10%) - Pour démo si pas de données réelles de dépenses
  const estimatedFuelCost = totalRevenue * 0.35; 
  const estimatedMaintenance = totalRevenue * 0.15;
  const netMargin = totalRevenue - (estimatedFuelCost + estimatedMaintenance);
  const marginPercent = totalRevenue > 0 ? Math.round((netMargin / totalRevenue) * 100) : 0;

  // Données Mensuelles (Basées sur les tickets)
  const revenueData = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthLabel = d.toLocaleString('fr-FR', { month: 'short' });
        
        const monthlyTickets = tickets.filter(t => {
            const tDate = new Date(t.date); // Format JJ/MM/AAAA ou ISO
            // Parsing simplifié si format FR
            const parts = t.date.split('/');
            const dateObj = parts.length === 3 ? new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0])) : new Date(t.date);
            return dateObj.getMonth() === d.getMonth() && dateObj.getFullYear() === d.getFullYear();
        });

        const rev = monthlyTickets.reduce((acc, t) => acc + Number(t.amount), 0);
        data.push({
            name: monthLabel,
            billetterie: rev,
            carburant: rev * 0.35, // Est.
            entretien: rev * 0.15, // Est.
        });
    }
    return data;
  }, [tickets]);

  // Répartition des coûts
  const costDistribution = [
    { name: 'Carburant', value: 65, color: '#f97316' }, // Orange
    { name: 'Entretien & Réparations', value: 20, color: '#ef4444' }, // Red
    { name: 'Péages & Taxes', value: 10, color: '#3b82f6' }, // Blue
    { name: 'Per Diems & Divers', value: 5, color: '#10b981' }, // Emerald
  ];

  // Rentabilité par Véhicule (Agrégation tickets par tripId si lié au véhicule - ici simulation projection sur la flotte)
  const vehicleROI = useMemo(() => {
     return fleet.map(v => {
         // Simulation: Assigner aléatoirement une partie du CA global pour l'exemple
         // Dans un système complet, on lierait Ticket -> Trip -> Vehicle
         const estimatedShare = Math.random() * 0.2; // 20% max share per vehicle roughly
         const rev = Math.round(totalRevenue * estimatedShare);
         const cost = Math.round(rev * 0.6); // 60% operating cost
         
         return {
             id: v.id,
             name: `${v.type.toUpperCase()} ${v.registrationNumber}`,
             revenue: rev,
             cost: cost,
             margin: rev > 0 ? Math.round(((rev - cost) / rev) * 100) : 0
         };
     }).sort((a, b) => b.revenue - a.revenue);
  }, [fleet, totalRevenue]);


  // --- SIMULATOR STATE ---
  const [simParams, setSimParams] = useState({
      distance: 300, // km (ex: Dakar-Touba A/R)
      conso: 35, // L/100km
      fuelPrice: 990, // FCFA/L
      peage: 6000,
      perDiem: 15000,
      entretien: 10000, // Amortissement par trajet
      places: 60,
      marginTarget: 30 // %
  });

  // Calculs Simulateur
  const simResults = useMemo(() => {
      const fuelCost = (simParams.distance / 100) * simParams.conso * simParams.fuelPrice;
      const totalFixedCost = fuelCost + simParams.peage + simParams.perDiem + simParams.entretien;
      const breakEvenPrice = totalFixedCost / simParams.places;
      const targetPrice = breakEvenPrice * (1 + (simParams.marginTarget / 100));
      
      return {
          totalCost: Math.round(totalFixedCost),
          breakEven: Math.ceil(breakEvenPrice / 50) * 50, // Arrondi 50F sup
          targetPrice: Math.ceil(targetPrice / 50) * 50
      };
  }, [simParams]);

  // --- VUE SIMULATEUR ---
  if (activeTab === 'simulator') {
      return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-4">
                  <button onClick={() => setActiveTab('overview')} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-500">
                      <ArrowRight size={20} className="rotate-180"/>
                  </button>
                  <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Simulateur de Prix</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Calcul du seuil de rentabilité par trajet</p>
                  </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 glass-card p-8 bg-white border-slate-100">
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                          <Wrench size={16} className="text-orange-500"/> Paramètres du Trajet
                      </h4>
                      <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Distance A/R (km)</label>
                              <input type="number" value={simParams.distance} onChange={e => setSimParams({...simParams, distance: parseInt(e.target.value)})} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20"/>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Conso. Moyenne (L/100)</label>
                              <input type="number" value={simParams.conso} onChange={e => setSimParams({...simParams, conso: parseInt(e.target.value)})} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20"/>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Prix Carburant (F/L)</label>
                              <input type="number" value={simParams.fuelPrice} onChange={e => setSimParams({...simParams, fuelPrice: parseInt(e.target.value)})} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20"/>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Frais Fixes (Péage/Perdiem)</label>
                              <input type="number" value={simParams.peage + simParams.perDiem} onChange={e => setSimParams({...simParams, peage: parseInt(e.target.value)})} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20"/>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Capacité Bus</label>
                              <input type="number" value={simParams.places} onChange={e => setSimParams({...simParams, places: parseInt(e.target.value)})} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20"/>
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Marge Cible (%)</label>
                              <input type="number" value={simParams.marginTarget} onChange={e => setSimParams({...simParams, marginTarget: parseInt(e.target.value)})} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20"/>
                          </div>
                      </div>
                  </div>

                  <div className="lg:col-span-5 space-y-6">
                      <div className="glass-card p-8 bg-slate-900 text-white relative overflow-hidden">
                          <div className="relative z-10">
                              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Prix Billet Recommandé</p>
                              <h2 className="text-5xl font-black tracking-tighter text-orange-400">{simResults.targetPrice.toLocaleString()} <span className="text-xl text-white opacity-40">F</span></h2>
                              <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                                  <div className="flex justify-between text-xs">
                                      <span className="opacity-70">Coût Total Voyage</span>
                                      <span className="font-bold">{simResults.totalCost.toLocaleString()} F</span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                      <span className="opacity-70">Seuil Rentabilité (Break-even)</span>
                                      <span className="font-bold text-emerald-400">{simResults.breakEven.toLocaleString()} F / passager</span>
                                  </div>
                              </div>
                          </div>
                          <div className="absolute -bottom-10 -right-10 opacity-10"><Calculator size={150}/></div>
                      </div>

                      <div className="glass-card p-6 bg-orange-50 border-orange-100 flex items-start gap-4">
                          <div className="p-3 bg-white rounded-xl text-orange-600 shadow-sm"><TrendingUp size={20}/></div>
                          <div>
                              <h5 className="font-black text-orange-900 text-sm">Rentabilité Projetée</h5>
                              <p className="text-xs text-orange-800/70 mt-1 leading-relaxed">
                                  Avec un prix de {simResults.targetPrice} F et {simParams.places} passagers, ce convoi génèrera un bénéfice net de <span className="font-bold">{( (simResults.targetPrice * simParams.places) - simResults.totalCost ).toLocaleString()} F</span>.
                              </p>
                          </div>
                      </div>
                      
                      <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                          <Save size={16}/> Enregistrer comme Modèle
                      </button>
                  </div>
              </div>
          </div>
      )
  }

  // --- VUE GENERALE ---
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
         <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Coûts & Rentabilité</h3>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
               <DollarSign size={14} className="text-emerald-500" /> Analyse financière du parc et des convois
            </p>
         </div>
         <div className="flex gap-3">
             <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                {['Mois', 'YTD', 'Tout'].map(t => (
                    <button key={t} onClick={() => setTimeRange(t)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${timeRange === t ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>
                ))}
             </div>
             <button onClick={() => setActiveTab('simulator')} className="px-6 py-3 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-orange-700 transition-all flex items-center gap-2">
                 <Calculator size={16}/> Simulateur
             </button>
             <button className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-emerald-600 hover:border-emerald-200 transition-all">
                 <Download size={18}/>
             </button>
         </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
           <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Ticket size={20}/></div>
              <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Recettes</span>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">Chiffre d'Affaires</p>
           <h4 className="text-3xl font-black text-slate-900 relative z-10">{totalRevenue.toLocaleString()} <span className="text-sm opacity-40">F</span></h4>
           <div className="absolute -bottom-4 -right-4 text-emerald-500/10"><TrendingUp size={80}/></div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl"><Fuel size={20}/></div>
              <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">Est.</span>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dépenses Carburant</p>
           <h4 className="text-3xl font-black text-slate-900">{estimatedFuelCost.toLocaleString()} <span className="text-sm opacity-40">F</span></h4>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Wrench size={20}/></div>
              <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">Est.</span>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Coûts Maintenance</p>
           <h4 className="text-3xl font-black text-slate-900">{estimatedMaintenance.toLocaleString()} <span className="text-sm opacity-40">F</span></h4>
        </div>
        <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 shadow-xl text-white">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/10 rounded-2xl text-orange-400"><PieChart size={20}/></div>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Marge Nette Estimée</p>
           <h4 className="text-3xl font-black text-emerald-400">{netMargin.toLocaleString()} <span className="text-sm opacity-40 text-white">F</span></h4>
           <div className="w-full h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${marginPercent}%` }}></div>
           </div>
           <p className="text-[9px] text-right mt-1 opacity-60">{marginPercent}% de Marge</p>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Main Chart: Revenue vs Costs */}
         <div className="lg:col-span-2 glass-card p-8 bg-white">
            <div className="flex justify-between items-center mb-8">
               <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Évolution Financière</h4>
               <div className="flex gap-4 text-[10px] font-bold uppercase">
                  <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Recettes</span>
                  <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Carburant</span>
                  <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Entretien</span>
               </div>
            </div>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                     <defs>
                        <linearGradient id="colorBill" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} />
                     <YAxis hide />
                     <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '11px', fontWeight: 'bold' }} />
                     <Area type="monotone" dataKey="billetterie" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorBill)" stackId="1" />
                     <Area type="monotone" dataKey="carburant" stroke="#f97316" strokeWidth={2} fillOpacity={0.6} fill="#f97316" stackId="2" />
                     <Area type="monotone" dataKey="entretien" stroke="#f43f5e" strokeWidth={2} fillOpacity={0.6} fill="#f43f5e" stackId="2" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Pie Chart: Cost Distribution */}
         <div className="lg:col-span-1 glass-card p-8 bg-white flex flex-col">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Structure des Coûts</h4>
            <div className="flex-1 min-h-[200px] relative">
               <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                     <Pie
                        data={costDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                     >
                        {costDistribution.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Pie>
                     <Tooltip />
                  </RePieChart>
               </ResponsiveContainer>
               {/* Center Text */}
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-slate-800">100%</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Dépenses</span>
               </div>
            </div>
            <div className="space-y-2 mt-4">
               {costDistribution.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="font-bold text-slate-600">{item.name}</span>
                     </div>
                     <span className="font-black text-slate-800">{item.value}%</span>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* VEHICLE ROI TABLE */}
      <div className="glass-card bg-white overflow-hidden border-slate-100">
         <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
               <Bus size={16} className="text-slate-400"/> Rentabilité par Véhicule
            </h4>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-orange-600 transition-colors shadow-sm">
               <Filter size={14}/>
            </button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                     <th className="px-8 py-4">Véhicule</th>
                     <th className="px-8 py-4 text-right">Recettes (YTD)</th>
                     <th className="px-8 py-4 text-right">Coûts (YTD)</th>
                     <th className="px-8 py-4 text-right">Marge Nette</th>
                     <th className="px-8 py-4 text-center">ROI</th>
                     <th className="px-8 py-4 text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {vehicleROI.length > 0 ? vehicleROI.map((v) => (
                     <tr key={v.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                                 <Bus size={14}/>
                              </div>
                              <div>
                                 <p className="text-xs font-black text-slate-800">{v.name}</p>
                                 <p className="text-[9px] text-slate-400 font-mono">{v.id}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-5 text-right font-medium text-slate-600">{v.revenue.toLocaleString()} F</td>
                        <td className="px-8 py-5 text-right font-medium text-slate-600">{v.cost.toLocaleString()} F</td>
                        <td className={`px-8 py-5 text-right font-black ${v.margin > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                           {(v.revenue - v.cost).toLocaleString()} F
                        </td>
                        <td className="px-8 py-5">
                           <div className="flex items-center justify-center gap-2">
                              {v.margin < 0 && <AlertTriangle size={14} className="text-rose-500"/>}
                              <span className={`px-2 py-1 rounded text-[9px] font-black ${
                                 v.margin > 40 ? 'bg-emerald-100 text-emerald-700' : 
                                 v.margin > 0 ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
                              }`}>
                                 {v.margin}%
                              </span>
                           </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <button className="text-[9px] font-black text-slate-400 hover:text-orange-600 uppercase transition-colors">Détails</button>
                        </td>
                     </tr>
                  )) : (
                      <tr>
                          <td colSpan={6} className="text-center py-12 text-slate-400 italic text-xs">Aucune donnée de rentabilité disponible</td>
                      </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default TransportStats;
