import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/theme/colors';

const { width, height } = Dimensions.get('window');

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

const generateParticles = (count: number): Particle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 80 + 40,
    delay: Math.random() * 2000,
    duration: Math.random() * 4000 + 6000,
    opacity: Math.random() * 0.3 + 0.1,
  }));
};

const FloatingParticle: React.FC<{ particle: Particle }> = ({ particle }) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(particle.opacity);

  useEffect(() => {
    // Vertical floating
    translateY.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(-50, {
          duration: particle.duration,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );

    // Horizontal floating
    translateX.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(30, {
          duration: particle.duration * 0.7,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );

    // Scale pulse
    scale.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(1.2, {
          duration: particle.duration * 0.5,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );

    // Opacity pulse
    opacity.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(particle.opacity * 0.5, {
          duration: particle.duration * 0.6,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: particle.x,
          top: particle.y,
          width: particle.size,
          height: particle.size,
        },
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={[
          `${COLORS.primary[400]}40`,
          `${COLORS.primary[600]}20`,
          'transparent',
        ]}
        style={styles.particleGradient}
      />
    </Animated.View>
  );
};

interface FloatingParticlesProps {
  count?: number;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 8,
}) => {
  const particles = generateParticles(count);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <FloatingParticle key={particle.id} particle={particle} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  particleGradient: {
    flex: 1,
    borderRadius: 9999,
  },
});
