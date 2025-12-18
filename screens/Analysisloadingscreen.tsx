import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ApiService from '../services/api';
import { colors, gradients, spacing, typography } from '../theme/index';
import { RootStackParamList } from '../types/index';

type Props = NativeStackScreenProps<RootStackParamList, 'AnalysisLoading'>;

interface LoadingStep {
    text: string;
    icon: keyof typeof Ionicons.glyphMap;
}

const LOADING_STEPS: LoadingStep[] = [
    { text: 'Detecting facial features...', icon: 'scan' },
    { text: 'Analyzing skin quality...', icon: 'sparkles' },
    { text: 'Measuring proportions...', icon: 'resize' },
    { text: 'Detecting undertone...', icon: 'color-palette' },
    { text: 'Calculating glass skin score...', icon: 'water' },
    { text: 'Generating your routine...', icon: 'heart' },
];

export default function AnalysisLoadingScreen({ route, navigation }: Props) {
    const { sessionId, userId } = route.params;
    const [currentStep, setCurrentStep] = useState<number>(0);
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.8,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Rotate animation
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true,
            })
        ).start();

        const stepInterval = setInterval(() => {
            setCurrentStep((prev) => {
                if (prev < LOADING_STEPS.length - 1) {
                    return prev + 1;
                }
                return prev;
            });
        }, 2000);

        analyzePhotos();

        return () => clearInterval(stepInterval);
    }, []);

    const analyzePhotos = async (): Promise<void> => {
        try {
            const result = await ApiService.analyzeSession(sessionId);

            setTimeout(() => {
                navigation.replace('Results', { sessionId, userId });
            }, 1000);
        } catch (error) {
            console.error('Analysis error:', error);
            setTimeout(() => {
                navigation.replace('Results', { sessionId, userId });
            }, 2000);
        }
    };

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <LinearGradient
            colors={gradients.sunset}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.content}>
                {/* Animated Icon */}
                <Animated.View
                    style={[
                        styles.iconContainer,
                        {
                            transform: [{ scale: scaleAnim }, { rotate: spin }],
                        },
                    ]}
                >
                    <Ionicons name="sparkles" size={80} color="#FFFFFF" />
                </Animated.View>

                {/* Loading Text */}
                <Text style={styles.title}>Analyzing Your Glow</Text>

                {/* Current Step */}
                <View style={styles.stepContainer}>
                    <Ionicons
                        name={LOADING_STEPS[currentStep].icon}
                        size={24}
                        color="#FFFFFF"
                    />
                    <Text style={styles.stepText}>
                        {LOADING_STEPS[currentStep].text}
                    </Text>
                </View>

                {/* Progress Dots */}
                <View style={styles.dots}>
                    {LOADING_STEPS.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index <= currentStep && styles.dotActive,
                            ]}
                        />
                    ))}
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    iconContainer: {
        marginBottom: spacing.xxl,
    },
    title: {
        ...typography.h1,
        color: '#FFFFFF',
        marginBottom: spacing.xl,
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: 999,
        marginBottom: spacing.xl,
    },
    stepText: {
        ...typography.body,
        color: '#FFFFFF',
        marginLeft: spacing.sm,
    },
    dots: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    dotActive: {
        backgroundColor: '#FFFFFF',
    },
});