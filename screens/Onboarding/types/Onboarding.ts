// Onboarding Types

export interface StepProps {
    onContinue: () => void;
    onBack: () => void;
}

export interface OnboardingData {
    skinGoals: SkinGoal[];
    skinConcerns: SkinConcern[];
    skinType: SkinType | null;
    lifestyle: LifestyleData;
    profile: ProfileData;
}

export type SkinGoal =
    | 'glass_skin'
    | 'anti_aging'
    | 'brightening'
    | 'acne_free'
    | 'hydration'
    | 'even_tone'
    | 'minimize_pores'
    | 'glow';

export type SkinConcern =
    | 'acne'
    | 'dark_spots'
    | 'wrinkles'
    | 'dryness'
    | 'oiliness'
    | 'redness'
    | 'dark_circles'
    | 'large_pores'
    | 'dullness'
    | 'uneven_texture'
    | 'sensitivity'
    | 'hyperpigmentation';

export type SkinType =
    | 'oily'
    | 'dry'
    | 'combination'
    | 'normal'
    | 'sensitive';

export interface LifestyleData {
    sleepHours: number | null;
    waterIntake: WaterIntake | null;
    sunExposure: SunExposure | null;
    stressLevel: StressLevel | null;
    diet: DietType | null;
}

export type WaterIntake = 'low' | 'moderate' | 'high';
export type SunExposure = 'minimal' | 'moderate' | 'high';
export type StressLevel = 'low' | 'moderate' | 'high';
export type DietType = 'balanced' | 'plant_based' | 'high_sugar' | 'processed';

export interface ProfileData {
    name: string;
    email: string;
    ageRange: AgeRange | null;
}

export type AgeRange =
    | 'under_20'
    | '20_25'
    | '26_30'
    | '31_35'
    | '36_40'
    | '41_50'
    | 'over_50';

export const SKIN_GOALS_DATA: { id: SkinGoal; label: string; emoji: string; description: string }[] = [
    { id: 'glass_skin', label: 'Glass Skin', emoji: '✨', description: 'Crystal clear, luminous complexion' },
    { id: 'anti_aging', label: 'Anti-Aging', emoji: '🌸', description: 'Youthful, firm, wrinkle-free skin' },
    { id: 'brightening', label: 'Brightening', emoji: '☀️', description: 'Radiant, even-toned glow' },
    { id: 'acne_free', label: 'Acne-Free', emoji: '💎', description: 'Clear, blemish-free skin' },
    { id: 'hydration', label: 'Deep Hydration', emoji: '💧', description: 'Plump, dewy, moisturized skin' },
    { id: 'even_tone', label: 'Even Tone', emoji: '🎨', description: 'Uniform, balanced complexion' },
    { id: 'minimize_pores', label: 'Refined Pores', emoji: '🔍', description: 'Smooth, poreless appearance' },
    { id: 'glow', label: 'Natural Glow', emoji: '🌟', description: 'Healthy, lit-from-within radiance' },
];

export const SKIN_CONCERNS_DATA: { id: SkinConcern; label: string; emoji: string }[] = [
    { id: 'acne', label: 'Acne & Breakouts', emoji: '😣' },
    { id: 'dark_spots', label: 'Dark Spots', emoji: '🔘' },
    { id: 'wrinkles', label: 'Fine Lines & Wrinkles', emoji: '〰️' },
    { id: 'dryness', label: 'Dryness & Flaking', emoji: '🏜️' },
    { id: 'oiliness', label: 'Excess Oil', emoji: '💦' },
    { id: 'redness', label: 'Redness & Irritation', emoji: '🔴' },
    { id: 'dark_circles', label: 'Dark Circles', emoji: '👀' },
    { id: 'large_pores', label: 'Large Pores', emoji: '⭕' },
    { id: 'dullness', label: 'Dull Skin', emoji: '😶' },
    { id: 'uneven_texture', label: 'Uneven Texture', emoji: '🧱' },
    { id: 'sensitivity', label: 'Sensitivity', emoji: '🌡️' },
    { id: 'hyperpigmentation', label: 'Hyperpigmentation', emoji: '🎯' },
];

export const SKIN_TYPES_DATA: { id: SkinType; label: string; emoji: string; description: string; indicators: string[] }[] = [
    {
        id: 'oily',
        label: 'Oily',
        emoji: '💧',
        description: 'Shiny by midday, enlarged pores',
        indicators: ['Shiny T-zone', 'Visible pores', 'Prone to breakouts']
    },
    {
        id: 'dry',
        label: 'Dry',
        emoji: '🏜️',
        description: 'Tight, flaky, needs moisture',
        indicators: ['Feels tight', 'Flaky patches', 'Fine lines visible']
    },
    {
        id: 'combination',
        label: 'Combination',
        emoji: '⚖️',
        description: 'Oily T-zone, dry cheeks',
        indicators: ['Oily forehead/nose', 'Normal/dry cheeks', 'Varied texture']
    },
    {
        id: 'normal',
        label: 'Normal',
        emoji: '✅',
        description: 'Balanced, few concerns',
        indicators: ['Well-balanced', 'Small pores', 'Smooth texture']
    },
    {
        id: 'sensitive',
        label: 'Sensitive',
        emoji: '🌸',
        description: 'Easily irritated, reactive',
        indicators: ['Reacts to products', 'Redness prone', 'Needs gentle care']
    },
];

export const AGE_RANGES_DATA: { id: AgeRange; label: string }[] = [
    { id: 'under_20', label: 'Under 20' },
    { id: '20_25', label: '20-25' },
    { id: '26_30', label: '26-30' },
    { id: '31_35', label: '31-35' },
    { id: '36_40', label: '36-40' },
    { id: '41_50', label: '41-50' },
    { id: 'over_50', label: '50+' },
];