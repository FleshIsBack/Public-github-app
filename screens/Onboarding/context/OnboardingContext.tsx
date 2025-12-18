import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
    OnboardingData,
    SkinGoal,
    SkinConcern,
    SkinType,
    LifestyleData,
    ProfileData,
} from '../types/Onboarding';

interface OnboardingContextType {
    data: OnboardingData;
    currentStep: number;
    totalSteps: number;

    // Navigation
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (step: number) => void;

    // Data setters
    setSkinGoals: (goals: SkinGoal[]) => void;
    toggleSkinGoal: (goal: SkinGoal) => void;
    setSkinConcerns: (concerns: SkinConcern[]) => void;
    toggleSkinConcern: (concern: SkinConcern) => void;
    setSkinType: (type: SkinType) => void;
    setLifestyleData: (data: Partial<LifestyleData>) => void;
    setProfileData: (data: Partial<ProfileData>) => void;

    // Validation
    canProceed: () => boolean;
    isStepComplete: (step: number) => boolean;

    resetOnboarding: () => void;
}

const initialData: OnboardingData = {
    skinGoals: [],
    skinConcerns: [],
    skinType: null,
    lifestyle: {
        sleepHours: null,
        waterIntake: null,
        sunExposure: null,
        stressLevel: null,
        diet: null,
    },
    profile: {
        name: '',
        email: '',
        ageRange: null,
    },
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<OnboardingData>(initialData);
    const [currentStep, setCurrentStep] = useState(0);
    const totalSteps = 7; // welcome, goals, concerns, skin_type, lifestyle, profile, photo_prep

    const nextStep = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const goToStep = (step: number) => {
        if (step >= 0 && step < totalSteps) {
            setCurrentStep(step);
        }
    };

    const setSkinGoals = (goals: SkinGoal[]) => {
        setData(prev => ({ ...prev, skinGoals: goals }));
    };

    const toggleSkinGoal = (goal: SkinGoal) => {
        setData(prev => ({
            ...prev,
            skinGoals: prev.skinGoals.includes(goal)
                ? prev.skinGoals.filter(g => g !== goal)
                : [...prev.skinGoals, goal].slice(0, 3),
        }));
    };

    const setSkinConcerns = (concerns: SkinConcern[]) => {
        setData(prev => ({ ...prev, skinConcerns: concerns }));
    };

    const toggleSkinConcern = (concern: SkinConcern) => {
        setData(prev => ({
            ...prev,
            skinConcerns: prev.skinConcerns.includes(concern)
                ? prev.skinConcerns.filter(c => c !== concern)
                : [...prev.skinConcerns, concern].slice(0, 5),
        }));
    };

    const setSkinType = (type: SkinType) => {
        setData(prev => ({ ...prev, skinType: type }));
    };

    const setLifestyleData = (lifestyleData: Partial<LifestyleData>) => {
        setData(prev => ({
            ...prev,
            lifestyle: { ...prev.lifestyle, ...lifestyleData },
        }));
    };

    const setProfileData = (profileData: Partial<ProfileData>) => {
        setData(prev => ({
            ...prev,
            profile: { ...prev.profile, ...profileData },
        }));
    };

    const isStepComplete = (step: number): boolean => {
        switch (step) {
            case 0: // Welcome
                return true;
            case 1: // Goals
                return data.skinGoals.length > 0;
            case 2: // Concerns
                return data.skinConcerns.length > 0;
            case 3: // Skin Type
                return data.skinType !== null;
            case 4: // Lifestyle
                return true;
            case 5: // Profile
                return data.profile.name.trim().length > 0;
            case 6: // Photo Prep 
                return true;
            default:
                return false;
        }
    };

    const canProceed = (): boolean => {
        return isStepComplete(currentStep);
    };

    const resetOnboarding = () => {
        setData(initialData);
        setCurrentStep(0);
    };

    return (
        <OnboardingContext.Provider
            value={{
                data,
                currentStep,
                totalSteps,
                nextStep,
                prevStep,
                goToStep,
                setSkinGoals,
                toggleSkinGoal,
                setSkinConcerns,
                toggleSkinConcern,
                setSkinType,
                setLifestyleData,
                setProfileData,
                canProceed,
                isStepComplete,
                resetOnboarding,
            }}
        >
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
}