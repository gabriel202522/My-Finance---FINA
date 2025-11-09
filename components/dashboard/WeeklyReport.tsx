import React, { useMemo } from 'react';
import { UserData } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface WeeklyReportProps {
  userData: UserData;
  openSubscription: () => void;
}

const WeeklyReport: React.FC<WeeklyReportProps> = ({ userData, openSubscription }) => {
  const { transactions } = userData;
  
  const reportData = useMemo(() => {
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(now.getDate() - 14);

    const thisWeekTransactions = transactions.filter(t => new Date(t.date) >= oneWeekAgo);
    const lastWeekTransactions = transactions.filter(t => new Date(t.date) >= twoWeeksAgo && new Date(t.date) < oneWeekAgo);

    const thisWeek = {
      income: thisWeekTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
      expense: thisWeekTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    };

    const lastWeek = {
      income: lastWeekTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
      expense: lastWeekTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    };

    const categoryData = thisWeekTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
      
    const sortedCategories = Object.entries(categoryData).sort((a,b) => b[1] - a[1]);
    const topCategory = sortedCategories.length > 0 ? sortedCategories[0] : null;

    const expenseChange = lastWeek.expense > 0 ? ((thisWeek.expense - lastWeek.expense) / lastWeek.expense) * 100 : thisWeek.expense > 0 ? 100 : 0;
    
    return { thisWeek, lastWeek, topCategory, expenseChange };

  }, [transactions]);

  const chartData = [
    { name: 'Semana Passada', Gastos: reportData.lastWeek.expense },
    { name: 'Esta Semana', Gastos: reportData.thisWeek.expense },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
      <h2 className="font-bold text-lg text-gray-800 text-center">Relatório Semanal Inteligente</h2>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Ganhos Totais</p>
          <p className="font-bold text-lg text-green-600">R$ {reportData.thisWeek.income.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Gastos Totais</p>
          <p className="font-bold text-lg text-red-600">R$ {reportData.thisWeek.expense.toFixed(2)}</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-md text-gray-700 mb-2">Comparativo de Gastos</h3>
        <ResponsiveContainer width="100%" height={150}>
            <BarChart data={chartData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={100} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value: number) => `R$${value.toFixed(2)}`} />
                <Bar dataKey="Gastos" fill="#8884d8" radius={[0, 4, 4, 0]} />
            </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-indigo-50 text-indigo-800 p-4 rounded-lg text-center">
        <h3 className="font-bold">Insight da FINA</h3>
        <p className="text-sm mt-1">
          {reportData.expenseChange < -1 ? `Ótimo! Você reduziu seus gastos em ${Math.abs(reportData.expenseChange).toFixed(0)}% em relação à semana passada.` :
          reportData.expenseChange > 1 ? `Atenção, seus gastos aumentaram ${reportData.expenseChange.toFixed(0)}% esta semana.` :
          `Seus gastos se mantiveram estáveis.`}
        </p>
        {reportData.topCategory && <p className="text-sm mt-1">Sua maior categoria de gasto foi <strong>{reportData.topCategory[0]}</strong>.</p>}
      </div>

      <div className="pt-2">
        <button 
          onClick={openSubscription}
          className="w-full py-3 bg-white text-indigo-600 font-semibold rounded-lg border-2 border-indigo-200 hover:bg-indigo-50 transition-colors"
        >
          Ver Assinatura
        </button>
      </div>
    </div>
  );
};

export default WeeklyReport;
