import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import GradientButton from '../../../components/Gradientbutton';
import { StepHeader, SelectionCounter } from '../components/Onboardingcomponents';
import { useOnboarding } from '../context/OnboardingContext';
import { SKIN_CONCERNS_DATA, StepProps } from '../types/Onboarding';
import { colors, gradients, spacing, typography, borderRadius, shadows } from '../../../theme';

export default function ConcernsStep({ onContinue, onBack }: StepProps) {
    const { data, toggleSkinConcern, canProceed } = useOnboarding();
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
                    title="What Are Your Concerns? 🎯"
                    subtitle="Select up to 5 skin concerns you'd like to address"
                />

                <SelectionCounter
                    current={data.skinConcerns.length}
                    max={5}
                    label="concerns selected"
                />

                {/* Concerns Pills */}
                <View style={styles.concernsContainer}>
                    {SKIN_CONCERNS_DATA.map((concern) => (
                        <ConcernPill
                            key={concern.id}
                            concern={concern}
                            selected={data.skinConcerns.includes(concern.id)}
                            onPress={() => toggleSkinConcern(concern.id)}
                        />
                    ))}
                </View>

                {/* No concerns option */}
                <TouchableOpacity
                    style={styles.noConcernsButton}
                    onPress={() => {
                        if (data.skinConcerns.length === 0) {
                            toggleSkinConcern('dullness');
                        }
                    }}
                >
                    <Text style={styles.noConcernsText}>
                        Not sure? That's okay! Our AI analysis will help identify areas for improvement.
                    </Text>
                </TouchableOpacity>

                {/* Selected Summary */}
                {data.skinConcerns.length > 0 && (
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryHeader}>
                            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                            <Text style={styles.summaryTitle}>We'll focus on:</Text>
                        </View>
                        <View style={styles.summaryList}>
                            {data.skinConcerns.map((concernId) => {
                                const concern = SKIN_CONCERNS_DATA.find(c => c.id === concernId);
                                return concern ? (
                                    <Text key={concernId} style={styles.summaryItem}>
                                        {concern.emoji} {concern.label}
                                    </Text>
                                ) : null;
                            })}
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.bottomActions}>
                <GradientButton
                    title={data.skinConcerns.length === 0 ? 'Select at least 1 concern' : 'Continue'}
                    onPress={onContinue}
                    disabled={!canProceed()}
                    style={styles.continueButton}
                />
            </View>
        </Animated.View>
    );
}

interface ConcernPillProps {
    concern: typeof SKIN_CONCERNS_DATA[0];
    selected: boolean;
    onPress: () => void;
}

function ConcernPill({ concern, selected, onPress }: ConcernPillProps) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

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
        >
            <Animated.View
                style={[
                    styles.concernPill,
                    selected && styles.concernPillSelected,
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
                <Text style={styles.concernEmoji}>{concern.emoji}</Text>
                <Text style={[styles.concernLabel, selected && styles.concernLabelSelected]}>
                    {concern.label}
                </Text>
                {selected && (
                    <View style={styles.checkIndicator}>
                        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                    </View>
                )}
            </Animated.View>
        </TouchableOpacity>
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
    concernsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    concernPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        borderWidth: 1.5,
        borderColor: colors.text.light,
        overflow: 'hidden',
        ...shadows.sm,
    },
    concernPillSelected: {
        borderColor: colors.primary,
    },
    concernEmoji: {
        fontSize: 16,
        marginRight: spacing.xs,
    },
    concernLabel: {
        ...typography.body,
        color: colors.text.primary,
        fontSize: 14,
    },
    concernLabelSelected: {
        color: '#FFFFFF',
    },
    checkIndicator: {
        marginLeft: spacing.xs,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noConcernsButton: {
        marginTop: spacing.xl,
        padding: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.text.light,
        borderStyle: 'dashed',
    },
    noConcernsText: {
        ...typography.caption,
        color: colors.text.secondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    summaryCard: {
        marginTop: spacing.xl,
        backgroundColor: colors.success + '10',
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        borderLeftWidth: 4,
        borderLeftColor: colors.success,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    summaryTitle: {
        ...typography.bodyBold,
        color: colors.text.primary,
        marginLeft: spacing.sm,
    },
    summaryList: {
        gap: spacing.xs,
    },
    summaryItem: {
        ...typography.body,
        color: colors.text.secondary,
        paddingLeft: spacing.sm,
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