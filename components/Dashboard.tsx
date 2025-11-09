import React, { useState, useEffect } from 'react';
import { UserData, Transaction, Goal } from '../types';
import { LayoutDashboard, BarChart2, Repeat, MessageCircle } from 'lucide-react';
import Controls from './dashboard/Controls';
import Goals from './dashboard/Goals';
import Visualizations from './dashboard/Visualizations';
import Transactions from './dashboard/Transactions';
import WeeklyReport from './dashboard/WeeklyReport';
import Tutorial from './dashboard/Tutorial';
import { motion } from 'framer-motion';

interface DashboardProps {
  userData: UserData;
  onAddTransaction: (transaction: Transaction) => void;
  onAddGoal: (goal: Goal) => void;
  onUpdateGoal: (goalId: string, newCurrentAmount: number) => void;
  openFina: () => void;
  openSubscription: () => void;
}

type ActiveTab = 'dashboard' | 'visualizations' | 'transactions' | 'report';

const Dashboard: React.FC<DashboardProps> = ({ userData, onAddTransaction, onAddGoal, onUpdateGoal, openFina, openSubscription }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenFinaTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    openSubscription();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <Controls userData={userData} onAddTransaction={onAddTransaction} />
            <Goals userData={userData} onAddGoal={onAddGoal} onUpdateGoal={onUpdateGoal} />
          </>
        );
      case 'visualizations':
        return <Visualizations userData={userData} />;
      case 'transactions':
        return <Transactions transactions={userData.transactions} />;
      case 'report':
        return <WeeklyReport userData={userData} openSubscription={openSubscription} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 relative">
      {showTutorial && <Tutorial onComplete={handleTutorialComplete} />}
      <header className="p-4 bg-white shadow-sm z-10">
        <div className="flex justify-between items-center">
            <div>
                <p className="text-sm text-gray-500">Olá, {userData.userName}!</p>
                <motion.p 
                    key={userData.currentBalance}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="text-3xl font-bold text-gray-800"
                >
                    R$ {userData.currentBalance.toFixed(2)}
                </motion.p>
            </div>
            <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                onClick={openFina} 
                className="p-3 bg-purple-100 text-purple-600 rounded-full"
            >
                <MessageCircle className="w-6 h-6" />
            </motion.button>
        </div>
      </header>
      
      <main className="flex-grow p-4 overflow-y-auto space-y-4">
        {renderContent()}
      </main>

      <nav className="flex justify-around p-2 bg-white border-t border-gray-200 z-10">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center p-2 rounded-lg transition w-20 ${activeTab === 'dashboard' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'}`}>
          <LayoutDashboard className="w-6 h-6" />
          <span className="text-xs font-medium">Início</span>
        </button>
        <button onClick={() => setActiveTab('visualizations')} className={`flex flex-col items-center p-2 rounded-lg transition w-20 ${activeTab === 'visualizations' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'}`}>
          <BarChart2 className="w-6 h-6" />
          <span className="text-xs font-medium">Gráficos</span>
        </button>
        <button onClick={() => setActiveTab('transactions')} className={`flex flex-col items-center p-2 rounded-lg transition w-20 ${activeTab === 'transactions' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'}`}>
          <Repeat className="w-6 h-6" />
          <span className="text-xs font-medium">Fluxo</span>
        </button>
        <button onClick={() => setActiveTab('report')} className={`flex flex-col items-center p-2 rounded-lg transition w-20 ${activeTab === 'report' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'}`}>
          <BarChart2 className="w-6 h-6" />
          <span className="text-xs font-medium">Relatório</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
