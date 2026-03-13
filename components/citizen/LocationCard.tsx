/**
 * components/citizen/LocationCard.tsx
 *
 * Displays the current GPS status and provides a button to fetch it.
 *
 * Visual states:
 *   - Fetched: Shows success text with truncated coordinates.
 *   - Empty:   Shows "Get Location" button.
 *   - Loading: Button text changes to "Locating..." and is disabled.
 */

import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Location from "expo-location";
import { STRINGS } from "../../constants/strings";

interface LocationCardProps {
  /** The currently resolved GPS position, or null if empty. */
  location: Location.LocationObject | null;
  /** True while a GPS fetch is in flight. */
  loading: boolean;
  /** Triggered when the user taps the Get Location button. */
  onGetLocation: () => void;
}

/**
 * LocationCard — GPS status UI.
 *
 * Includes an icon, action button/status text, and coordinates.
 */
export function LocationCard({
  location,
  loading,
  onGetLocation,
}: LocationCardProps) {
  return (
    <View className="bg-white rounded-2xl p-5 shadow-sm mb-5 border border-gray-100">
      <Text className="text-xl font-bold text-primary text-right mb-3">
        {STRINGS.SECTION_LOCATION}
      </Text>

      <View className="flex-row items-center justify-between">
        {/* Placeholder pin icon with soft background */}
        <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
          <Text className="text-2xl">📍</Text>
        </View>

        {/* State 1: Resolved */}
        {location ? (
          <View className="items-end">
            <Text className="text-success font-bold mb-1 text-right">
              {STRINGS.LABEL_LOCATION_SET}
            </Text>
            {/* Show coordinates truncated to 5 decimals (~1.1 meter accuracy) */}
            <Text className="text-xs text-gray-500 text-right">
              {location.coords.latitude.toFixed(5)},{" "}
              {location.coords.longitude.toFixed(5)}
            </Text>
          </View>
        ) : (
          /* State 2: Empty or Loading */
          <TouchableOpacity
            onPress={onGetLocation}
            className="px-5 py-2.5 bg-primary/10 rounded-xl active:opacity-70"
            disabled={loading}
            accessibilityLabel={STRINGS.LABEL_GET_LOCATION}
            accessibilityRole="button"
          >
            <Text className="text-primary font-bold text-sm text-right">
              {loading ? STRINGS.LABEL_LOCATING : STRINGS.LABEL_GET_LOCATION}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
