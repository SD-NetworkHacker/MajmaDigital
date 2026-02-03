
import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
  label?: string;
  error?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, onChange, label, error }) => {
  
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    onChange(newStart, endDate);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    onChange(startDate, newEnd);
  };

  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{label}</label>}
      
      <div className={`flex items-center gap-2 p-1.5 bg-slate-50 border rounded-2xl transition-all ${error ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500'}`}>
         
         <div className="flex-1 relative group">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="date" 
              value={startDate}
              onChange={handleStartChange}
              className="w-full pl-10 pr-2 py-2.5 bg-white rounded-xl text-xs font-bold text-slate-700 outline-none border border-transparent focus:border-slate-200 transition-all"
            />
         </div>

         <div className="text-slate-300"><ArrowRight size={14}/></div>

         <div className="flex-1 relative group">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="date" 
              value={endDate}
              onChange={handleEndChange}
              min={startDate}
              className="w-full pl-10 pr-2 py-2.5 bg-white rounded-xl text-xs font-bold text-slate-700 outline-none border border-transparent focus:border-slate-200 transition-all"
            />
         </div>

      </div>
      {error && <p className="text-[10px] font-bold text-rose-500 ml-1">{error}</p>}
    </div>
  );
};

export default DateRangePicker;
