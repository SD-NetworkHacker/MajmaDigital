
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Mic, Sparkles, Volume2, MapPin, Loader2, AlertCircle, Maximize2, Minimize2 } from 'lucide-react';
import { startChat, transcribeAudio, generateSpeech, decodeBase64, decodeAudioData } from '../services/geminiService';

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatRef = useRef<any>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const toggleChat = () => {
    if (!isOpen && !chatRef.current) {
      try {
        chatRef.current = startChat();
      } catch (e) {
        console.error("Chat init failed", e);
      }
    }
    setIsOpen(!isOpen);
    setError(null);
    if (!isOpen) setIsExpanded(false); // Reset expansion on open
  };

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || input;
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      if (!chatRef.current) chatRef.current = startChat();
      const result = await chatRef.current.sendMessage({ message: text });
      setMessages(prev => [...prev, { role: 'model', text: result.text }]);
    } catch (error: any) {
      const isQuotaError = error?.message?.includes('429') || error?.status === 429;
      const errorMsg = isQuotaError 
        ? "Le service est très sollicité actuellement (quota atteint). Veuillez patienter quelques minutes avant de reposer votre question."
        : "Désolé, j'ai rencontré une difficulté technique. Veuillez réessayer.";
      
      setError(errorMsg);
      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setIsLoading(true);
          const transcription = await transcribeAudio(base64Audio);
          setIsLoading(false);
          if (transcription) handleSend(transcription);
        };
      };
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false); mediaRecorder.current.stream.getTracks().forEach(t => t.stop());
    }
  };

  const speak = async (text: string) => {
    const base64 = await generateSpeech(text);
    if (base64) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const buffer = await decodeAudioData(decodeBase64(base64), ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    }
  };

  return (
    <>
      <button 
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#2E8B57] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-[150] border-4 border-white group"
        title="Assistant Majma"
      >
        {isOpen ? <X /> : <MessageSquare />}
        {!isOpen && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
      </button>

      {isOpen && (
        <div className={`fixed z-[150] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col animate-in slide-in-from-bottom-4 duration-300 transition-all ${
          isExpanded 
            ? 'top-4 bottom-24 left-4 right-6 md:left-auto md:w-[600px]' 
            : 'bottom-24 right-6 w-[90vw] md:w-96 h-[500px]'
        }`}>
          {/* Header */}
          <div className="p-4 bg-emerald-700 text-white rounded-t-3xl flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md shadow-inner">
                <Sparkles size={20} className="text-emerald-100" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Assistant Majma</h3>
                <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold flex items-center gap-1">
                   <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> En ligne
                </p>
              </div>
            </div>
            <div className="flex gap-2">
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80">
                   {isExpanded ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}
                </button>
                <button onClick={toggleChat} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80">
                   <X size={18} />
                </button>
            </div>
          </div>

          {/* Chat Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scroll-smooth">
            {messages.length === 0 && (
              <div className="text-center py-10 space-y-4 animate-in zoom-in">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-emerald-100 shadow-sm">
                  <MessageSquare size={32} />
                </div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Posez votre question</p>
                <div className="grid grid-cols-1 gap-2 max-w-xs mx-auto">
                  <button onClick={() => handleSend("Qu'est-ce que le Dahira Majmahoun Nourayni ?")} className="text-[10px] p-3 bg-white rounded-xl hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-gray-600 font-bold border border-gray-100 transition-all text-left">
                    ✨ C'est quoi Majma ?
                  </button>
                  <button onClick={() => handleSend("Quels sont les bienfaits du Xassaid Jawartu ?")} className="text-[10px] p-3 bg-white rounded-xl hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-gray-600 font-bold border border-gray-100 transition-all text-left">
                    📖 Signification de Jawartu
                  </button>
                </div>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`p-3.5 max-w-[85%] rounded-2xl text-xs leading-relaxed shadow-sm relative ${
                   m.role === 'user' 
                     ? 'bg-emerald-600 text-white rounded-tr-none' 
                     : 'bg-white text-gray-700 rounded-tl-none border border-gray-100'
                }`}>
                  {m.text}
                  {m.role === 'model' && !m.text.includes("quota atteint") && (
                    <button onClick={() => speak(m.text)} className="absolute -right-6 top-2 p-1 text-slate-400 hover:text-emerald-600 transition-colors">
                        <Volume2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-3">
                 <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center">
                    <Sparkles size={14} className="text-emerald-500 animate-spin"/>
                 </div>
                 <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                    <div className="flex gap-1">
                       <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                       <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
                       <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                 </div>
              </div>
            )}
          </div>

          {/* Footer Input */}
          <div className="p-4 border-t border-gray-50 bg-white rounded-b-3xl">
            {error && (
              <div className="mb-3 p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-[10px] text-rose-600 flex items-center gap-2 animate-in fade-in">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 focus-within:border-emerald-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
              <button 
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className={`p-2 rounded-xl transition-all active:scale-95 ${isRecording ? 'bg-red-500 text-white shadow-md animate-pulse' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
              >
                <Mic size={18} />
              </button>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Votre message..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-xs px-2 font-medium text-slate-700 placeholder:text-slate-400"
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBot;
