/**
 * hooks/useDeviceId.ts
 *
 * Returns a stable device identifier, resolved once on component mount.
 * Initialises with "unknown_device" to avoid a null/undefined intermediate state
 * that callers would need to guard against.
 */

import { useEffect, useState } from "react";
import { getDeviceId } from "../utils/device";

/**
 * React hook that resolves and caches the device identifier.
 *
 * @returns A string identifier for the current device.
 */
export function useDeviceId(): string {
  const [deviceId, setDeviceId] = useState("unknown_device");

  useEffect(() => {
    setDeviceId(getDeviceId());
  }, []);

  return deviceId;
}
