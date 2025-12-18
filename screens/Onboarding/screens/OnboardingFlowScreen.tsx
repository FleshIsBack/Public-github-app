import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Context
import { OnboardingProvider, useOnboarding } from '../context/OnboardingContext';

// Steps
import WelcomeStep from './Welcomestep';
import GoalsStep from './GoalsStep';
import ConcernsStep from './ConcernsStep';
import SkinTypeStep from './SkinTypeStep';
import LifestyleStep from './LifestyleStep';
import ProfileStep from './ProfileStep';
import PhotoPrepStep from './PhotoPrepStep';

// Components
import { ProgressIndicator } from '../components/Onboardingcomponents';

// Services & Theme
import ApiService from '../../../services/api';
import { colors, spacing } from '../../../theme';
import { RootStackParamList } from '../../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

function OnboardingFlowContent({ navigation }: Props) {
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


            const session = await ApiService.createSession(user.user_id, 'onboarding');



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
                <View style={styles.header}>
                    {showBackButton ? (
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleBack}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.backButton} />
                    )}

                    {showProgress && (
                        <View style={styles.progressWrapper}>
                            <ProgressIndicator
                                currentStep={currentStep - 1}
                                totalSteps={totalSteps - 1}
                            />
                        </View>
                    )}

                    <View style={styles.backButton} />
                </View>

                {/* Step Content */}
                <View style={styles.content}>
                    {renderStep()}
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

// Main export with provider wrapper
export default function OnboardingFlowScreen(props: Props) {
    return (
        <OnboardingProvider>
            <OnboardingFlowContent {...props} />
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
});