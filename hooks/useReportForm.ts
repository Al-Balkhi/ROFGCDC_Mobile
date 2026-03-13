/**
 * hooks/useReportForm.ts
 *
 * Manages all citizen-report form state and handles the API submission.
 *
 * Responsibilities:
 *   - Image list (add / remove)
 *   - Description text
 *   - Issue type selection
 *   - Submitting flag
 *   - FormData construction and POST to /reports/submit/
 *   - Form reset on success
 *
 * Does NOT handle location or device-ID — those are separate concerns
 * provided by useLocation and useDeviceId respectively, and passed in at
 * call time so this hook remains independently testable.
 */

import * as Location from "expo-location";
import { useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api";
import { STRINGS } from "../constants/strings";
import { buildPhotoPayload } from "../utils/media";

/** All valid issue type values accepted by the backend. */
export type IssueType = "container_full" | "no_container";

export type ReportFormState = {
  images: string[];
  description: string;
  issueType: IssueType;
  submitting: boolean;
  addImage: (uri: string) => void;
  removeImage: (index: number) => void;
  setDescription: (text: string) => void;
  setIssueType: (type: IssueType) => void;
  /**
   * Submit the completed form to the backend.
   * @param location  Resolved GPS position from useLocation.
   * @param deviceId  Stable device identifier from useDeviceId.
   */
  submitReport: (
    location: Location.LocationObject,
    deviceId: string
  ) => Promise<void>;
  /** Reset image list and description (called internally on success). */
  resetForm: () => void;
};

/**
 * Hook: citizen report form state and submission logic.
 *
 * Usage:
 * ```tsx
 * const form = useReportForm();
 * form.submitReport(location, deviceId);
 * ```
 */
export function useReportForm(): ReportFormState {
  const [images, setImages]         = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [issueType, setIssueType]   = useState<IssueType>("container_full");
  const [submitting, setSubmitting] = useState(false);

  const addImage = (uri: string) =>
    setImages((prev) => [...prev, uri]);

  /**
   * Remove image at a given index without mutating the existing array.
   * Uses Array.filter for clarity over splice-on-a-copy.
   */
  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const resetForm = () => {
    setImages([]);
    setDescription("");
    // issueType intentionally preserved — users typically reuse the same type.
  };

  const submitReport = async (
    location: Location.LocationObject,
    deviceId: string
  ) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("latitude",    String(location.coords.latitude));
      formData.append("longitude",   String(location.coords.longitude));
      formData.append("description", description);
      formData.append("issue_type",  issueType);
      formData.append("device_id",   deviceId);

      images.forEach((uri, index) => {
        /**
         * `as any` is required here because React Native's FormData is a
         * polyfill that accepts `{ uri, name, type }` objects, but TypeScript's
         * DOM lib expects a `Blob | string`. This is a known RN vs DOM type gap.
         * The actual payload object is correctly typed by buildPhotoPayload().
         */
        formData.append("photos", buildPhotoPayload(uri, index) as any);
      });

      const response = await fetch(`${API_URL}/reports/submit/`, {
        method: "POST",
        body:   formData,
        headers: { Accept: "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(STRINGS.TITLE_SUCCESS, STRINGS.ALERT_SUBMIT_SUCCESS);
        resetForm();
      } else {
        Alert.alert(
          STRINGS.TITLE_ERROR,
          data.detail ?? data.error ?? STRINGS.ALERT_SUBMIT_ERROR
        );
      }
    } catch {
      Alert.alert(STRINGS.TITLE_NET_ERR, STRINGS.ALERT_NETWORK_ERROR);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    images,
    description,
    issueType,
    submitting,
    addImage,
    removeImage,
    setDescription,
    setIssueType,
    submitReport,
    resetForm,
  };
}
