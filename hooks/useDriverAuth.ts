import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import driverApi, {
    setOnUnauthorizedCallback,
} from "../services/driverApi";

interface UserProfile {
  id: number;
  email: string;
  username: string;
  phone?: string;
  role: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    access: string,
    refresh: string,
    userData: UserProfile,
  ) => Promise<void>;
  logout: () => Promise<void>;
  restoreToken: () => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => void;
}

export const useDriverAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  updateUser: (data) =>
    set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),

  login: async (access, refresh, userData) => {
    try {
      await SecureStore.setItemAsync("driver_access_token", access);
      await SecureStore.setItemAsync("driver_refresh_token", refresh);
      set({ user: userData, isAuthenticated: true, isLoading: false });
    } catch (e) {
      console.error("Failed to stringify/save tokens:", e);
    }
  },

  logout: async () => {
    try {
      await driverApi.post("/auth/logout/").catch(() => null); // Best effort backend logout
    } catch {}

    await SecureStore.deleteItemAsync("driver_access_token");
    await SecureStore.deleteItemAsync("driver_refresh_token");
    set({ user: null, isAuthenticated: false });
  },

  restoreToken: async () => {
    try {
      const token = await SecureStore.getItemAsync("driver_access_token");
      if (token) {
        // Attempt to fetch profile to validate the token
        const response = await driverApi.get("/profile/");
        set({ user: response.data, isAuthenticated: true, isLoading: false });
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      // 401 error or no connection
      console.warn("Failed to restore token context:", e);
      set({ isAuthenticated: false, isLoading: false });
    }
  },
}));

// Auto-hook the unauthorized callback from axios to our auth store
setOnUnauthorizedCallback(() => {
  useDriverAuth.getState().logout();
});
