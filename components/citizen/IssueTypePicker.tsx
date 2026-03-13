/**
 * components/citizen/IssueTypePicker.tsx
 *
 * Renders a horizontal group of pill-buttons (SegmentedControl style) for
 * selecting the type of waste issue being reported.
 *
 * The list of options is driven by an array rather than hardcoded JSX,
 * making it trivial to add more types in the future.
 */

import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { IssueType } from "../../hooks/useReportForm";
import { STRINGS } from "../../constants/strings";

const ISSUE_OPTIONS: { value: IssueType; label: string }[] = [
  { value: "container_full", label: STRINGS.LABEL_ISSUE_FULL },
  { value: "no_container",   label: STRINGS.LABEL_ISSUE_NONE },
];

interface IssueTypePickerProps {
  /** The currently selected issue type. */
  selected: IssueType;
  /** Callback fired when a new type is tapped. */
  onSelect: (type: IssueType) => void;
}

/**
 * IssueTypePicker — Radio pills for issue type.
 *
 * Highlights the selected pill with the primary colour and a soft background.
 */
export function IssueTypePicker({ selected, onSelect }: IssueTypePickerProps) {
  return (
    <View className="bg-white rounded-2xl p-5 shadow-sm mb-5 border border-gray-100">
      <Text className="text-xl font-bold text-primary text-right mb-3">
        {STRINGS.SECTION_ISSUE_TYPE}
      </Text>

      <View className="flex-row justify-end gap-2">
        {ISSUE_OPTIONS.map(({ value, label }) => {
          const isActive = selected === value;
          return (
            <TouchableOpacity
              key={value}
              onPress={() => onSelect(value)}
              className={`px-4 py-2 rounded-xl border ${
                isActive
                  ? "bg-primary/10 border-primary"
                  : "bg-white border-gray-200"
              }`}
              accessibilityRole="radio"
              accessibilityState={{ selected: isActive }}
            >
              <Text
                className={`text-sm font-bold ${
                  isActive ? "text-primary" : "text-gray-700"
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
