import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GradientButton from '../../../components/Gradientbutton';
import {
    SelectableCard,
    StepHeader,
    SelectionCounter,
} from '../components/Onboardingcomponents';
import { useOnboarding } from '../context/OnboardingContext';
import { SKIN_GOALS_DATA, SkinGoal, StepProps } from '../types/Onboarding';
import { colors, spacing, typography, borderRadius } from '../../../theme';

export default function GoalsStep({ onContinue, onBack }: StepProps) {
    const { data, toggleSkinGoal, canProceed } = useOnboarding();
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
                    title="What's Your Glow Goal? ✨"
                    subtitle="Select up to 3 skin goals you want to achieve"
                />

                <SelectionCounter
                    current={data.skinGoals.length}
                    max={3}
                    label="goals selected"
                />

                {/* Goals Grid */}
                <View style={styles.goalsGrid}>
                    {SKIN_GOALS_DATA.map((goal) => (
                        <SelectableCard
                            key={goal.id}
                            selected={data.skinGoals.includes(goal.id)}
                            onPress={() => toggleSkinGoal(goal.id)}
                            emoji={goal.emoji}
                            label={goal.label}
                            description={goal.description}
                        />
                    ))}
                </View>

                {/* Motivational Note */}
                {data.skinGoals.length > 0 && (
                    <View style={styles.motivationalNote}>
                        <Ionicons name="bulb" size={20} color={colors.peach} />
                        <Text style={styles.motivationalText}>
                            {getMotivationalMessage(data.skinGoals)}
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.bottomActions}>
                <GradientButton
                    title={data.skinGoals.length === 0 ? 'Select at least 1 goal' : 'Continue'}
                    onPress={onContinue}
                    disabled={!canProceed()}
                    style={styles.continueButton}
                />
            </View>
        </Animated.View>
    );
}

function getMotivationalMessage(goals: SkinGoal[]): string {
    if (goals.includes('glass_skin')) {
        return "Amazing choice! Glass skin is the ultimate skin goal. We'll help you get that lit-from-within glow! 💎";
    }
    if (goals.includes('anti_aging')) {
        return "Great! Prevention is key. We'll create a routine focused on keeping your skin youthful and firm. 🌸";
    }
    if (goals.includes('acne_free')) {
        return "We've got you! Clear skin is absolutely achievable with the right routine and consistency. 💪";
    }
    if (goals.includes('hydration')) {
        return "Hydration is the foundation of healthy skin. You're on the right track! 💧";
    }
    return "Perfect! Your personalized routine will be tailored to help you achieve these goals. 🌟";
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.xl,
        paddingBottom: 120,
    },
    goalsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    motivationalNote: {
        flexDirection: 'row',
        backgroundColor: colors.peach + '15',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginTop: spacing.lg,
        alignItems: 'flex-start',
    },
    motivationalText: {
        ...typography.body,
        color: colors.text.secondary,
        flex: 1,
        marginLeft: spacing.sm,
        lineHeight: 22,
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