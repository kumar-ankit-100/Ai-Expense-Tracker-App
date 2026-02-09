import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolate,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SPACING } from '@/theme/colors';
import { useEffect } from 'react';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = RADIUS.sm,
  style,
}) => {
  const translateX = useSharedValue(-1);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const interpolatedX = interpolate(
      translateX.value,
      [-1, 1],
      [-300, 300],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX: interpolatedX }],
    };
  });

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
    >
      <Animated.View style={[styles.shimmer, animatedStyle]}>
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255, 255, 255, 0.05)',
            'rgba(255, 255, 255, 0.1)',
            'rgba(255, 255, 255, 0.05)',
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

export const SkeletonCard: React.FC = () => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Skeleton width={80} height={80} borderRadius={RADIUS.md} />
      <View style={styles.cardContent}>
        <Skeleton width="60%" height={20} />
        <Skeleton width="40%" height={16} style={{ marginTop: SPACING.xs }} />
      </View>
    </View>
    <Skeleton width="100%" height={16} style={{ marginTop: SPACING.md }} />
    <Skeleton width="80%" height={16} style={{ marginTop: SPACING.xs }} />
  </View>
);

export const SkeletonBalanceCard: React.FC = () => (
  <View style={styles.balanceCard}>
    <Skeleton width="40%" height={16} />
    <Skeleton width="70%" height={40} style={{ marginTop: SPACING.sm }} />
    <View style={styles.balanceRow}>
      <View style={{ flex: 1 }}>
        <Skeleton width="60%" height={14} />
        <Skeleton width="80%" height={20} style={{ marginTop: SPACING.xs }} />
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <Skeleton width="60%" height={14} />
        <Skeleton width="80%" height={20} style={{ marginTop: SPACING.xs }} />
      </View>
    </View>
  </View>
);

export const SkeletonTransactionItem: React.FC = () => (
  <View style={styles.transaction}>
    <Skeleton width={48} height={48} borderRadius={RADIUS.md} />
    <View style={styles.transactionContent}>
      <Skeleton width="60%" height={18} />
      <Skeleton width="40%" height={14} style={{ marginTop: SPACING.xs }} />
    </View>
    <View style={{ alignItems: 'flex-end' }}>
      <Skeleton width={80} height={18} />
      <Skeleton width={60} height={14} style={{ marginTop: SPACING.xs }} />
    </View>
  </View>
);

export const SkeletonChartCard: React.FC = () => (
  <View style={styles.chartCard}>
    <Skeleton width="50%" height={20} style={{ marginBottom: SPACING.md }} />
    <Skeleton width="100%" height={200} borderRadius={RADIUS.lg} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.glass.light,
    overflow: 'hidden',
  },
  shimmer: {
    width: 300,
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.glass.light,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  balanceCard: {
    backgroundColor: COLORS.glass.light,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  balanceRow: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.glass.light,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  transactionContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  chartCard: {
    backgroundColor: COLORS.glass.light,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});
