/**
 * constants/api.ts
 *
 * Global API configuration and app-wide tuning constants.
 * All values are resolved from Expo public environment variables where possible.
 *
 * EXPO_PUBLIC_API_URL must be set in your .env / eas.json for production.
 * The localhost fallback is intentionally safe — it will not reach a real server,
 * making misconfiguration obvious rather than silently sending data to a dev machine.
 */

/** Base URL for the backend REST API. */
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000/api";

/** Maximum number of photos allowed per citizen report. */
export const MAX_PHOTOS = 3;

/** How long the onboarding splash screen is shown before auto-navigating (ms). */
export const SPLASH_DELAY_MS = 1000;

/**
 * Primary brand colour — mirrors the `primary` Tailwind token in tailwind.config.js.
 * Use this wherever inline styles (not className) are required (e.g. headerStyle).
 */
export const PRIMARY_COLOR = "#1A6B96";
