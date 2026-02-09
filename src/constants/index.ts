export const CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: '🍔', color: '#F59E0B' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: '#3B82F6' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#EC4899' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#8B5CF6' },
  { id: 'bills', name: 'Bills & Utilities', icon: '💡', color: '#EF4444' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', color: '#10B981' },
  { id: 'education', name: 'Education', icon: '📚', color: '#06B6D4' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: '#F97316' },
  { id: 'rent', name: 'Rent', icon: '🏠', color: '#6366F1' },
  { id: 'insurance', name: 'Insurance', icon: '🛡️', color: '#14B8A6' },
  { id: 'investment', name: 'Investment/SIP', icon: '📈', color: '#10B981' },
  { id: 'loan', name: 'Loan/EMI', icon: '💳', color: '#EF4444' },
  { id: 'subscription', name: 'Subscription', icon: '📱', color: '#8B5CF6' },
  { id: 'salary', name: 'Salary', icon: '💰', color: '#10B981' },
  { id: 'other', name: 'Other', icon: '📦', color: '#64748B' },
];

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
];

export const THEMES = {
  DARK: 'dark',
  BLUE: 'blue',
  AMOLED: 'amoled',
} as const;

export const AI_PROMPTS = {
  CATEGORIZE: `You are a financial categorization AI. Given a transaction description and amount, categorize it into one of these categories:
  
Categories: Food & Dining, Transport, Shopping, Entertainment, Bills & Utilities, Healthcare, Education, Travel, Rent, Insurance, Investment/SIP, Loan/EMI, Subscription, Salary, Other

Return ONLY a JSON object with this exact format:
{
  "category": "category_name",
  "confidence": 0.95,
  "reasoning": "brief explanation"
}

Be precise and consider Indian financial context.`,
  
  INSIGHTS: `Analyze the user's spending patterns and provide actionable insights. Consider:
- Overspending in categories
- Unusual patterns
- Savings opportunities
- Budget recommendations

Return insights in a friendly, actionable format.`,
};

export const CALCULATOR_TYPES = [
  {
    id: 'sip',
    name: 'SIP Calculator',
    description: 'Calculate returns on Systematic Investment Plans',
    icon: '📊',
    color: '#10B981',
  },
  {
    id: 'lumpsum',
    name: 'Lumpsum Calculator',
    description: 'Calculate returns on one-time investments',
    icon: '💰',
    color: '#3B82F6',
  },
  {
    id: 'emi',
    name: 'EMI Calculator',
    description: 'Calculate loan EMI and interest',
    icon: '🏦',
    color: '#EF4444',
  },
  {
    id: 'credit',
    name: 'Credit Card Calculator',
    description: 'Calculate credit card interest',
    icon: '💳',
    color: '#8B5CF6',
  },
  {
    id: 'inflation',
    name: 'Inflation Calculator',
    description: 'Calculate inflation impact on savings',
    icon: '📉',
    color: '#F59E0B',
  },
  {
    id: 'fire',
    name: 'FIRE Calculator',
    description: 'Calculate Financial Independence goals',
    icon: '🔥',
    color: '#EC4899',
  },
];

export const APP_CONFIG = {
  VERSION: '1.0.0',
  APP_NAME: 'AI Finance Tracker',
  TAGLINE: 'Smart Finance Management',
  SUPPORT_EMAIL: 'support@aifinancetracker.com',
  PRIVACY_URL: 'https://aifinancetracker.com/privacy',
  TERMS_URL: 'https://aifinancetracker.com/terms',
};
