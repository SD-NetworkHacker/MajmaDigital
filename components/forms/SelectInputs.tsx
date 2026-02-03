
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

interface SearchableSelectProps extends SelectProps {
  value: string;
  onChange: (value: string) => void;
}

interface MultiSelectProps extends SelectProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({ 
  options, value, onChange, label, placeholder = "Sélectionner...", error, disabled 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find(o => o.value === value)?.label;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full space-y-2" ref={wrapperRef}>
       {label && <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{label}</label>}
       <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={`w-full text-left px-4 py-3.5 bg-slate-50 border rounded-2xl flex items-center justify-between transition-all ${
              error ? 'border-rose-300 ring-2 ring-rose-100' : 
              isOpen ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-white' : 'border-slate-200 hover:bg-slate-100'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
             <span className={`text-sm font-bold ${value ? 'text-slate-800' : 'text-slate-400'}`}>
               {selectedLabel || placeholder}
             </span>
             <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
               <div className="p-2 border-b border-slate-50 relative">
                  <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-2 py-2 bg-slate-50 rounded-lg text-xs font-medium outline-none focus:bg-white transition-colors"
                    placeholder="Rechercher..."
                    autoFocus
                  />
               </div>
               <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                  {filteredOptions.length > 0 ? filteredOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { onChange(opt.value); setIsOpen(false); setSearch(''); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold flex items-center justify-between transition-colors ${
                        value === opt.value ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                       {opt.label}
                       {value === opt.value && <Check size={14} />}
                    </button>
                  )) : (
                    <p className="text-center text-[10px] text-slate-400 py-4 italic">Aucun résultat</p>
                  )}
               </div>
            </div>
          )}
       </div>
       {error && <p className="text-[10px] font-bold text-rose-500 ml-1">{error}</p>}
    </div>
  );
};

export const MultiSelect: React.FC<MultiSelectProps> = ({ 
  options, value = [], onChange, label, placeholder = "Sélectionner...", error, disabled 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange(value.filter(v => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  const removeTag = (e: React.MouseEvent, optValue: string) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== optValue));
  };

  return (
    <div className="w-full space-y-2" ref={wrapperRef}>
       {label && <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{label}</label>}
       <div className="relative">
          <div
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={`w-full min-h-[48px] px-2 py-1.5 bg-slate-50 border rounded-2xl flex flex-wrap items-center gap-1.5 cursor-pointer transition-all ${
              error ? 'border-rose-300 ring-2 ring-rose-100' : 
              isOpen ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-white' : 'border-slate-200 hover:bg-slate-100'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
             {value.length > 0 ? value.map(val => {
               const opt = options.find(o => o.value === val);
               return (
                 <span key={val} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 shadow-sm animate-in zoom-in duration-200">
                    {opt?.label || val}
                    <button onClick={(e) => removeTag(e, val)} className="p-0.5 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-colors"><X size={10}/></button>
                 </span>
               );
             }) : (
               <span className="text-sm text-slate-400 font-bold px-2">{placeholder}</span>
             )}
             <div className="flex-1"></div>
             <ChevronDown size={16} className={`text-slate-400 mr-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
               <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                  {options.map(opt => {
                    const isSelected = value.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleOption(opt.value)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold flex items-center justify-between transition-colors ${
                          isSelected ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                         {opt.label}
                         {isSelected && <Check size={14} />}
                      </button>
                    )
                  })}
               </div>
            </div>
          )}
       </div>
       {error && <p className="text-[10px] font-bold text-rose-500 ml-1">{error}</p>}
    </div>
  );
};
