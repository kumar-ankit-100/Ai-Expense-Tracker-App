import { GoogleGenerativeAI } from '@google/generative-ai';
import { CATEGORIES, AI_PROMPTS } from '@/constants';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private cache: Map<string, any> = new Map();

  constructor() {
    if (GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }
  }

  async categorizeTransaction(
    title: string,
    amount: number,
    note?: string
  ): Promise<{
    category: string;
    categoryIcon: string;
    categoryColor: string;
    confidence: number;
    reasoning: string;
  }> {
    // Check cache first
    const cacheKey = `${title}_${amount}_${note || ''}`.toLowerCase();
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Fallback if API key is not configured
    if (!this.model) {
      return this.fallbackCategorization(title, amount, note);
    }

    try {
      const prompt = `${AI_PROMPTS.CATEGORIZE}

Transaction Details:
Title: ${title}
Amount: ₹${amount}
${note ? `Note: ${note}` : ''}

Analyze and categorize this transaction.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Find matching category
        const categoryData = this.findCategoryByName(parsed.category);
        
        const result = {
          category: categoryData.id,
          categoryIcon: categoryData.icon,
          categoryColor: categoryData.color,
          confidence: parsed.confidence || 0.8,
          reasoning: parsed.reasoning || 'AI categorized',
        };
        
        // Cache the result
        this.cache.set(cacheKey, result);
        
        return result;
      }
    } catch (error) {
      console.error('Gemini AI Error:', error);
    }

    // Fallback to rule-based categorization
    return this.fallbackCategorization(title, amount, note);
  }

  private findCategoryByName(categoryName: string): any {
    const normalized = categoryName.toLowerCase();
    
    const category = CATEGORIES.find(
      (cat) =>
        cat.name.toLowerCase().includes(normalized) ||
        normalized.includes(cat.name.toLowerCase()) ||
        cat.id === normalized
    );
    
    return category || CATEGORIES.find((cat) => cat.id === 'other')!;
  }

  private fallbackCategorization(
    title: string,
    amount: number,
    note?: string
  ): {
    category: string;
    categoryIcon: string;
    categoryColor: string;
    confidence: number;
    reasoning: string;
  } {
    const text = `${title} ${note || ''}`.toLowerCase();
    
    // Rule-based categorization
    const rules: Record<string, string[]> = {
      food: ['food', 'restaurant', 'cafe', 'swiggy', 'zomato', 'lunch', 'dinner', 'breakfast', 'pizza', 'burger'],
      transport: ['uber', 'ola', 'petrol', 'fuel', 'metro', 'bus', 'train', 'taxi', 'parking'],
      shopping: ['amazon', 'flipkart', 'shop', 'clothes', 'clothing', 'fashion', 'myntra', 'ajio'],
      entertainment: ['movie', 'netflix', 'prime', 'spotify', 'youtube', 'game', 'concert', 'theatre'],
      bills: ['electricity', 'water', 'gas', 'bill', 'utility', 'recharge', 'broadband', 'internet'],
      healthcare: ['hospital', 'doctor', 'medicine', 'pharmacy', 'health', 'clinic', 'medical'],
      education: ['course', 'book', 'school', 'college', 'university', 'tuition', 'learning'],
      travel: ['flight', 'hotel', 'booking', 'makemytrip', 'goibibo', 'vacation', 'trip'],
      rent: ['rent', 'house rent', 'apartment', 'lease'],
      insurance: ['insurance', 'premium', 'policy'],
      investment: ['mutual fund', 'sip', 'stock', 'investment', 'zerodha', 'groww'],
      loan: ['emi', 'loan', 'credit', 'debt', 'repayment'],
      subscription: ['subscription', 'membership', 'plan', 'premium'],
      salary: ['salary', 'income', 'payment received', 'credited'],
    };
    
    for (const [categoryId, keywords] of Object.entries(rules)) {
      if (keywords.some((keyword) => text.includes(keyword))) {
        const categoryData = CATEGORIES.find((cat) => cat.id === categoryId)!;
        return {
          category: categoryData.id,
          categoryIcon: categoryData.icon,
          categoryColor: categoryData.color,
          confidence: 0.75,
          reasoning: 'Rule-based categorization',
        };
      }
    }
    
    // Default to 'other'
    const otherCategory = CATEGORIES.find((cat) => cat.id === 'other')!;
    return {
      category: otherCategory.id,
      categoryIcon: otherCategory.icon,
      categoryColor: otherCategory.color,
      confidence: 0.5,
      reasoning: 'Default category',
    };
  }

  async generateInsights(transactions: any[]): Promise<string[]> {
    if (!this.model || transactions.length === 0) {
      return this.generateFallbackInsights(transactions);
    }

    try {
      const summary = this.generateTransactionSummary(transactions);
      
      const prompt = `${AI_PROMPTS.INSIGHTS}

Transaction Summary:
${summary}

Provide 3-5 actionable insights in brief bullet points.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse insights
      const insights = text
        .split('\n')
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) => line.replace(/^[•\-*]\s*/, '').trim())
        .filter((line: string) => line.length > 10);
      
      return insights.slice(0, 5);
    } catch (error) {
      console.error('Insights Generation Error:', error);
      return this.generateFallbackInsights(transactions);
    }
  }

  private generateTransactionSummary(transactions: any[]): string {
    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const categoryBreakdown: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
      });
    
    const topCategories = Object.entries(categoryBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([cat, amount]) => `${cat}: ₹${amount}`)
      .join(', ');
    
    return `Total Expenses: ₹${totalExpense}\nTop Categories: ${topCategories}\nTotal Transactions: ${transactions.length}`;
  }

  private generateFallbackInsights(transactions: any[]): string[] {
    const insights: string[] = [];
    
    if (transactions.length === 0) {
      return ['Start adding transactions to get personalized insights!'];
    }
    
    const expenses = transactions.filter((t) => t.type === 'expense');
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    if (totalExpense > 0) {
      const avgExpense = totalExpense / expenses.length;
      insights.push(`Your average transaction is ₹${avgExpense.toFixed(0)}`);
    }
    
    // Category insights
    const categoryBreakdown: Record<string, number> = {};
    expenses.forEach((t) => {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
    });
    
    const topCategory = Object.entries(categoryBreakdown).sort(([, a], [, b]) => b - a)[0];
    if (topCategory) {
      const percentage = ((topCategory[1] / totalExpense) * 100).toFixed(0);
      insights.push(`${percentage}% of spending is on ${topCategory[0]}`);
    }
    
    return insights;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const geminiService = new GeminiService();
