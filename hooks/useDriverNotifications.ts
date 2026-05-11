/**
 * hooks/useDriverNotifications.ts
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Polls driver notifications from the REST API and manages read state.
 * WebSocket support can be layered on top via the connect() method.
 *
 * Note: Uses polling (every 60 s) rather than WebSocket so it works
 * without Django Channels configured on the mobile backend.
 * Switch POLL_INTERVAL to 0 and enable wsConnect() for WebSocket mode.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import driverApi from "../services/driverApi";

export interface DriverNotification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const POLL_INTERVAL_MS = 60_000; // 60 seconds

export function useDriverNotifications() {
  const [notifications, setNotifications] = useState<DriverNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await driverApi.get("/driver/notifications/");
      const data: DriverNotification[] = resp.data.results ?? resp.data;
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.is_read).length);
      setError(null);
    } catch {
      setError("فشل تحميل الإشعارات.");
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: number) => {
    try {
      await driverApi.post(`/driver/notifications/${id}/read/`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // Silently fail — non-critical
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await driverApi.post("/driver/notifications/read-all/");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      // Silently fail
    }
  }, []);

  // Initial fetch + polling
  useEffect(() => {
    fetchNotifications();
    pollTimer.current = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, [fetchNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}
