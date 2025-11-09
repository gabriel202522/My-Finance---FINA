
import React, { useState, useRef, useEffect } from 'react';
import { UserData, ChatMessage } from '../types';
import { getFinaResponse } from '../services/geminiService';
import { ArrowLeft, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FinaAssistantProps {
  userData: UserData;
  onBack: () => void;
}

const FinaAssistant: React.FC<FinaAssistantProps> = ({ userData, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'fina', text: 'Olá! Como posso te ajudar a organizar suas finanças hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatHistory = useRef<{ role: string; parts: { text: string }[] }[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [messages]);

  const quickReplies = [
    "Qual meu maior gasto?",
    "Como posso economizar?",
    "Analise minha última semana."
  ];

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    chatHistory.current.push({ role: 'user', parts: [{ text: messageText }] });
    
    try {
        const finaResponseText = await getFinaResponse(userData, chatHistory.current, messageText);
        const finaMessage: ChatMessage = { sender: 'fina', text: finaResponseText };
        setMessages(prev => [...prev, finaMessage]);
        chatHistory.current.push({ role: 'model', parts: [{ text: finaResponseText }] });
    } catch (error) {
        const errorMessage: ChatMessage = { sender: 'fina', text: 'Desculpe, estou com um problema para me conectar. Tente novamente mais tarde.' };
        setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <header className="flex items-center p-4 bg-white shadow-sm z-10">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 ml-4">FINA</h2>
      </header>

      <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto space-y-4">
        <AnimatePresence>
            {messages.map((msg, index) => (
            <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
                {msg.text}
                </div>
            </motion.div>
            ))}
            {isLoading && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
            >
                <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-white text-gray-800 rounded-bl-none shadow-sm">
                    <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                    </div>
                </div>
            </motion.div>
            )}
        </AnimatePresence>
      </div>
        
      <div className="p-4 bg-white border-t">
        <div className="flex space-x-2 mb-3 overflow-x-auto pb-2">
            {quickReplies.map(reply => (
                <button key={reply} onClick={() => handleSend(reply)} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-full whitespace-nowrap hover:bg-indigo-100 transition">
                    {reply}
                </button>
            ))}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Converse com a FINA..."
            className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button onClick={() => handleSend(input)} disabled={isLoading || !input.trim()} className="p-3 bg-indigo-600 text-white rounded-full disabled:bg-gray-400 transition-colors">
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinaAssistant;
