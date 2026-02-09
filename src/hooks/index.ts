import { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/store';
import { formatCurrency, formatDate, calculatePercentageChange } from '@/utils/helpers';

export const useTransactions = (filter?: {
  type?: 'income' | 'expense';
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const transactions = useStore((state) => state.transactions);
  
  const filtered = transactions.filter((t) => {
    if (filter?.type && t.type !== filter.type) return false;
    if (filter?.categoryId && t.category !== filter.categoryId) return false;
    if (filter?.startDate && new Date(t.date) < new Date(filter.startDate)) return false;
    if (filter?.endDate && new Date(t.date) > new Date(filter.endDate)) return false;
    return true;
  });
  
  return filtered;
};

export const useAnalytics = (period: 'today' | 'week' | 'month' | 'year' | 'all' = 'month') => {
  const getTotalIncome = useStore((state) => state.getTotalIncome);
  const getTotalExpense = useStore((state) => state.getTotalExpense);
  const getBalance = useStore((state) => state.getBalance);
  const getCategoryBreakdown = useStore((state) => state.getCategoryBreakdown);
  
  const totalIncome = getTotalIncome(period);
  const totalExpense = getTotalExpense(period);
  const balance = getBalance();
  const categoryBreakdown = getCategoryBreakdown('expense', period);
  
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  
  return {
    totalIncome,
    totalExpense,
    balance,
    categoryBreakdown,
    savingsRate,
  };
};

export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

export const useAnimatedValue = (targetValue: number, duration: number = 1000) => {
  const [currentValue, setCurrentValue] = useState(0);
  
  useEffect(() => {
    const startValue = currentValue;
    const difference = targetValue - startValue;
    const startTime = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const newValue = startValue + difference * easeOutQuart;
      
      setCurrentValue(newValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrentValue(targetValue);
      }
    };
    
    requestAnimationFrame(animate);
  }, [targetValue, duration]);
  
  return currentValue;
};

export const useCurrency = () => {
  const user = useStore((state) => state.user);
  const currencyCode = user?.currency || 'INR';
  
  const format = useCallback(
    (amount: number) => formatCurrency(amount, currencyCode),
    [currencyCode]
  );
  
  return { currencyCode, format };
};

export const useTheme = () => {
  const user = useStore((state) => state.user);
  const updateUserSettings = useStore((state) => state.updateUserSettings);
  
  const theme = user?.theme || 'dark';
  
  const setTheme = useCallback(
    (newTheme: 'dark' | 'blue' | 'amoled') => {
      updateUserSettings({ theme: newTheme });
    },
    [updateUserSettings]
  );
  
  return { theme, setTheme };
};
