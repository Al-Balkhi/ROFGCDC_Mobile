import React from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { PasswordForm, PasswordErrors } from "../types";

interface PasswordFieldProps {
  label: string;
  field: keyof PasswordForm;
  value: string;
  error?: string;
  onChangeText: (field: keyof PasswordForm, value: string) => void;
  editable: boolean;
}

function PasswordField({
  label,
  field,
  value,
  error,
  onChangeText,
  editable,
}: PasswordFieldProps) {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-bold mb-1 text-right">{label}</Text>
      <TextInput
        value={value}
        onChangeText={(v) => onChangeText(field, v)}
        secureTextEntry
        editable={editable}
        className={`w-full h-12 border rounded-lg px-4 text-right ${
          error ? "border-red-400 bg-red-50" : "border-blue-300 bg-blue-50"
        }`}
        textContentType="password"
      />
      {error ? (
        <Text className="text-red-500 text-xs mt-1 text-right">{error}</Text>
      ) : null}
    </View>
  );
}

interface PasswordTabProps {
  passwordForm: PasswordForm;
  passwordErrors: PasswordErrors;
  loading: boolean;
  onChangePassword: () => void;
  updatePasswordField: (field: keyof PasswordForm, value: string) => void;
}

export function PasswordTab({
  passwordForm,
  passwordErrors,
  loading,
  onChangePassword,
  updatePasswordField,
}: PasswordTabProps) {
  return (
    <View>
      <PasswordField
        label="كلمة المرور الحالية"
        field="old_password"
        value={passwordForm.old_password}
        error={passwordErrors.old_password}
        onChangeText={updatePasswordField}
        editable={!loading}
      />
      <PasswordField
        label="كلمة المرور الجديدة"
        field="new_password"
        value={passwordForm.new_password}
        error={passwordErrors.new_password}
        onChangeText={updatePasswordField}
        editable={!loading}
      />
      <PasswordField
        label="تأكيد كلمة المرور الجديدة"
        field="confirm_new_password"
        value={passwordForm.confirm_new_password}
        error={passwordErrors.confirm_new_password}
        onChangeText={updatePasswordField}
        editable={!loading}
      />

      <TouchableOpacity
        onPress={onChangePassword}
        disabled={loading}
        className={`w-full h-12 rounded-lg items-center justify-center mt-2 ${
          loading ? "bg-blue-500/70" : "bg-blue-500"
        }`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-base">تغيير كلمة المرور</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
