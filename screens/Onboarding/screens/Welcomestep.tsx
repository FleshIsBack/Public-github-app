import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import GradientButton from '../../../components/Gradientbutton';
import { colors, gradients, spacing, typography, borderRadius } from '../../../theme';

const { width, height } = Dimensions.get('window');

interface WelcomeStepProps {
    onContinue: () => void;
    onBack?: () => void;
}

export default function WelcomeStep({ onContinue }: WelcomeStepProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const sparkle1 = useRef(new Animated.Value(0)).current;
    const sparkle2 = useRef(new Animated.Value(0)).current;
    const sparkle3 = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Main entrance animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();

        // Staggered sparkle animations
        const sparkleAnimation = (anim: Animated.Value, delay: number) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        sparkleAnimation(sparkle1, 0);
        sparkleAnimation(sparkle2, 500);
        sparkleAnimation(sparkle3, 1000);

        // Pulse animation for main icon
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const sparkleStyle = (anim: Animated.Value, top: number, left: number) => ({
        position: 'absolute' as const,
        top,
        left,
        opacity: anim,
        transform: [
            {
                scale: anim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.5, 1.2, 0.5],
                }),
            },
        ],
    });

    return (
        <View style={styles.container}>
            {/* Background Pattern */}
            <View style={styles.backgroundPattern}>
                {[...Array(20)].map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.patternDot,
                            {
                                top: Math.random() * height,
                                left: Math.random() * width,
                                opacity: Math.random() * 0.3 + 0.1,
                            },
                        ]}
                    />
                ))}
            </View>

            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    {/* Floating Sparkles */}
                    <Animated.View style={sparkleStyle(sparkle1, -20, width * 0.2)}>
                        <Ionicons name="sparkles" size={24} color={colors.peach} />
                    </Animated.View>
                    <Animated.View style={sparkleStyle(sparkle2, 40, width * 0.7)}>
                        <Ionicons name="star" size={20} color={colors.mint} />
                    </Animated.View>
                    <Animated.View style={sparkleStyle(sparkle3, 100, width * 0.15)}>
                        <Ionicons name="heart" size={18} color={colors.lavender} />
                    </Animated.View>

                    {/* Main Icon */}
                    <Animated.View
                        style={[
                            styles.iconContainer,
                            { transform: [{ scale: pulseAnim }] },
                        ]}
                    >
                        <LinearGradient
                            colors={gradients.sunset}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.iconGradient}
                        >
                            <View style={styles.iconInner}>
                                <Ionicons name="sparkles" size={50} color={colors.primary} />
                            </View>
                        </LinearGradient>
                    </Animated.View>

                    <Text style={styles.title}>Welcome to{'\n'}Glow Up</Text>
                    <Text style={styles.subtitle}>
                        Your personalized skin journey{'\n'}starts here ✨
                    </Text>
                </View>

                {/* Value Props */}
                <View style={styles.valueProps}>
                    <ValuePropItem
                        icon="scan"
                        title="AI Skin Analysis"
                        description="Get detailed insights about your unique skin"
                    />
                    <ValuePropItem
                        icon="heart"
                        title="Personalized Routine"
                        description="Custom skin routine just for you"
                    />
                    <ValuePropItem
                        icon="trending-up"
                        title="Track Your Glow"
                        description="Watch your glass skin score improve"
                    />
                </View>

                {/* Free Badge */}
                {/* <View style={styles.freeBadge}>
                    <Ionicons name="gift" size={18} color={colors.success} />
                    <Text style={styles.freeBadgeText}>
                        Free to start • No credit card required
                    </Text>
                </View> */}

                {/* CTA */}
                <GradientButton
                    title="Begin Your Glow Journey"
                    onPress={onContinue}
                    style={styles.ctaButton}
                />

                <Text style={styles.disclaimer}>
                    Takes only 2 minutes to set up
                </Text>
            </Animated.View>
        </View>
    );
}

interface ValuePropItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
}

function ValuePropItem({ icon, title, description }: ValuePropItemProps) {
    return (
        <View style={styles.valueProp}>
            <View style={styles.valuePropIcon}>
                <LinearGradient
                    colors={gradients.primary}
                    style={styles.valuePropIconGradient}
                >
                    <Ionicons name={icon} size={20} color="#FFFFFF" />
                </LinearGradient>
            </View>
            <View style={styles.valuePropText}>
                <Text style={styles.valuePropTitle}>{title}</Text>
                <Text style={styles.valuePropDesc}>{description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundPattern: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    patternDot: {
        position: 'absolute',
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.primary,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xxl,
    },
    heroSection: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    iconContainer: {
        marginBottom: spacing.xl,
    },
    iconGradient: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
    },
    iconInner: {
        width: '100%',
        height: '100%',
        borderRadius: 58,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: colors.text.primary,
        textAlign: 'center',
        marginBottom: spacing.md,
        lineHeight: 44,
    },
    subtitle: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    valueProps: {
        marginBottom: spacing.xl,
    },
    valueProp: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    valuePropIcon: {
        marginRight: spacing.md,
    },
    valuePropIconGradient: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    valuePropText: {
        flex: 1,
    },
    valuePropTitle: {
        ...typography.bodyBold,
        color: colors.text.primary,
        marginBottom: 2,
    },
    valuePropDesc: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    freeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.success + '15',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.full,
        marginBottom: spacing.xl,
        alignSelf: 'center',
    },
    freeBadgeText: {
        ...typography.caption,
        color: colors.success,
        marginLeft: spacing.sm,
        fontWeight: '600',
    },
    ctaButton: {
        marginBottom: spacing.md,
    },
    disclaimer: {
        ...typography.caption,
        color: colors.text.tertiary,
        textAlign: 'center',
    },
});