export const COLORS = {
  // Primary Blue Palette
  primary: {
    50: '#E6F0FF',
    100: '#CCE1FF',
    200: '#99C3FF',
    300: '#66A5FF',
    400: '#3387FF',
    500: '#0069FF',
    600: '#0054CC',
    700: '#003F99',
    800: '#002A66',
    900: '#001533',
  },
  
  // Dark Theme
  dark: {
    50: '#1A1F3A',
    100: '#151A30',
    200: '#101426',
    300: '#0C0F1D',
    400: '#0A0E27',
    500: '#080B1E',
    600: '#060914',
    700: '#04060D',
    800: '#020307',
    900: '#000000',
  },
  
  // Semantic Colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Finance Specific
  income: '#10B981',
  expense: '#EF4444',
  
  // Gradients
  gradients: {
    primary: ['#0069FF', '#0054CC'],
    success: ['#10B981', '#059669'],
    error: ['#EF4444', '#DC2626'],
    dark: ['#0A0E27', '#060914'],
    blue: ['#667EEA', '#764BA2'],
    purple: ['#A78BFA', '#C084FC'],
  },
  
  // Glassmorphism
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.15)',
    dark: 'rgba(0, 0, 0, 0.3)',
  },
  
  // Text
  text: {
    primary: '#FFFFFF',
    secondary: '#A0AEC0',
    tertiary: '#718096',
    disabled: '#4A5568',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#0069FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
};

export const TYPOGRAPHY = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const ANIMATION = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    inOut: 'ease-in-out',
    in: 'ease-in',
    out: 'ease-out',
  },
};
