/**
 * components/driver/StopEventModal.tsx
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Modal for logging a stop event during task execution.
 * Shows a reason picker and optional note + duration input.
 */

import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import driverApi from "../../services/driverApi";

interface Props {
  taskId: number | string;
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const STOP_REASONS = [
  { value: "traffic", label: "ازدحام مروري" },
  { value: "refueling", label: "تعبئة وقود" },
  { value: "emptying_bin", label: "تفريغ حاوية" },
  { value: "unloading", label: "تفريغ الشاحنة في المدفن" },
  { value: "other", label: "أخرى" },
];

export default function StopEventModal({
  taskId,
  visible,
  onClose,
  onSuccess,
}: Props) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setReason("");
    setNote("");
    setDurationMinutes("");
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!reason) {
      setError("يرجى اختيار سبب التوقف.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const durationSecs = durationMinutes
        ? Math.round(parseFloat(durationMinutes) * 60)
        : 0;
      await driverApi.post(`/driver/tasks/${taskId}/stops/`, {
        reason,
        note: note.trim(),
        duration_seconds: durationSecs,
      });
      reset();
      onSuccess?.();
      onClose();
    } catch {
      setError("فشل تسجيل التوقف. حاول مجدداً.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end"
      >
        <View className="bg-black/40 absolute inset-0" />
        <View
          className="bg-white rounded-t-3xl px-5 pt-5 pb-8"
          style={{ minHeight: 480 }}
        >
          {/* Handle */}
          <View className="w-10 h-1 bg-gray-300 rounded-full self-center mb-4" />

          {/* Title */}
          <View className="flex-row justify-between items-center mb-5">
            <TouchableOpacity onPress={handleClose}>
              <MaterialIcons name="close" size={22} color="#6b7280" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-800">تسجيل توقف</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Reason Picker */}
            <Text className="text-sm font-semibold text-gray-700 text-right mb-2">
              سبب التوقف *
            </Text>
            <View className="flex-row flex-wrap justify-end gap-2 mb-5">
              {STOP_REASONS.map((r) => (
                <TouchableOpacity
                  key={r.value}
                  onPress={() => setReason(r.value)}
                  className={`px-3 py-2 rounded-lg border mb-2 ${
                    reason === r.value
                      ? "bg-green-600 border-green-600"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Text
                    className={`text-sm font-bold ${
                      reason === r.value ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Duration */}
            <Text className="text-sm font-semibold text-gray-700 text-right mb-2">
              المدة (بالدقائق) — اختياري
            </Text>
            <TextInput
              value={durationMinutes}
              onChangeText={setDurationMinutes}
              placeholder="مثال: 10"
              keyboardType="numeric"
              textAlign="right"
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 mb-5"
            />

            {/* Note */}
            <Text className="text-sm font-semibold text-gray-700 text-right mb-2">
              ملاحظات — اختياري
            </Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="أضف أي تفاصيل إضافية..."
              multiline
              numberOfLines={3}
              textAlign="right"
              textAlignVertical="top"
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 mb-5"
            />

            {error && (
              <Text className="text-red-500 text-sm text-right mb-3">
                {error}
              </Text>
            )}

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={submitting}
              className="bg-green-600 py-4 rounded-xl items-center"
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">
                  تأكيد التوقف
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
