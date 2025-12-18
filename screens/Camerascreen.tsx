import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Camera, CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, gradients, spacing, typography, borderRadius } from '../theme';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Camera'>;

const { width, height } = Dimensions.get('window');

interface PhotoAngle {
    key: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    instruction: string;
}

const PHOTO_ANGLES: PhotoAngle[] = [
    { key: 'front', label: 'Front View', icon: 'person', instruction: 'Face the camera directly' },
    { key: 'left_45', label: 'Left 45°', icon: 'arrow-back', instruction: 'Turn left 45 degrees' },
    { key: 'right_45', label: 'Right 45°', icon: 'arrow-forward', instruction: 'Turn right 45 degrees' },
];

export default function CameraScreen({ route, navigation }: Props) {
    const { sessionId, userId } = route.params;
    const [permission, requestPermission] = useCameraPermissions();
    const [currentAngleIndex, setCurrentAngleIndex] = useState<number>(0);
    const [capturedPhotos, setCapturedPhotos] = useState<Record<string, string>>({});
    const [cameraReady, setCameraReady] = useState<boolean>(false);
    const cameraRef = useRef<CameraView>(null);

    const currentAngle = PHOTO_ANGLES[currentAngleIndex];

    useEffect(() => {

        if (!sessionId) {
            console.error('WARNING: sessionId is undefined/null!');
            Alert.alert(
                'Error',
                'Session ID is missing. Please start onboarding again.',
                [{ text: 'OK', onPress: () => navigation.navigate('Onboarding') }]
            );
        }

        if (!userId) {
            console.error('WARNING: userId is undefined/null!');
        }

    }, []);

    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, []);

    const takePicture = async (): Promise<void> => {
        if (!cameraRef.current || !cameraReady) return;

        try {

            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
                skipProcessing: true,
            });

            if (photo) {

                const updatedPhotos = {
                    ...capturedPhotos,
                    [currentAngle.key]: photo.uri,
                };

                setCapturedPhotos(updatedPhotos);


                if (currentAngleIndex < PHOTO_ANGLES.length - 1) {
                    setCurrentAngleIndex(currentAngleIndex + 1);
                } else {
                    if (!sessionId) {
                        console.error('ERROR: sessionId is missing!');
                        Alert.alert('Error', 'Session ID is missing. Please start over.');
                        return;
                    }

                    if (!userId) {
                        console.error('ERROR: userId is missing!');
                        Alert.alert('Error', 'User ID is missing. Please start over.');
                        return;
                    }

                    if (Object.keys(updatedPhotos).length === 0) {
                        console.error('ERROR: No photos captured!');
                        Alert.alert('Error', 'No photos captured. Please try again.');
                        return;
                    }


                    try {
                        navigation.navigate('PhotoReview', {
                            sessionId,
                            userId,
                            photos: updatedPhotos,
                        });
                    } catch (navError) {
                        console.error('Navigation failed:', navError);
                        Alert.alert('Navigation Error', 'Failed to proceed to photo review. Please try again.');
                    }
                }
            } else {
                console.error('photo capture returned null');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to capture photo. Please try again.');
        }
    };

    const retakeCurrent = (): void => {
        const newPhotos = { ...capturedPhotos };
        delete newPhotos[currentAngle.key];
        setCapturedPhotos(newPhotos);
    };

    const skipPhoto = (): void => {
        if (currentAngleIndex < PHOTO_ANGLES.length - 1) {
            setCurrentAngleIndex(currentAngleIndex + 1);
        } else {
            navigation.navigate('PhotoReview', {
                sessionId,
                userId,
                photos: capturedPhotos,
            });
        }
    };

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Camera permission is required</Text>
            </View>
        );
    }

    const progressPercentage = ((currentAngleIndex + 1) / PHOTO_ANGLES.length) * 100;

    return (
        <View style={styles.container}>
            {/* Camera View */}
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="front"
                onCameraReady={() => setCameraReady(true)}
            >
                {/* Overlay */}
                <View style={styles.overlay}>
                    {/* Top Bar */}
                    <View style={styles.topBar}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="close" size={28} color="#FFFFFF" />
                        </TouchableOpacity>

                        {/* Progress */}
                        <View style={styles.progressContainer}>
                            <Text style={styles.progressText}>
                                {currentAngleIndex + 1} / {PHOTO_ANGLES.length}
                            </Text>
                            <View style={styles.progressBar}>
                                <LinearGradient
                                    colors={gradients.primary}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[styles.progressFill, { width: `${progressPercentage}%` }]}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Face Guide */}
                    <View style={styles.faceGuide}>
                        <View style={styles.faceOval} />
                    </View>

                    {/* Instruction Card */}
                    <View style={styles.instructionCard}>
                        <Ionicons name={currentAngle.icon} size={32} color={colors.primary} />
                        <Text style={styles.angleLabel}>{currentAngle.label}</Text>
                        <Text style={styles.instruction}>{currentAngle.instruction}</Text>
                    </View>

                    {/* Bottom Controls */}
                    <View style={styles.bottomBar}>
                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={skipPhoto}
                        >
                            <Text style={styles.secondaryButtonText}>Skip</Text>
                        </TouchableOpacity>

                        {/* Capture Button */}
                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={takePicture}
                            disabled={!cameraReady}
                        >
                            <LinearGradient
                                colors={gradients.primary}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.captureGradient}
                            >
                                <View style={styles.captureInner} />
                            </LinearGradient>
                        </TouchableOpacity>

                        {capturedPhotos[currentAngle.key] ? (
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={retakeCurrent}
                            >
                                <Text style={styles.secondaryButtonText}>Retake</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.secondaryButton} />
                        )}
                    </View>

                    {/* Tips */}
                    <View style={styles.tips}>
                        <Text style={styles.tipText}>💡 Make sure your face is well-lit and centered</Text>
                    </View>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
    },
    topBar: {
        paddingTop: 60,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressContainer: {
        marginTop: spacing.md,
    },
    progressText: {
        ...typography.bodyBold,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    progressBar: {
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
    },
    faceGuide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    faceOval: {
        width: width * 0.7,
        height: height * 0.45,
        borderRadius: width * 0.35,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        borderStyle: 'dashed',
    },
    instructionCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        marginHorizontal: spacing.xl,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
    },
    angleLabel: {
        ...typography.h3,
        color: colors.text.primary,
        marginTop: spacing.sm,
    },
    instruction: {
        ...typography.body,
        color: colors.text.secondary,
        marginTop: spacing.xs,
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.xxl,
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    captureGradient: {
        flex: 1,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureInner: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: '#FFFFFF',
    },
    secondaryButton: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        minWidth: 80,
    },
    secondaryButtonText: {
        ...typography.bodyBold,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    tips: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.md,
    },
    tipText: {
        ...typography.caption,
        color: '#FFFFFF',
        textAlign: 'center',
        opacity: 0.8,
    },
    errorText: {
        ...typography.body,
        color: colors.text.secondary,
        textAlign: 'center',
    },
});