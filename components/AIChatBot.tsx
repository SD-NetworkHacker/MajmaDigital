
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Mic, Sparkles, Volume2, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { startChat, transcribeAudio, generateSpeech, decodeBase64, decodeAudioData } from '../services/geminiService';

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<any>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

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
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#2E8B57] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-[150] border-4 border-white"
      >
        {isOpen ? <X /> : <MessageSquare />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col z-[150] animate-in slide-in-from-bottom-4">
          <div className="p-4 bg-emerald-700 text-white rounded-t-3xl flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Assistant Majma</h3>
              <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Intelligence Spirituelle</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center">
                  <MessageSquare size={32} />
                </div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Posez votre question</p>
                <div className="grid grid-cols-1 gap-2">
                  <button onClick={() => handleSend("Qu'est-ce que le Dahira Majmahoun Nourayni ?")} className="text-[10px] p-2 bg-gray-50 rounded-xl hover:bg-emerald-50 text-gray-600 font-bold border border-gray-100">C'est quoi Majma ?</button>
                  <button onClick={() => handleSend("Quels sont les bienfaits du Xassaid Jawartu ?")} className="text-[10px] p-2 bg-gray-50 rounded-xl hover:bg-emerald-50 text-gray-600 font-bold border border-gray-100">Signification de Jawartu</button>
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 max-w-[85%] rounded-2xl text-xs leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-[#2E8B57] text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                  {m.text}
                  {m.role === 'model' && !m.text.includes("quota atteint") && (
                    <button onClick={() => speak(m.text)} className="ml-2 p-1 opacity-50 hover:opacity-100"><Volume2 size={12} /></button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-[#2E8B57]">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-[10px] font-bold uppercase">L'IA réfléchit...</span>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-50">
            {error && (
              <div className="mb-2 p-2 bg-rose-50 border border-rose-100 rounded-xl text-[10px] text-rose-600 flex items-center gap-2 animate-in fade-in">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
              <button 
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                className={`p-2 rounded-xl transition-colors ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-emerald-600'}`}
              >
                <Mic size={18} />
              </button>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Votre message..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-xs px-2"
              />
              <button 
                onClick={() => handleSend()}
                className="p-2 bg-[#2E8B57] text-white rounded-xl hover:bg-emerald-700 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBot;
