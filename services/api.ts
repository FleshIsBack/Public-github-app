import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'xxx';

export interface User {
    user_id: number;
    username: string;
    email: string;
    created_at: string;
    total_sessions?: number;
}

export interface Session {
    session_id: string;
    user_id: number;
    session_type: string;
    status: string;
    created_at: string;
}

export interface PhotoUploadResponse {
    photo_id: string;
    angle: string;
    detected_pose?: string;
    message: string;
}

export interface SkinMetrics {
    clarity_score: number;
    tone_evenness: number;
    texture_smoothness: number;
    redness_score: number;
    hydration_index: number;
    overall_skin_health: number;
    pigmentation_score: number;
    glow_level: number;
    pore_visibility: number;
    dryness_score: number;
    barrier_health: number;
    glass_skin_score: number;
    undertone: string;
    undertone_confidence: number;
    seasonal_color: string;
    seasonal_confidence: number;
    detected_issues: Record<string, any>;
}

export interface Features {
    eye_brightness: number;
    under_eye_darkness: number;
    eye_openness: number;
    lip_definition: number;
    lip_fullness: number;
    eyebrow_shape_score: number;
    eyebrow_thickness: number;
    canthal_tilt_angle: number;
    canthal_tilt_type: string;
    canthal_tilt_score: number;
    eye_type: string;
    eye_type_confidence: number;
    eye_width_height_ratio: number;
    face_shape: string;
    face_shape_confidence: number;
    face_width_height_ratio: number;
    jaw_width_cheekbone_ratio: number;
    nose_type: string;
    nose_type_confidence: number;
    nose_length_width_ratio: number;
    nose_tip_angle: number;
}

export interface AnalysisResult {
    session_id: string;
    analysis_id: string;
    analysis_type: string;
    confidence: string;
    overall_score: number;
    skin_metrics: SkinMetrics;
    facial_structure: {
        symmetry_score: number;
        golden_ratio_adherence: number;
        jaw_definition: number;
        cheekbone_prominence: number;
        overall_structure_score: number;
    };
    features: Features;
    recommendations: string[];
    improvement_areas: Array<{
        area: string;
        current_score: number;
        category: string;
        priority: string;
    }>;
}

export interface RoutineStep {
    step: string;
    product: string;
    reason: string;
}

export interface ColorPalette {
    best_colors: string[];
    avoid_colors: string[];
    makeup_recommendations: Record<string, string>;
}

export interface Routine {
    session_id: string;
    morning_routine: RoutineStep[];
    evening_routine: RoutineStep[];
    color_palette: ColorPalette;
    lifestyle_tips: string[];
    created_at: string;
}

export interface CheckinData {
    completed_routine: boolean;
    skin_feeling: string;
    notes?: string;
}

export interface Checkin {
    checkin_id: string;
    date: string;
    completed_routine: boolean;
    skin_feeling: string;
    notes?: string;
}

export interface GlassSkinProgress {
    data_points: Array<{
        date: string;
        glass_skin_score: number;
    }>;
}

export interface UserProgress {
    latest_glass_skin_score: number;
    improvement_percentage: number;
    total_analyses: number;
}

const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

class ApiService {
    async createUser(name: string, email?: string): Promise<User> {
        try {
            const payload = {
                username: name,
                email: email || 'user@example.com'
            };

            const response = await api.post<User>('/users/', payload);
            await AsyncStorage.setItem('userId', response.data.user_id.toString());
            return response.data;
        } catch (error) {
            console.error('Create user error:', error);
            throw error;
        }
    }

    async getUser(userId: number): Promise<User> {
        try {
            const response = await api.get<User>(`/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Get user error:', error);
            throw error;
        }
    }

    async getCurrentUserId(): Promise<string | null> {
        return await AsyncStorage.getItem('userId');
    }

    async createSession(userId: number, sessionType: string = 'onboarding'): Promise<Session> {
        try {
            const payload = {
                user_id: userId,
                session_type: sessionType
            };

            const response = await api.post<Session>('/sessions/', payload);
            await AsyncStorage.setItem('currentSessionId', response.data.session_id);
            return response.data;
        } catch (error) {
            console.error('Create session error:', error);
            throw error;
        }
    }

    async getSession(sessionId: string): Promise<Session> {
        try {
            const response = await api.get<Session>(`/sessions/${sessionId}`);
            return response.data;
        } catch (error) {
            console.error('Get session error:', error);
            throw error;
        }
    }

    async uploadPhoto(sessionId: string, photoUri: string, angle: string): Promise<PhotoUploadResponse> {
        try {

            const formData = new FormData();

            const uriParts = photoUri.split('.');
            const fileType = uriParts[uriParts.length - 1].toLowerCase();

            formData.append('file', {
                uri: photoUri,
                name: `photo_${angle}.${fileType}`,
                type: fileType === 'png' ? 'image/png' : 'image/jpeg',
            } as any);

            formData.append('angle', angle);

            const response = await api.post<PhotoUploadResponse>(
                `/sessions/${sessionId}/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    transformRequest: (data) => data,
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Upload error:', error.response?.data || error.message);
            throw error;
        }
    }

    async analyzeSession(sessionId: string): Promise<AnalysisResult> {
        try {
            const response = await api.post<AnalysisResult>(`/sessions/${sessionId}/analyze`);
            return response.data;
        } catch (error) {
            console.error('Analyze session error:', error);
            throw error;
        }
    }

    async getAnalysis(sessionId: string): Promise<AnalysisResult> {
        try {
            const response = await api.get<AnalysisResult>(`/sessions/${sessionId}/analysis`);
            return response.data;
        } catch (error) {
            console.error('Get analysis error:', error);
            throw error;
        }
    }

    async getRoutine(sessionId: string): Promise<Routine> {
        try {
            const response = await api.get<Routine>(`/sessions/${sessionId}/routine`);
            return response.data;
        } catch (error) {
            console.error('Get routine error:', error);
            throw error;
        }
    }

    async getCurrentRoutine(userId: number): Promise<Routine> {
        try {
            const response = await api.get<Routine>(`/users/${userId}/current-routine`);
            return response.data;
        } catch (error) {
            console.error('Get current routine error:', error);
            throw error;
        }
    }

    async checkIn(userId: number, data: CheckinData): Promise<Checkin> {
        try {
            const response = await api.post<Checkin>(`/users/${userId}/checkin`, data);
            return response.data;
        } catch (error) {
            console.error('Check-in error:', error);
            throw error;
        }
    }

    async getCheckins(userId: number, days: number = 30): Promise<Checkin[]> {
        try {
            const response = await api.get<Checkin[]>(`/users/${userId}/checkins?days=${days}`);
            return response.data;
        } catch (error) {
            console.error('Get check-ins error:', error);
            throw error;
        }
    }

    async getGlassSkinProgress(userId: number, days: number = 90): Promise<GlassSkinProgress> {
        try {
            const response = await api.get<GlassSkinProgress>(`/users/${userId}/glass-skin-progress?days=${days}`);
            return response.data;
        } catch (error) {
            console.error('progress error:', error);
            throw error;
        }
    }

    async getUserProgress(userId: number): Promise<UserProgress> {
        try {
            const response = await api.get<UserProgress>(`/users/${userId}/progress`);
            return response.data;
        } catch (error) {
            console.error('Get user progress error:', error);
            throw error;
        }
    }
}

export default new ApiService();