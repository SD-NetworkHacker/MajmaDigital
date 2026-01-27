
import React, { useState } from 'react';
import { 
  Bot, Sparkles, Copy, RefreshCcw, 
  Facebook, Instagram, MessageCircle, Linkedin, Twitter,
  CheckCircle, Loader2, Zap, LayoutTemplate, MessageSquare, PenTool, Image as ImageIcon,
  Smartphone, Hash
} from 'lucide-react';
import { generateSocialPost, generateReplyToComment, generateHooks } from '../../services/geminiService';

const AICommunityManager: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'writer' | 'reply' | 'hooks'>('writer');
  
  // States Writer
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Facebook');
  const [tone, setTone] = useState('Spirituel & Inspirant');
  
  // States Reply
  const [commentInput, setCommentInput] = useState('');
  const [contextInput, setContextInput] = useState('');
  
  // Output & Status
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Handlers
  const handleGenerate = async () => {
    if ((activeTool === 'writer' || activeTool === 'hooks') && !topic.trim()) return;
    if (activeTool === 'reply' && !commentInput.trim()) return;

    setIsGenerating(true);
    setGeneratedContent('');
    
    let content = '';
    if (activeTool === 'writer') {
      content = await generateSocialPost(topic, platform, tone);
    } else if (activeTool === 'reply') {
      content = await generateReplyToComment(commentInput, contextInput);
    } else if (activeTool === 'hooks') {
      content = await generateHooks(topic);
    }

    setGeneratedContent(content);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tools = [
    { id: 'writer', label: 'Studio Rédaction', icon: PenTool },
    { id: 'reply', label: 'Assistant Réponse', icon: MessageSquare },
    { id: 'hooks', label: 'Générateur d\'Accroches', icon: Zap },
  ];

  return (
    <div className="h-[800px] flex flex-col lg:flex-row gap-6 animate-in zoom-in duration-500">
      
      {/* Sidebar Tools */}
      <div className="lg:w-64 flex flex-col gap-2 shrink-0">
        <div className="p-6 bg-slate-900 text-white rounded-[2rem] mb-2 relative overflow-hidden">
           <Bot size={32} className="text-amber-400 mb-4" />
           <h3 className="font-black text-lg leading-tight">CM Intelligence</h3>
           <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest mt-1">Suite Pro v2.0</p>
           <div className="absolute -right-4 -bottom-4 opacity-10"><Sparkles size={80}/></div>
        </div>
        <div className="flex-1 bg-white rounded-[2rem] border border-slate-100 p-4 space-y-2">
           {tools.map(tool => (
             <button
               key={tool.id}
               onClick={() => { setActiveTool(tool.id as any); setGeneratedContent(''); }}
               className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${
                 activeTool === tool.id 
                   ? 'bg-amber-50 text-amber-700 border border-amber-100 shadow-sm' 
                   : 'text-slate-500 hover:bg-slate-50'
               }`}
             >
               <tool.icon size={18} />
               <span className="text-xs font-black uppercase tracking-wide">{tool.label}</span>
             </button>
           ))}
        </div>
      </div>

      {/* Main Config Area */}
      <div className="flex-1 glass-card p-8 bg-white flex flex-col gap-6 overflow-y-auto custom-scrollbar">
         {/* HEADER TOOL */}
         <div className="flex justify-between items-center border-b border-slate-50 pb-4">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
               {tools.find(t => t.id === activeTool)?.icon && React.createElement(tools.find(t => t.id === activeTool)!.icon, { size: 24, className: 'text-amber-500' })}
               {tools.find(t => t.id === activeTool)?.label}
            </h2>
            {isGenerating && <span className="flex items-center gap-2 text-[10px] font-black text-amber-600 animate-pulse"><Loader2 size={12} className="animate-spin"/> IA au travail...</span>}
         </div>

         {/* INPUTS DYNAMIC */}
         <div className="space-y-6">
            {activeTool === 'writer' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plateforme</label>
                      <div className="flex gap-2">
                         {[
                           { id: 'Facebook', icon: Facebook }, { id: 'Instagram', icon: Instagram }, 
                           { id: 'WhatsApp', icon: MessageCircle }, { id: 'LinkedIn', icon: Linkedin }
                         ].map(p => (
                           <button 
                             key={p.id} 
                             onClick={() => setPlatform(p.id)}
                             className={`p-3 rounded-xl border transition-all ${platform === p.id ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-100 text-slate-400'}`}
                           >
                             <p.icon size={18} />
                           </button>
                         ))}
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tonalité</label>
                      <select 
                        value={tone} 
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-amber-400"
                      >
                         <option>Spirituel & Inspirant</option>
                         <option>Informatif & Sérieux</option>
                         <option>Dynamique & Jeune</option>
                         <option>Urgent & Mobilisateur</option>
                      </select>
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sujet ou Idée du Post</label>
                   <textarea 
                     value={topic}
                     onChange={(e) => setTopic(e.target.value)}
                     className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-amber-500/20 outline-none resize-none"
                     placeholder="Ex: Retour en images sur le dernier Ziar, remercier les donateurs..."
                   />
                </div>
              </>
            )}

            {activeTool === 'reply' && (
              <>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commentaire du Membre</label>
                   <textarea 
                     value={commentInput}
                     onChange={(e) => setCommentInput(e.target.value)}
                     className="w-full h-24 p-4 bg-rose-50/30 border border-rose-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-rose-500/20 outline-none resize-none"
                     placeholder="Collez le commentaire ici..."
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contexte (Optionnel)</label>
                   <input 
                     type="text"
                     value={contextInput}
                     onChange={(e) => setContextInput(e.target.value)}
                     className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none"
                     placeholder="Ex: Post sur les retards de cotisation..."
                   />
                </div>
              </>
            )}

            {activeTool === 'hooks' && (
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sujet à viraliser</label>
                  <input 
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-amber-400"
                    placeholder="Ex: L'importance de la présence aux réunions..."
                  />
               </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
            >
               {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
               {activeTool === 'reply' ? 'Analyser & Répondre' : 'Générer Contenu'}
            </button>
         </div>
      </div>

      {/* Preview & Results Area (Phone Mockup Style) */}
      <div className="lg:w-96 glass-card bg-slate-50 border-slate-200 flex flex-col overflow-hidden relative">
         <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><Smartphone size={14}/> Aperçu Mobile</span>
            <div className="flex gap-2">
               <button onClick={handleCopy} className="p-2 text-slate-400 hover:text-amber-500 transition-colors" title="Copier"><Copy size={16}/></button>
               {copied && <span className="text-[9px] font-bold text-emerald-500 animate-in fade-in">Copié !</span>}
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {generatedContent ? (
               <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                     <div>
                        <div className="h-2 w-20 bg-slate-200 rounded mb-1"></div>
                        <div className="h-1.5 w-12 bg-slate-100 rounded"></div>
                     </div>
                  </div>
                  <div className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-medium">
                     {generatedContent}
                  </div>
                  {(platform === 'Instagram' || activeTool === 'hooks') && (
                     <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-2 flex items-center gap-1"><ImageIcon size={10}/> Suggestion Visuelle IA</p>
                        <p className="text-[10px] text-slate-500 italic">"Utilisez une photo grand angle de l'assemblée avec un filtre chaud pour accentuer l'aspect fraternel."</p>
                     </div>
                  )}
                  <div className="flex gap-2 pt-2">
                     <div className="h-6 w-16 bg-slate-100 rounded-full"></div>
                     <div className="h-6 w-16 bg-slate-100 rounded-full"></div>
                  </div>
               </div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                  <LayoutTemplate size={48} className="mb-4"/>
                  <p className="text-xs font-bold uppercase tracking-widest">Le contenu généré apparaîtra ici</p>
               </div>
            )}
         </div>

         {generatedContent && (
            <div className="p-4 bg-white border-t border-slate-200">
               <button className="w-full py-3 border-2 border-slate-900 text-slate-900 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                  Ajouter au Planning
               </button>
            </div>
         )}
      </div>

    </div>
  );
};

export default AICommunityManager;
