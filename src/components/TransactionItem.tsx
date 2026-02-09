import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GlassCard } from './GlassCard';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '@/theme/colors';
import { formatDate } from '@/utils/helpers';
import { useCurrency } from '@/hooks';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface TransactionItemProps {
  transaction: {
    id: string;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    categoryIcon: string;
    categoryColor: string;
    category: string;
    date: string;
    note?: string;
  };
  onPress?: () => void;
  index?: number;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
  index = 0,
}) => {
  const { format } = useCurrency();
  const isIncome = transaction.type === 'income';
  
  return (
    <Animated.View entering={FadeInRight.delay(index * 50).springify()}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <GlassCard style={styles.card}>
          <View style={styles.container}>
            <View style={styles.leftSection}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${transaction.categoryColor}20` },
                ]}
              >
                <Text style={styles.icon}>{transaction.categoryIcon}</Text>
              </View>
              
              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>
                  {transaction.title}
                </Text>
                <Text style={styles.category} numberOfLines={1}>
                  {transaction.category} • {formatDate(transaction.date, 'relative')}
                </Text>
              </View>
            </View>
            
            <View style={styles.rightSection}>
              <Text
                style={[
                  styles.amount,
                  { color: isIncome ? COLORS.income : COLORS.expense },
                ]}
              >
                {isIncome ? '+' : '-'}
                {format(transaction.amount)}
              </Text>
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  category: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
});
