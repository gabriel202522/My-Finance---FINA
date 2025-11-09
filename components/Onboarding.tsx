import React, { useState } from 'react';
import { UserData, Goal } from '../types';
import { ShieldCheck, Plane, Home, Handshake, GraduationCap, BarChart, User, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingProps {
  onComplete: (data: UserData) => void;
}

const goalOptions = [
  { id: 'emergency', name: 'Fundo de Emergência', icon: <ShieldCheck className="w-6 h-6" /> },
  { id: 'travel', name: 'Viagem dos Sonhos', icon: <Plane className="w-6 h-6" /> },
  { id: 'home', name: 'Casa Própria', icon: <Home className="w-6 h-6" /> },
  { id: 'debt', name: 'Quitar Dívidas', icon: <Handshake className="w-6 h-6" /> },
  { id: 'education', name: 'Educação', icon: <GraduationCap className="w-6 h-6" /> },
  { id: 'investments', name: 'Investimentos', icon: <BarChart className="w-6 h-6" /> },
  { id: 'personal', name: 'Plano Pessoal', icon: <User className="w-6 h-6" /> },
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [goalDetails, setGoalDetails] = useState<Record<string, { current: string; target: string }>>({});

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId) ? prev.filter(id => id !== goalId) : [...prev, goalId]
    );
    if (!goalDetails[goalId]) {
      setGoalDetails(prev => ({ ...prev, [goalId]: { current: '', target: '' } }));
    }
  };

  const handleGoalDetailChange = (id: string, field: 'current' | 'target', value: string) => {
    setGoalDetails(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSubmit = () => {
    const finalGoals: Goal[] = selectedGoals.map(id => {
        const goalInfo = goalOptions.find(g => g.id === id)!;
        return {
            id,
            name: goalInfo.name,
            icon: goalInfo.id,
            currentAmount: parseFloat(goalDetails[id]?.current || '0'),
            targetAmount: parseFloat(goalDetails[id]?.target || '0'),
        };
    });

    onComplete({
      userName,
      monthlyIncome: parseFloat(monthlyIncome),
      currentBalance: parseFloat(currentBalance),
      goals: finalGoals,
      transactions: [],
    });
  };
  
  const totalSteps = 5;

  const renderStep = () => {
    const commonProps = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
        transition: { type: 'spring', stiffness: 300, damping: 30 }
    };
    switch (step) {
      case 1:
        return (
          <motion.div {...commonProps} key="step1" className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Primeiro, qual o seu nome?</h2>
            <p className="text-gray-600 mb-8">Isso nos ajuda a personalizar sua experiência.</p>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Digite seu nome"
              className="w-full text-center text-2xl font-bold p-4 bg-transparent border-b-2 border-cyan-400 focus:outline-none focus:border-cyan-600 transition text-gray-900"
            />
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleNext} disabled={!userName} className="mt-12 w-full py-4 bg-cyan-500 text-white font-bold rounded-full shadow-lg hover:bg-cyan-600 disabled:bg-gray-300 transition">Continuar</motion.button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div {...commonProps} key="step2" className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Quanto você ganha por mês, <span className="text-cyan-600">{userName}</span>? 💰</h2>
             <p className="text-gray-600 mb-8">Sua renda é o ponto de partida.</p>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder="R$ 3000,00"
              className="w-full text-center text-3xl font-bold p-4 bg-transparent border-b-2 border-cyan-400 focus:outline-none focus:border-cyan-600 transition text-gray-900"
            />
            <div className="flex w-full gap-4 mt-12">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleBack} className="flex-1 py-3 bg-white text-gray-700 font-bold rounded-full hover:bg-gray-50 transition">Voltar</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleNext} disabled={!monthlyIncome} className="flex-1 py-3 bg-cyan-500 text-white font-bold rounded-full shadow-lg hover:bg-cyan-600 disabled:bg-gray-300 transition">Próximo</motion.button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div {...commonProps} key="step3" className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">E quanto você tem disponível agora? 💵</h2>
            <p className="text-gray-600 mb-8">Este é o seu saldo atual.</p>
            <input
              type="number"
              value={currentBalance}
              onChange={(e) => setCurrentBalance(e.target.value)}
              placeholder="R$ 1500,00"
              className="w-full text-center text-3xl font-bold p-4 bg-transparent border-b-2 border-cyan-400 focus:outline-none focus:border-cyan-600 transition text-gray-900"
            />
             <div className="flex w-full gap-4 mt-12">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleBack} className="flex-1 py-3 bg-white text-gray-700 font-bold rounded-full hover:bg-gray-50 transition">Voltar</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleNext} disabled={!currentBalance} className="flex-1 py-3 bg-cyan-500 text-white font-bold rounded-full shadow-lg hover:bg-cyan-600 disabled:bg-gray-300 transition">Próximo</motion.button>
            </div>
            <p className="text-sm text-cyan-800 mt-4">Perfeito! Estamos quase lá.</p>
          </motion.div>
        );
      case 4:
        return (
          <motion.div {...commonProps} key="step4" className="flex flex-col h-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Quais são seus objetivos financeiros?</h2>
            <div className="flex-grow space-y-3 overflow-y-auto w-full pr-2 -mr-2">
              {goalOptions.map(goal => (
                <div key={goal.id} onClick={() => toggleGoal(goal.id)} className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${selectedGoals.includes(goal.id) ? 'border-cyan-500 bg-cyan-50 shadow-md' : 'border-transparent bg-white'}`}>
                  <div className="mr-4 text-cyan-600">{goal.icon}</div>
                  <span className="font-semibold text-gray-700">{goal.name}</span>
                  <div className={`ml-auto h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedGoals.includes(goal.id) ? 'bg-cyan-500 border-cyan-500' : 'border-gray-300'}`}>
                    {selectedGoals.includes(goal.id) && <motion.div initial={{scale:0}} animate={{scale:1}} className="w-3 h-3 bg-white rounded-full" />}
                  </div>
                </div>
              ))}
            </div>
             <div className="flex w-full gap-4 pt-4">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleBack} className="flex-1 py-3 bg-white text-gray-700 font-bold rounded-full hover:bg-gray-50 transition">Voltar</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleNext} disabled={selectedGoals.length === 0} className="flex-1 py-3 bg-cyan-500 text-white font-bold rounded-full shadow-lg hover:bg-cyan-600 disabled:bg-gray-300 transition">Próximo</motion.button>
            </div>
          </motion.div>
        );
      case 5:
        return (
            <motion.div {...commonProps} key="step5" className="flex flex-col h-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Detalhes das suas metas...</h2>
              <div className="flex-grow space-y-4 overflow-y-auto w-full pr-2 -mr-2">
                {selectedGoals.map(id => {
                  const goalInfo = goalOptions.find(g => g.id === id)!;
                  return (
                    <div key={id} className="p-4 bg-white rounded-lg border">
                      <div className="flex items-center mb-3">
                        <div className="mr-3 text-cyan-600">{goalInfo.icon}</div>
                        <h3 className="font-semibold">{goalInfo.name}</h3>
                      </div>
                      <input
                        type="number"
                        placeholder="Quanto já tem guardado?"
                        value={goalDetails[id]?.current || ''}
                        onChange={(e) => handleGoalDetailChange(id, 'current', e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                      />
                      <input
                        type="number"
                        placeholder="Qual o valor que quer atingir?"
                        value={goalDetails[id]?.target || ''}
                        onChange={(e) => handleGoalDetailChange(id, 'target', e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex w-full gap-4 pt-4">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleBack} className="flex-1 py-3 bg-white text-gray-700 font-bold rounded-full hover:bg-gray-50 transition">Voltar</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSubmit} className="flex-1 py-3 bg-cyan-500 text-white font-bold rounded-full shadow-lg hover:bg-cyan-600 transition">Finalizar</motion.button>
              </div>
            </motion.div>
          );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-cyan-50 to-indigo-100">
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-8">
            <motion.div 
                className="bg-cyan-500 h-1.5 rounded-full"
                animate={{ width: `${(step / totalSteps) * 100}%`}}
                transition={{ type: 'spring', stiffness: 100 }}
            />
        </div>
        <AnimatePresence mode="wait">
            {renderStep()}
        </AnimatePresence>
    </div>
  );
};

export default Onboarding;
