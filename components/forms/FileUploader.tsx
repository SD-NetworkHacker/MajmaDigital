import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, X, FileImage, CheckCircle, Loader2, FileText } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File | string) => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  preview?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileSelect, 
  label = "Déposer un fichier", 
  accept = "image/*,application/pdf", 
  maxSizeMB = 5,
  preview = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxWidth = 1024;
          const scaleSize = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scaleSize;
          
          if (!ctx) return reject('Canvas error');
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // Compression
          resolve(dataUrl);
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const processFile = async (selectedFile: File) => {
    setError(null);
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`Le fichier dépasse la taille limite de ${maxSizeMB}MB`);
      return;
    }

    setFile(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
      setIsCompressing(true);
      try {
        const compressed = await compressImage(selectedFile);
        setPreviewUrl(compressed);
        onFileSelect(compressed); // Return base64
      } catch (err) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
        onFileSelect(selectedFile); // Fallback to raw file
      } finally {
        setIsCompressing(false);
      }
    } else {
      setPreviewUrl(null);
      onFileSelect(selectedFile);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = '';
    onFileSelect('');
  };

  return (
    <div className="w-full">
      <div 
        className={`relative border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer group ${
          error ? 'border-rose-300 bg-rose-50' :
          isDragging ? 'border-emerald-500 bg-emerald-50' : 
          file ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input 
          ref={inputRef}
          type="file" 
          className="hidden" 
          accept={accept}
          onChange={handleChange}
        />

        {file ? (
          <div className="flex items-center gap-4">
             {previewUrl ? (
               <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-white">
                 <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
               </div>
             ) : (
               <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center shrink-0">
                 <FileText size={24} className="text-slate-500" />
               </div>
             )}
             
             <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
               <div className="flex items-center gap-2 mt-1">
                 <span className="text-[10px] text-slate-500 font-medium">{(file.size / 1024).toFixed(1)} KB</span>
                 {isCompressing ? (
                   <span className="flex items-center gap-1 text-[10px] text-amber-600 font-bold"><Loader2 size={10} className="animate-spin"/> Compression...</span>
                 ) : (
                   <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold"><CheckCircle size={10}/> Prêt</span>
                 )}
               </div>
             </div>

             <button onClick={clearFile} className="p-2 hover:bg-rose-100 rounded-full text-slate-400 hover:text-rose-500 transition-colors">
               <X size={18} />
             </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-4">
             <div className={`p-4 rounded-full mb-3 transition-colors ${isDragging ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-400 group-hover:text-emerald-500 group-hover:shadow-md'}`}>
                <UploadCloud size={24} />
             </div>
             <p className="text-sm font-bold text-slate-700">{isDragging ? 'Relâchez pour uploader' : label}</p>
             <p className="text-[10px] text-slate-400 mt-1">Glissez-déposez ou cliquez (Max {maxSizeMB}MB)</p>
          </div>
        )}
      </div>
      {error && <p className="text-[10px] font-bold text-rose-500 mt-2 ml-1">{error}</p>}
    </div>
  );
};

export default FileUploader;