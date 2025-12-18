import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, borderRadius, shadows } from '../theme/index';

interface GlassCardProps {
    children: ReactNode;
    style?: ViewStyle;
    intensity?: number;
}

export default function GlassCard({ children, style, intensity = 80 }: GlassCardProps) {
    return (
        <View style={[styles.container, style]}>
            <BlurView intensity={intensity} tint="light" style={styles.blur}>
                <View style={styles.content}>
                    {children}
                </View>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        backgroundColor: colors.glass,
        ...shadows.md,
    },
    blur: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
    },
});