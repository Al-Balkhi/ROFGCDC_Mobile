/**
 * components/driver/DriverHeader.tsx
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Reusable header bar for driver screens (non-drawer pages like task detail,
 * navigation, report view). Provides a back arrow + title with the same
 * green color scheme used in the drawer layout.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Props {
  title: string;
  onBack?: () => void;
  /** Right-side action (e.g. a notification badge) */
  rightComponent?: React.ReactNode;
}

const HEADER_HEIGHT = 56;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight ?? 0;

export default function DriverHeader({ title, onBack, rightComponent }: Props) {
  const router = useRouter();

  const handleBack = onBack ?? (() => router.back());

  return (
    <>
      <StatusBar backgroundColor="#15803d" barStyle="light-content" />
      <View
        style={{ paddingTop: STATUS_BAR_HEIGHT, height: STATUS_BAR_HEIGHT + HEADER_HEIGHT }}
        className="bg-green-700 flex-row items-end justify-between px-4 pb-3"
      >
        {/* Right side (back button) — RTL layout */}
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Centered title */}
        <Text
          className="text-white font-bold text-lg flex-1 text-center"
          numberOfLines={1}
        >
          {title}
        </Text>

        {/* Left side — optional action or spacer */}
        <View style={{ width: 24 }}>
          {rightComponent ?? null}
        </View>
      </View>
    </>
  );
}
