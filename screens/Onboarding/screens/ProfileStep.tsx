import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Animated,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import GradientButton from '../../../components/Gradientbutton';
import { StepHeader } from '../components/Onboardingcomponents';
import { useOnboarding } from '../context/OnboardingContext';
import { AGE_RANGES_DATA, StepProps } from '../types/Onboarding';
import { colors, gradients, spacing, typography, borderRadius, shadows } from '../../../theme';

export default function ProfileStep({ onContinue, onBack }: StepProps) {
    const { data, setProfileData, canProceed } = useOnboarding();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [nameFocused, setNameFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <StepHeader
                        title="Almost There! 🎉"
                        subtitle="Create your profile to save your personalized routine"
                    />

                    {/* Profile Summary */}
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryTitle}>Your Personalized Profile</Text>
                        <View style={styles.summaryRow}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Goals</Text>
                                <Text style={styles.summaryValue}>
                                    {data.skinGoals.length} selected
                                </Text>
                            </View>
                            <View style={styles.summaryDivider} />
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Concerns</Text>
                                <Text style={styles.summaryValue}>
                                    {data.skinConcerns.length} selected
                                </Text>
                            </View>
                            <View style={styles.summaryDivider} />
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Skin Type</Text>
                                <Text style={styles.summaryValue}>
                                    {data.skinType ? data.skinType.charAt(0).toUpperCase() + data.skinType.slice(1) : '-'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Name Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>What should we call you? *</Text>
                        <View style={[styles.input, nameFocused && styles.inputFocused]}>
                            <Ionicons
                                name="person-outline"
                                size={20}
                                color={nameFocused ? colors.primary : colors.text.secondary}
                            />
                            <TextInput
                                style={styles.textInput}
                                placeholder="Your name"
                                placeholderTextColor={colors.text.tertiary}
                                value={data.profile.name}
                                onChangeText={(text) => setProfileData({ name: text })}
                                autoCapitalize="words"
                                onFocus={() => setNameFocused(true)}
                                onBlur={() => setNameFocused(false)}
                            />
                            {data.profile.name.length > 0 && (
                                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                            )}
                        </View>
                    </View>

                    {/* Email Input (Optional) */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Email <Text style={styles.optional}>(optional)</Text>
                        </Text>
                        <View style={[styles.input, emailFocused && styles.inputFocused]}>
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color={emailFocused ? colors.primary : colors.text.secondary}
                            />
                            <TextInput
                                style={styles.textInput}
                                placeholder="your@email.com"
                                placeholderTextColor={colors.text.tertiary}
                                value={data.profile.email}
                                onChangeText={(text) => setProfileData({ email: text })}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => setEmailFocused(false)}
                            />
                        </View>
                    </View>

                    {/* Age Range */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Age range <Text style={styles.optional}>(optional)</Text>
                        </Text>
                        <View style={styles.ageGrid}>
                            {AGE_RANGES_DATA.map((ageRange) => (
                                <TouchableOpacity
                                    key={ageRange.id}
                                    style={[
                                        styles.ageButton,
                                        data.profile.ageRange === ageRange.id && styles.ageButtonSelected,
                                    ]}
                                    onPress={() => setProfileData({ ageRange: ageRange.id })}
                                >
                                    {data.profile.ageRange === ageRange.id && (
                                        <LinearGradient
                                            colors={gradients.primary}
                                            style={StyleSheet.absoluteFill}
                                        />
                                    )}
                                    <Text style={[
                                        styles.ageButtonText,
                                        data.profile.ageRange === ageRange.id && styles.ageButtonTextSelected,
                                    ]}>
                                        {ageRange.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Privacy Notice */}
                    <View style={styles.privacyNotice}>
                        <Ionicons name="shield-checkmark" size={20} color={colors.success} />
                        <Text style={styles.privacyText}>
                            Your data is encrypted and never shared.
                        </Text>
                    </View>
                </ScrollView>

                {/* Bottom Actions */}
                <View style={styles.bottomActions}>
                    <GradientButton
                        title={!data.profile.name.trim() ? 'Enter your name' : 'Continue to Photo'}
                        onPress={onContinue}
                        disabled={!canProceed()}
                        style={styles.continueButton}
                    />
                </View>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.xl,
        paddingBottom: 120,
    },
    summaryCard: {
        backgroundColor: colors.primaryLight + '30',
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.xl,
    },
    summaryTitle: {
        ...typography.bodyBold,
        color: colors.primary,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryDivider: {
        width: 1,
        height: 30,
        backgroundColor: colors.primary + '30',
    },
    summaryLabel: {
        ...typography.caption,
        color: colors.text.secondary,
        marginBottom: 2,
    },
    summaryValue: {
        ...typography.bodyBold,
        color: colors.text.primary,
        fontSize: 13,
    },
    inputContainer: {
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.bodyBold,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    optional: {
        ...typography.caption,
        color: colors.text.tertiary,
        fontWeight: 'normal',
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        height: 56,
        borderWidth: 2,
        borderColor: 'transparent',
        ...shadows.sm,
    },
    inputFocused: {
        borderColor: colors.primary,
    },
    textInput: {
        flex: 1,
        marginLeft: spacing.sm,
        ...typography.body,
        color: colors.text.primary,
    },
    ageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    ageButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.text.light,
        overflow: 'hidden',
    },
    ageButtonSelected: {
        borderColor: colors.primary,
    },
    ageButtonText: {
        ...typography.body,
        color: colors.text.secondary,
        fontSize: 14,
    },
    ageButtonTextSelected: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    privacyNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.success + '10',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginTop: spacing.md,
    },
    privacyText: {
        ...typography.caption,
        color: colors.text.secondary,
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