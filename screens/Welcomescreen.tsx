import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import GradientButton from '../components/Gradientbutton';
import { colors, gradients, spacing, typography, borderRadius } from '../theme/index';
import { RootStackParamList } from '../types/index';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: Props) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const sparkleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(sparkleAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(sparkleAnim, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const sparkleScale = sparkleAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.2, 1],
    });

    const sparkleOpacity = sparkleAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.5, 1, 0.5],
    });

    return (
        <LinearGradient
            colors={gradients.sunset}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                <View style={styles.iconContainer}>
                    <Animated.View
                        style={{
                            transform: [{ scale: sparkleScale }],
                            opacity: sparkleOpacity,
                        }}
                    >
                        <Ionicons name="sparkles" size={80} color="#FFFFFF" />
                    </Animated.View>
                </View>

                <Text style={styles.title}>Glow Up</Text>
                <Text style={styles.subtitle}>Your skin AI Companion</Text>

                <View style={styles.features}>
                    <FeatureItem icon="scan" text="AI-Powered Skin Analysis" />
                    <FeatureItem icon="heart" text="Personalized skin Routine" />
                    <FeatureItem icon="trending-up" text="Track Your Glass Skin Journey" />
                    <FeatureItem icon="color-palette" text="Find Your Perfect Colors" />
                </View>

                <GradientButton
                    title="Get Started"
                    onPress={() => navigation.navigate('Onboarding')}
                    style={styles.button}
                />

                <Text style={styles.terms}>
                    By continuing, you agree to our Terms & Privacy Policy
                </Text>
            </Animated.View>
        </LinearGradient>
    );
}

interface FeatureItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    text: string;
}

function FeatureItem({ icon, text }: FeatureItemProps) {
    return (
        <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
                <Ionicons name={icon} size={20} color={colors.primary} />
            </View>
            <Text style={styles.featureText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        paddingTop: height * 0.15,
        paddingBottom: spacing.xl,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h1,
        fontSize: 48,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: spacing.sm,
        fontWeight: '800',
    },
    subtitle: {
        ...typography.body,
        color: '#FFFFFF',
        textAlign: 'center',
        opacity: 0.9,
        marginBottom: spacing.xxl,
    },
    features: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.xl,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    featureIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    featureText: {
        ...typography.body,
        color: '#FFFFFF',
        flex: 1,
    },
    button: {
        marginBottom: spacing.md,
    },
    terms: {
        ...typography.small,
        color: '#FFFFFF',
        textAlign: 'center',
        opacity: 0.7,
    },
});