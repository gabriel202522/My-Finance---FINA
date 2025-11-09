import React, { useState, useEffect } from 'react';
import { UserData, Transaction } from '../../types';
import { getDailySummaryInsight, getExpenseInsight } from '../../services/geminiService';
import { PlusCircle, MinusCircle, FileText, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ControlsProps {
  userData: UserData;
  onAddTransaction: (transaction: Transaction) => void;
}

type ModalType = 'expense' | 'income' | 'summary' | null;

const expenseCategories = ['Alimentação', 'Transporte', 'Lazer', 'Moradia', 'Educação', 'Saúde', 'Outros'];

const Controls: React.FC<ControlsProps> = ({ userData, onAddTransaction }) => {
  const [modal, setModal] = useState<ModalType>(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [source, setSource] = useState('');
  const [insight, setInsight] = useState('');
  const [dailySummary, setDailySummary] = useState({ spent: 0, earned: 0, variation: 0 });
  const [expenseInsight, setExpenseInsight] = useState('');

  const todayTransactions = userData.transactions.filter(t => new Date(t.date).toDateString() === new Date().toDateString());
  
  useEffect(() => {
    const spent = todayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const earned = todayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    setDailySummary({ spent, earned, variation: earned - spent });
  }, [userData.transactions, todayTransactions]);

  const openModal = (type: ModalType) => {
    setAmount('');
    setCategory('');
    setSource('');
    setExpenseInsight('');
    setModal(type);
    if (type === 'summary') {
      getDailySummaryInsight(userData).then(setInsight);
    }
  };

  const closeModal = () => setModal(null);

  const handleSubmit = () => {
    if (!amount || (modal === 'expense' && !category)) return;

    if (modal === 'expense') {
        const transaction: Transaction = {
            id: new Date().toISOString(),
            type: 'expense',
            amount: parseFloat(amount),
            category,
            date: new Date(),
        };
        onAddTransaction(transaction);
        setExpenseInsight(getExpenseInsight(transaction.amount, userData.monthlyIncome/30));
        setCategory('');
        setAmount('');
    } else if (modal === 'income') {
        onAddTransaction({
            id: new Date().toISOString(),
            type: 'income',
            amount: parseFloat(amount),
            category: 'Ganho',
            source,
            date: new Date(),
        });
        closeModal();
    }
  };
  
  const ModalContent = () => {
    if (!modal) return null;

    if (expenseInsight) {
      return (
        <div className="flex flex-col items-center justify-center text-center">
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, transition: { type: 'spring', delay: 0.1 } }}
            >
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            </motion.div>
            <h3 className="text-lg font-bold mb-4">Gasto Adicionado!</h3>
            <p className="text-gray-600 mb-6">{expenseInsight}</p>
            <button onClick={closeModal} className="w-full py-2 bg-indigo-600 text-white rounded-lg">Fechar</button>
        </div>
      );
    }

    switch (modal) {
      case 'expense':
        return (
            <>
                <h3 className="text-lg font-bold mb-4">Com o que gastou?</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                    {expenseCategories.map(cat => (
                        <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1 text-sm rounded-full border transition-colors ${category === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
                <h3 className="text-lg font-bold mb-2">Qual o valor?</h3>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="R$ 80,00" className="w-full p-2 border rounded mb-4" />
                <button onClick={handleSubmit} disabled={!amount || !category} className="w-full py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-300">Salvar Gasto</button>
            </>
        );
      case 'income':
        return (
            <>
                <h3 className="text-lg font-bold mb-2">Quanto recebeu hoje?</h3>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="R$ 100,00" className="w-full p-2 border rounded mb-2" />
                <h3 className="text-lg font-bold mb-2">De qual fonte?</h3>
                <input type="text" value={source} onChange={e => setSource(e.target.value)} placeholder="Salário, Extra, etc." className="w-full p-2 border rounded mb-4" />
                <button onClick={handleSubmit} className="w-full py-2 bg-indigo-600 text-white rounded-lg">Salvar Ganho</button>
            </>
        );
      case 'summary':
        return (
            <>
                <h3 className="text-lg font-bold mb-4 text-center">Resumo do Dia</h3>
                <div className="space-y-2 text-center mb-4">
                    <p>Ganhos: <span className="font-semibold text-green-600">R$ {dailySummary.earned.toFixed(2)}</span></p>
                    <p>Gastos: <span className="font-semibold text-red-600">R$ {dailySummary.spent.toFixed(2)}</span></p>
                    <p>Variação: <span className={`font-semibold ${dailySummary.variation >= 0 ? 'text-green-600' : 'text-red-600'}`}>R$ {dailySummary.variation.toFixed(2)}</span></p>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-800 rounded-lg text-sm text-center">
                    {insight || 'Carregando insight...'}
                </div>
                <button onClick={closeModal} className="w-full py-2 mt-4 bg-gray-200 text-gray-700 rounded-lg">Fechar</button>
            </>
        );
      default: return null;
    }
  };


  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="font-bold text-lg mb-3 text-gray-800">Controle de Gastos Diários</h2>
      <div className="grid grid-cols-3 gap-2 text-center">
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => openModal('expense')} className="flex flex-col items-center p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
          <MinusCircle className="w-6 h-6 mb-1" />
          <span className="text-xs font-semibold">Gastei</span>
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => openModal('income')} className="flex flex-col items-center p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition">
          <PlusCircle className="w-6 h-6 mb-1" />
          <span className="text-xs font-semibold">Ganhei</span>
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => openModal('summary')} className="flex flex-col items-center p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
          <FileText className="w-6 h-6 mb-1" />
          <span className="text-xs font-semibold">Resumo</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white p-6 rounded-2xl w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {ModalContent()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Controls;
