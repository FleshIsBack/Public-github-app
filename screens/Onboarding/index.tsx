import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types from App.tsx
type RootStackParamList = {
    Welcome: undefined;
    Onboarding: undefined;
    Camera: { sessionId: string; userId: number };
    PhotoReview: { sessionId: string; userId: number; photos: Record<string, string> };
    AnalysisLoading: { sessionId: string; userId: number };
    Results: { sessionId: string; userId: number };
    MainTabs: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

// Context
import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';

// Steps
import WelcomeStep from './screens/Welcomestep';
import GoalsStep from './screens/GoalsStep';
import ConcernsStep from './screens/ConcernsStep';
import SkinTypeStep from './screens/SkinTypeStep';
import LifestyleStep from './screens/LifestyleStep';
import ProfileStep from './screens/ProfileStep';
import PhotoPrepStep from './screens/PhotoPrepStep';

// Components
import { ProgressIndicator } from './components/Onboardingcomponents';

// Services
import ApiService from '../../services/api';

// Theme
import { colors, spacing } from '../../theme';

function OnboardingContent({ navigation }: Props) {
    const {
        data,
        currentStep,
        totalSteps,
        nextStep,
        prevStep,
    } = useOnboarding();

    const [loading, setLoading] = useState(false);

    const handleBack = () => {
        if (currentStep === 0) {
            navigation.goBack();
        } else {
            prevStep();
        }
    };

    const handleComplete = async () => {
        try {
            setLoading(true);


            const user = await ApiService.createUser(
                data.profile.name,
                data.profile.email || ''
            );


            // Store user ID
            await AsyncStorage.setItem('user_id', String(user.user_id));

            // Create onboarding session
            const session = await ApiService.createSession(user.user_id, 'onboarding');

            // Mark onboarding as seen
            await AsyncStorage.setItem('onboarding_completed', 'true');

            // Navigate to camera
            navigation.navigate('Camera', {
                sessionId: session.session_id,
                userId: user.user_id,
            });

        } catch (error) {
            console.error('Onboarding completion error:', error);
            Alert.alert('Error', 'Failed to create your profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        const handleContinue = () => {
            if (currentStep === totalSteps - 1) {
                handleComplete();
            } else {
                nextStep();
            }
        };

        switch (currentStep) {
            case 0:
                return <WelcomeStep onContinue={handleContinue} onBack={handleBack} />;
            case 1:
                return <GoalsStep onContinue={handleContinue} onBack={handleBack} />;
            case 2:
                return <ConcernsStep onContinue={handleContinue} onBack={handleBack} />;
            case 3:
                return <SkinTypeStep onContinue={handleContinue} onBack={handleBack} />;
            case 4:
                return <LifestyleStep onContinue={handleContinue} onBack={handleBack} />;
            case 5:
                return <ProfileStep onContinue={handleContinue} onBack={handleBack} />;
            case 6:
                return <PhotoPrepStep onContinue={handleContinue} onBack={handleBack} />;
            default:
                return <WelcomeStep onContinue={handleContinue} onBack={handleBack} />;
        }
    };

    const showBackButton = currentStep > 0;
    const showProgress = currentStep > 0;

    return (
        <LinearGradient
            colors={[colors.background, colors.surfaceLight]}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                < View style={styles.header} >
                    {
                        showBackButton ? (
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={handleBack}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.backButton} />
                        )
                    }

                    {
                        showProgress && (
                            <View style={styles.progressWrapper}>
                                <ProgressIndicator
                                    currentStep={currentStep - 1}
                                    totalSteps={totalSteps - 1
                                    }
                                />
                            </View>
                        )}

                    <View style={styles.backButton} />
                </View>

                {/* Step Content */}
                <View style={styles.content}>
                    {renderStep()}
                </View>

                {/* Loading Overlay */}
                {
                    loading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color={colors.primary} />
                        </View>
                    )
                }
            </SafeAreaView>
        </LinearGradient>
    );
}

// Main export with provider wrapper
export default function OnboardingScreen(props: Props) {
    return (
        <OnboardingProvider>
            <OnboardingContent {...props} />
        </OnboardingProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressWrapper: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});