import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients, spacing, typography, borderRadius, shadows } from '../../../theme';

const { width } = Dimensions.get('window');

interface SelectableCardProps {
    selected: boolean;
    onPress: () => void;
    emoji: string;
    label: string;
    description?: string;
    style?: object;
    compact?: boolean;
}

export function SelectableCard({
    selected,
    onPress,
    emoji,
    label,
    description,
    style,
    compact = false,
}: SelectableCardProps) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const checkAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(checkAnim, {
            toValue: selected ? 1 : 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
        }).start();
    }, [selected]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
            style={[compact ? styles.compactCardContainer : styles.cardContainer, style]}
        >
            <Animated.View
                style={[
                    compact ? styles.compactCard : styles.card,
                    selected && styles.cardSelected,
                    { transform: [{ scale: scaleAnim }] },
                ]}
            >
                {selected && (
                    <LinearGradient
                        colors={gradients.primary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={StyleSheet.absoluteFill}
                    />
                )}

                <View style={compact ? styles.compactCardContent : styles.cardContent}>
                    <Text style={[
                        compact ? styles.compactEmoji : styles.emoji,
                        selected && styles.emojiSelected
                    ]}>
                        {emoji}
                    </Text>
                    <Text style={[
                        compact ? styles.compactLabel : styles.label,
                        selected && styles.labelSelected
                    ]}>
                        {label}
                    </Text>
                    {description && !compact && (
                        <Text style={[
                            styles.description,
                            selected && styles.descriptionSelected
                        ]}>
                            {description}
                        </Text>
                    )}
                </View>

                {/* Selection Indicator */}
                <Animated.View
                    style={[
                        styles.checkBadge,
                        {
                            opacity: checkAnim,
                            transform: [
                                { scale: checkAnim },
                            ],
                        },
                    ]}
                >
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                </Animated.View>
            </Animated.View>
        </TouchableOpacity>
    );
}

interface ProgressIndicatorProps {
    currentStep: number;
    totalSteps: number;
    style?: object;
}

export function ProgressIndicator({ currentStep, totalSteps, style }: ProgressIndicatorProps) {
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(progressAnim, {
            toValue: (currentStep + 1) / totalSteps,
            useNativeDriver: false,
            tension: 50,
            friction: 10,
        }).start();
    }, [currentStep, totalSteps]);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={[styles.progressContainer, style]}>
            <View style={styles.progressBar}>
                <Animated.View style={[styles.progressFillContainer, { width: progressWidth }]}>
                    <LinearGradient
                        colors={gradients.primary}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.progressFill}
                    />
                </Animated.View>
            </View>
            <Text style={styles.progressText}>
                {currentStep + 1} of {totalSteps}
            </Text>
        </View>
    );
}

interface StepHeaderProps {
    title: string;
    subtitle: string;
    style?: object;
}

export function StepHeader({ title, subtitle, style }: StepHeaderProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        fadeAnim.setValue(0);
        slideAnim.setValue(20);

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, [title]);

    return (
        <Animated.View
            style={[
                styles.headerContainer,
                style,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
        </Animated.View>
    );
}

interface SelectionCounterProps {
    current: number;
    max: number;
    label: string;
}

export function SelectionCounter({ current, max, label }: SelectionCounterProps) {
    return (
        <View style={styles.counterContainer}>
            <Text style={styles.counterText}>
                <Text style={styles.counterCurrent}>{current}</Text>
                <Text style={styles.counterMax}>/{max}</Text>
            </Text>
            <Text style={styles.counterLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    // Card Styles
    cardContainer: {
        width: (width - spacing.xl * 2 - spacing.md) / 2,
        marginBottom: spacing.md,
    },
    compactCardContainer: {
        marginBottom: spacing.sm,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
        ...shadows.sm,
    },
    compactCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
        ...shadows.sm,
    },
    cardSelected: {
        borderColor: colors.primary,
    },
    cardContent: {
        alignItems: 'center',
    },
    compactCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    emoji: {
        fontSize: 36,
        marginBottom: spacing.sm,
    },
    compactEmoji: {
        fontSize: 24,
        marginRight: spacing.md,
    },
    emojiSelected: {},
    label: {
        ...typography.bodyBold,
        color: colors.text.primary,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    compactLabel: {
        ...typography.body,
        color: colors.text.primary,
        flex: 1,
    },
    labelSelected: {
        color: '#FFFFFF',
    },
    description: {
        ...typography.caption,
        color: colors.text.secondary,
        textAlign: 'center',
    },
    descriptionSelected: {
        color: 'rgba(255, 255, 255, 0.8)',
    },
    checkBadge: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.success,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Progress Indicator Styles
    progressContainer: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
    },
    progressBar: {
        height: 6,
        backgroundColor: colors.text.light,
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: spacing.sm,
    },
    progressFillContainer: {
        height: '100%',
    },
    progressFill: {
        flex: 1,
        borderRadius: 3,
    },
    progressText: {
        ...typography.caption,
        color: colors.text.tertiary,
        textAlign: 'center',
    },

    // Header Styles
    headerContainer: {
        marginBottom: spacing.xl,
    },
    title: {
        ...typography.h1,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.body,
        color: colors.text.secondary,
    },

    // Counter Styles
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        alignSelf: 'flex-start',
        marginBottom: spacing.lg,
        ...shadows.sm,
    },
    counterText: {
        marginRight: spacing.sm,
    },
    counterCurrent: {
        ...typography.h3,
        color: colors.primary,
    },
    counterMax: {
        ...typography.body,
        color: colors.text.tertiary,
    },
    counterLabel: {
        ...typography.caption,
        color: colors.text.secondary,
    },
});