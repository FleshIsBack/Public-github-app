import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import GlassCard from '../components/Glasscard';
import ApiService, { Routine, RoutineStep as RoutineStepType } from '../services/api';
import { colors, gradients, spacing, typography, borderRadius } from '../theme/index';
import { MainTabsParamList } from '../types/index';

type Props = BottomTabScreenProps<MainTabsParamList, 'Routine'>;
type TabType = 'morning' | 'evening';

export default function RoutineScreen({ }: Props) {
    const [routine, setRoutine] = useState<Routine | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>('morning');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        loadRoutine();
    }, []);

    const loadRoutine = async (): Promise<void> => {
        try {
            const userId = await ApiService.getCurrentUserId();
            if (userId) {
                const data = await ApiService.getCurrentRoutine(parseInt(userId));
                setRoutine(data);
            }
        } catch (error) {
            console.error('Load routine error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return null;
    }

    const currentRoutine = activeTab === 'morning' ? routine?.morning_routine : routine?.evening_routine;

    return (
        <LinearGradient
            colors={[colors.background, colors.surfaceLight]}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Your Routine</Text>
                    <Text style={styles.subtitle}>Personalized skin routine</Text>
                </View>

                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'morning' && styles.tabActive]}
                        onPress={() => setActiveTab('morning')}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="sunny"
                            size={20}
                            color={activeTab === 'morning' ? '#FFFFFF' : colors.text.secondary}
                        />
                        <Text style={[styles.tabText, activeTab === 'morning' && styles.tabTextActive]}>
                            Morning
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'evening' && styles.tabActive]}
                        onPress={() => setActiveTab('evening')}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="moon"
                            size={20}
                            color={activeTab === 'evening' ? '#FFFFFF' : colors.text.secondary}
                        />
                        <Text style={[styles.tabText, activeTab === 'evening' && styles.tabTextActive]}>
                            Evening
                        </Text>
                    </TouchableOpacity>
                </View>

                {currentRoutine?.map((step, index) => (
                    <RoutineStep
                        key={index}
                        step={step}
                        number={index + 1}
                    />
                )) || <EmptyRoutine />}

                {routine?.color_palette && (
                    <>
                        <Text style={styles.sectionTitle}>Your Color Palette 🎨</Text>
                        <GlassCard style={styles.colorCard}>
                            <Text style={styles.colorTitle}>Best Colors</Text>
                            <View style={styles.colorGrid}>
                                {routine.color_palette.best_colors?.map((color, index) => (
                                    <View key={index} style={styles.colorChip}>
                                        <Text style={styles.colorChipText}>{color}</Text>
                                    </View>
                                ))}
                            </View>

                            <Text style={[styles.colorTitle, { marginTop: spacing.md }]}>Avoid</Text>
                            <View style={styles.colorGrid}>
                                {routine.color_palette.avoid_colors?.map((color, index) => (
                                    <View key={index} style={[styles.colorChip, styles.colorChipAvoid]}>
                                        <Text style={styles.colorChipText}>{color}</Text>
                                    </View>
                                ))}
                            </View>
                        </GlassCard>
                    </>
                )}

                {routine?.lifestyle_tips && routine.lifestyle_tips.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Lifestyle Tips 💡</Text>
                        {routine.lifestyle_tips.map((tip, index) => (
                            <GlassCard key={index} style={styles.tipCard}>
                                <Text style={styles.tipText}>{tip}</Text>
                            </GlassCard>
                        ))}
                    </>
                )}
            </ScrollView>
        </LinearGradient>
    );
}

interface RoutineStepProps {
    step: RoutineStepType;
    number: number;
}

function RoutineStep({ step, number }: RoutineStepProps) {
    return (
        <GlassCard style={styles.stepCard}>
            <View style={styles.stepHeader}>
                <View style={styles.stepNumber}>
                    <LinearGradient
                        colors={gradients.primary}
                        style={styles.stepNumberGradient}
                    >
                        <Text style={styles.stepNumberText}>{number}</Text>
                    </LinearGradient>
                </View>
                <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>{step.step}</Text>
                    <Text style={styles.stepProduct}>{step.product}</Text>
                </View>
            </View>
            <Text style={styles.stepReason}>{step.reason}</Text>
        </GlassCard>
    );
}

function EmptyRoutine() {
    return (
        <GlassCard style={styles.emptyCard}>
            <Ionicons name="heart-outline" size={48} color={colors.text.tertiary} />
            <Text style={styles.emptyTitle}>No Routine Yet</Text>
            <Text style={styles.emptyText}>
                Complete your first analysis to get your personalized skin routine!
            </Text>
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.xl,
        paddingTop: spacing.xxl * 2,
    },
    header: {
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
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: 4,
        marginBottom: spacing.xl,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
        gap: spacing.sm,
    },
    tabActive: {
        backgroundColor: colors.primary,
    },
    tabText: {
        ...typography.bodyBold,
        color: colors.text.secondary,
    },
    tabTextActive: {
        color: '#FFFFFF',
    },
    stepCard: {
        marginBottom: spacing.md,
    },
    stepHeader: {
        flexDirection: 'row',
        marginBottom: spacing.sm,
    },
    stepNumber: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        marginRight: spacing.md,
    },
    stepNumberGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepNumberText: {
        ...typography.bodyBold,
        color: '#FFFFFF',
        fontSize: 18,
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        ...typography.bodyBold,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    stepProduct: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    stepReason: {
        ...typography.body,
        color: colors.text.secondary,
        lineHeight: 22,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.text.primary,
        marginTop: spacing.lg,
        marginBottom: spacing.md,
    },
    colorCard: {
        marginBottom: spacing.md,
    },
    colorTitle: {
        ...typography.bodyBold,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    colorChip: {
        backgroundColor: colors.primaryLight + '40',
        borderWidth: 1,
        borderColor: colors.primary,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: borderRadius.sm,
    },
    colorChipAvoid: {
        backgroundColor: colors.text.light,
        borderColor: colors.text.tertiary,
    },
    colorChipText: {
        ...typography.caption,
        color: colors.text.primary,
    },
    tipCard: {
        marginBottom: spacing.sm,
    },
    tipText: {
        ...typography.body,
        color: colors.text.secondary,
        lineHeight: 22,
    },
    emptyCard: {
        alignItems: 'center',
        paddingVertical: spacing.xxl,
    },
    emptyTitle: {
        ...typography.h3,
        color: colors.text.primary,
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    emptyText: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
    },
});