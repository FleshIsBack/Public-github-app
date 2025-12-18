import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, borderRadius, typography, shadows } from '../theme/index';

interface GradientButtonProps {
    title: string;
    onPress: () => void;
    gradient?: readonly [string, string, ...string[]];
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export default function GradientButton({
    title,
    onPress,
    gradient = gradients.primary,
    disabled = false,
    loading = false,
    style,
    textStyle
}: GradientButtonProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[styles.container, style]}
        >
            <LinearGradient
                colors={disabled ? ['#9B9BAB', '#9B9BAB'] as const : gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={[styles.text, textStyle]}>{title}</Text>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 56,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        ...shadows.md,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    text: {
        ...typography.bodyBold,
        color: '#FFFFFF',
        textAlign: 'center',
    },
});