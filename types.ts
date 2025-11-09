export interface Goal {
  id: string;
  name: string;
  icon: string;
  currentAmount: number;
  targetAmount: number;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  source?: string;
  date: Date;
}

export interface UserData {
  userName: string;
  monthlyIncome: number;
  currentBalance: number;
  goals: Goal[];
  transactions: Transaction[];
}

export interface ChatMessage {
    sender: 'user' | 'fina';
    text: string;
}