/**
 * utils/media.ts
 *
 * Utilities for working with image URIs in React Native / Expo.
 *
 * Why this exists:
 *   - MIME-type detection needs to handle query-string URIs (e.g. CDN cache-busting).
 *   - The iOS `file://` stripping is a cross-cutting concern that should live in one place.
 *   - `as any` casts on FormData are isolated here with a clear explanation, rather than
 *     being hidden mid-submission logic.
 */

import { Platform } from "react-native";

/**
 * Derive the MIME type of an image from its URI.
 *
 * Handles:
 *   - simple extensions:        "photo.jpg"  → "image/jpg"
 *   - uppercase extensions:     "IMG.PNG"    → "image/png"
 *   - query-string URIs:        "img.webp?v=2" → "image/webp"
 *   - missing/unknown extension: "noext"     → "image/jpeg" (safe fallback)
 */
export function getImageMimeType(uri: string): string {
  const ext = /\.(\w+)(?:\?|#|$)/.exec(uri)?.[1]?.toLowerCase();
  return ext ? `image/${ext}` : "image/jpeg";
}

/**
 * Build the photo payload object required by React Native's multipart FormData polyfill.
 *
 * Note: The returned object is typed as `{ uri, name, type }` rather than a `File`
 * because React Native's FormData does not use the browser's File API.
 * Callers must still cast to `any` when calling `formData.append()` due to type
 * mismatches in the `@types/react-native` / `lib.dom.d.ts` definitions.
 */
export function buildPhotoPayload(
  uri: string,
  index: number
): { uri: string; name: string; type: string } {
  const name = uri.split("/").pop() ?? `photo_${index}.jpg`;
  return {
    // iOS prepends "file://" to local asset URIs; the fetch API on iOS
    // requires it to be stripped before the request is sent.
    uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
    name,
    type: getImageMimeType(uri),
  };
}
