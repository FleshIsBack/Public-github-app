import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import GlassCard from '../components/Glasscard';
import ApiService, { User, UserProgress } from '../services/api';
import { colors, gradients, spacing, typography, borderRadius } from '../theme/index';
import { MainTabsParamList } from '../types/index';

type Props = BottomTabScreenProps<MainTabsParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    const [userData, setUserData] = useState<User | null>(null);
    const [progress, setProgress] = useState<UserProgress | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async (): Promise<void> => {
        try {
            const userId = await ApiService.getCurrentUserId();
            if (userId) {
                const user = await ApiService.getUser(parseInt(userId));
                const progressData = await ApiService.getUserProgress(parseInt(userId));
                setUserData(user);
                setProgress(progressData);
            }
        } catch (error) {
            console.error('Load data error:', error);
        }
    };

    return (
        <LinearGradient
            colors={[colors.background, colors.surfaceLight]}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, {userData?.username || 'Beautiful'} 👋</Text>
                        <Text style={styles.subtitle}>Ready to glow today?</Text>
                    </View>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Ionicons name="notifications-outline" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                </View>

                {/* Glass Skin Progress Card */}
                <GlassCard style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.cardTitle}>Your Glass Skin Journey</Text>
                        <Ionicons name="sparkles" size={20} color={colors.primary} />
                    </View>
                    <View style={styles.scoreRow}>
                        <View style={styles.scoreItem}>
                            <Text style={styles.scoreValue}>
                                {progress?.latest_glass_skin_score ? Math.round(progress.latest_glass_skin_score * 100) : '-'}
                            </Text>
                            <Text style={styles.scoreLabel}>Current</Text>
                        </View>
                        <View style={styles.scoreDivider} />
                        <View style={styles.scoreItem}>
                            <Text style={[styles.scoreValue, styles.scoreValuePositive]}>
                                {progress?.improvement_percentage ? `+${Math.round(progress.improvement_percentage)}%` : '-'}
                            </Text>
                            <Text style={styles.scoreLabel}>Progress</Text>
                        </View>
                    </View>
                </GlassCard>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    <ActionCard
                        title="New Analysis"
                        icon="camera"
                        gradient={gradients.primary}
                        onPress={() => navigation.navigate('Camera' as any)}
                    />
                    <ActionCard
                        title="My Routine"
                        icon="heart"
                        gradient={gradients.secondary}
                        onPress={() => navigation.navigate('Routine')}
                    />
                    <ActionCard
                        title="Progress"
                        icon="trending-up"
                        gradient={[colors.mint, colors.lavender] as const}
                        onPress={() => navigation.navigate('Progress')}
                    />
                    <ActionCard
                        title="Profile"
                        icon="person"
                        gradient={[colors.peach, colors.blush] as const}
                        onPress={() => navigation.navigate('Profile')}
                    />
                </View>

                {/* Daily Tips */}
                <Text style={styles.sectionTitle}>Today's Glow Tip</Text>
                <GlassCard style={styles.tipCard}>
                    <View style={styles.tipHeader}>
                        <Ionicons name="bulb" size={24} color={colors.peach} />
                        <Text style={styles.tipTitle}>Hydration is Key</Text>
                    </View>
                    <Text style={styles.tipText}>
                        Drink at least 8 glasses of water today to boost your skin's natural glow and maintain that glass skin effect!
                    </Text>
                </GlassCard>

                {/* Routine Reminder */}
                <GlassCard style={styles.reminderCard}>
                    <View style={styles.reminderContent}>
                        <Ionicons name="time-outline" size={32} color={colors.primary} />
                        <View style={styles.reminderText}>
                            <Text style={styles.reminderTitle}>Morning Routine</Text>
                            <Text style={styles.reminderSubtitle}>Have you completed your AM routine?</Text>
                        </View>
                        <TouchableOpacity style={styles.reminderButton}>
                            <Ionicons name="checkmark" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </GlassCard>
            </ScrollView>
        </LinearGradient>
    );
}

interface ActionCardProps {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    gradient: readonly [string, string, ...string[]];
    onPress: () => void;
}

function ActionCard({ title, icon, gradient, onPress }: ActionCardProps) {
    return (
        <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.8}>
            <LinearGradient
                colors={gradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionGradient}
            >
                <Ionicons name={icon} size={28} color="#FFFFFF" />
                <Text style={styles.actionTitle}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.xl,
    },
    greeting: {
        ...typography.h2,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.body,
        color: colors.text.secondary,
    },
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressCard: {
        marginBottom: spacing.xl,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    cardTitle: {
        ...typography.bodyBold,
        color: colors.text.primary,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreItem: {
        flex: 1,
        alignItems: 'center',
    },
    scoreValue: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    scoreValuePositive: {
        color: colors.success,
    },
    scoreLabel: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    scoreDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.text.light,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.text.primary,
        marginBottom: spacing.md,
        marginTop: spacing.md,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    actionCard: {
        width: '48%',
        height: 120,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
    },
    actionGradient: {
        flex: 1,
        padding: spacing.md,
        justifyContent: 'space-between',
    },
    actionTitle: {
        ...typography.bodyBold,
        color: '#FFFFFF',
    },
    tipCard: {
        marginBottom: spacing.md,
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    tipTitle: {
        ...typography.bodyBold,
        color: colors.text.primary,
        marginLeft: spacing.sm,
    },
    tipText: {
        ...typography.body,
        color: colors.text.secondary,
        lineHeight: 22,
    },
    reminderCard: {
        marginBottom: spacing.xl,
    },
    reminderContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reminderText: {
        flex: 1,
        marginLeft: spacing.md,
    },
    reminderTitle: {
        ...typography.bodyBold,
        color: colors.text.primary,
    },
    reminderSubtitle: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    reminderButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primaryLight + '40',
        justifyContent: 'center',
        alignItems: 'center',
    },
});