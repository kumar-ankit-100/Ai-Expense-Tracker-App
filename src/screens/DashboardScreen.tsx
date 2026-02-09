import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  BalanceCard,
  GlassCard,
  TransactionItem,
  AddTransactionModal,
  FloatingParticles,
} from '@/components';
import { useStore } from '@/store';
import { useAnalytics } from '@/hooks';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '@/theme/colors';
import { geminiService } from '@/services/ai';

const { width } = Dimensions.get('window');

export const DashboardScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  
  const transactions = useStore((state) => state.transactions);
  const user = useStore((state) => state.user);
  const { totalIncome, totalExpense, balance, categoryBreakdown } = useAnalytics('month');
  
  const recentTransactions = transactions.slice(0, 10);
  
  useEffect(() => {
    loadInsights();
  }, [transactions.length]);
  
  const loadInsights = async () => {
    if (transactions.length > 0) {
      const generatedInsights = await geminiService.generateInsights(transactions);
      setInsights(generatedInsights);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadInsights();
    setRefreshing(false);
  };
  
  const handleAddTransaction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsModalVisible(true);
  };
  
  const topCategories = categoryBreakdown.slice(0, 3);
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Floating Particles */}
      <FloatingParticles count={6} />

      {/* Header Gradient */}
      <LinearGradient
        colors={['rgba(0, 105, 255, 0.2)', 'transparent']}
        style={styles.headerGradient}
      />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary[500]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.userName}>{user?.name || 'Guest'} 👋</Text>
          </View>
          <TouchableOpacity style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'G'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Balance Card */}
        <BalanceCard
          balance={balance}
          income={totalIncome}
          expense={totalExpense}
        />
        
        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <Animated.View entering={FadeInDown.delay(100)} style={styles.statCard}>
            <GlassCard>
              <View style={styles.statIcon}>
                <Text style={styles.statEmoji}>📝</Text>
              </View>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statValue}>{transactions.length}</Text>
              <Text style={styles.statSubtext}>Transactions</Text>
            </GlassCard>
          </Animated.View>
          
          <Animated.View entering={FadeInDown.delay(200)} style={styles.statCard}>
            <GlassCard>
              <View style={styles.statIcon}>
                <Text style={styles.statEmoji}>📊</Text>
              </View>
              <Text style={styles.statLabel}>Active</Text>
              <Text style={[styles.statValue, { color: COLORS.primary[400] }]}>
                {categoryBreakdown.length}
              </Text>
              <Text style={styles.statSubtext}>Categories</Text>
            </GlassCard>
          </Animated.View>
          
          <Animated.View entering={FadeInDown.delay(300)} style={styles.statCard}>
            <GlassCard>
              <View style={styles.statIcon}>
                <Text style={styles.statEmoji}>💰</Text>
              </View>
              <Text style={styles.statLabel}>Avg Daily</Text>
              <Text style={[styles.statValue, { fontSize: 18 }]}>
                ₹{(totalExpense / 30).toFixed(0)}
              </Text>
              <Text style={styles.statSubtext}>Spending</Text>
            </GlassCard>
          </Animated.View>
        </View>

        {/* Savings Rate Card */}
        <Animated.View entering={FadeInDown.delay(350)}>
          <GlassCard
            gradient
            gradientColors={['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.05)']}
            style={styles.savingsCard}
          >
            <View style={styles.savingsHeader}>
              <View>
                <Text style={styles.savingsLabel}>💎 Savings Rate</Text>
                <Text style={styles.savingsValue}>
                  {totalIncome > 0 ? ((1 - totalExpense / totalIncome) * 100).toFixed(1) : 0}%
                </Text>
              </View>
              <View style={styles.savingsIndicator}>
                <Text style={styles.savingsAmount}>
                  ₹{(totalIncome - totalExpense).toLocaleString()}
                </Text>
                <Text style={styles.savingsText}>Saved this month</Text>
              </View>
            </View>
          </GlassCard>
        </Animated.View>
        
        {/* AI Insights */}
        {insights.length > 0 && (
          <Animated.View entering={FadeInDown.delay(400)}>
            <View style={styles.sectionHeaderWithLine}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionIcon}>✨</Text>
                <Text style={styles.sectionTitle}>AI Insights</Text>
              </View>
              <View style={styles.sectionLine} />
            </View>
            <GlassCard
              gradient
              gradientColors={['rgba(139, 92, 246, 0.2)', 'rgba(139, 92, 246, 0.05)']}
              style={styles.insightsCard}
            >
              {insights.map((insight, index) => (
                <View key={index} style={styles.insightItem}>
                  <Text style={styles.insightBullet}>•</Text>
                  <Text style={styles.insightText}>{insight}</Text>
                </View>
              ))}
            </GlassCard>
          </Animated.View>
        )}
        
        {/* Top Spending Categories */}
        {topCategories.length > 0 && (
          <Animated.View entering={FadeInDown.delay(500)}>
            <View style={styles.sectionHeaderWithLine}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionIcon}>📊</Text>
                <Text style={styles.sectionTitle}>Top Spending</Text>
              </View>
              <View style={styles.sectionLine} />
            </View>
            
            {topCategories.map((category, index) => {
              const percentage = (category.amount / totalExpense) * 100;
              return (
                <GlassCard key={category.categoryId} style={styles.categoryCard}>
                  <View style={styles.categoryRow}>
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryIcon}>{category.categoryIcon}</Text>
                      <View style={styles.categoryDetails}>
                        <Text style={styles.categoryName}>{category.categoryName}</Text>
                        <Text style={styles.categoryAmount}>
                          ₹{category.amount.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.categoryPercentage}>
                      {percentage.toFixed(0)}%
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${percentage}%`,
                          backgroundColor: category.categoryColor || COLORS.primary[500],
                        },
                      ]}
                    />
                  </View>
                </GlassCard>
              );
            })}
          </Animated.View>
        )}
        
        {/* Recent Transactions */}
        <View style={styles.sectionHeaderWithLine}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionIcon}>💳</Text>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
          </View>
          <View style={styles.sectionLine} />
        </View>
        
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction, index) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              index={index}
            />
          ))
        ) : (
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to add your first transaction
            </Text>
          </GlassCard>
        )}
        
        <View style={{ height: 100 }} />
      </ScrollView>
      
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddTransaction}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={COLORS.gradients.primary}
          style={styles.fabGradient}
        >
          <Text style={styles.fabIcon}>+</Text>
        </LinearGradient>
      </TouchableOpacity>
      
      <AddTransactionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark[400],
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.md,
  },
  greeting: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
  },
  userName: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginTop: 4,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
  },
  statIcon: {
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  statEmoji: {
    fontSize: 28,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  statSubtext: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
    marginTop: 2,
    textAlign: 'center',
  },
  savingsCard: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    padding: SPACING.lg,
  },
  savingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsLabel: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  savingsValue: {
    fontSize: 36,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.success,
  },
  savingsIndicator: {
    alignItems: 'flex-end',
  },
  savingsAmount: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
  },
  savingsText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  insightsCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionHeaderWithLine: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  sectionLine: {
    height: 2,
    backgroundColor: COLORS.primary[400] + '30',
    borderRadius: RADIUS.full,
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
  },
  seeAll: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.primary[400],
  },
  categoryCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    padding: SPACING.lg,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  categoryAmount: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  categoryPercentage: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.primary[400],
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.dark[200] + '50',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  emptyCard: {
    marginHorizontal: SPACING.md,
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  emptySubtext: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xxl,
    right: SPACING.lg,
    width: 64,
    height: 64,
    borderRadius: RADIUS.full,
    ...SHADOWS.glow,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    fontSize: 32,
    color: COLORS.text.primary,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
});
