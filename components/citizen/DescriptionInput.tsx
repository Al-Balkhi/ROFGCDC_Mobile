/**
 * components/citizen/DescriptionInput.tsx
 *
 * A multi-line text area card for gathering optional notes from the citizen.
 * Uses `textAlignVertical: "top"` so text starts at the top-right corner
 * as expected in RTL multi-line inputs.
 */

import React from "react";
import { Text, TextInput, View } from "react-native";
import { STRINGS } from "../../constants/strings";

interface DescriptionInputProps {
  /** Current text value. */
  value: string;
  /** Callback when the text changes. */
  onChange: (text: string) => void;
}

/**
 * DescriptionInput — multi-line text area card.
 */
export function DescriptionInput({ value, onChange }: DescriptionInputProps) {
  return (
    <View className="bg-white rounded-2xl p-5 shadow-sm mb-6 border border-gray-100">
      <Text className="text-xl font-bold text-primary text-right mb-3">
        {STRINGS.SECTION_DESCRIPTION}
      </Text>
      <TextInput
        className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-right h-24"
        placeholder={STRINGS.LABEL_DESCRIPTION_HINT}
        multiline
        textAlign="right"
        value={value}
        onChangeText={onChange}
        /**
         * Required on Android to prevent multiline text fields from vertical
         * centre-alignment by default.
         */
        style={{ textAlignVertical: "top" }}
        accessibilityLabel={STRINGS.SECTION_DESCRIPTION}
      />
    </View>
  );
}
