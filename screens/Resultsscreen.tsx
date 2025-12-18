import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import GlassCard from '../components/Glasscard';
import GradientButton from '../components/Gradientbutton';
import ApiService, { AnalysisResult } from '../services/api';
import { colors, gradients, spacing, typography, borderRadius, shadows } from '../theme/index';
import { RootStackParamList } from '../types/index';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

const { width } = Dimensions.get('window');

export default function ResultsScreen({ route, navigation }: Props) {
    const { sessionId, userId } = route.params;
    const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        loadAnalysis();
    }, []);

    const loadAnalysis = async (): Promise<void> => {
        try {
            const data = await ApiService.getAnalysis(sessionId);
            setAnalysisData(data);
        } catch (error) {
            console.error('Load analysis error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !analysisData) {
        return null;
    }

    const { skin_metrics, features, overall_score } = analysisData;
    const glassScore = Math.round((skin_metrics.glass_skin_score || 0) * 100);

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
                    <Text style={styles.title}>Your Glow Score</Text>
                    <Text style={styles.subtitle}>Here's your personalized analysis</Text>
                </View>

                <GlassCard style={styles.heroCard}>
                    <View style={styles.heroContent}>
                        <Text style={styles.heroLabel}>Glass Skin Score</Text>
                        <View style={styles.scoreCircle}>
                            <LinearGradient
                                colors={gradients.primary}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.scoreGradient}
                            >
                                <View style={styles.scoreInner}>
                                    <Text style={styles.scoreValue}>{glassScore}</Text>
                                    <Text style={styles.scoreMax}>/100</Text>
                                </View>
                            </LinearGradient>
                        </View>
                        <Text style={styles.heroDescription}>
                            {glassScore >= 70 ? '✨ Amazing! You have glass skin!' :
                                glassScore >= 50 ? '🌟 Great! Keep up your routine!' :
                                    '💪 Good foundation! Let\'s boost it!'}
                        </Text>
                    </View>
                </GlassCard>

                <SectionHeader title="Skin Analysis" icon="sparkles" />
                <View style={styles.metricsGrid}>
                    <MetricCard
                        title="Clarity"
                        value={skin_metrics.clarity_score || 0}
                        icon="scan"
                        color={colors.primary}
                    />
                    <MetricCard
                        title="Glow"
                        value={skin_metrics.glow_level || 0}
                        icon="sunny"
                        color={colors.peach}
                    />
                    <MetricCard
                        title="Hydration"
                        value={skin_metrics.hydration_index || 0}
                        icon="water"
                        color={colors.mint}
                    />
                    <MetricCard
                        title="Tone Evenness"
                        value={skin_metrics.tone_evenness || 0}
                        icon="color-palette"
                        color={colors.lavender}
                    />
                </View>

                <GlassCard style={styles.detailCard}>
                    <DetailRow
                        label="Pore Visibility"
                        value={`${Math.round((skin_metrics.pore_visibility || 0) * 100)}%`}
                        good={skin_metrics.pore_visibility < 0.3}
                    />
                    <DetailRow
                        label="Pigmentation"
                        value={`${Math.round((skin_metrics.pigmentation_score || 0) * 100)}%`}
                        good={skin_metrics.pigmentation_score < 0.4}
                    />
                    <DetailRow
                        label="Barrier Health"
                        value={`${Math.round((skin_metrics.barrier_health || 0) * 100)}%`}
                        good={skin_metrics.barrier_health > 0.6}
                    />
                </GlassCard>

                <SectionHeader title="Your Colors" icon="color-palette" />
                <GlassCard style={styles.colorCard}>
                    <View style={styles.colorRow}>
                        <View style={styles.colorItem}>
                            <Text style={styles.colorLabel}>Undertone</Text>
                            <View style={[styles.colorTag, { borderColor: getUndertoneColor(skin_metrics.undertone) }]}>
                                <Text style={styles.colorValue}>
                                    {skin_metrics.undertone ? skin_metrics.undertone.toUpperCase() : 'UNKNOWN'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.colorItem}>
                            <Text style={styles.colorLabel}>Season</Text>
                            <View style={[styles.colorTag, { borderColor: getSeasonColor(skin_metrics.seasonal_color) }]}>
                                <Text style={styles.colorValue}>
                                    {skin_metrics.seasonal_color ? formatSeason(skin_metrics.seasonal_color) : 'UNKNOWN'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </GlassCard>

                <SectionHeader title="Features" icon="person" />
                <View style={styles.featuresGrid}>
                    {features.eye_type !== 'unknown' && (
                        <FeatureChip
                            label="Eye Type"
                            value={formatFeature(features.eye_type)}
                        />
                    )}
                    {features.face_shape !== 'unknown' && (
                        <FeatureChip
                            label="Face Shape"
                            value={formatFeature(features.face_shape)}
                        />
                    )}
                    {features.nose_type !== 'unknown' && (
                        <FeatureChip
                            label="Nose Type"
                            value={formatFeature(features.nose_type)}
                        />
                    )}
                </View>

                <GradientButton
                    title="View Your Routine"
                    onPress={() => (navigation as any).navigate('MainTabs', { screen: 'Routine' })}
                    style={styles.ctaButton}
                />

                <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => (navigation as any).navigate('MainTabs')}
                >
                    <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
}

interface SectionHeaderProps {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
}

function SectionHeader({ title, icon }: SectionHeaderProps) {
    return (
        <View style={styles.sectionHeader}>
            <Ionicons name={icon} size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );
}

interface MetricCardProps {
    title: string;
    value: number;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
    const percentage = Math.round(value * 100);
    return (
        <GlassCard style={styles.metricCard}>
            <Ionicons name={icon} size={24} color={color} />
            <Text style={styles.metricValue}>{percentage}</Text>
            <Text style={styles.metricTitle}>{title}</Text>
        </GlassCard>
    );
}

interface DetailRowProps {
    label: string;
    value: string;
    good: boolean;
}

function DetailRow({ label, value, good }: DetailRowProps) {
    return (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <View style={styles.detailRight}>
                <Text style={[styles.detailValue, good && styles.detailValueGood]}>{value}</Text>
                <Ionicons
                    name={good ? 'checkmark-circle' : 'alert-circle'}
                    size={16}
                    color={good ? colors.success : colors.warning}
                />
            </View>
        </View>
    );
}

interface FeatureChipProps {
    label: string;
    value: string;
}

function FeatureChip({ label, value }: FeatureChipProps) {
    return (
        <View style={styles.featureChip}>
            <Text style={styles.featureLabel}>{label}</Text>
            <Text style={styles.featureValue}>{value}</Text>
        </View>
    );
}

function getUndertoneColor(undertone?: string): string {
    if (undertone === 'warm') return colors.peach;
    if (undertone === 'cool') return colors.mint;
    return colors.lavender;
}

function getSeasonColor(season?: string): string {
    if (season?.includes('spring')) return colors.mint;
    if (season?.includes('summer')) return colors.lavender;
    if (season?.includes('autumn')) return colors.peach;
    if (season?.includes('winter')) return colors.primary;
    return colors.lilac;
}

function formatSeason(season?: string): string {
    return season ? season.replace('_', ' ').toUpperCase() : 'UNKNOWN';
}

function formatFeature(feature?: string): string {
    return feature ? feature.charAt(0).toUpperCase() + feature.slice(1).replace('_', ' ') : '';
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
    heroCard: {
        marginBottom: spacing.xl,
    },
    heroContent: {
        alignItems: 'center',
    },
    heroLabel: {
        ...typography.bodyBold,
        color: colors.text.secondary,
        marginBottom: spacing.md,
    },
    scoreCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        marginBottom: spacing.md,
    },
    scoreGradient: {
        flex: 1,
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreInner: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreValue: {
        fontSize: 48,
        fontWeight: '800',
        color: colors.text.primary,
    },
    scoreMax: {
        ...typography.body,
        color: colors.text.tertiary,
    },
    heroDescription: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
        marginTop: spacing.lg,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.text.primary,
        marginLeft: spacing.sm,
    },
    metricsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    metricCard: {
        width: (width - spacing.xl * 2 - spacing.md) / 2,
        alignItems: 'center',
        padding: spacing.lg,
    },
    metricValue: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.text.primary,
        marginTop: spacing.sm,
    },
    metricTitle: {
        ...typography.caption,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
    detailCard: {
        marginBottom: spacing.lg,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    detailLabel: {
        ...typography.body,
        color: colors.text.secondary,
    },
    detailRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    detailValue: {
        ...typography.bodyBold,
        color: colors.text.primary,
    },
    detailValueGood: {
        color: colors.success,
    },
    colorCard: {
        marginBottom: spacing.lg,
    },
    colorRow: {
        flexDirection: 'row',
        gap: spacing.lg,
    },
    colorItem: {
        flex: 1,
    },
    colorLabel: {
        ...typography.caption,
        color: colors.text.secondary,
        marginBottom: spacing.sm,
    },
    colorTag: {
        borderWidth: 2,
        borderRadius: borderRadius.sm,
        padding: spacing.sm,
        alignItems: 'center',
    },
    colorValue: {
        ...typography.bodyBold,
        color: colors.text.primary,
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.xl,
    },
    featureChip: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        ...shadows.sm,
    },
    featureLabel: {
        ...typography.caption,
        color: colors.text.tertiary,
        marginBottom: spacing.xs,
    },
    featureValue: {
        ...typography.bodyBold,
        color: colors.text.primary,
    },
    ctaButton: {
        marginTop: spacing.lg,
        marginBottom: spacing.md,
    },
    doneButton: {
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    doneText: {
        ...typography.body,
        color: colors.text.secondary,
    },
});