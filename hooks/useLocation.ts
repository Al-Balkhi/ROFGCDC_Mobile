/**
 * hooks/useLocation.ts
 *
 * Encapsulates:
 *   - GPS location state (`location`, `loading`)
 *   - `getCurrentPositionAsync` call with High accuracy
 *   - Error handling with an Arabic alert message
 *
 * Does NOT request permission — that is done once on screen mount so the
 * OS dialog can appear at the right moment in the UX flow.
 */

import * as Location from "expo-location";
import { useState } from "react";
import { Alert } from "react-native";
import { STRINGS } from "../constants/strings";

export type LocationState = {
  /** The resolved GPS position, or null if not yet obtained. */
  location: Location.LocationObject | null;
  /** Human-readable location name (city/region), or null if not resolved. */
  locationName: string | null;
  /** True while a position request is in flight. */
  loading: boolean;
  /** Trigger a new GPS position request. Safe to call multiple times. */
  getLocation: () => Promise<void>;
};

/**
 * Hook: GPS location state and retrieval.
 *
 * Usage:
 * ```tsx
 * const { location, loading, getLocation } = useLocation();
 * ```
 */
export function useLocation(): LocationState {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [locationName, setLocationName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getLocation = async () => {
    setLoading(true);
    try {
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(pos);

      // Reverse geocode to get location name
      const geocode = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });

      if (geocode.length > 0) {
        const address = geocode[0];
        const parts = [address.city, address.region, address.country].filter(
          Boolean,
        );
        setLocationName(parts.join("، "));
      }
    } catch {
      // Log suppressed — the alert gives the user actionable guidance.
      Alert.alert(STRINGS.TITLE_ERROR, STRINGS.ALERT_LOCATION_ERROR);
    } finally {
      setLoading(false);
    }
  };

  return { location, loading, locationName, getLocation };
}
