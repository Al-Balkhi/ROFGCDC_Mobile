import React from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { User } from "../types";

interface ProfileTabProps {
  user: User | null;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  username: string;
  phone: string;
  loading: boolean;
  setUsername: (value: string) => void;
  setPhone: (value: string) => void;
  handleSaveProfile: () => void;
  handleCancelEdit: () => void;
}

export function ProfileTab({
  user,
  isEditing,
  setIsEditing,
  username,
  phone,
  loading,
  setUsername,
  setPhone,
  handleSaveProfile,
  handleCancelEdit,
}: ProfileTabProps) {
  if (isEditing) {
    return (
      <View>
        <View className="mb-4">
          <Text className="text-gray-700 font-bold mb-1 text-right">الاسم</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            className="w-full h-12 border border-blue-300 rounded-lg px-4 text-right bg-blue-50"
            editable={!loading}
          />
        </View>

        <View className="mb-6">
          <Text className="text-gray-700 font-bold mb-1 text-right">
            رقم الهاتف
          </Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            className="w-full h-12 border border-blue-300 rounded-lg px-4 text-right bg-blue-50"
            editable={!loading}
          />
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={handleCancelEdit}
            disabled={loading}
            className="flex-1 bg-gray-200 rounded-lg items-center justify-center h-12"
          >
            <Text className="text-gray-800 font-bold">إلغاء</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSaveProfile}
            disabled={loading}
            className={`flex-1 rounded-lg items-center justify-center h-12 ${
              loading ? "bg-green-500/70" : "bg-green-500"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold">حفظ</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View>
      {/* Read-only email */}
      <View className="mb-3">
        <Text className="text-gray-500 text-xs text-right mb-1">
          البريد الإلكتروني
        </Text>
        <View className="bg-gray-100 border border-gray-200 rounded-lg px-4 h-12 justify-center">
          <Text className="text-gray-500 text-right">{user?.email}</Text>
        </View>
        <Text className="text-gray-400 text-xs mt-1 text-right">
          لا يمكن تغيير البريد الإلكتروني
        </Text>
      </View>

      <View className="bg-gray-50 p-4 rounded-lg flex-row justify-between border border-gray-100 mb-2">
        <Text className="font-bold text-gray-800">الاسم</Text>
        <Text className="text-gray-600">{user?.username}</Text>
      </View>

      <View className="bg-gray-50 p-4 rounded-lg flex-row justify-between border border-gray-100 mb-2">
        <Text className="font-bold text-gray-800">رقم الهاتف</Text>
        <Text className="text-gray-600" style={{ textAlign: "left" }}>
          {user?.phone || "غير محدد"}
        </Text>
      </View>

      <View className="bg-gray-50 p-4 rounded-lg flex-row justify-between border border-gray-100 mb-2">
        <Text className="font-bold text-gray-800">البلدية</Text>
        <Text className="text-gray-600">
          {user?.municipality_name || "غير محدد"}
        </Text>
      </View>

      <View className="bg-gray-50 p-4 rounded-lg flex-row justify-between border border-gray-100 mb-6">
        <Text className="font-bold text-gray-800">الدور</Text>
        <Text className="text-gray-600">
          {user?.role === "driver" ? "سائق شاحنة" : user?.role}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => setIsEditing(true)}
        className="w-full bg-blue-600 h-12 rounded-lg items-center justify-center"
      >
        <Text className="text-white font-bold text-base">تعديل الملف الشخصي</Text>
      </TouchableOpacity>
    </View>
  );
}
