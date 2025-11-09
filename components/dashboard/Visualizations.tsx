
import React from 'react';
import { UserData } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';

interface VisualizationsProps {
  userData: UserData;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f'];

const Visualizations: React.FC<VisualizationsProps> = ({ userData }) => {
  const { transactions } = userData;

  const weeklyData = Array(7).fill(0).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const day = d.toLocaleDateString('pt-BR', { weekday: 'short' });
    const income = transactions.filter(t => t.type === 'income' && new Date(t.date).toDateString() === d.toDateString()).reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense' && new Date(t.date).toDateString() === d.toDateString()).reduce((sum, t) => sum + t.amount, 0);
    return { name: day.charAt(0).toUpperCase() + day.slice(1,3), Ganhos: income, Gastos: expense };
  }).reverse();

  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

  const balanceHistory = transactions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, t) => {
      const lastBalance = acc.length > 0 ? acc[acc.length - 1].saldo : userData.currentBalance; // This isn't perfect but gives a trend
      const newBalance = t.type === 'income' ? lastBalance + t.amount : lastBalance - t.amount;
      acc.push({ name: new Date(t.date).toLocaleDateString('pt-BR'), saldo: newBalance });
      return acc;
    }, [] as { name: string; saldo: number }[]);

  return (
    <div className="space-y-6 pb-4">
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h3 className="font-bold text-lg mb-4 text-gray-800">Gastos vs Ganhos (Últimos 7 dias)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`}/>
            <Tooltip formatter={(value: number) => `R$${value.toFixed(2)}`} />
            <Legend wrapperStyle={{fontSize: "12px"}}/>
            <Bar dataKey="Gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Ganhos" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h3 className="font-bold text-lg mb-4 text-gray-800">Distribuição de Gastos</h3>
        {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `R$${value.toFixed(2)}`} />
                    <Legend wrapperStyle={{fontSize: "12px", overflow: "hidden"}}/>
                </PieChart>
            </ResponsiveContainer>
        ) : <p className="text-center text-gray-500">Sem dados de gastos para exibir.</p>}
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h3 className="font-bold text-lg mb-4 text-gray-800">Evolução de Saldo</h3>
        {balanceHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={balanceHistory}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`}/>
                    <Tooltip formatter={(value: number) => `R$${value.toFixed(2)}`} />
                    <Line type="monotone" dataKey="saldo" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        ) : <p className="text-center text-gray-500">Sem histórico para exibir.</p>}
      </div>
       <div className="text-center p-4">
            <h3 className="font-bold text-lg text-gray-800">Destaques da IA</h3>
            <p className="text-sm text-gray-600 mt-2 bg-indigo-50 p-3 rounded-lg">Você gasta mais com {pieData.length > 0 ? pieData.reduce((prev, current) => (prev.value > current.value) ? prev : current).name : '...'}!</p>
       </div>
    </div>
  );
};

export default Visualizations;
