import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import GlassCard from '../components/Glasscard';
import ApiService, { GlassSkinProgress } from '../services/api';
import { colors, gradients, spacing, typography, borderRadius } from '../theme/index';
import { MainTabsParamList } from '../types/index';

type Props = BottomTabScreenProps<MainTabsParamList, 'Progress'>;

const { width } = Dimensions.get('window');

export default function ProgressScreen({ }: Props) {
    const [progressData, setProgressData] = useState<GlassSkinProgress | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async (): Promise<void> => {
        try {
            const userId = await ApiService.getCurrentUserId();
            if (userId) {
                const data = await ApiService.getGlassSkinProgress(parseInt(userId));
                setProgressData(data);
            }
        } catch (error) {
            console.error('Load progress error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return null;
    }

    const currentScore = progressData?.data_points?.[progressData.data_points.length - 1]?.glass_skin_score || 0;
    const previousScore = progressData?.data_points?.[0]?.glass_skin_score || 0;
    const improvement = previousScore > 0 ? ((currentScore - previousScore) / previousScore * 100).toFixed(1) : '0.0';

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
                    <Text style={styles.title}>Your Progress</Text>
                    <Text style={styles.subtitle}>Track your glass skin journey</Text>
                </View>

                <View style={styles.statsRow}>
                    <GlassCard style={styles.statCard}>
                        <Text style={styles.statValue}>{Math.round(currentScore * 100)}</Text>
                        <Text style={styles.statLabel}>Current Score</Text>
                        <Ionicons name="sparkles" size={20} color={colors.primary} style={styles.statIcon} />
                    </GlassCard>

                    <GlassCard style={styles.statCard}>
                        <Text style={[styles.statValue, { color: colors.success }]}>
                            {parseFloat(improvement) > 0 ? `+${improvement}` : improvement}%
                        </Text>
                        <Text style={styles.statLabel}>Improvement</Text>
                        <Ionicons name="trending-up" size={20} color={colors.success} style={styles.statIcon} />
                    </GlassCard>
                </View>

                <GlassCard style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Glass Skin Progress</Text>
                    <View style={styles.chartPlaceholder}>
                        {progressData?.data_points?.map((point, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.bar,
                                    { height: `${point.glass_skin_score * 100}%` }
                                ]}
                            >
                                <LinearGradient
                                    colors={gradients.primary}
                                    style={styles.barGradient}
                                />
                            </View>
                        )) || null}
                    </View>
                    <Text style={styles.chartSubtitle}>Last 90 days</Text>
                </GlassCard>

                <Text style={styles.sectionTitle}>Milestones 🎯</Text>
                <View style={styles.milestones}>
                    <MilestoneItem
                        title="First Analysis"
                        date="Completed"
                        achieved
                    />
                    <MilestoneItem
                        title="7 Day Streak"
                        date="In progress"
                        achieved={false}
                    />
                    <MilestoneItem
                        title="Glass Skin Level"
                        date="Score 70+"
                        achieved={currentScore >= 0.7}
                    />
                </View>

                <Text style={styles.sectionTitle}>Insights 💡</Text>
                <GlassCard style={styles.insightCard}>
                    <Text style={styles.insightText}>
                        {parseFloat(improvement) > 0
                            ? `Amazing! Your glass skin score improved by ${improvement}% since you started. Keep up your routine!`
                            : 'Stay consistent with your skincare routine to see improvements in your glass skin score.'}
                    </Text>
                </GlassCard>
            </ScrollView>
        </LinearGradient>
    );
}

interface MilestoneItemProps {
    title: string;
    date: string;
    achieved: boolean;
}

function MilestoneItem({ title, date, achieved }: MilestoneItemProps) {
    return (
        <GlassCard style={styles.milestoneCard}>
            <View style={styles.milestoneContent}>
                <View style={[styles.milestoneIcon, achieved && styles.milestoneIconAchieved]}>
                    <Ionicons
                        name={achieved ? 'checkmark' : 'lock-closed'}
                        size={20}
                        color={achieved ? colors.success : colors.text.tertiary}
                    />
                </View>
                <View style={styles.milestoneText}>
                    <Text style={[styles.milestoneTitle, achieved && styles.milestoneTitleAchieved]}>
                        {title}
                    </Text>
                    <Text style={styles.milestoneDate}>{date}</Text>
                </View>
            </View>
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
    statsRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: spacing.lg,
        position: 'relative',
    },
    statValue: {
        fontSize: 40,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: spacing.xs,
    },
    statLabel: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    statIcon: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
    },
    chartCard: {
        marginBottom: spacing.xl,
    },
    chartTitle: {
        ...typography.bodyBold,
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    chartPlaceholder: {
        height: 200,
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 4,
        marginBottom: spacing.sm,
    },
    bar: {
        flex: 1,
        borderRadius: 4,
        overflow: 'hidden',
        minHeight: 20,
    },
    barGradient: {
        flex: 1,
    },
    chartSubtitle: {
        ...typography.caption,
        color: colors.text.tertiary,
        textAlign: 'center',
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.text.primary,
        marginBottom: spacing.md,
        marginTop: spacing.md,
    },
    milestones: {
        gap: spacing.sm,
        marginBottom: spacing.xl,
    },
    milestoneCard: {
        padding: spacing.md,
    },
    milestoneContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    milestoneIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.text.light,
        justifyContent: 'center',
        alignItems: 'center',
    },
    milestoneIconAchieved: {
        backgroundColor: colors.success + '40',
    },
    milestoneText: {
        marginLeft: spacing.md,
        flex: 1,
    },
    milestoneTitle: {
        ...typography.bodyBold,
        color: colors.text.tertiary,
    },
    milestoneTitleAchieved: {
        color: colors.text.primary,
    },
    milestoneDate: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    insightCard: {
        marginBottom: spacing.xl,
    },
    insightText: {
        ...typography.body,
        color: colors.text.secondary,
        lineHeight: 24,
    },
});