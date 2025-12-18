import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
    Welcome: undefined;
    Onboarding: undefined;
    Camera: { sessionId: string; userId: number };
    PhotoReview: { sessionId: string; userId: number; photos: Record<string, string> };
    AnalysisLoading: { sessionId: string; userId: number };
    Results: { sessionId: string; userId: number };
    MainTabs: undefined;
};

export type MainTabsParamList = {
    Home: undefined;
    Progress: undefined;
    Routine: undefined;
    Profile: undefined;
};

export type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;
export type OnboardingScreenProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;
export type CameraScreenProps = NativeStackScreenProps<RootStackParamList, 'Camera'>;
export type PhotoReviewScreenProps = NativeStackScreenProps<RootStackParamList, 'PhotoReview'>;
export type AnalysisLoadingScreenProps = NativeStackScreenProps<RootStackParamList, 'AnalysisLoading'>;
export type ResultsScreenProps = NativeStackScreenProps<RootStackParamList, 'Results'>;

export type HomeScreenProps = BottomTabScreenProps<MainTabsParamList, 'Home'>;
export type ProgressScreenProps = BottomTabScreenProps<MainTabsParamList, 'Progress'>;
export type RoutineScreenProps = BottomTabScreenProps<MainTabsParamList, 'Routine'>;
export type ProfileScreenProps = BottomTabScreenProps<MainTabsParamList, 'Profile'>;

export interface PhotoAngles {
    front?: string;
    left_45?: string;
    right_45?: string;
    profile_left?: string;
    profile_right?: string;
}