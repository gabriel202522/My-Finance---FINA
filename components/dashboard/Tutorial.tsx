import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

interface TutorialProps {
  onComplete: () => void;
}

const tutorialSteps = [
  {
    text: "Bem-vindo(a)! Estamos muito felizes por ter você aqui. Este é o seu painel, onde você adiciona gastos e ganhos diários. É super rápido! 💨",
    position: { top: '150px', left: '16px', right: '16px' }
  },
  {
    text: "Aqui você acompanha o progresso das suas metas. Ver essas barrinhas crescendo é muito bom! 💪",
    position: { top: '350px', left: '16px', right: '16px' }
  },
  {
    text: "E aqui embaixo você navega entre os gráficos e relatórios. Explore tudo para ter o controle total! 🧭",
    position: { bottom: '90px', left: '16px', right: '16px' }
  },
  {
    text: "Tem alguma dúvida? Toque aqui para conversar com a FINA, sua assistente com IA pronta para te dar dicas e insights financeiros exclusivos! 🤖✨",
    position: { top: '20px', left: 'auto', right: '80px', width: '250px' }
  },
  {
    text: "Para mantermos a FINA sempre inteligente e o app evoluindo, o My Finance funciona com uma assinatura mensal de R$9,99. Você pode cancelar quando quiser!",
    position: { top: '30%', left: '16px', right: '16px' }
  }
];

const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('hasSeenFinaTutorial', 'true');
      onComplete();
    }
  };
  
  const currentStep = tutorialSteps[step];
  
  const handleSkip = () => {
    localStorage.setItem('hasSeenFinaTutorial', 'true');
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black bg-opacity-60 z-40"
    >
      <AnimatePresence>
        <motion.div
          key={step}
          className="absolute p-4"
          style={currentStep.position}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-indigo-500 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="bg-white p-4 rounded-xl rounded-tl-none shadow-xl relative">
                <p className="text-gray-800 font-medium">{currentStep.text}</p>
                <div className="flex justify-end mt-4">
                    <button onClick={handleNext} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg text-sm">
                        {step === tutorialSteps.length - 1 ? 'Entendi!' : 'Seguir'}
                    </button>
                </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <button onClick={handleSkip} className="absolute top-4 right-4 p-2 bg-white rounded-full z-50">
        <X className="w-5 h-5 text-gray-700" />
      </button>
    </motion.div>
  );
};

export default Tutorial;