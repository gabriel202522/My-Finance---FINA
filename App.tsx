import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import Onboarding from './components/Onboarding';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './components/Dashboard';
import FinaAssistant from './components/FinaAssistant';
import SubscriptionScreen from './components/SubscriptionScreen';
import { UserData, Goal, Transaction } from './types';
import { subscriptionService } from './services/subscriptionService';

const App: React.FC = () => {
  const [screen, setScreen] = useState('welcome');
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data);
    setScreen('loading');
  };
  
  const handleLoadingComplete = () => {
    setScreen('dashboard');
  };

  const addTransaction = (transaction: Transaction) => {
    if (!userData) return;

    const newTransactions = [...userData.transactions, transaction];
    let newBalance = userData.currentBalance;
    if (transaction.type === 'expense') {
      newBalance -= transaction.amount;
    } else {
      newBalance += transaction.amount;
    }

    setUserData({
      ...userData,
      currentBalance: newBalance,
      transactions: newTransactions,
    });
  };

  const addGoal = (goal: Goal) => {
    if (!userData) return;
    setUserData({
        ...userData,
        goals: [...userData.goals, goal],
    });
  };

  const handleUpdateGoal = (goalId: string, newCurrentAmount: number) => {
    if (!userData) return;
    setUserData({
        ...userData,
        goals: userData.goals.map(g => 
            g.id === goalId ? { ...g, currentAmount: newCurrentAmount } : g
        ),
    });
  };
  
  const handleSubscribe = () => {
    subscriptionService.subscribe();
    // In a real app, you might show a confirmation, but here we go back to the dashboard.
    // This function is called when the user clicks the link, so the app state is updated.
    setScreen('dashboard');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return <WelcomeScreen onStart={() => setScreen('onboarding')} />;
      case 'onboarding':
        return <Onboarding onComplete={handleOnboardingComplete} />;
      case 'loading':
        return <LoadingScreen onComplete={handleLoadingComplete} />;
      case 'dashboard':
        if (userData) {
          return <Dashboard 
            userData={userData} 
            onAddTransaction={addTransaction} 
            onAddGoal={addGoal}
            onUpdateGoal={handleUpdateGoal}
            openFina={() => setScreen('fina')}
            openSubscription={() => setScreen('subscription')}
          />;
        }
        return <WelcomeScreen onStart={() => setScreen('onboarding')} />; // Fallback if no user data
      case 'fina':
        if (userData) {
          return <FinaAssistant userData={userData} onBack={() => setScreen('dashboard')} />;
        }
        return null;
      case 'subscription':
        return <SubscriptionScreen 
                    onBack={() => setScreen('dashboard')} 
                    onSubscribe={handleSubscribe}
                />;
      default:
        return <WelcomeScreen onStart={() => setScreen('onboarding')} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex items-center justify-center">
      <div className="w-full max-w-sm h-[800px] max-h-[800px] bg-white shadow-lg rounded-3xl overflow-hidden relative">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;
