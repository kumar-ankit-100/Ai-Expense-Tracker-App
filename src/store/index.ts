import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, User, AIInsight, CalculatorResult } from '@/types';

interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  updateUserSettings: (settings: Partial<User>) => void;
  
  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionsByDateRange: (startDate: string, endDate: string) => Transaction[];
  getTransactionsByCategory: (categoryId: string) => Transaction[];
  
  // Insights
  insights: AIInsight[];
  addInsight: (insight: Omit<AIInsight, 'id' | 'createdAt'>) => void;
  markInsightAsRead: (id: string) => void;
  clearInsights: () => void;
  
  // Calculator Results
  calculatorResults: CalculatorResult[];
  saveCalculatorResult: (result: Omit<CalculatorResult, 'id' | 'createdAt'>) => void;
  deleteCalculatorResult: (id: string) => void;
  
  // Analytics
  getTotalIncome: (period?: 'today' | 'week' | 'month' | 'year' | 'all') => number;
  getTotalExpense: (period?: 'today' | 'week' | 'month' | 'year' | 'all') => number;
  getBalance: () => number;
  getCategoryBreakdown: (type: 'income' | 'expense', period?: string) => any[];
  
  // Utilities
  resetAllData: () => void;
  exportData: () => string;
}

const generateId = () => `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const getDateRangeForPeriod = (period: 'today' | 'week' | 'month' | 'year' | 'all' = 'all') => {
  const now = new Date();
  const startDate = new Date();
  
  switch (period) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case 'all':
      return { startDate: new Date(0), endDate: now };
  }
  
  return { startDate, endDate: now };
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      transactions: [],
      insights: [],
      calculatorResults: [],
      
      // User Actions
      setUser: (user) => set({ user }),
      
      updateUserSettings: (settings) => set((state) => ({
        user: state.user ? { ...state.user, ...settings } : null,
      })),
      
      // Transaction Actions
      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
      },
      
      updateTransaction: (id, updates) => set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
        ),
      })),
      
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      })),
      
      getTransactionsByDateRange: (startDate, endDate) => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        
        return get().transactions.filter((t) => {
          const tDate = new Date(t.date).getTime();
          return tDate >= start && tDate <= end;
        });
      },
      
      getTransactionsByCategory: (categoryId) =>
        get().transactions.filter((t) => t.category === categoryId),
      
      // Insights Actions
      addInsight: (insight) => {
        const newInsight: AIInsight = {
          ...insight,
          id: generateId(),
          createdAt: new Date().toISOString(),
          read: false,
        };
        
        set((state) => ({
          insights: [newInsight, ...state.insights],
        }));
      },
      
      markInsightAsRead: (id) => set((state) => ({
        insights: state.insights.map((i) =>
          i.id === id ? { ...i, read: true } : i
        ),
      })),
      
      clearInsights: () => set({ insights: [] }),
      
      // Calculator Actions
      saveCalculatorResult: (result) => {
        const newResult: CalculatorResult = {
          ...result,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          calculatorResults: [newResult, ...state.calculatorResults],
        }));
      },
      
      deleteCalculatorResult: (id) => set((state) => ({
        calculatorResults: state.calculatorResults.filter((r) => r.id !== id),
      })),
      
      // Analytics Actions
      getTotalIncome: (period = 'all') => {
        const { startDate, endDate } = getDateRangeForPeriod(period);
        const transactions = get().getTransactionsByDateRange(
          startDate.toISOString(),
          endDate.toISOString()
        );
        
        return transactions
          .filter((t) => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
      },
      
      getTotalExpense: (period = 'all') => {
        const { startDate, endDate } = getDateRangeForPeriod(period);
        const transactions = get().getTransactionsByDateRange(
          startDate.toISOString(),
          endDate.toISOString()
        );
        
        return transactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
      },
      
      getBalance: () => {
        const income = get().getTotalIncome('all');
        const expense = get().getTotalExpense('all');
        return income - expense;
      },
      
      getCategoryBreakdown: (type, period) => {
        const transactions = get().transactions.filter((t) => t.type === type);
        const breakdown: Record<string, any> = {};
        
        transactions.forEach((t) => {
          if (!breakdown[t.category]) {
            breakdown[t.category] = {
              categoryId: t.category,
              categoryName: t.category,
              categoryIcon: t.categoryIcon,
              categoryColor: t.categoryColor,
              amount: 0,
              count: 0,
            };
          }
          
          breakdown[t.category].amount += t.amount;
          breakdown[t.category].count += 1;
        });
        
        return Object.values(breakdown).sort((a, b) => b.amount - a.amount);
      },
      
      // Utility Actions
      resetAllData: () => set({
        transactions: [],
        insights: [],
        calculatorResults: [],
      }),
      
      exportData: () => {
        const state = get();
        return JSON.stringify({
          user: state.user,
          transactions: state.transactions,
          insights: state.insights,
          calculatorResults: state.calculatorResults,
          exportedAt: new Date().toISOString(),
        }, null, 2);
      },
    }),
    {
      name: 'finance-tracker-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
