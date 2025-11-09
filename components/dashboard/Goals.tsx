
import React, { useState } from 'react';
import { UserData, Goal } from '../../types';
import { ShieldCheck, Plane, Home, Handshake, GraduationCap, BarChart, User as UserIcon, Plus, X, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GoalsProps {
  userData: UserData;
  onAddGoal: (goal: Goal) => void;
  onUpdateGoal: (goalId: string, newCurrentAmount: number) => void;
}

const iconMap: { [key: string]: React.ReactElement } = {
  emergency: <ShieldCheck className="w-6 h-6 text-white" />,
  travel: <Plane className="w-6 h-6 text-white" />,
  home: <Home className="w-6 h-6 text-white" />,
  debt: <Handshake className="w-6 h-6 text-white" />,
  education: <GraduationCap className="w-6 h-6 text-white" />,
  investments: <BarChart className="w-6 h-6 text-white" />,
  personal: <UserIcon className="w-6 h-6 text-white" />,
};
const colorMap: { [key: string]: string } = {
  emergency: 'bg-green-500',
  travel: 'bg-blue-500',
  home: 'bg-yellow-500',
  debt: 'bg-red-500',
  education: 'bg-purple-500',
  investments: 'bg-indigo-500',
  personal: 'bg-pink-500',
};

const GoalCompleteEffect = () => (
    <>
        {[...Array(3)].map((_, i) => (
             <motion.div
                key={i}
                className="absolute top-0 left-1/4 w-1 h-1 bg-yellow-300 rounded-full"
                animate={{
                    y: [0, -20, 0],
                    x: [0, (i-1) * 15, 0],
                    opacity: [1, 0.5, 0],
                    scale: [1, 1.5, 1],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                }}
             />
        ))}
    </>
);

const GoalCard: React.FC<{ goal: Goal; userData: UserData; onClick: () => void }> = ({ goal, userData, onClick }) => {
    const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
    const isCompleted = progress >= 100;
    const monthlyContribution = userData.monthlyIncome * 0.1; // Assuming 10% savings rate for estimation
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    const monthsRemaining = monthlyContribution > 0 && remainingAmount > 0 ? Math.ceil(remainingAmount / monthlyContribution) : 0;

    return (
        <motion.div 
            onClick={onClick}
            whileTap={{ scale: 0.98 }}
            className="bg-white p-4 rounded-xl shadow-md flex flex-col justify-between h-full relative overflow-hidden cursor-pointer"
        >
            {isCompleted && <GoalCompleteEffect />}
            <div>
                <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${colorMap[goal.icon] || 'bg-gray-500'} relative z-10`}>
                        {isCompleted ? <Award className="w-6 h-6 text-white" /> : (iconMap[goal.icon] || <UserIcon className="w-6 h-6 text-white" />)}
                    </div>
                    <h3 className="font-bold text-gray-800">{goal.name}</h3>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">R$ {goal.currentAmount.toFixed(2)}</span> / R$ {goal.targetAmount.toFixed(2)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <motion.div 
                        className={`${isCompleted ? 'bg-yellow-400' : 'bg-indigo-600'} h-2.5 rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress > 100 ? 100 : progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />
                </div>
                <div className="text-xs text-gray-500 text-right font-medium">{progress.toFixed(0)}%</div>
            </div>
            {monthsRemaining > 0 && !isCompleted && (
                <p className="text-xs text-center text-indigo-700 bg-indigo-50 p-2 rounded-lg mt-3">
                    Tempo estimado: <strong>{monthsRemaining} meses</strong>
                </p>
            )}
             {isCompleted && (
                <p className="text-xs text-center text-green-700 bg-green-100 font-bold p-2 rounded-lg mt-3">
                    Meta Concluída! 🎉
                </p>
            )}
        </motion.div>
    )
}

const AddGoalModal: React.FC<{onClose: () => void; onAddGoal: (goal: Goal) => void}> = ({ onClose, onAddGoal}) => {
    const [name, setName] = useState('');
    const [current, setCurrent] = useState('');
    const [target, setTarget] = useState('');

    const handleAdd = () => {
        if (!name || !target) return;
        const newGoal: Goal = {
            id: new Date().toISOString(),
            name,
            icon: 'personal',
            currentAmount: parseFloat(current) || 0,
            targetAmount: parseFloat(target),
        };
        onAddGoal(newGoal);
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-2xl w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Adicionar Nova Meta</h3>
                <button onClick={onClose}><X /></button>
              </div>
              <div className="space-y-3">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nome da meta" className="w-full p-2 border rounded" />
                <input type="number" value={current} onChange={e => setCurrent(e.target.value)} placeholder="Valor atual (opcional)" className="w-full p-2 border rounded" />
                <input type="number" value={target} onChange={e => setTarget(e.target.value)} placeholder="Valor alvo" className="w-full p-2 border rounded" />
              </div>
              <button onClick={handleAdd} className="w-full mt-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg">Criar Meta</button>
            </motion.div>
        </motion.div>
    );
};

const EditGoalModal: React.FC<{goal: Goal; onClose: () => void; onUpdate: (addedAmount: number) => void}> = ({ goal, onClose, onUpdate }) => {
    const [amountToAdd, setAmountToAdd] = useState('');

    const handleUpdate = () => {
        const addedValue = parseFloat(amountToAdd);
        if (isNaN(addedValue) || addedValue <= 0) return;
        onUpdate(addedValue);
    };

    return (
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-2xl w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Adicionar à Meta: {goal.name}</h3>
                <button onClick={onClose}><X /></button>
              </div>
              <p className="text-sm text-gray-600 mb-4">Você já tem R$ {goal.currentAmount.toFixed(2)} de R$ {goal.targetAmount.toFixed(2)}.</p>
              <div className="space-y-3">
                <input type="number" value={amountToAdd} onChange={e => setAmountToAdd(e.target.value)} placeholder="Quanto você guardou?" className="w-full p-2 border rounded" />
              </div>
              <button onClick={handleUpdate} className="w-full mt-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg">Adicionar Valor</button>
            </motion.div>
        </motion.div>
    );
}

const Goals: React.FC<GoalsProps> = ({ userData, onAddGoal, onUpdateGoal }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  return (
    <div className="bg-gray-50">
      <h2 className="font-bold text-lg mb-3 text-gray-800">Metas e Visualizações</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {userData.goals.map(goal => (
          <GoalCard key={goal.id} goal={goal} userData={userData} onClick={() => setEditingGoal(goal)} />
        ))}
        <button onClick={() => setShowAddModal(true)} className="flex flex-col items-center justify-center p-4 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:bg-gray-100 hover:border-indigo-400 hover:text-indigo-500 transition h-full min-h-[180px]">
            <Plus className="w-8 h-8 mb-2" />
            <span className="font-semibold">Nova Meta</span>
        </button>
      </div>
      <AnimatePresence>
        {showAddModal && <AddGoalModal onClose={() => setShowAddModal(false)} onAddGoal={onAddGoal} />}
        {editingGoal && (
            <EditGoalModal 
                goal={editingGoal}
                onClose={() => setEditingGoal(null)}
                onUpdate={(addedAmount) => {
                    onUpdateGoal(editingGoal.id, editingGoal.currentAmount + addedAmount);
                    setEditingGoal(null);
                }}
            />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Goals;
