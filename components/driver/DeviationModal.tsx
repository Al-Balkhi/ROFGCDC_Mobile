/**
 * components/driver/DeviationModal.tsx
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Modal for logging a route deviation during task execution.
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

const DEVIATION_REASONS = [
  { value: "refueling", label: "تعبئة وقود" },
  { value: "traffic_change", label: "تغيير طريق بسبب المرور" },
  { value: "truck_full", label: "تفريغ مبكر – الشاحنة ممتلئة" },
  { value: "other", label: "أخرى" },
];

export default function DeviationModal({
  taskId,
  visible,
  onClose,
  onSuccess,
}: Props) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setReason("");
    setNote("");
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!reason) {
      setError("يرجى اختيار سبب الانحراف.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await driverApi.post(`/driver/tasks/${taskId}/deviations/`, {
        reason,
        note: note.trim(),
      });
      reset();
      onSuccess?.();
      onClose();
    } catch {
      setError("فشل تسجيل الانحراف. حاول مجدداً.");
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
          style={{ minHeight: 400 }}
        >
          {/* Handle */}
          <View className="w-10 h-1 bg-gray-300 rounded-full self-center mb-4" />

          {/* Title */}
          <View className="flex-row justify-between items-center mb-5">
            <TouchableOpacity onPress={handleClose}>
              <MaterialIcons name="close" size={22} color="#6b7280" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-800">
              إبلاغ انحراف مسار
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Reason Picker */}
            <Text className="text-sm font-semibold text-gray-700 text-right mb-2">
              سبب الانحراف *
            </Text>
            <View className="flex-row flex-wrap justify-end gap-2 mb-5">
              {DEVIATION_REASONS.map((r) => (
                <TouchableOpacity
                  key={r.value}
                  onPress={() => setReason(r.value)}
                  className={`px-3 py-2 rounded-lg border mb-2 ${
                    reason === r.value
                      ? "bg-amber-500 border-amber-500"
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

            {/* Note */}
            <Text className="text-sm font-semibold text-gray-700 text-right mb-2">
              ملاحظات — اختياري
            </Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="صف سبب الانحراف بمزيد من التفصيل..."
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
              className="bg-amber-500 py-4 rounded-xl items-center"
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">
                  تأكيد الانحراف
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
