import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '@/theme/colors';
import { GlassCard } from './GlassCard';
import { useCurrency } from '@/hooks';

interface BalanceCardProps {
  balance: number;
  income: number;
  expense: number;
  onPress?: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  income,
  expense,
  onPress,
}) => {
  const { format } = useCurrency();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 90,
    });
    opacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  
  return (
    <Animated.View style={[animatedStyle]}>
      <GlassCard
        gradient
        gradientColors={['rgba(0, 105, 255, 0.3)', 'rgba(102, 126, 234, 0.2)']}
        style={styles.card}
      >
        <View>
          <Text style={styles.label}>Total Balance</Text>
          <Text style={styles.balance}>{format(balance)}</Text>
          
          <View style={styles.row}>
            <View style={styles.stat}>
              <View style={[styles.indicator, { backgroundColor: COLORS.income }]} />
              <View>
                <Text style={styles.statLabel}>Income</Text>
                <Text style={[styles.statValue, { color: COLORS.income }]}>
                  {format(income)}
                </Text>
              </View>
            </View>
            
            <View style={styles.stat}>
              <View style={[styles.indicator, { backgroundColor: COLORS.expense }]} />
              <View>
                <Text style={styles.statLabel}>Expense</Text>
                <Text style={[styles.statValue, { color: COLORS.expense }]}>
                  {format(expense)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  balance: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  indicator: {
    width: 4,
    height: 32,
    borderRadius: RADIUS.xs,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.text.secondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
});
