import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from '@/theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: RADIUS.xl,
      ...SHADOWS.medium,
    };
    
    // Size
    switch (size) {
      case 'small':
        base.paddingVertical = SPACING.sm;
        base.paddingHorizontal = SPACING.md;
        break;
      case 'large':
        base.paddingVertical = SPACING.lg;
        base.paddingHorizontal = SPACING.xl;
        break;
      default:
        base.paddingVertical = SPACING.md;
        base.paddingHorizontal = SPACING.lg;
    }
    
    // Variant
    switch (variant) {
      case 'primary':
        base.backgroundColor = COLORS.primary[500];
        break;
      case 'secondary':
        base.backgroundColor = COLORS.dark[200];
        break;
      case 'outline':
        base.backgroundColor = 'transparent';
        base.borderWidth = 2;
        base.borderColor = COLORS.primary[500];
        break;
      case 'ghost':
        base.backgroundColor = 'transparent';
        delete base.shadowColor;
        break;
      case 'gradient':
        // Handled by LinearGradient
        break;
    }
    
    if (disabled) {
      base.opacity = 0.5;
    }
    
    if (fullWidth) {
      base.width = '100%';
    }
    
    return base;
  };
  
  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      color: COLORS.text.primary,
      fontWeight: TYPOGRAPHY.weights.semibold,
    };
    
    switch (size) {
      case 'small':
        base.fontSize = TYPOGRAPHY.sizes.sm;
        break;
      case 'large':
        base.fontSize = TYPOGRAPHY.sizes.lg;
        break;
      default:
        base.fontSize = TYPOGRAPHY.sizes.md;
    }
    
    if (variant === 'outline' || variant === 'ghost') {
      base.color = COLORS.primary[500];
    }
    
    return base;
  };
  
  const content = (
    <>
      {loading && <ActivityIndicator color={COLORS.text.primary} style={{ marginRight: SPACING.sm }} />}
      {!loading && icon && <View style={{ marginRight: SPACING.sm }}>{icon}</View>}
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </>
  );
  
  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[fullWidth && { width: '100%' }, style]}
      >
        <LinearGradient
          colors={COLORS.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[getButtonStyle(), style]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[getButtonStyle(), style]}
    >
      {content}
    </TouchableOpacity>
  );
};
