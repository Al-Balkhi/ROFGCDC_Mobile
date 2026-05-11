import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import "../../../global.css";
import {
    ActivityIndicator,
    View
} from "react-native";
import { useDriverAuth } from "../../../hooks/useDriverAuth";

export default function DriverAppRoot() {
  const { isAuthenticated, isLoading, restoreToken } = useDriverAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    restoreToken();
  }, [restoreToken]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = [
      "login",
      "activate",
      "forgot-password",
      "reset-password"
    ].includes(segments[0] as any);

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to the login page.
      router.replace("/login" as any);
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to the default drawer page.
      router.replace("/(drawer)/" as any);
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1A6B96" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(drawer)" />
      <Stack.Screen name="login" />
      <Stack.Screen name="activate" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen
        name="profile"
        options={{
          headerShown: true,
          title: "الملف الشخصي",
          headerStyle: { backgroundColor: "#1A6B96" },
          headerTintColor: "#fff",
        }}
      />
    </Stack>
  );
}
