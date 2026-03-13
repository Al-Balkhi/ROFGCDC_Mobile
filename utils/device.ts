/**
 * utils/device.ts
 *
 * Utilities for identifying the current device.
 *
 * Strategy (in priority order):
 *   1. expo-device osBuildId  — stable, unique per OS build on most Android devices
 *   2. expo-device modelId    — model identifier, less unique but broadly available
 *   3. Timestamp fallback     — never returns null; uniqueness not guaranteed across sessions
 *
 * The backend uses this ID for rate-limiting and deduplication of reports,
 * so a stable value is preferred but a fallback is acceptable.
 */

import * as Device from "expo-device";

/**
 * Return a best-effort stable identifier for the current device.
 * This value is sent with every report submission as `device_id`.
 */
export function getDeviceId(): string {
  return Device.osBuildId ?? Device.modelId ?? `mobile_device_${Date.now()}`;
}
