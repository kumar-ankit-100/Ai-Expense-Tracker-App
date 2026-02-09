export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  categoryIcon: string;
  categoryColor: string;
  date: string;
  note?: string;
  aiCategorized: boolean;
  aiConfidence?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type?: 'income' | 'expense' | 'both';
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  spent: number;
  remaining: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  currency: string;
  theme: 'dark' | 'blue' | 'amoled';
  createdAt: string;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'tip';
  title: string;
  message: string;
  categoryId?: string;
  createdAt: string;
  read: boolean;
}

export interface CalculatorResult {
  id: string;
  type: 'sip' | 'lumpsum' | 'emi' | 'credit' | 'inflation' | 'fire';
  inputs: Record<string, any>;
  results: Record<string, any>;
  createdAt: string;
  name?: string;
}

export interface Analytics {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrend: MonthlyData[];
  topCategories: TopCategory[];
  averageDailySpend: number;
  savingsRate: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface TopCategory {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  amount: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
  color?: string;
}
