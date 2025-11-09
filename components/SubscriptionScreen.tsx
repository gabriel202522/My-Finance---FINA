import React from 'react';
import { Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubscriptionScreenProps {
  onBack: () => void;
  onSubscribe: () => void;
}

const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({ onBack, onSubscribe }) => {
    
    const handleSubscribeAndRedirect = () => {
        // This marks the user as subscribed in the app's state for simulation purposes
        onSubscribe();
    };

  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="text-center my-auto">
        <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { type: 'spring', delay: 0.1 } }}
            className="flex items-center justify-center w-20 h-20 mb-6 bg-white rounded-full shadow-lg mx-auto"
        >
            <Star className="w-10 h-10 text-yellow-500" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3 font-poppins">Apoie o My Finance</h1>
        <p className="text-gray-600 mb-8">
          Sua assinatura de R$9,99/mês nos ajuda a manter a plataforma funcionando e a trazer novas ferramentas para melhorar suas finanças. Cancele a qualquer momento.
        </p>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            className="space-y-3 text-left bg-white/50 p-6 rounded-2xl mb-8"
        >
          <p className="flex items-center text-gray-800"><Check className="w-5 h-5 text-green-500 mr-3" /> Assistente FINA ilimitada</p>
          <p className="flex items-center text-gray-800"><Check className="w-5 h-5 text-green-500 mr-3" /> Relatórios e gráficos avançados</p>
          <p className="flex items-center text-gray-800"><Check className="w-5 h-5 text-green-500 mr-3" /> Atualizações funcionais constantes</p>
          <p className="flex items-center text-gray-800"><Check className="w-5 h-5 text-green-500 mr-3" /> Suporte direto da nossa equipe</p>
        </motion.div>
        
        <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
            href="https://pay.cakto.com.br/3bdertq_641640"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleSubscribeAndRedirect}
            className="block w-full py-4 px-8 mb-4 bg-indigo-600 text-white font-bold rounded-full shadow-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
            Assinar por R$ 9,99/mês
        </motion.a>

        <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.7 } }}
            onClick={onBack}
            className="w-full text-indigo-600 font-semibold py-2"
        >
            Agora não
        </motion.button>
      </div>
    </div>
  );
};

export default SubscriptionScreen;