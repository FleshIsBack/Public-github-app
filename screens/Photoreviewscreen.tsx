import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import GradientButton from '../components/Gradientbutton';
import ApiService from '../services/api';
import { colors, gradients, spacing, typography, borderRadius, shadows } from '../theme';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export default function OnboardingScreen({ navigation }: Props) {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleContinue = async (): Promise<void> => {
        if (!name.trim()) {
            Alert.alert('Name Required', 'Please enter your name to continue');
            return;
        }

        try {
            setLoading(true);

            // Create user
            const user = await ApiService.createUser(name, email || '');

            // Create onboarding session
            const session = await ApiService.createSession(user.user_id, 'onboarding');

            // Navigate to camera
            navigation.navigate('Camera', { sessionId: session.session_id, userId: user.user_id });
        } catch (error) {
            Alert.alert('Error', 'Failed to create your profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={[colors.background, colors.surfaceLight]}
            style={styles.container}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.iconCircle}>
                            <LinearGradient
                                colors={gradients.primary}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.iconGradient}
                            >
                                <Ionicons name="person-add" size={32} color="#FFFFFF" />
                            </LinearGradient>
                        </View>
                        <Text style={styles.title}>Create Your Profile</Text>
                        <Text style={styles.subtitle}>
                            Let's personalize your glow-up journey
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {/* Name Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>What's your name? *</Text>
                            <View style={styles.input}>
                                <Ionicons name="person-outline" size={20} color={colors.text.secondary} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Enter your name"
                                    placeholderTextColor={colors.text.tertiary}
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>

                        {/* Email Input (Optional) */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email (optional)</Text>
                            <View style={styles.input}>
                                <Ionicons name="mail-outline" size={20} color={colors.text.secondary} />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="your@email.com"
                                    placeholderTextColor={colors.text.tertiary}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Info Card */}
                        <View style={styles.infoCard}>
                            <Ionicons name="information-circle" size={24} color={colors.primary} />
                            <Text style={styles.infoText}>
                                We'll analyze your skin and create a personalized skin routine just for you!
                            </Text>
                        </View>
                    </View>

                    {/* Button */}
                    <GradientButton
                        title="Continue"
                        onPress={handleContinue}
                        loading={loading}
                        disabled={!name.trim() || loading}
                        style={styles.button}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: spacing.xl,
        paddingTop: spacing.xxl * 2,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: spacing.lg,
        overflow: 'hidden',
        ...shadows.md,
    },
    iconGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        ...typography.h1,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    subtitle: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
    },
    form: {
        flex: 1,
        marginBottom: spacing.lg,
    },
    inputContainer: {
        marginBottom: spacing.lg,
    },
    label: {
        ...typography.bodyBold,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        height: 56,
        ...shadows.sm,
    },
    textInput: {
        flex: 1,
        marginLeft: spacing.sm,
        ...typography.body,
        color: colors.text.primary,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: colors.primaryLight + '20',
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginTop: spacing.md,
    },
    infoText: {
        ...typography.caption,
        color: colors.text.secondary,
        flex: 1,
        marginLeft: spacing.sm,
    },
    button: {
        marginTop: 'auto',
    },
});