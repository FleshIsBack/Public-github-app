import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import GradientButton from '../../../components/Gradientbutton';
import { StepHeader } from '../components/Onboardingcomponents';
import { useOnboarding } from '../context/OnboardingContext';
import { WaterIntake, SunExposure, StressLevel } from '../types/Onboarding';
import { colors, gradients, spacing, typography, borderRadius, shadows } from '../../../theme';

interface LifestyleStepProps {
    onContinue: () => void;
    onBack: () => void;
}

export default function LifestyleStep({ onContinue, onBack }: LifestyleStepProps) {
    const { data, setLifestyleData } = useOnboarding();
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <StepHeader
                    title="Your Lifestyle Habits 🌿"
                    subtitle="This helps us personalize your routine even more (optional)"
                />

                {/* Sleep Hours */}
                <View style={styles.questionCard}>
                    <View style={styles.questionHeader}>
                        <Ionicons name="moon" size={24} color={colors.lavender} />
                        <Text style={styles.questionTitle}>How many hours do you sleep?</Text>
                    </View>
                    <View style={styles.sliderContainer}>
                        <Slider
                            style={styles.slider}
                            minimumValue={4}
                            maximumValue={10}
                            step={1}
                            value={data.lifestyle.sleepHours || 7}
                            onValueChange={(value) => setLifestyleData({ sleepHours: value })}
                            minimumTrackTintColor={colors.primary}
                            maximumTrackTintColor={colors.text.light}
                            thumbTintColor={colors.primary}
                        />
                        <View style={styles.sliderLabels}>
                            <Text style={styles.sliderLabel}>4h</Text>
                            <Text style={styles.sliderValue}>
                                {data.lifestyle.sleepHours || 7} hours
                            </Text>
                            <Text style={styles.sliderLabel}>10h</Text>
                        </View>
                    </View>
                    <SleepFeedback hours={data.lifestyle.sleepHours || 7} />
                </View>

                {/* Water Intake */}
                <View style={styles.questionCard}>
                    <View style={styles.questionHeader}>
                        <Ionicons name="water" size={24} color={colors.mint} />
                        <Text style={styles.questionTitle}>Daily water intake?</Text>
                    </View>
                    <View style={styles.optionsRow}>
                        <OptionButton
                            label="Low"
                            sublabel="< 4 glasses"
                            emoji="🥤"
                            selected={data.lifestyle.waterIntake === 'low'}
                            onPress={() => setLifestyleData({ waterIntake: 'low' })}
                        />
                        <OptionButton
                            label="Moderate"
                            sublabel="4-6 glasses"
                            emoji="💧"
                            selected={data.lifestyle.waterIntake === 'moderate'}
                            onPress={() => setLifestyleData({ waterIntake: 'moderate' })}
                        />
                        <OptionButton
                            label="High"
                            sublabel="7+ glasses"
                            emoji="🌊"
                            selected={data.lifestyle.waterIntake === 'high'}
                            onPress={() => setLifestyleData({ waterIntake: 'high' })}
                        />
                    </View>
                </View>

                {/* Sun Exposure */}
                <View style={styles.questionCard}>
                    <View style={styles.questionHeader}>
                        <Ionicons name="sunny" size={24} color={colors.peach} />
                        <Text style={styles.questionTitle}>Daily sun exposure?</Text>
                    </View>
                    <View style={styles.optionsRow}>
                        <OptionButton
                            label="Minimal"
                            sublabel="Mostly indoors"
                            emoji="🏠"
                            selected={data.lifestyle.sunExposure === 'minimal'}
                            onPress={() => setLifestyleData({ sunExposure: 'minimal' })}
                        />
                        <OptionButton
                            label="Moderate"
                            sublabel="Some outdoor time"
                            emoji="🌤️"
                            selected={data.lifestyle.sunExposure === 'moderate'}
                            onPress={() => setLifestyleData({ sunExposure: 'moderate' })}
                        />
                        <OptionButton
                            label="High"
                            sublabel="Often outdoors"
                            emoji="☀️"
                            selected={data.lifestyle.sunExposure === 'high'}
                            onPress={() => setLifestyleData({ sunExposure: 'high' })}
                        />
                    </View>
                </View>

                {/* Stress Level */}
                <View style={styles.questionCard}>
                    <View style={styles.questionHeader}>
                        <Ionicons name="fitness" size={24} color={colors.blush} />
                        <Text style={styles.questionTitle}>Stress level?</Text>
                    </View>
                    <View style={styles.optionsRow}>
                        <OptionButton
                            label="Low"
                            sublabel="Pretty chill"
                            emoji="😌"
                            selected={data.lifestyle.stressLevel === 'low'}
                            onPress={() => setLifestyleData({ stressLevel: 'low' })}
                        />
                        <OptionButton
                            label="Moderate"
                            sublabel="Manageable"
                            emoji="😐"
                            selected={data.lifestyle.stressLevel === 'moderate'}
                            onPress={() => setLifestyleData({ stressLevel: 'moderate' })}
                        />
                        <OptionButton
                            label="High"
                            sublabel="Often stressed"
                            emoji="😰"
                            selected={data.lifestyle.stressLevel === 'high'}
                            onPress={() => setLifestyleData({ stressLevel: 'high' })}
                        />
                    </View>
                </View>

                {/* Skip Notice */}
                <View style={styles.skipNotice}>
                    <Ionicons name="information-circle" size={18} color={colors.text.tertiary} />
                    <Text style={styles.skipNoticeText}>
                        This step is optional. You can always update this later in settings.
                    </Text>
                </View>
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.bottomActions}>
                <GradientButton
                    title="Continue"
                    onPress={onContinue}
                    style={styles.continueButton}
                />
                <TouchableOpacity style={styles.skipButton} onPress={onContinue}>
                    <Text style={styles.skipButtonText}>Skip for now</Text>
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
}

interface OptionButtonProps {
    label: string;
    sublabel: string;
    emoji: string;
    selected: boolean;
    onPress: () => void;
}

function OptionButton({ label, sublabel, emoji, selected, onPress }: OptionButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.optionButton, selected && styles.optionButtonSelected]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {selected && (
                <LinearGradient
                    colors={gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
            )}
            <Text style={styles.optionEmoji}>{emoji}</Text>
            <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                {label}
            </Text>
            <Text style={[styles.optionSublabel, selected && styles.optionSublabelSelected]}>
                {sublabel}
            </Text>
        </TouchableOpacity>
    );
}

interface SleepFeedbackProps {
    hours: number;
}

function SleepFeedback({ hours }: SleepFeedbackProps) {
    let message = '';
    let emoji = '';
    let color: string = colors.text.secondary;

    if (hours < 6) {
        message = 'Not enough! Sleep deprivation affects skin health.';
        emoji = '😴';
        color = colors.warning;
    } else if (hours <= 7) {
        message = 'Good! Try to aim for 7-8 hours for optimal skin repair.';
        emoji = '👍';
        color = colors.text.secondary;
    } else if (hours <= 8) {
        message = 'Perfect! This is the sweet spot for skin regeneration.';
        emoji = '✨';
        color = colors.success;
    } else {
        message = 'Great for recovery! Quality matters too.';
        emoji = '😊';
        color = colors.success;
    }

    return (
        <View style={[styles.feedbackContainer, { backgroundColor: color + '15' }]}>
            <Text style={styles.feedbackEmoji}>{emoji}</Text>
            <Text style={[styles.feedbackText, { color }]}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.xl,
        paddingBottom: 140,
    },
    questionCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        ...shadows.sm,
    },
    questionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    questionTitle: {
        ...typography.bodyBold,
        color: colors.text.primary,
        marginLeft: spacing.sm,
        flex: 1,
    },
    sliderContainer: {
        marginBottom: spacing.md,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.xs,
    },
    sliderLabel: {
        ...typography.caption,
        color: colors.text.tertiary,
    },
    sliderValue: {
        ...typography.bodyBold,
        color: colors.primary,
    },
    feedbackContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.sm,
        borderRadius: borderRadius.sm,
    },
    feedbackEmoji: {
        fontSize: 16,
        marginRight: spacing.sm,
    },
    feedbackText: {
        ...typography.caption,
        flex: 1,
    },
    optionsRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    optionButton: {
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.text.light,
        overflow: 'hidden',
    },
    optionButtonSelected: {
        borderColor: colors.primary,
    },
    optionEmoji: {
        fontSize: 24,
        marginBottom: spacing.xs,
    },
    optionLabel: {
        ...typography.bodyBold,
        color: colors.text.primary,
        fontSize: 13,
        marginBottom: 2,
    },
    optionLabelSelected: {
        color: '#FFFFFF',
    },
    optionSublabel: {
        ...typography.caption,
        color: colors.text.tertiary,
        fontSize: 10,
        textAlign: 'center',
    },
    optionSublabelSelected: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    skipNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
    },
    skipNoticeText: {
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
    skipButton: {
        alignItems: 'center',
        padding: spacing.sm,
    },
    skipButtonText: {
        ...typography.body,
        color: colors.text.secondary,
    },
});