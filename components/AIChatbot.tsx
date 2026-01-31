
import React, { useState, useRef, useEffect } from 'react';
import { getBurgerRecommendation } from '../services/geminiService';
import { ChatMessage } from '../types';
import BurgerWarriorLogo from './BurgerWarriorLogo';

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '¡Saludos, valiente comensal! Soy el Guerrero de Origen. ¿Qué tesoro del menú deseas conquistar hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const response = await getBurgerRecommendation(userMsg);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-[#ff9f1c] w-16 h-16 rounded-full shadow-[0_0_30px_rgba(255,159,28,0.5)] flex items-center justify-center z-[100] hover:scale-110 transition-transform animate-bounce p-2"
      >
        <BurgerWarriorLogo size="sm" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] max-w-[calc(100vw-48px)] h-[500px] bg-[#1a1a1d] border-2 border-[#ff9f1c] rounded-3xl shadow-2xl flex flex-col z-[100] overflow-hidden animate-slide-up">
          <div className="bg-[#ff9f1c] p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <BurgerWarriorLogo size="sm" className="w-8 h-8" />
              <h3 className="text-black font-black uppercase italic text-sm">Guerrero de Origen</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-black font-bold p-1">✕</button>
          </div>

          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                  ? 'bg-[#2ec4b6] text-white rounded-tr-none' 
                  : 'bg-[#333] text-gray-200 rounded-tl-none border border-white/5 shadow-md'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#333] p-3 rounded-2xl rounded-tl-none">
                  <span className="flex space-x-1">
                    <span className="w-2 h-2 bg-[#ff9f1c] rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-[#ff9f1c] rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-[#ff9f1c] rounded-full animate-bounce delay-150"></span>
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-[#252525] flex space-x-2">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tengo hambre de..."
              className="flex-1 bg-[#333] border border-gray-600 text-white p-3 rounded-xl outline-none focus:border-[#ff9f1c] text-sm"
            />
            <button 
              onClick={handleSend}
              className="bg-[#ff9f1c] w-12 rounded-xl text-black font-black flex items-center justify-center hover:bg-white transition-colors"
            >
              ➔
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.19, 1, 0.22, 1); }
      `}</style>
    </>
  );
};

export default AIChatbot;
