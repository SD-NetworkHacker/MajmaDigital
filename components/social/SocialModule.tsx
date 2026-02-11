
import React, { useState } from 'react';
import { Heart, HandHelping, Users, TrendingUp, Plus, Target, PieChart as PieIcon, ArrowUpRight, ArrowLeft } from 'lucide-react';
// Fix: Corrected path for AuthContext
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const SocialModule: React.FC = () => {
  const { user } = useAuth();
  const { socialProjects, addSocialCase, contributions } = useData();
  const isAdmin = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'Super Admin';
  
  const [view, setView] = useState<'dashboard' | 'request'>('dashboard');
  
  const [newRequest, setNewRequest] = useState({
     type: 'Soutien Médical',
     description: ''
  });

  const socialFunds = (contributions || [])
    .filter(c => c.type === 'Diayanté' || c.type === 'Gott')
    .reduce((acc, c) => acc + c.amount, 0);

  const submitRequest = (e: React.FormEvent) => {
      e.preventDefault();
      addSocialCase({
          type: newRequest.type as any,
          description: newRequest.description,
          status: 'nouveau'
      });
      setNewRequest({ type: 'Soutien Médical', description: '' });
      setView('dashboard');
  };

  if (!isAdmin) {
      if (view === 'request') {
          return (
              <div className="max-w-xl mx-auto animate-in slide-in-from-right-4">
                  <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold uppercase text-xs tracking-widest mb-6 transition-colors">
                      <ArrowLeft size={16} /> Retour
                  </button>
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
                      <h3 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-3">
                         <HandHelping size={24} className="text-rose-600"/> Demande d'Assistance
                      </h3>
                      <form onSubmit={submitRequest} className="space-y-6">
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
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setView('request')} className="px-6 py-3 bg-rose-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-rose-700 transition-all">
                        Solliciter une Aide
                    </button>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight leading-none">Action Sociale & Solidarité</h2>
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
              <p className="text-4xl font-black mb-2 tracking-tighter">{socialFunds.toLocaleString()} F</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialModule;
