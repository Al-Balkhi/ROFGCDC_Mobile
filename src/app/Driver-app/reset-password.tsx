import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import driverApi from "../../../services/driverApi";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [email, setEmail] = useState((params.email as string) || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("خطأ", "يرجى إدخال بريد إلكتروني صحيح");
      return;
    }
    if (!otp || otp.length !== 5) {
      Alert.alert("خطأ", "يجب إدخال رمز التحقق (5 أرقام)");
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      Alert.alert("خطأ", "كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("خطأ", "كلمات المرور غير متطابقة");
      return;
    }

    setLoading(true);
    try {
      await driverApi.post("/auth/password/reset/confirm/", {
        email,
        otp,
        new_password: newPassword,
      });
      Alert.alert(
        "نجاح",
        "تمت إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.",
      );
      router.replace("/login" as any);
    } catch (error: any) {
      console.warn(
        "Reset Password error:",
        error?.response?.data || error.message,
      );
      const msg =
        error?.response?.data?.detail ||
        "فشل إعادة تعيين كلمة المرور، يرجى التأكد من الرمز المدخل";
      Alert.alert("خطأ", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white items-center justify-center p-4"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          width: "100%",
          minWidth: "80%",
        }}
        showsVerticalScrollIndicator={false}
        className="w-full"
      >
        <View className="items-center mb-8">
          <Text className="text-2xl font-bold text-gray-800">
            إعادة تعيين كلمة المرور
          </Text>
          <Text className="mt-2 text-gray-500 text-center px-4">
            أدخل رمز التحقق الذي وصلك وكلمة المرور الجديدة
          </Text>
        </View>

        <View className="space-y-4">
          <TextInput
            placeholder="البريد الإلكتروني"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            className="w-full h-12 border border-gray-300 rounded-lg px-4 text-right bg-gray-50 mb-4"
          />

          <TextInput
            placeholder="رمز التحقق (5 أرقام)"
            keyboardType="number-pad"
            maxLength={5}
            value={otp}
            onChangeText={setOtp}
            editable={!loading}
            className="w-full h-12 border border-gray-300 rounded-lg px-4 text-center tracking-widest text-lg bg-gray-50 mb-4"
          />

          <View className="relative w-full h-12 justify-center mb-4">
            <TextInput
              placeholder="كلمة المرور الجديدة"
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              editable={!loading}
              className="w-full h-full border border-gray-300 rounded-lg pl-12 pr-4 text-right bg-gray-50"
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
              className="absolute left-4 h-full justify-center"
            >
              <Ionicons
                name={showNewPassword ? "eye-off" : "eye"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <View className="relative w-full h-12 justify-center mb-6">
            <TextInput
              placeholder="تأكيد كلمة المرور"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
              className="w-full h-full border border-gray-300 rounded-lg pl-12 pr-4 text-right bg-gray-50"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute left-4 h-full justify-center"
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`w-full h-12 rounded-lg items-center justify-center mb-4 ${
              loading ? "bg-blue-400" : "bg-blue-600"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">
                إعادة تعيين كلمة المرور
              </Text>
            )}
          </TouchableOpacity>

          <View className="items-center mt-2">
            <TouchableOpacity onPress={() => router.replace("/login" as any)}>
              <Text className="text-sm font-bold text-gray-500 underline">
                العودة لتسجيل الدخول
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
