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
import { AnimatedCounter } from './AnimatedCounter';

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
          <View style={styles.balanceContainer}>
            <AnimatedCounter
              value={balance}
              prefix="₹"
              style={styles.balance}
              duration={1200}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.stat}>
              <View style={[styles.indicator, { backgroundColor: COLORS.income }]} />
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>Income</Text>
                <AnimatedCounter
                  value={income}
                  prefix="₹"
                  style={{ ...styles.statValue, color: COLORS.income }}
                  duration={1000}
                />
              </View>
            </View>

            <View style={styles.stat}>
              <View style={[styles.indicator, { backgroundColor: COLORS.expense }]} />
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>Expense</Text>
                <AnimatedCounter
                  value={expense}
                  prefix="₹"
                  style={{ ...styles.statValue, color: COLORS.expense }}
                  duration={1000}
                />
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
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  balanceContainer: {
    marginBottom: SPACING.lg,
  },
  balance: {
    fontSize: 42,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    lineHeight: 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  statInfo: {
    flex: 1,
  },
  indicator: {
    width: 4,
    height: 40,
    borderRadius: RADIUS.full,
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
