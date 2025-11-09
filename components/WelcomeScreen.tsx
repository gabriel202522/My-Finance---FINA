
import React from 'react';
import { Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-gradient-to-br from-indigo-50 to-purple-50 text-center">
      <div className="flex items-center justify-center w-24 h-24 mb-6 bg-white rounded-full shadow-md">
        <Sparkles className="w-12 h-12 text-indigo-500" />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2 font-poppins">MyFinance</h1>
      <p className="text-lg text-gray-600 mb-12">
        Seu assistente financeiro inteligente com IA.
      </p>
      <button
        onClick={onStart}
        className="w-full py-4 px-8 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
      >
        Começar agora
      </button>
    </div>
  );
};

export default WelcomeScreen;
