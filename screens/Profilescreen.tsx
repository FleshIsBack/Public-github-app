import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import GlassCard from '../components/Glasscard';
import ApiService, { User } from '../services/api';
import { colors, gradients, spacing, typography, borderRadius } from '../theme';
import { MainTabsParamList } from '../types';

type Props = BottomTabScreenProps<MainTabsParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
    const [userData, setUserData] = useState<User | null>(null);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async (): Promise<void> => {
        try {
            const userId = await ApiService.getCurrentUserId();
            if (userId) {
                const user = await ApiService.getUser(parseInt(userId));
                setUserData(user);
            }
        } catch (error) {
            console.error('Load user error:', error);
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
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <LinearGradient
                            colors={gradients.primary}
                            style={styles.avatar}
                        >
                            <Text style={styles.avatarText}>
                                {userData?.username?.charAt(0).toUpperCase() || '?'}
                            </Text>
                        </LinearGradient>
                    </View>
                    <Text style={styles.name}>{userData?.username || 'User'}</Text>
                    {userData?.email && (
                        <Text style={styles.email}>{userData.email}</Text>
                    )}
                </View>

                <View style={styles.statsRow}>
                    <GlassCard style={styles.statCard}>
                        <Text style={styles.statValue}>{userData?.total_sessions || 0}</Text>
                        <Text style={styles.statLabel}>Sessions</Text>
                    </GlassCard>
                    <GlassCard style={styles.statCard}>
                        <Text style={styles.statValue}>
                            {userData?.created_at
                                ? Math.floor((Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24))
                                : 0
                            }
                        </Text>
                        <Text style={styles.statLabel}>Days Active</Text>
                    </GlassCard>
                </View>

                <View style={styles.menu}>
                    <MenuItem
                        icon="sparkles"
                        title="New Analysis"
                        onPress={() => {
                            Alert.alert(
                                'New Analysis',
                                'Create a new analysis session?',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    {
                                        text: 'Start',
                                        onPress: async () => {
                                            if (userData) {
                                                const session = await ApiService.createSession(userData.user_id, 'progress');
                                                (navigation as any).navigate('Camera', {
                                                    sessionId: session.session_id,
                                                    userId: userData.user_id
                                                });
                                            }
                                        }
                                    }
                                ]
                            );
                        }}
                    />
                    <MenuItem
                        icon="time-outline"
                        title="Analysis History"
                        onPress={() => Alert.alert('Coming Soon', 'View your past analyses')}
                    />
                    <MenuItem
                        icon="notifications-outline"
                        title="Notifications"
                        onPress={() => Alert.alert('Coming Soon', 'Manage your notifications')}
                    />
                    <MenuItem
                        icon="color-palette-outline"
                        title="Theme"
                        onPress={() => Alert.alert('Coming Soon', 'Customize your app theme')}
                    />
                    <MenuItem
                        icon="help-circle-outline"
                        title="Help & Support"
                        onPress={() => Alert.alert('Help', 'Contact us at support@glowup.com')}
                    />
                    <MenuItem
                        icon="information-circle-outline"
                        title="About"
                        onPress={() => Alert.alert('Glow Up', 'Version 1.0.0\nYour skin AI Companion')}
                    />
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => {
                        Alert.alert(
                            'Logout',
                            'Are you sure you want to logout?',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Logout',
                                    style: 'destructive',
                                    onPress: () => (navigation as any).navigate('Welcome')
                                }
                            ]
                        );
                    }}
                >
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
}

interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    onPress: () => void;
}

function MenuItem({ icon, title, onPress }: MenuItemProps) {
    return (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.menuLeft}>
                <View style={styles.menuIcon}>
                    <Ionicons name={icon} size={22} color={colors.primary} />
                </View>
                <Text style={styles.menuTitle}>{title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
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
    profileHeader: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    avatarContainer: {
        marginBottom: spacing.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 48,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    name: {
        ...typography.h2,
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    email: {
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
    },
    statValue: {
        fontSize: 32,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: spacing.xs,
    },
    statLabel: {
        ...typography.caption,
        color: colors.text.secondary,
    },
    menu: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        marginBottom: spacing.xl,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.background,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primaryLight + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    menuTitle: {
        ...typography.body,
        color: colors.text.primary,
    },
    logoutButton: {
        alignItems: 'center',
        padding: spacing.md,
    },
    logoutText: {
        ...typography.bodyBold,
        color: colors.error,
    },
});