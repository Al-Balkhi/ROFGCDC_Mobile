/**
 * components/driver/RouteMap.tsx
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Map component that displays:
 *   - The driver's current location
 *   - Bin markers along the planned route
 *   - Landfill marker
 *   - Actual GPS trail (blue polyline) if provided
 *
 * Uses react-native-maps which is already a dependency from Phase 4.
 */

import React from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

interface LatLng {
  latitude: number;
  longitude: number;
}

interface Bin {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface Landfill {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
}

interface Props {
  /** Current driver location to center the map */
  currentLocation?: LatLng | null;
  /** Bins to display as green markers */
  bins?: Bin[];
  /** Landfill to display as a red marker */
  landfill?: Landfill | null;
  /** Ordered GPS trail (actual route taken) */
  gpsTrail?: LatLng[];
  /** Planned ideal route coordinates [[lat, lng], ...] */
  plannedRoute?: [number, number][];
  /** Height of the map — defaults to full flex-1 */
  height?: number;
  /** Map style override */
  style?: object;
}

const DEFAULT_REGION = {
  latitude: 33.5138,
  longitude: 36.2765,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function RouteMap({
  currentLocation,
  bins = [],
  landfill,
  gpsTrail = [],
  plannedRoute = [],
  height,
  style,
}: Props) {
  const initialRegion = currentLocation
    ? {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }
    : DEFAULT_REGION;

  return (
    <MapView
      style={[height ? { height } : styles.flex, style]}
      initialRegion={initialRegion}
      showsUserLocation
      showsMyLocationButton
    >
      {/* Bin markers */}
      {bins.map((bin) => (
        <Marker
          key={`bin-${bin.id}`}
          coordinate={{ latitude: bin.latitude, longitude: bin.longitude }}
          title={bin.name}
          pinColor="#16a34a"
        />
      ))}

      {/* Landfill marker */}
      {landfill && (
        <Marker
          coordinate={{
            latitude: landfill.latitude,
            longitude: landfill.longitude,
          }}
          title={landfill.name}
          pinColor="#dc2626"
        />
      )}

      {/* Planned route polyline */}
      {plannedRoute.length > 1 && (
        <Polyline
          coordinates={plannedRoute.map(([lat, lng]) => ({
            latitude: lat,
            longitude: lng,
          }))}
          strokeColor="#16a34a"
          strokeWidth={3}
          lineDashPattern={[6, 4]}
        />
      )}

      {/* Actual GPS trail polyline */}
      {gpsTrail.length > 1 && (
        <Polyline
          coordinates={gpsTrail}
          strokeColor="#2563eb"
          strokeWidth={3}
          lineDashPattern={[4, 4]}
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
