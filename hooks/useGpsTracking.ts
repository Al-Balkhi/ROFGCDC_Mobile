/**
 * hooks/useGpsTracking.ts
 * ~~~~~~~~~~~~~~~~~~~~~~~~
 * Manages foreground GPS location tracking during task execution.
 * Accumulates pings and flushes them to the backend in batches every 30 s.
 *
 * Usage:
 *   const { currentLocation, startTracking, stopTracking } = useGpsTracking(taskId);
 */

import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import driverApi from "../services/driverApi";

interface GpsPing {
  lat: number;
  lng: number;
  timestamp: string;
}

interface GpsTrackingState {
  currentLocation: Location.LocationObject | null;
  hasPermission: boolean;
  isTracking: boolean;
  error: string | null;
}

export function useGpsTracking(taskId: number | string | null) {
  const [state, setState] = useState<GpsTrackingState>({
    currentLocation: null,
    hasPermission: false,
    isTracking: false,
    error: null,
  });

  const pendingPings = useRef<GpsPing[]>([]);
  const watchSubscription = useRef<Location.LocationSubscription | null>(null);
  const flushInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Flush accumulated GPS pings to the backend
  const flushPings = useCallback(async () => {
    if (!taskId || pendingPings.current.length === 0) return;
    const pingsToSend = [...pendingPings.current];
    pendingPings.current = [];
    try {
      await driverApi.post(`/driver/tasks/${taskId}/location/`, {
        pings: pingsToSend,
      });
    } catch {
      // Put pings back on failure to avoid data loss
      pendingPings.current = [...pingsToSend, ...pendingPings.current];
    }
  }, [taskId]);

  const startTracking = useCallback(async () => {
    // Request permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setState((s) => ({
        ...s,
        hasPermission: false,
        error: "لا يمكن تتبع الموقع بدون صلاحيات.",
      }));
      return false;
    }

    setState((s) => ({
      ...s,
      hasPermission: true,
      isTracking: true,
      error: null,
    }));

    // Start watching location
    watchSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 10, // Update every 10 metres
        timeInterval: 5000, // Or every 5 seconds, whichever comes first
      },
      (location) => {
        setState((s) => ({ ...s, currentLocation: location }));
        pendingPings.current.push({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
          timestamp: new Date(location.timestamp).toISOString(),
        });
      },
    );

    // Flush pings every 30 seconds
    flushInterval.current = setInterval(flushPings, 30_000);

    return true;
  }, [flushPings]);

  const stopTracking = useCallback(async () => {
    if (watchSubscription.current) {
      watchSubscription.current.remove();
      watchSubscription.current = null;
    }
    if (flushInterval.current) {
      clearInterval(flushInterval.current);
      flushInterval.current = null;
    }
    // Final flush before stopping
    await flushPings();
    setState((s) => ({ ...s, isTracking: false }));
  }, [flushPings]);

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchSubscription.current) watchSubscription.current.remove();
      if (flushInterval.current) clearInterval(flushInterval.current);
    };
  }, []);

  return {
    ...state,
    pendingPingsCount: pendingPings.current.length,
    startTracking,
    stopTracking,
    flushPings,
  };
}
