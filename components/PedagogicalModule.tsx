
import React, { useState } from 'react';
import { BookOpen, Search, Play, FileText, Brain, Sparkles, X, ChevronRight, Volume2, Languages, Loader2, Award, History, Bookmark, TrendingUp, ArrowLeft } from 'lucide-react';
import { explainXassaid, translateXassaid } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';

const PedagogicalModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedXassaid, setSelectedXassaid] = useState<any>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [loadingTranslation, setLoadingTranslation] = useState(false);

  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'Super Admin';

  // Exemple de données pour la démo
  const xassaids = [
    { id: '1', title: 'Mawahibou Nafiha', type: 'Khassaide', theme: 'Panégyrique', length: '45 Versets', content: 'Texte arabe simulé...' },
    { id: '2', title: 'Djazboul Qulub', type: 'Khassaide', theme: 'Amour du Prophète', length: '63 Versets', content: 'Texte arabe simulé...' },
    { id: '3', title: 'Matlaboul Fawzayni', type: 'Khassaide', theme: 'Recherche du Bonheur', length: 'Long', content: 'Texte arabe simulé...' },
  ];

  const handleExplain = async (title: string) => {
    setLoadingAi(true);
    const explanation = await explainXassaid(title);
    setAiExplanation(explanation);
    setLoadingAi(false);
  };

  const handleTranslate = async (text: string) => {
    setLoadingTranslation(true);
    const result = await translateXassaid(text);
    setTranslation(result);
    setLoadingTranslation(false);
  };

  const handleCloseReader = () => {
      setSelectedXassaid(null);
      setAiExplanation(null);
      setTranslation(null);
  };

  return (
    <div className="space-y-6 h-full flex flex-col overflow-hidden animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Pédagogie & Xassaids</h2>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
            <BookOpen size={14} className="text-emerald-500" /> Éducation Spirituelle • Bibliothèque Numérique
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          {isAdmin && (
             <div className="hidden sm:flex px-6 py-4 bg-amber-50 rounded-2xl items-center gap-3 border border-amber-100 shadow-sm shadow-amber-900/5">
                <Sparkles size={18} className="text-amber-600" />
                <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">IA Majma Optisée</span>
             </div>
          )}
          <button className="flex-1 md:flex-none px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95">
             <History size={16} /> Mon Carnet
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden">
        {/* Library Section */}
        <div className="lg:col-span-8 flex flex-col space-y-6 overflow-hidden">
          <div className="relative shrink-0 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher par titre, thème ou verset..." 
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 shadow-sm rounded-[1.5rem] text-sm font-bold focus:ring-4 focus:ring-emerald-500/5 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 pr-2 pb-6 custom-scrollbar">
            {xassaids.length > 0 ? xassaids.filter(x => x.title.toLowerCase().includes(searchTerm.toLowerCase())).map((x) => (
              <div 
                key={x.id} 
                className="glass-card p-8 group flex flex-col hover:border-emerald-500/40 relative cursor-pointer"
                onClick={() => {setSelectedXassaid(x); setAiExplanation(null); setTranslation(null);}}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                    <BookOpen size={24} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[9px] font-black text-emerald-600 bg-white border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-widest">{x.type}</span>
                    <button className="p-2 text-slate-200 hover:text-emerald-500 transition-colors"><Bookmark size={18} /></button>
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{x.title}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-10">{x.theme}</p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{x.length}</span>
                  <div className="flex gap-2">
                    <button className="p-2 bg-white rounded-xl text-slate-400 border border-slate-100 shadow-sm"><Volume2 size={16} /></button>
                    <button className="px-4 py-2 bg-[#2E8B57] text-white rounded-xl shadow-lg shadow-emerald-100 text-[10px] font-black uppercase flex items-center gap-2">
                       Lire <Play size={10} className="fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-2 flex flex-col items-center justify-center py-20 text-slate-400">
                 <BookOpen size={48} className="mb-4 opacity-20"/>
                 <p className="text-xs font-bold uppercase">Aucun résultat trouvé</p>
              </div>
            )}
          </div>
        </div>

        {/* Progression Sidebar */}
        <div className="lg:col-span-4 space-y-8 overflow-y-auto pr-1 pb-4 no-scrollbar">
          <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10"><TrendingUp size={24} /></div>
                <h3 className="font-black text-xs uppercase tracking-[0.2em]">Acquisition Spirituelle</h3>
              </div>
              <div className="space-y-8">
                {/* Empty State for Progress */}
                <p className="text-xs italic opacity-60 text-center">Aucun progrès enregistré.</p>
              </div>
              <button className="w-full mt-12 py-4 bg-white/10 hover:bg-white text-white hover:text-emerald-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 active:scale-95">
                Ouvrir mon carnet personnel
              </button>
            </div>
            <div className="absolute top-[-10%] right-[-10%] p-10 opacity-[0.03] font-arabic text-[15rem] select-none text-white pointer-events-none">ب</div>
          </div>

          <div className="glass-card p-10 space-y-8">
            <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-widest flex items-center gap-3">
              <Award size={18} className="text-amber-500" /> Séances Collectives
            </h3>
            <div className="space-y-4">
               <p className="text-xs text-slate-400 italic text-center">Aucune séance planifiée.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reader Modal / AI Explanation */}
      {selectedXassaid && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] border border-white/20 relative">
            
            {/* Top Bar Mobile/Desktop */}
            <button 
              onClick={handleCloseReader} 
              className="absolute top-6 right-6 p-3 bg-slate-100 hover:bg-rose-100 hover:text-rose-500 rounded-full transition-all z-50 shadow-sm"
            >
              <X size={20} />
            </button>

            {/* Left: Text Content */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto border-r border-slate-50 flex flex-col bg-white">
              <div className="flex items-center gap-4 mb-8">
                 <button onClick={handleCloseReader} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors md:hidden">
                    <ArrowLeft size={20} />
                 </button>
                 <div>
                    <h3 className="text-3xl font-black text-slate-900 leading-tight">{selectedXassaid.title}</h3>
                    <p className="text-emerald-600 font-bold uppercase text-[10px] tracking-[0.2em]">{selectedXassaid.theme}</p>
                 </div>
              </div>

              <div className="flex-1 rounded-[2.5rem] p-8 md:p-12 bg-slate-50/50 border border-slate-100 overflow-y-auto custom-scrollbar shadow-inner relative">
                 <div className="space-y-12 text-slate-800 leading-relaxed text-2xl md:text-3xl font-arabic text-right pb-10">
                    <p className="text-emerald-700 font-bold text-4xl">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
                    <p className="opacity-40 italic font-sans text-lg">صَلَّى اللَّهُ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلَّمَ تَسْلِيمًا</p>
                    <div className="arabic-glow leading-[2]">{selectedXassaid.content}</div>
                    <div className="pt-10 flex justify-center">
                       <span className="px-6 py-2 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Fin de l'extrait</span>
                    </div>
                 </div>

                 {translation && (
                   <div className="mt-12 pt-12 border-t border-emerald-100 animate-in slide-in-from-bottom-8 duration-500">
                     <div className="flex items-center gap-3 mb-8">
                       <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl"><Languages size={18} /></div>
                       <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Traduction Intégrale (IA)</h4>
                     </div>
                     <div className="text-base text-slate-600 leading-[1.8] bg-white p-8 rounded-[2rem] border border-emerald-50 shadow-sm italic font-medium">
                       {translation}
                     </div>
                   </div>
                 )}
              </div>
            </div>

            {/* Right: AI Analysis Panel */}
            <div className="w-full md:w-96 bg-slate-50/50 p-8 md:p-10 flex flex-col overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-4 mb-10 text-emerald-800 shrink-0">
                <div className="p-3 bg-white rounded-2xl shadow-sm"><Sparkles size={28} /></div>
                <div>
                  <h4 className="font-black uppercase text-[10px] tracking-[0.2em]">Majma Assistant</h4>
                  <p className="text-[9px] text-emerald-600 font-bold uppercase">Exégèse Spirituelle</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass-card p-6 md:p-8 space-y-6 bg-white">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Brain size={16} /> Analyse Théologique
                  </h5>
                  {!aiExplanation ? (
                    <button 
                      onClick={() => handleExplain(selectedXassaid.title)}
                      disabled={loadingAi}
                      className="w-full py-4 bg-[#2E8B57] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-900/10 hover:bg-emerald-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {loadingAi ? <Loader2 size={18} className="animate-spin" /> : <Brain size={18} />}
                      {loadingAi ? 'Analyse IA...' : 'Expliquer le texte'}
                    </button>
                  ) : (
                    <div className="text-sm text-slate-600 leading-relaxed italic bg-emerald-50/30 p-5 rounded-2xl border border-emerald-50 animate-in fade-in">
                      {aiExplanation}
                    </div>
                  )}
                </div>

                <div className="glass-card p-6 md:p-8 space-y-6 bg-white">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Languages size={16} /> Linguistique
                  </h5>
                  {!translation ? (
                    <button 
                      onClick={() => handleTranslate(selectedXassaid.content)}
                      disabled={loadingTranslation}
                      className="w-full py-4 bg-white border border-slate-100 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {loadingTranslation ? <Loader2 size={18} className="animate-spin" /> : <Languages size={18} />}
                      {loadingTranslation ? 'Traduction...' : 'Traduire en Français'}
                    </button>
                  ) : (
                    <button onClick={() => setTranslation(null)} className="text-[10px] font-black text-rose-500 hover:underline uppercase tracking-widest">Masquer la traduction</button>
                  )}
                </div>

                <div className="bg-slate-900 p-8 rounded-[2rem] text-white space-y-6 shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6">Support Audio</h5>
                    <div className="flex items-center gap-4">
                      <button className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all active:scale-95 border border-white/10 shadow-inner">
                        <Play size={24} className="fill-current" />
                      </button>
                      <div>
                        <p className="text-sm font-black">Récitation : Khidma</p>
                        <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Format HQ • 12:45</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -right-6 -bottom-6 opacity-5 text-emerald-400 rotate-12 group-hover:scale-125 transition-transform duration-1000"><Volume2 size={100} /></div>
                </div>
              </div>

              <div className="mt-auto pt-10">
                <p className="text-[9px] text-slate-400 font-black uppercase mb-6 tracking-[0.2em] border-b border-slate-100 pb-2">Outils de Révision</p>
                <div className="grid grid-cols-1 gap-3">
                  <button className="w-full p-4 bg-white rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center justify-center gap-3 border border-slate-100 hover:border-emerald-200 transition-all shadow-sm">
                    <FileText size={16} /> Exporter en PDF
                  </button>
                  <button className="w-full p-4 bg-white rounded-2xl text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center justify-center gap-3 border border-slate-100 hover:border-emerald-200 transition-all shadow-sm">
                    <History size={16} /> Reprendre la mémorisation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedagogicalModule;
