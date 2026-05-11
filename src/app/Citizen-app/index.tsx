import * as Location from "expo-location";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";

import { DescriptionInput } from "../../../components/citizen/DescriptionInput";
import { IssueTypePicker } from "../../../components/citizen/IssueTypePicker";
import { LocationCard } from "../../../components/citizen/LocationCard";
import { PhotoPicker } from "../../../components/citizen/PhotoPicker";
import { STRINGS } from "../../../constants/strings";
import { useDeviceId } from "../../../hooks/useDeviceId";
import { useLocation } from "../../../hooks/useLocation";
import { useReportForm } from "../../../hooks/useReportForm";

/**
 * CitizenReportScreen — central orchestrator for the citizen report flow.
 *
 * All business logic (network, GPS, device ID) is delegated to hooks.
 * All UI logic is delegated to feature-specific sub-components.
 */
export default function CitizenReportScreen() {
  const deviceId = useDeviceId();
  const {
    location,
    locationName,
    loading: locating,
    getLocation,
  } = useLocation();
  const form = useReportForm();

  // Request location permission eagerly so the GPS prompt appears upfront.
  // The side-effect is kept outside of the hook so the hook itself remains pure.
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(STRINGS.TITLE_WARNING, STRINGS.ALERT_LOCATION_DENIED);
      }
    })();
  }, []);

  const handleSubmit = () => {
    if (form.images.length === 0) {
      Alert.alert(STRINGS.TITLE_WARNING, STRINGS.ALERT_NO_IMAGE);
      return;
    }
    if (!location) {
      Alert.alert(STRINGS.TITLE_WARNING, STRINGS.ALERT_NO_LOCATION);
      return;
    }
    form.submitReport(location, deviceId);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-5">
      <PhotoPicker
        images={form.images}
        onAdd={form.addImage}
        onRemove={form.removeImage}
        onFirstPhoto={getLocation}
      />

      <LocationCard
        location={location}
        locationName={locationName}
        loading={locating}
        onGetLocation={getLocation}
      />

      <IssueTypePicker selected={form.issueType} onSelect={form.setIssueType} />

      <DescriptionInput
        value={form.description}
        onChange={form.setDescription}
      />

      <TouchableOpacity
        className={`rounded-2xl py-4 items-center justify-center mb-10 shadow-lg mt-2 active:scale-95 ${
          form.submitting ? "bg-success/70" : "bg-success"
        }`}
        onPress={handleSubmit}
        disabled={form.submitting}
        accessibilityLabel={STRINGS.LABEL_SUBMIT}
        accessibilityRole="button"
      >
        {form.submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-lg">
            {STRINGS.LABEL_SUBMIT}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
