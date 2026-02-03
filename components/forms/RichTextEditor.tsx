
import React, { useState } from 'react';
import { Bold, Italic, List, ListOrdered, Link, Image as ImageIcon, Eye, Code, Heading } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, label, placeholder, error }) => {
  const [isPreview, setIsPreview] = useState(false);

  const insertFormat = (startTag: string, endTag: string = '') => {
    const textarea = document.getElementById('rte-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = `${before}${startTag}${selection}${endTag}${after}`;
    onChange(newText);
    
    // Restore focus
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + startTag.length, end + startTag.length);
    }, 0);
  };

  return (
    <div className="w-full space-y-2">
      {label && <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{label}</label>}
      
      <div className={`border rounded-2xl overflow-hidden bg-white transition-all ${error ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500'}`}>
        
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-slate-100 bg-slate-50/50">
           <button type="button" onClick={() => insertFormat('**', '**')} className="p-2 rounded-lg hover:bg-white text-slate-500 hover:text-slate-800 transition-all" title="Gras"><Bold size={14}/></button>
           <button type="button" onClick={() => insertFormat('_', '_')} className="p-2 rounded-lg hover:bg-white text-slate-500 hover:text-slate-800 transition-all" title="Italique"><Italic size={14}/></button>
           <div className="w-px h-4 bg-slate-200 mx-1"></div>
           <button type="button" onClick={() => insertFormat('# ')} className="p-2 rounded-lg hover:bg-white text-slate-500 hover:text-slate-800 transition-all" title="Titre"><Heading size={14}/></button>
           <button type="button" onClick={() => insertFormat('- ')} className="p-2 rounded-lg hover:bg-white text-slate-500 hover:text-slate-800 transition-all" title="Liste"><List size={14}/></button>
           <button type="button" onClick={() => insertFormat('1. ')} className="p-2 rounded-lg hover:bg-white text-slate-500 hover:text-slate-800 transition-all" title="Liste numérotée"><ListOrdered size={14}/></button>
           <div className="w-px h-4 bg-slate-200 mx-1"></div>
           <button type="button" onClick={() => insertFormat('[', '](url)')} className="p-2 rounded-lg hover:bg-white text-slate-500 hover:text-slate-800 transition-all" title="Lien"><Link size={14}/></button>
           
           <div className="flex-1"></div>
           
           <button 
             type="button" 
             onClick={() => setIsPreview(!isPreview)} 
             className={`p-2 rounded-lg transition-all flex items-center gap-2 text-[10px] font-bold uppercase ${isPreview ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-white text-slate-500'}`}
           >
             {isPreview ? <><Code size={14}/> Éditer</> : <><Eye size={14}/> Aperçu</>}
           </button>
        </div>

        {/* Editor Area */}
        <div className="relative min-h-[150px]">
          {isPreview ? (
            <div className="p-4 prose prose-sm prose-slate max-w-none text-slate-600">
               {/* Very basic markdown rendering for preview */}
               {value.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) return <h3 key={i} className="font-black text-slate-800 text-lg mt-2 mb-1">{line.replace('# ', '')}</h3>;
                  if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc">{line.replace('- ', '')}</li>;
                  if (line.startsWith('**')) return <p key={i}><strong>{line.replace(/\*\*/g, '')}</strong></p>;
                  return <p key={i} className="min-h-[1rem]">{line}</p>;
               })}
               {!value && <p className="text-slate-400 italic">Rien à afficher</p>}
            </div>
          ) : (
            <textarea
              id="rte-textarea"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-full min-h-[150px] p-4 bg-transparent border-none outline-none resize-y text-sm font-medium text-slate-700"
            />
          )}
        </div>
      </div>
      {error && <p className="text-[10px] font-bold text-rose-500 ml-1">{error}</p>}
    </div>
  );
};

export default RichTextEditor;
