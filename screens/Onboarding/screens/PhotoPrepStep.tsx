import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import GradientButton from '../../../components/Gradientbutton';
import { StepHeader } from '../components/Onboardingcomponents';
import { StepProps } from '../types/Onboarding';
import { colors, gradients, spacing, typography, borderRadius, shadows } from '../../../theme';

const { width } = Dimensions.get('window');

interface TipItem {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    color: string;
}

const TIPS: TipItem[] = [
    {
        icon: 'sunny',
        title: 'Good Lighting',
        description: 'Face a window or use soft, natural light.',
        color: colors.peach,
    },
    {
        icon: 'water',
        title: 'Clean Face',
        description: 'Remove makeup for best results.',
        color: colors.mint,
    },
    {
        icon: 'camera',
        title: 'Front Camera',
        description: 'Hold phone at eye level.',
        color: colors.lavender,
    },
    {
        icon: 'eye',
        title: 'Face Forward',
        description: 'Look directly at the camera.',
        color: colors.blush,
    },
];

const WHAT_WE_ANALYZE = [
    { emoji: '✨', text: 'Skin clarity & glow' },
    { emoji: '💧', text: 'Hydration levels' },
    { emoji: '🎨', text: 'Undertone & colors' },
    { emoji: '🔍', text: 'Pore visibility' },
    { emoji: '💎', text: 'Glass skin score' },
];

export default function PhotoPrepStep({ onContinue, onBack }: StepProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [currentTip, setCurrentTip] = useState(0);
    const tipOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();

        const tipInterval = setInterval(() => {
            Animated.timing(tipOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                setCurrentTip((prev) => (prev + 1) % TIPS.length);
                Animated.timing(tipOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            });
        }, 3000);

        return () => clearInterval(tipInterval);
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <StepHeader
                    title="Ready for Your Analysis? 📸"
                    subtitle="Get the most accurate results with these tips"
                />

                {/* Animated Tip Card */}
                <Animated.View style={[styles.highlightCard, { opacity: tipOpacity }]}>
                    <LinearGradient
                        colors={[TIPS[currentTip].color + '30', TIPS[currentTip].color + '10']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={[styles.highlightIcon, { backgroundColor: TIPS[currentTip].color + '40' }]}>
                        <Ionicons name={TIPS[currentTip].icon} size={32} color={TIPS[currentTip].color} />
                    </View>
                    <Text style={styles.highlightTitle}>{TIPS[currentTip].title}</Text>
                    <Text style={styles.highlightDesc}>{TIPS[currentTip].description}</Text>

                    <View style={styles.tipIndicators}>
                        {TIPS.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.tipDot,
                                    index === currentTip && styles.tipDotActive,
                                    index === currentTip && { backgroundColor: TIPS[currentTip].color },
                                ]}
                            />
                        ))}
                    </View>
                </Animated.View>

                {/* Tips Grid */}
                <View style={styles.tipsGrid}>
                    {TIPS.map((tip, index) => (
                        <View key={index} style={styles.tipItem}>
                            <View style={[styles.tipIcon, { backgroundColor: tip.color + '20' }]}>
                                <Ionicons name={tip.icon} size={20} color={tip.color} />
                            </View>
                            <Text style={styles.tipTitle}>{tip.title}</Text>
                        </View>
                    ))}
                </View>

                {/* What We Analyze */}
                <View style={styles.analyzeSection}>
                    <Text style={styles.sectionTitle}>What We'll Analyze</Text>
                    <View style={styles.analyzeGrid}>
                        {WHAT_WE_ANALYZE.map((item, index) => (
                            <View key={index} style={styles.analyzeItem}>
                                <Text style={styles.analyzeEmoji}>{item.emoji}</Text>
                                <Text style={styles.analyzeText}>{item.text}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Privacy Card */}
                <View style={styles.privacyCard}>
                    <View style={styles.privacyHeader}>
                        <Ionicons name="lock-closed" size={20} color={colors.success} />
                        <Text style={styles.privacyTitle}>Your Privacy is Protected</Text>
                    </View>
                    <Text style={styles.privacyText}>
                        Photos are processed securely and never stored or shared.
                    </Text>
                </View>

                {/* Time Estimate */}
                <View style={styles.timeEstimate}>
                    <Ionicons name="time-outline" size={18} color={colors.text.tertiary} />
                    <Text style={styles.timeText}>Takes about 30 seconds</Text>
                </View>
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.bottomActions}>
                <GradientButton
                    title="I'm Ready! Let's Go 📸"
                    onPress={onContinue}
                    style={styles.continueButton}
                />
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.xl,
        paddingBottom: 120,
    },
    highlightCard: {
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        alignItems: 'center',
        marginBottom: spacing.xl,
        overflow: 'hidden',
    },
    highlightIcon: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    highlightTitle: {
        ...typography.h3,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    highlightDesc: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    tipIndicators: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    tipDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.text.light,
    },
    tipDotActive: {
        width: 24,
    },
    tipsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
    },
    tipItem: {
        width: '48%',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
        ...shadows.sm,
    },
    tipIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    tipTitle: {
        ...typography.caption,
        color: colors.text.primary,
        fontWeight: '600',
        flex: 1,
    },
    analyzeSection: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    analyzeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    analyzeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.full,
        ...shadows.sm,
    },
    analyzeEmoji: {
        fontSize: 16,
        marginRight: spacing.xs,
    },
    analyzeText: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    privacyCard: {
        backgroundColor: colors.success + '10',
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderLeftWidth: 4,
        borderLeftColor: colors.success,
    },
    privacyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    privacyTitle: {
        ...typography.bodyBold,
        color: colors.success,
        marginLeft: spacing.sm,
    },
    privacyText: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    timeEstimate: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.md,
    },
    timeText: {
        ...typography.caption,
        color: colors.text.tertiary,
        marginLeft: spacing.sm,
    },
    bottomActions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.text.light,
    },
    continueButton: {
        marginBottom: spacing.sm,
    },
});