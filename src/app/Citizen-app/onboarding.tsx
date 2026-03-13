import { router } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaView, Text, View } from "react-native";
import AppLogo from "./Logo";
import { SPLASH_DELAY_MS } from "../../../constants/api";
import { STRINGS } from "../../../constants/strings";

export default function OnboardingScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/");
    }, SPLASH_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    // StatusBar is managed by _layout.tsx — no duplicate here.
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <View className="mt-20 items-center">
          <AppLogo size={300} />
        </View>

        <Text className="text-3xl font-bold text-primary mb-6 text-center shadow-sm">
          {STRINGS.ONBOARDING_TITLE}
        </Text>

        <Text className="text-lg text-gray-600 text-center leading-8 mb-12 px-4 font-medium">
          {STRINGS.ONBOARDING_SUBTITLE}
        </Text>

        <Text className="text-sm text-gray-400 text-center">
          {STRINGS.ONBOARDING_STARTING}
        </Text>
      </View>
    </SafeAreaView>
  );
}
