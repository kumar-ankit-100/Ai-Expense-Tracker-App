import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/theme/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  gradient?: boolean;
  gradientColors?: string[];
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 20,
  gradient = false,
  gradientColors,
}) => {
  if (gradient) {
    return (
      <View style={[styles.container, style]}>
        <LinearGradient
          colors={gradientColors || ['rgba(0, 105, 255, 0.2)', 'rgba(0, 105, 255, 0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <BlurView intensity={intensity} style={styles.blur}>
            {children}
          </BlurView>
        </LinearGradient>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={intensity} style={styles.blur}>
        <View style={styles.content}>{children}</View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: COLORS.glass.light,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  gradient: {
    flex: 1,
  },
  blur: {
    flex: 1,
    padding: SPACING.md,
  },
  content: {
    flex: 1,
  },
});
