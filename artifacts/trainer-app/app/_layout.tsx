import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppProvider } from "@/context/AppContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="profile-select" />
      <Stack.Screen name="filters" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(personal-tabs)" />
      <Stack.Screen name="onboarding/welcome" />
      <Stack.Screen name="onboarding/basic" />
      <Stack.Screen name="onboarding/goal" />
      <Stack.Screen name="onboarding/physical" />
      <Stack.Screen name="onboarding/health" />
      <Stack.Screen name="onboarding/workout" />
      <Stack.Screen name="onboarding/complete" />
      <Stack.Screen name="workout/history" />
      <Stack.Screen name="workout/register" />
      <Stack.Screen name="assessment/info" />
      <Stack.Screen name="assessment/conduct" />
      <Stack.Screen name="assessment/complete" />
      <Stack.Screen name="assessment/reeval" />
      <Stack.Screen name="student/ficha" />
      <Stack.Screen name="student/evolution" />
      <Stack.Screen name="student/notifications" />
      <Stack.Screen name="checkin/[bookingId]" />
      <Stack.Screen name="review/[bookingId]" />
      <Stack.Screen name="personal/student-file/[studentId]" />
      <Stack.Screen name="personal/workout-edit" />
      <Stack.Screen name="gym/[gymId]/trainers" />
      <Stack.Screen name="trainer/[trainerId]" />
      <Stack.Screen name="booking/confirm" />
      <Stack.Screen name="booking/payment" />
      <Stack.Screen name="booking/success" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <AppProvider>
                <RootLayoutNav />
              </AppProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
