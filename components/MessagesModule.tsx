
import React, { useState } from 'react';
import { Send, Search, Info, MoreVertical, CheckCheck, Megaphone, Sparkles, Wand2, TrendingUp, MessageSquare } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  time: string;
}

const MessagesModule: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // État initial vide
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [chats, setChats] = useState<any[]>([]); 

  const handleSendMessage = (textOverride?: string) => {
    if (!selectedChat) return;
    const text = textOverride || inputText;
    if (!text.trim()) return;
    
    const newMessage: Message = {
      id: Date.now(),
      text: text,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage]
    }));
    
    setInputText('');
    setAiSuggestions([]);
  };

  const getAiSuggestions = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setAiSuggestions([
        "Bien reçu, merci.",
        "Je valide ce point.",
        "Pouvons-nous en discuter ?"
      ]);
      setIsAiLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100dvh-140px)] min-h-[500px] bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in">
      
      {/* Sidebar Liste des Chats */}
      <div className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col bg-gray-50/30">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-black text-gray-800 mb-6">Messagerie</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="w-full pl-12 pr-4 py-3 bg-white border-none rounded-2xl text-xs font-bold focus:ring-1 focus:ring-[#2E8B57] shadow-sm transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {chats.length > 0 ? (
             chats.map((chat) => (
                <button key={chat.id} onClick={() => setSelectedChat(chat.id)} className="w-full text-left p-4 mb-2 bg-white rounded-xl shadow-sm">
                   {chat.name}
                </button>
             ))
          ) : (
             <div className="text-center text-gray-400 mt-10">
                <MessageSquare size={32} className="mx-auto mb-2 opacity-20"/>
                <p className="text-xs font-bold uppercase">Aucune conversation</p>
             </div>
          )}
        </div>
      </div>

      {/* Zone de Chat Active */}
      <div className="flex-1 flex flex-col bg-gray-50/50 min-w-0 h-full">
        {selectedChat ? (
          <>
            <div className="p-4 md:p-6 bg-white border-b border-gray-100 flex justify-between items-center shadow-sm relative z-10 shrink-0">
               <span className="font-black text-sm">{chats.find(c => c.id === selectedChat)?.name}</span>
            </div>

            <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar space-y-6">
              {(messages[selectedChat] || []).map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 md:p-5 max-w-[85%] md:max-w-[70%] rounded-3xl shadow-sm border ${
                    msg.sender === 'me' ? 'bg-[#2E8B57] text-white rounded-tr-none border-[#2E8B57]' : 'bg-white text-gray-700 rounded-tl-none border-gray-50'
                  }`}>
                    <p className="text-xs md:text-sm leading-loose font-medium">{msg.text}</p>
                    <div className="mt-2 flex justify-end items-center gap-2">
                      <span className={`text-[9px] font-bold ${msg.sender === 'me' ? 'opacity-60' : 'text-gray-400'}`}>{msg.time}</span>
                      {msg.sender === 'me' && <CheckCheck size={12} className="opacity-60" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 md:p-8 bg-white border-t border-gray-50 space-y-4 shrink-0">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                 <button 
                    onClick={getAiSuggestions}
                    disabled={isAiLoading}
                    className="shrink-0 p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-100 transition-all shadow-sm border border-emerald-100 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                 >
                    {isAiLoading ? <TrendingUp size={16} className="animate-spin" /> : <Wand2 size={16} />}
                    IA
                 </button>
                 {aiSuggestions.map((s, i) => (
                    <button key={i} onClick={() => handleSendMessage(s)} className="shrink-0 px-4 py-3 bg-gray-50 rounded-2xl text-[10px] font-bold">{s}</button>
                 ))}
              </div>

              <form className="flex gap-3 bg-gray-50 p-2 rounded-[1.5rem] items-center border border-gray-100" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Écrivez votre message..." className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium px-2" />
                <button type="submit" className="p-3 bg-gray-900 text-white rounded-2xl shadow-xl hover:bg-black transition-all"><Send size={18} /></button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
             <MessageSquare size={48} className="mb-4 opacity-20"/>
             <p className="text-xs font-bold uppercase">Sélectionnez une conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesModule;
