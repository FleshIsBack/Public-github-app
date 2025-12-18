import { TextStyle, ViewStyle } from 'react-native';

export const colors = {

    primary: '#FF6B9D',
    primaryLight: '#FFB3C6',
    primaryDark: '#E5527A',

    secondary: '#C77DFF',
    secondaryLight: '#E0AAFF',
    secondaryDark: '#9D4EDD',

    background: '#FFF9FC',
    surface: '#FFFFFF',
    surfaceLight: '#FFF5F9',

    peach: '#FFD6A5',
    lavender: '#E0AAFF',
    mint: '#CAFFBF',
    blush: '#FFB3C6',
    lilac: '#C4B5D8',

    text: {
        primary: '#2D2D3A',
        secondary: '#6B6B7B',
        tertiary: '#9B9BAB',
        light: '#B8B8C8',
    },

    success: '#CAFFBF',
    warning: '#FFD6A5',
    error: '#FF99AC',

    overlay: 'rgba(45, 45, 58, 0.6)',
    overlayLight: 'rgba(255, 255, 255, 0.9)',

    glass: 'rgba(255, 255, 255, 0.85)',
    glassDark: 'rgba(255, 255, 255, 0.7)',
} as const;

export type Colors = typeof colors;

export const gradients = {
    primary: ['#FF6B9D', '#C77DFF'] as const,
    secondary: ['#FFB3C6', '#E0AAFF'] as const,
    glass: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)'] as const,
    sunset: ['#FFD6A5', '#FFB3C6', '#E0AAFF'] as const,
    aurora: ['#CAFFBF', '#C4B5D8', '#FFB3C6'] as const,
} as const;

export type Gradients = typeof gradients;

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
} as const;

export type Spacing = typeof spacing;

export const borderRadius = {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    full: 9999,
} as const;

export type BorderRadius = typeof borderRadius;

export const typography = {
    h1: {
        fontSize: 32,
        fontWeight: '700' as TextStyle['fontWeight'],
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    h2: {
        fontSize: 24,
        fontWeight: '700' as TextStyle['fontWeight'],
        lineHeight: 32,
        letterSpacing: -0.3,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600' as TextStyle['fontWeight'],
        lineHeight: 28,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as TextStyle['fontWeight'],
        lineHeight: 24,
    },
    bodyBold: {
        fontSize: 16,
        fontWeight: '600' as TextStyle['fontWeight'],
        lineHeight: 24,
    },
    caption: {
        fontSize: 14,
        fontWeight: '400' as TextStyle['fontWeight'],
        lineHeight: 20,
    },
    small: {
        fontSize: 12,
        fontWeight: '400' as TextStyle['fontWeight'],
        lineHeight: 16,
    },
} as const;

export type Typography = typeof typography;

export const shadows = {
    sm: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    lg: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10,
    },
} as const;

export type Shadows = typeof shadows;

// Theme type
export interface Theme {
    colors: Colors;
    gradients: Gradients;
    spacing: Spacing;
    borderRadius: BorderRadius;
    typography: Typography;
    shadows: Shadows;
}

const theme: Theme = {
    colors,
    gradients,
    spacing,
    borderRadius,
    typography,
    shadows,
};

export default theme;