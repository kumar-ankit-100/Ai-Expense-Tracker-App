import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

/**
 * Spring animation config presets
 */
export const SPRING_CONFIGS = {
  default: {
    damping: 15,
    stiffness: 90,
  },
  bouncy: {
    damping: 10,
    stiffness: 100,
  },
  smooth: {
    damping: 20,
    stiffness: 120,
  },
  slow: {
    damping: 25,
    stiffness: 60,
  },
};

/**
 * Timing animation config presets
 */
export const TIMING_CONFIGS = {
  fast: {
    duration: 200,
    easing: Easing.out(Easing.cubic),
  },
  normal: {
    duration: 300,
    easing: Easing.inOut(Easing.ease),
  },
  slow: {
    duration: 500,
    easing: Easing.out(Easing.exp),
  },
  elastic: {
    duration: 600,
    easing: Easing.elastic(1.2),
  },
};

/**
 * Hook for fade in animation
 */
export const useFadeIn = (delay = 0, duration = 300) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return animatedStyle;
};

/**
 * Hook for scale in animation
 */
export const useScaleIn = (delay = 0) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      scale.value = withSpring(1, SPRING_CONFIGS.bouncy);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return animatedStyle;
};

/**
 * Hook for slide in animation
 */
export const useSlideIn = (direction: 'left' | 'right' | 'top' | 'bottom', distance = 50) => {
  const translateX = useSharedValue(direction === 'left' ? -distance : direction === 'right' ? distance : 0);
  const translateY = useSharedValue(direction === 'top' ? -distance : direction === 'bottom' ? distance : 0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(0, SPRING_CONFIGS.smooth);
    translateY.value = withSpring(0, SPRING_CONFIGS.smooth);
    opacity.value = withTiming(1, TIMING_CONFIGS.normal);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return animatedStyle;
};

/**
 * Hook for pulsing animation
 */
export const usePulse = () => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return animatedStyle;
};

/**
 * Hook for shimmer animation (for skeleton loaders)
 */
export const useShimmer = () => {
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          translateX.value,
          [-1, 1],
          [-300, 300],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  return animatedStyle;
};

/**
 * Hook for floating animation
 */
export const useFloat = (distance = 10, duration = 2000) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-distance, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: duration / 2, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
};

/**
 * Hook for rotate animation
 */
export const useRotate = (duration = 2000) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return animatedStyle;
};

/**
 * Hook for progress bar animation
 */
export const useProgressBar = (progress: number, duration = 500) => {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(progress, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return animatedStyle;
};

/**
 * Hook for count up animation
 */
export const useCountUp = (end: number, duration = 1000) => {
  const count = useSharedValue(0);

  useEffect(() => {
    count.value = withTiming(end, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [end]);

  return count;
};
