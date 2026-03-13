/**
 * components/citizen/PhotoPicker.tsx
 *
 * Renders the "attach a photo" card in the citizen report form.
 *
 * Features:
 *   - Displays captured photo thumbnails with a remove button on each.
 *   - Shows an "add" button while fewer than MAX_PHOTOS have been selected.
 *   - Requests camera permission before launching the picker.
 *   - Calls onFirstPhoto() after the very first image is captured so the
 *     parent can trigger a location fetch early.
 */

import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { MAX_PHOTOS } from "../../constants/api";
import { STRINGS } from "../../constants/strings";

interface PhotoPickerProps {
  /** URIs of already-captured photos. */
  images: string[];
  /** Called with the new URI when a photo is taken. */
  onAdd: (uri: string) => void;
  /** Called with the index to remove. */
  onRemove: (index: number) => void;
  /**
   * Optional callback fired after the very first photo is added.
   * Used to kick off a background location fetch while the user is still
   * looking at the camera result.
   */
  onFirstPhoto?: () => void;
}

/**
 * PhotoPicker — camera launch + photo thumbnail grid.
 *
 * Displays up to MAX_PHOTOS thumbnails.
 * Each thumbnail has a red × button for removal.
 * An "add" (+) button is shown while the limit has not been reached.
 */
export function PhotoPicker({
  images,
  onAdd,
  onRemove,
  onFirstPhoto,
}: PhotoPickerProps) {
  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(STRINGS.TITLE_WARNING, STRINGS.ALERT_CAMERA_DENIED);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      const isFirst = images.length === 0;
      onAdd(uri);
      if (isFirst) onFirstPhoto?.();
    }
  };

  return (
    <View className="bg-white rounded-2xl p-5 shadow-sm mb-5 border border-gray-100">
      {/* Section header */}
      <Text className="text-xl font-bold text-primary text-right mb-2">
        {STRINGS.SECTION_PHOTO}
      </Text>
      <Text className="text-gray-500 text-sm text-right mb-4">
        {STRINGS.LABEL_PHOTO_HINT}
      </Text>

      {/* Thumbnail grid */}
      <View className="flex-row flex-wrap justify-end gap-2">
        {images.map((uri, i) => (
          <View
            key={`photo-thumb-${i}`}
            className="relative"
            accessibilityLabel={`صورة ${i + 1}`}
          >
            <Image source={{ uri }} className="w-24 h-24 rounded-lg" />
            <TouchableOpacity
              className="absolute top-1 right-1 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
              onPress={() => onRemove(i)}
              accessibilityLabel={STRINGS.LABEL_REMOVE_PHOTO}
              accessibilityRole="button"
            >
              {/* Using ✕ (U+2715) instead of "X" for a cleaner cross icon */}
              <Text className="text-white font-bold text-xs">✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Add button — hidden at MAX_PHOTOS */}
        {images.length < MAX_PHOTOS && (
          <TouchableOpacity
            onPress={handleTakePhoto}
            className="w-24 h-24 bg-primary/5 rounded-2xl justify-center items-center border border-dashed border-primary/30 active:opacity-70"
            accessibilityLabel={STRINGS.LABEL_ADD_PHOTO}
            accessibilityRole="button"
          >
            <Text className="text-4xl text-primary">+</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
