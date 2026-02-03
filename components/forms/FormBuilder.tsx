
import React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Loader2, Save } from 'lucide-react';
import { SearchableSelect, MultiSelect } from './SelectInputs';
import DateRangePicker from './DateRangePicker';
import RichTextEditor from './RichTextEditor';
import FileUploader from './FileUploader';

// --- TYPES ---
export type FieldType = 'text' | 'number' | 'email' | 'tel' | 'textarea' | 'select' | 'multi-select' | 'date-range' | 'rich-text' | 'file';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[]; // Pour select
  validation?: yup.AnySchema; // Règle Yup spécifique
  width?: 'full' | 'half' | 'third';
  defaultValue?: any;
}

interface FormBuilderProps {
  fields: FormField[];
  onSubmit: (data: any) => Promise<void> | void;
  submitLabel?: string;
  isLoading?: boolean;
  defaultValues?: Record<string, any>;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ 
  fields, 
  onSubmit, 
  submitLabel = "Enregistrer", 
  isLoading = false,
  defaultValues = {}
}) => {
  
  // 1. Construction du Schema Yup dynamique
  const validationSchema = yup.object().shape(
    fields.reduce((acc, field) => {
      if (field.validation) {
        acc[field.name] = field.validation;
      }
      return acc;
    }, {} as Record<string, any>)
  );

  // 2. Setup Hook Form
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...fields.reduce((acc, f) => ({ ...acc, [f.name]: f.defaultValue || '' }), {}),
      ...defaultValues
    }
  });

  // 3. Render Helper
  const renderField = (field: FormField) => {
    const errorMsg = errors[field.name]?.message as string | undefined;

    switch (field.type) {
      case 'select':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <SearchableSelect
                label={field.label}
                options={field.options || []}
                value={value}
                onChange={onChange}
                placeholder={field.placeholder}
                error={errorMsg}
              />
            )}
          />
        );

      case 'multi-select':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <MultiSelect
                label={field.label}
                options={field.options || []}
                value={value || []}
                onChange={onChange}
                placeholder={field.placeholder}
                error={errorMsg}
              />
            )}
          />
        );
      
      case 'date-range':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <DateRangePicker
                label={field.label}
                startDate={value?.start || ''}
                endDate={value?.end || ''}
                onChange={(start, end) => onChange({ start, end })}
                error={errorMsg}
              />
            )}
          />
        );

      case 'rich-text':
        return (
          <Controller
            name={field.name}
            control={control}
            render={({ field: { onChange, value } }) => (
              <RichTextEditor
                label={field.label}
                value={value}
                onChange={onChange}
                placeholder={field.placeholder}
                error={errorMsg}
              />
            )}
          />
        );

      case 'file':
        return (
           <Controller
             name={field.name}
             control={control}
             render={({ field: { onChange } }) => (
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{field.label}</label>
                 <FileUploader 
                   onFileSelect={onChange} 
                   label={field.placeholder} 
                 />
                 {errorMsg && <p className="text-[10px] font-bold text-rose-500 ml-1">{errorMsg}</p>}
               </div>
             )}
           />
        );
      
      case 'textarea':
        return (
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{field.label}</label>
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <textarea
                  value={value}
                  onChange={onChange}
                  placeholder={field.placeholder}
                  className={`w-full p-4 bg-slate-50 border rounded-2xl text-sm font-medium text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none h-32 ${
                    errorMsg ? 'border-rose-300 bg-rose-50' : 'border-transparent focus:border-emerald-500'
                  }`}
                />
              )}
            />
            {errorMsg && <p className="text-[10px] font-bold text-rose-500 ml-1">{errorMsg}</p>}
          </div>
        );

      default: // text, number, email, tel
        return (
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{field.label}</label>
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <input
                  type={field.type}
                  value={value}
                  onChange={onChange}
                  placeholder={field.placeholder}
                  className={`w-full p-3.5 bg-slate-50 border rounded-2xl text-sm font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all ${
                    errorMsg ? 'border-rose-300 bg-rose-50' : 'border-transparent focus:border-emerald-500'
                  }`}
                />
              )}
            />
            {errorMsg && <p className="text-[10px] font-bold text-rose-500 ml-1">{errorMsg}</p>}
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((field, index) => (
          <div 
            key={field.name + index} 
            className={`
              ${field.width === 'full' ? 'col-span-1 md:col-span-2 lg:col-span-3' : ''}
              ${field.width === 'half' ? 'col-span-1 md:col-span-1 lg:col-span-1.5' : ''} 
            `}
          >
            {renderField(field)}
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-slate-100 flex justify-end">
        <button 
          type="submit" 
          disabled={isLoading}
          className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-black transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isLoading ? 'Traitement...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default FormBuilder;
