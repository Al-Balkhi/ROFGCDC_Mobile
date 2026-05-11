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
import { useDriverAuth } from "../../../hooks/useDriverAuth";
import driverApi from "../../../services/driverApi";

export default function ActivateScreen() {
  const router = useRouter();
  const { login } = useDriverAuth();
  const params = useLocalSearchParams();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState((params.email as string) || "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("خطأ", "يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    setLoading(true);
    try {
      await driverApi.post("/auth/initial-setup/request-otp/", { email });
      Alert.alert("نجاح", "تم إرسال رمز التحقق إلى بريدك الإلكتروني");
      setStep(2);
    } catch (error: any) {
      console.warn(
        "Request OTP error:",
        error?.response?.data || error.message,
      );
      const msg = error?.response?.data?.detail || "فشل إرسال رمز التحقق";
      Alert.alert("خطأ", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!otp || otp.length !== 5) {
      Alert.alert("خطأ", "يجب إدخال رمز التحقق (5 أرقام)");
      return;
    }
    if (!password || password.length < 8) {
      Alert.alert("خطأ", "كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("خطأ", "كلمات المرور غير متطابقة");
      return;
    }

    setLoading(true);
    try {
      await driverApi.post("/auth/initial-setup/confirm/", {
        email,
        otp,
        password,
        confirm_password: confirmPassword,
      });

      Alert.alert("نجاح", "تم تفعيل الحساب بنجاح، جاري تسجيل الدخول...");

      // Attempt login
      const resp = await driverApi.post("/auth/login/", { email, password });
      const { access, refresh, user } = resp.data;
      if (access && user) {
        if (user.role !== "driver") {
          Alert.alert("خطأ", "عذراً، هذا التطبيق مخصص للسائقين فقط");
          router.replace("/login" as any);
        } else {
          await login(access, refresh, user);
        }
      }
    } catch (error: any) {
      console.warn(
        "Confirm setup error:",
        error?.response?.data || error.message,
      );
      const msg =
        error?.response?.data?.detail || "فشل تفعيل الحساب أو بيانات غير صحيحة";
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
          <Text className="text-2xl font-bold text-gray-800">تفعيل الحساب</Text>
        </View>

        {step === 1 ? (
          <View className="space-y-4">
            <TextInput
              placeholder="البريد الإلكتروني"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              className="w-full h-12 border border-gray-300 rounded-lg px-4 text-right bg-gray-50 mb-6"
            />

            <TouchableOpacity
              onPress={handleRequestOTP}
              disabled={loading}
              className={`w-full h-12 rounded-lg items-center justify-center mb-4 ${
                loading ? "bg-blue-400" : "bg-blue-600"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  إرسال رمز التحقق
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
        ) : (
          <View className="space-y-4">
            <Text className="text-sm text-gray-600 mb-4 text-center">
              تم إرسال رمز التحقق إلى:{"\n"}
              <Text className="font-bold">{email}</Text>
            </Text>

            <TextInput
              placeholder="رمز التحقق (5 أرقام)"
              keyboardType="number-pad"
              maxLength={5}
              value={otp}
              onChangeText={setOtp}
              editable={!loading}
              className="w-full h-12 border border-gray-300 rounded-lg px-4 text-center tracking-widest text-lg bg-gray-50 mb-2"
            />

            <TouchableOpacity onPress={handleRequestOTP} className="mb-4">
              <Text className="text-xs text-blue-600 text-center">
                لم يصلك الرمز؟ اطلب رمزاً جديداً
              </Text>
            </TouchableOpacity>

            <View className="relative w-full h-12 justify-center mb-4">
              <TextInput
                placeholder="كلمة المرور الجديدة"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
                className="w-full h-full border border-gray-300 rounded-lg pl-12 pr-4 text-right bg-gray-50"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute left-4 h-full justify-center"
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
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

            <View className="flex-row justify-between mb-4 mt-2">
              <TouchableOpacity
                onPress={() => setStep(1)}
                className="h-12 flex-1 rounded-lg items-center justify-center bg-gray-300 mr-2"
              >
                <Text className="text-gray-700 font-bold">رجوع</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirm}
                disabled={loading}
                className={`h-12 flex-1 rounded-lg items-center justify-center bg-blue-600 ml-2 ${loading ? "bg-blue-400" : ""}`}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold">تفعيل الحساب</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
