import React, { useEffect, useState } from 'react';
import { Text, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedReaction,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  style?: TextStyle;
  onAnimationComplete?: () => void;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  prefix = '',
  suffix = '',
  decimals = 0,
  style,
  onAnimationComplete,
}) => {
  const [displayValue, setDisplayValue] = useState('0');
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(
      value,
      {
        duration,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        if (finished && onAnimationComplete) {
          runOnJS(onAnimationComplete)();
        }
      }
    );
  }, [value, duration]);

  useAnimatedReaction(
    () => animatedValue.value,
    (currentValue) => {
      const formatted = currentValue.toFixed(decimals);
      const withCommas = parseFloat(formatted).toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
      runOnJS(setDisplayValue)(withCommas);
    },
    [decimals]
  );

  return (
    <Text style={style}>
      {prefix}
      {displayValue}
      {suffix}
    </Text>
  );
};
