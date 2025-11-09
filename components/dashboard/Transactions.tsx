
import React, { useState, useMemo } from 'react';
import { Transaction } from '../../types';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface TransactionsProps {
  transactions: Transaction[];
}

type FilterPeriod = 'day' | 'week' | 'month' | 'bimester';

const Transactions: React.FC<TransactionsProps> = ({ transactions }) => {
  const [filter, setFilter] = useState<FilterPeriod>('week');

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions
      .filter(t => {
        const tDate = new Date(t.date);
        switch (filter) {
          case 'day':
            return tDate.toDateString() === now.toDateString();
          case 'week':
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(now.getDate() - 7);
            return tDate >= oneWeekAgo;
          case 'month':
            return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
          case 'bimester':
            const twoMonthsAgo = new Date();
            twoMonthsAgo.setMonth(now.getMonth() - 2);
            return tDate >= twoMonthsAgo;
          default:
            return true;
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filter]);
  
  const getPeriodTotal = (period: FilterPeriod) => {
    // This is a simplified calculation for demo purposes
    const total = filteredTransactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
    return `R$${total.toFixed(2)}`;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex flex-col h-full">
      <h2 className="font-bold text-lg text-gray-800">Entradas e Saídas</h2>
      
      <div className="flex justify-between items-center my-3">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {(['day', 'week', 'month', 'bimester'] as FilterPeriod[]).map(p => (
            <button key={p} onClick={() => setFilter(p)} className={`px-2 py-1 text-xs font-semibold rounded-md transition ${filter === p ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600'}`}>
              {p === 'day' ? 'Dia' : p === 'week' ? 'Semana' : p === 'month' ? 'Mês' : 'Bimestre'}
            </button>
          ))}
        </div>
        <div className="text-right">
            <p className="text-sm font-bold text-gray-800">{getPeriodTotal(filter)}</p>
            <p className="text-xs text-gray-500">no período</p>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto pr-2">
        {filteredTransactions.length === 0 ? (
          <p className="text-center text-gray-500 pt-10">Nenhuma transação neste período.</p>
        ) : (
          <ul className="space-y-3">
            {filteredTransactions.map(t => (
              <li key={t.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {t.type === 'income' ? <ArrowUpRight /> : <ArrowDownLeft />}
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-gray-800 capitalize">{t.category}</p>
                  <p className="text-sm text-gray-500">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <p className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'} R$ {t.amount.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Transactions;
