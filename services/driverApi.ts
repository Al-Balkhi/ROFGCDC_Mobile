import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "../constants/api";

const driverApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Mobile-Auth": "true", // Used internally by our backend to return access/refresh in body
  },
});

// Configure interceptor to append the Bearer token dynamically
driverApi.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("driver_access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("Failed to retrieve token for driver API:", error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Optional: Configure an interceptor for 401s to logout
let onUnauthorized = () => {};
export const setOnUnauthorizedCallback = (callback: () => void) => {
  onUnauthorized = callback;
};

driverApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Prevent infinite loops if the logout call itself fails with 401
      if (error.config && error.config.url !== "/auth/logout/") {
        onUnauthorized();
      }
    }
    return Promise.reject(error);
  },
);

export default driverApi;
