import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import GradientButton from '../../../components/Gradientbutton';
import { StepHeader } from '../components/Onboardingcomponents';
import { useOnboarding } from '../context/OnboardingContext';
import { SKIN_TYPES_DATA, SkinType, StepProps } from '../types/Onboarding';
import { colors, gradients, spacing, typography, borderRadius, shadows } from '../../../theme';

export default function SkinTypeStep({ onContinue, onBack }: StepProps) {
    const { data, setSkinType, canProceed } = useOnboarding();
    const [showQuiz, setShowQuiz] = useState(false);
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
                    title="What's Your Skin Type? 🧴"
                    subtitle="This helps us recommend the perfect products"
                />

                <Text style={styles.sectionLabel}>Choose your skin type:</Text>

                <View style={styles.skinTypesContainer}>
                    {SKIN_TYPES_DATA.map((skinType) => (
                        <SkinTypeCard
                            key={skinType.id}
                            skinType={skinType}
                            selected={data.skinType === skinType.id}
                            onPress={() => setSkinType(skinType.id)}
                        />
                    ))}
                </View>

                {/* Not Sure Helper */}
                <TouchableOpacity
                    style={styles.helpButton}
                    onPress={() => setShowQuiz(!showQuiz)}
                >
                    <Ionicons
                        name={showQuiz ? "chevron-up" : "help-circle"}
                        size={20}
                        color={colors.primary}
                    />
                    <Text style={styles.helpButtonText}>
                        {showQuiz ? 'Hide quiz' : "Not sure? Take a quick quiz"}
                    </Text>
                </TouchableOpacity>

                {/* Mini Quiz */}
                {showQuiz && <SkinTypeQuiz onResult={(type) => setSkinType(type)} />}

                {/* Selected Type Info */}
                {data.skinType && (
                    <SelectedTypeInfo skinType={data.skinType} />
                )}
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.bottomActions}>
                <GradientButton
                    title={!data.skinType ? 'Select your skin type' : 'Continue'}
                    onPress={onContinue}
                    disabled={!canProceed()}
                    style={styles.continueButton}
                />
            </View>
        </Animated.View>
    );
}

interface SkinTypeCardProps {
    skinType: typeof SKIN_TYPES_DATA[0];
    selected: boolean;
    onPress: () => void;
}

function SkinTypeCard({ skinType, selected, onPress }: SkinTypeCardProps) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
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
                    styles.skinTypeCard,
                    selected && styles.skinTypeCardSelected,
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

                <View style={styles.skinTypeContent}>
                    <View style={styles.skinTypeHeader}>
                        <Text style={styles.skinTypeEmoji}>{skinType.emoji}</Text>
                        <View style={styles.skinTypeText}>
                            <Text style={[
                                styles.skinTypeLabel,
                                selected && styles.skinTypeLabelSelected
                            ]}>
                                {skinType.label}
                            </Text>
                            <Text style={[
                                styles.skinTypeDesc,
                                selected && styles.skinTypeDescSelected
                            ]}>
                                {skinType.description}
                            </Text>
                        </View>
                    </View>

                    {selected && (
                        <View style={styles.checkBadge}>
                            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                        </View>
                    )}
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
}

interface SkinTypeQuizProps {
    onResult: (type: SkinType) => void;
}

function SkinTypeQuiz({ onResult }: SkinTypeQuizProps) {
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const questions = [
        {
            id: 'midday',
            question: 'By midday, how does your face feel?',
            options: [
                { label: 'Shiny all over', value: 'oily' },
                { label: 'Tight and dry', value: 'dry' },
                { label: 'Oily T-zone, normal elsewhere', value: 'combination' },
                { label: 'Comfortable and balanced', value: 'normal' },
            ],
        },
        {
            id: 'reaction',
            question: 'How does your skin react to new products?',
            options: [
                { label: 'Often gets red or irritated', value: 'sensitive' },
                { label: 'Usually fine, occasionally breaks out', value: 'oily' },
                { label: 'Generally tolerates well', value: 'normal' },
                { label: 'Gets flaky or more dry', value: 'dry' },
            ],
        },
    ];

    const handleAnswer = (questionId: string, value: string) => {
        const newAnswers = { ...answers, [questionId]: value };
        setAnswers(newAnswers);

        if (Object.keys(newAnswers).length === questions.length) {
            const counts: Record<string, number> = {};
            Object.values(newAnswers).forEach(v => {
                counts[v] = (counts[v] || 0) + 1;
            });
            const result = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as SkinType;
            onResult(result);
        }
    };

    return (
        <View style={styles.quizContainer}>
            {questions.map((q, qIndex) => (
                <View key={q.id} style={styles.quizQuestion}>
                    <Text style={styles.questionText}>
                        {qIndex + 1}. {q.question}
                    </Text>
                    <View style={styles.optionsContainer}>
                        {q.options.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.optionButton,
                                    answers[q.id] === option.value && styles.optionButtonSelected,
                                ]}
                                onPress={() => handleAnswer(q.id, option.value)}
                            >
                                <Text style={[
                                    styles.optionText,
                                    answers[q.id] === option.value && styles.optionTextSelected,
                                ]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );
}

interface SelectedTypeInfoProps {
    skinType: SkinType;
}

function SelectedTypeInfo({ skinType }: SelectedTypeInfoProps) {
    const typeData = SKIN_TYPES_DATA.find(t => t.id === skinType);
    if (!typeData) return null;

    return (
        <View style={styles.selectedInfo}>
            <View style={styles.selectedInfoHeader}>
                <Text style={styles.selectedInfoEmoji}>{typeData.emoji}</Text>
                <Text style={styles.selectedInfoTitle}>{typeData.label} Skin</Text>
            </View>
            <Text style={styles.selectedInfoSubtitle}>Common characteristics:</Text>
            <View style={styles.indicatorsList}>
                {typeData.indicators.map((indicator, index) => (
                    <View key={index} style={styles.indicatorItem}>
                        <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                        <Text style={styles.indicatorText}>{indicator}</Text>
                    </View>
                ))}
            </View>
        </View>
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
    sectionLabel: {
        ...typography.bodyBold,
        color: colors.text.secondary,
        marginBottom: spacing.md,
    },
    skinTypesContainer: {
        gap: spacing.md,
    },
    skinTypeCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
        ...shadows.sm,
    },
    skinTypeCardSelected: {
        borderColor: colors.primary,
    },
    skinTypeContent: {
        padding: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    skinTypeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    skinTypeEmoji: {
        fontSize: 32,
        marginRight: spacing.md,
    },
    skinTypeText: {
        flex: 1,
    },
    skinTypeLabel: {
        ...typography.bodyBold,
        color: colors.text.primary,
        marginBottom: 2,
    },
    skinTypeLabelSelected: {
        color: '#FFFFFF',
    },
    skinTypeDesc: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    skinTypeDescSelected: {
        color: 'rgba(255, 255, 255, 0.8)',
    },
    checkBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    helpButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.xl,
        paddingVertical: spacing.md,
    },
    helpButtonText: {
        ...typography.body,
        color: colors.primary,
        marginLeft: spacing.sm,
    },
    quizContainer: {
        marginTop: spacing.lg,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        ...shadows.sm,
    },
    quizQuestion: {
        marginBottom: spacing.lg,
    },
    questionText: {
        ...typography.bodyBold,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    optionsContainer: {
        gap: spacing.sm,
    },
    optionButton: {
        backgroundColor: colors.background,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.text.light,
    },
    optionButtonSelected: {
        backgroundColor: colors.primary + '20',
        borderColor: colors.primary,
    },
    optionText: {
        ...typography.body,
        color: colors.text.secondary,
    },
    optionTextSelected: {
        color: colors.primary,
        fontWeight: '600',
    },
    selectedInfo: {
        marginTop: spacing.xl,
        backgroundColor: colors.primaryLight + '30',
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
    },
    selectedInfoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    selectedInfoEmoji: {
        fontSize: 24,
        marginRight: spacing.sm,
    },
    selectedInfoTitle: {
        ...typography.h3,
        color: colors.text.primary,
    },
    selectedInfoSubtitle: {
        ...typography.caption,
        color: colors.text.secondary,
        marginBottom: spacing.sm,
    },
    indicatorsList: {
        gap: spacing.xs,
    },
    indicatorItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    indicatorText: {
        ...typography.body,
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