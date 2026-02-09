import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  GlassCard,
  LineChartComponent,
  PieChartComponent,
  BarChartComponent,
} from '@/components';
import { useStore } from '@/store';
import { useAnalytics, useCurrency } from '@/hooks';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '@/theme/colors';
import { getMonthName } from '@/utils/helpers';

const { width } = Dimensions.get('window');

type Period = 'week' | 'month' | 'year';

export const AnalyticsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  const transactions = useStore((state) => state.transactions);
  const { format } = useCurrency();
  const { totalIncome, totalExpense, balance, categoryBreakdown, savingsRate } =
    useAnalytics(selectedPeriod);
  
  // Monthly Trend Data
  const monthlyTrendData = useMemo(() => {
    const last6Months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return (
          tDate.getMonth() === month.getMonth() &&
          tDate.getFullYear() === month.getFullYear()
        );
      });
      
      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      last6Months.push({
        label: getMonthName(month.getMonth()),
        income,
        expense,
      });
    }
    
    return {
      labels: last6Months.map((m) => m.label),
      datasets: [
        {
          data: last6Months.map((m) => m.expense),
        },
      ],
    };
  }, [transactions]);
  
  // Category Distribution Data
  const categoryDistributionData = useMemo(() => {
    return categoryBreakdown.slice(0, 5).map((cat) => ({
      name: cat.categoryName,
      population: cat.amount,
      color: cat.categoryColor || COLORS.primary[500],
      legendFontColor: COLORS.text.secondary,
      legendFontSize: 12,
    }));
  }, [categoryBreakdown]);
  
  // Income vs Expense Bar Chart
  const incomeVsExpenseData = useMemo(() => {
    const last6Months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return (
          tDate.getMonth() === month.getMonth() &&
          tDate.getFullYear() === month.getFullYear()
        );
      });
      
      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      last6Months.push({
        label: getMonthName(month.getMonth()),
        income,
      });
    }
    
    return {
      labels: last6Months.map((m) => m.label),
      datasets: [
        {
          data: last6Months.map((m) => m.income),
        },
      ],
    };
  }, [transactions]);
  
  // Calculate daily average spend
  const dailyAverage = useMemo(() => {
    const days = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 365;
    return totalExpense / days;
  }, [totalExpense, selectedPeriod]);
  
  // Forecast next month
  const forecastNextMonth = useMemo(() => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const lastMonthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date);
      return (
        tDate.getMonth() === lastMonth.getMonth() &&
        tDate.getFullYear() === lastMonth.getFullYear()
      );
    });
    
    const lastMonthExpense = lastMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Simple forecast: average of current and last month with 5% growth
    return ((totalExpense + lastMonthExpense) / 2) * 1.05;
  }, [transactions, totalExpense]);
  
  const periods: Period[] = ['week', 'month', 'year'];
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: SPACING.lg }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Detailed insights into your finances</Text>
        </View>
        
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period && styles.periodTextActive,
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <Animated.View entering={FadeInDown.delay(100)} style={styles.summaryCard}>
            <GlassCard gradient gradientColors={['rgba(34, 197, 94, 0.2)', 'rgba(34, 197, 94, 0.05)']}>
              <Text style={styles.summaryIcon}>💰</Text>
              <Text style={styles.summaryLabel}>Income</Text>
              <Text style={[styles.summaryValue, { color: COLORS.success }]}>
                {format(totalIncome)}
              </Text>
            </GlassCard>
          </Animated.View>
          
          <Animated.View entering={FadeInDown.delay(200)} style={styles.summaryCard}>
            <GlassCard gradient gradientColors={['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.05)']}>
              <Text style={styles.summaryIcon}>💸</Text>
              <Text style={styles.summaryLabel}>Expense</Text>
              <Text style={[styles.summaryValue, { color: COLORS.expense }]}>
                {format(totalExpense)}
              </Text>
            </GlassCard>
          </Animated.View>
        </View>
        
        {/* Overview Cards */}
        <View style={styles.overviewGrid}>
          <Animated.View entering={FadeInDown.delay(100)} style={styles.overviewCard}>
            <GlassCard
              gradient
              gradientColors={['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.05)']}
            >
              <Text style={styles.overviewLabel}>Total Income</Text>
              <Text style={[styles.overviewValue, { color: COLORS.income }]}>
                {format(totalIncome)}
              </Text>
            </GlassCard>
          </Animated.View>
          
          <Animated.View entering={FadeInDown.delay(200)} style={styles.overviewCard}>
            <GlassCard
              gradient
              gradientColors={['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.05)']}
            >
              <Text style={styles.overviewLabel}>Total Expense</Text>
              <Text style={[styles.overviewValue, { color: COLORS.expense }]}>
                {format(totalExpense)}
              </Text>
            </GlassCard>
          </Animated.View>
        </View>
        
        {/* Savings Rate */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <GlassCard style={styles.savingsCard}>
            <View style={styles.savingsHeader}>
              <Text style={styles.savingsLabel}>Savings Rate</Text>
              <Text style={styles.savingsValue}>
                {savingsRate > 0 ? '+' : ''}
                {savingsRate.toFixed(1)}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(Math.abs(savingsRate), 100)}%`,
                    backgroundColor: savingsRate > 0 ? COLORS.income : COLORS.expense,
                  },
                ]}
              />
            </View>
            <Text style={styles.savingsDescription}>
              {savingsRate > 0
                ? `Great! You're saving ${savingsRate.toFixed(1)}% of your income`
                : 'Your expenses exceed your income'}
            </Text>
          </GlassCard>
        </Animated.View>
        
        {/* Monthly Expense Trend */}
        <Animated.View entering={FadeInDown.delay(400)}>
          <LineChartComponent
            data={monthlyTrendData}
            title="Monthly Expense Trend"
          />
        </Animated.View>
        
        {/* Category Distribution */}
        {categoryDistributionData.length > 0 && (
          <Animated.View entering={FadeInDown.delay(500)}>
            <PieChartComponent
              data={categoryDistributionData}
              title="Category Distribution"
            />
          </Animated.View>
        )}
        
        {/* Income Trend */}
        <Animated.View entering={FadeInDown.delay(600)}>
          <BarChartComponent
            data={incomeVsExpenseData}
            title="Income Trend"
          />
        </Animated.View>
        
        {/* Spending Velocity */}
        <Animated.View entering={FadeInDown.delay(700)}>
          <GlassCard style={styles.insightCard}>
            <Text style={styles.insightTitle}>💨 Spending Velocity</Text>
            <View style={styles.insightRow}>
              <View style={styles.insightItem}>
                <Text style={styles.insightLabel}>Daily Average</Text>
                <Text style={styles.insightValue}>{format(dailyAverage)}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.insightItem}>
                <Text style={styles.insightLabel}>Forecast Next Month</Text>
                <Text style={styles.insightValue}>{format(forecastNextMonth)}</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>
        
        {/* Smart Insights */}
        <Animated.View entering={FadeInDown.delay(800)}>
          <GlassCard
            gradient
            gradientColors={['rgba(139, 92, 246, 0.2)', 'rgba(139, 92, 246, 0.05)']}
            style={styles.smartInsightsCard}
          >
            <Text style={styles.smartInsightsTitle}>🧠 Smart Insights</Text>
            
            {categoryBreakdown.length > 0 && (
              <View style={styles.insightItem}>
                <Text style={styles.insightBullet}>•</Text>
                <Text style={styles.insightText}>
                  Your top spending category is{' '}
                  <Text style={styles.highlight}>
                    {categoryBreakdown[0]?.categoryName}
                  </Text>{' '}
                  at {format(categoryBreakdown[0]?.amount)}
                </Text>
              </View>
            )}
            
            {savingsRate > 20 && (
              <View style={styles.insightItem}>
                <Text style={styles.insightBullet}>•</Text>
                <Text style={styles.insightText}>
                  Excellent! You're saving more than 20% of your income
                </Text>
              </View>
            )}
            
            {savingsRate < 0 && (
              <View style={styles.insightItem}>
                <Text style={styles.insightBullet}>•</Text>
                <Text style={styles.insightText}>
                  Consider reducing expenses to improve your savings rate
                </Text>
              </View>
            )}
            
            <View style={styles.insightItem}>
              <Text style={styles.insightBullet}>•</Text>
              <Text style={styles.insightText}>
                You've made {transactions.length} transactions in total
              </Text>
            </View>
          </GlassCard>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark[400],
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
  },
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  periodButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.glass.light,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary[500],
  },
  periodText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.secondary,
  },
  periodTextActive: {
    color: COLORS.text.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  summaryCard: {
    flex: 1,
  },
  summaryIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    textAlign: 'center',
  },
  overviewGrid: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  overviewCard: {
    flex: 1,
  },
  overviewLabel: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  overviewValue: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  savingsCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  savingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  savingsLabel: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
  },
  savingsValue: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary[400],
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.dark[200],
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  savingsDescription: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
  },
  insightCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  insightTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightItem: {
    flex: 1,
    marginBottom: SPACING.sm,
  },
  insightLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  insightValue: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.dark[200],
    marginHorizontal: SPACING.md,
  },
  smartInsightsCard: {
    marginHorizontal: SPACING.md,
  },
  smartInsightsTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  insightBullet: {
    fontSize: TYPOGRAPHY.sizes.lg,
    color: COLORS.primary[400],
    marginRight: SPACING.sm,
  },
  insightText: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  highlight: {
    color: COLORS.primary[400],
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
});
