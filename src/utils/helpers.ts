export const formatCurrency = (
  amount: number,
  currencyCode: string = 'INR'
): string => {
  const symbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
  };
  
  const symbol = symbols[currencyCode] || currencyCode;
  const formatted = Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  return `${symbol}${formatted}`;
};

export const formatDate = (date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string => {
  const d = new Date(date);
  
  if (format === 'relative') {
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

export const getMonthName = (monthIndex: number): string => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return months[monthIndex];
};

export const getDateRange = (period: 'today' | 'week' | 'month' | 'year'): { start: Date; end: Date } => {
  const end = new Date();
  const start = new Date();
  
  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start.setDate(end.getDate() - 7);
      break;
    case 'month':
      start.setMonth(end.getMonth() - 1);
      break;
    case 'year':
      start.setFullYear(end.getFullYear() - 1);
      break;
  }
  
  return { start, end };
};

export const groupTransactionsByDate = (transactions: any[]): Record<string, any[]> => {
  const grouped: Record<string, any[]> = {};
  
  transactions.forEach((transaction) => {
    const date = new Date(transaction.date).toDateString();
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
  });
  
  return grouped;
};

export const calculateSIP = (
  monthlyInvestment: number,
  annualRate: number,
  years: number
): { totalInvestment: number; estimatedReturns: number; totalValue: number; yearlyBreakdown: any[] } => {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  
  let totalInvestment = 0;
  const yearlyBreakdown = [];
  
  for (let year = 1; year <= years; year++) {
    const monthsElapsed = year * 12;
    const invested = monthlyInvestment * monthsElapsed;
    const futureValue = monthlyInvestment * (((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate) * (1 + monthlyRate));
    
    yearlyBreakdown.push({
      year,
      invested,
      value: futureValue,
      returns: futureValue - invested,
    });
  }
  
  totalInvestment = monthlyInvestment * months;
  const totalValue = monthlyInvestment * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
  const estimatedReturns = totalValue - totalInvestment;
  
  return {
    totalInvestment,
    estimatedReturns,
    totalValue,
    yearlyBreakdown,
  };
};

export const calculateLumpsum = (
  principal: number,
  annualRate: number,
  years: number
): { totalInvestment: number; estimatedReturns: number; totalValue: number; yearlyBreakdown: any[] } => {
  const totalValue = principal * Math.pow(1 + annualRate / 100, years);
  const estimatedReturns = totalValue - principal;
  
  const yearlyBreakdown = [];
  for (let year = 1; year <= years; year++) {
    const value = principal * Math.pow(1 + annualRate / 100, year);
    yearlyBreakdown.push({
      year,
      invested: principal,
      value,
      returns: value - principal,
    });
  }
  
  return {
    totalInvestment: principal,
    estimatedReturns,
    totalValue,
    yearlyBreakdown,
  };
};

export const calculateEMI = (
  principal: number,
  annualRate: number,
  years: number
): { emi: number; totalPayment: number; totalInterest: number; breakdown: any[] } => {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;
  
  let balance = principal;
  const breakdown = [];
  
  for (let month = 1; month <= months; month++) {
    const interest = balance * monthlyRate;
    const principalPaid = emi - interest;
    balance -= principalPaid;
    
    if (month === 1 || month % 12 === 0 || month === months) {
      breakdown.push({
        month,
        emi,
        principal: principalPaid,
        interest,
        balance: Math.max(0, balance),
      });
    }
  }
  
  return {
    emi,
    totalPayment,
    totalInterest,
    breakdown,
  };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
