import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import WelcomeScreen from './screens/Welcomescreen';
import OnboardingScreen from './screens/Onboarding/index';
import CameraScreen from './screens/Camerascreen';
import PhotoReviewScreen from './screens/Photoreviewscreen';
import AnalysisLoadingScreen from './screens/Analysisloadingscreen';
import ResultsScreen from './screens/Resultsscreen';
import HomeScreen from './screens/Homescreen';
import ProgressScreen from './screens/Progressscreen';
import RoutineScreen from './screens/Routinescreen';
import ProfileScreen from './screens/Profilescreen';
import { SafeAreaView } from 'react-native-safe-area-context';

// Types
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

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'sparkles' : 'sparkles-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Routine') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B9D',
        tabBarInactiveTintColor: '#C4B5D8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#FF6B9D',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Routine" component={RoutineScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then((value) => {
      if (value === null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  if (isFirstLaunch === null) {
    return null;
  }

  return (
    <>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <StatusBar style="dark" />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={isFirstLaunch ? "Welcome" : "MainTabs"}
            screenOptions={{
              headerShown: false,
              animation: 'fade',
            }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Camera" component={CameraScreen} />
            <Stack.Screen name="PhotoReview" component={PhotoReviewScreen} />
            <Stack.Screen name="AnalysisLoading" component={AnalysisLoadingScreen} />
            <Stack.Screen name="Results" component={ResultsScreen} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
}