import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useDriverAuth } from "../../../hooks/useDriverAuth";
import driverApi from "../../../services/driverApi";
export default function LoginScreen() {
  const { login } = useDriverAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("خطأ", "يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);
    try {
      const resp = await driverApi.post("/auth/login/", { email, password });
      // Because we passed X-Mobile-Auth: true, our backend returns tokens in body
      const { access, refresh, user } = resp.data;
      if (!access || !user) {
        throw new Error("بيانات الدخول غير صحيحة");
      }

      if (user.role !== "driver") {
        throw new Error("عذراً، هذا التطبيق مخصص للسائقين فقط");
      }

      await login(access, refresh, user);
    } catch (error: any) {
      console.warn("Login Error:", error?.response?.data || error.message);
      let errMsg = "بيانات الدخول غير صحيحة.";
      if (error?.response?.data?.code === "initial_setup_required") {
        errMsg = "مطلوب إعداد كلمة المرور لأول مرة.";
        Alert.alert("يتطلب الإعداد", errMsg, [
          {
            text: "تفعيل الحساب",
            onPress: () =>
              router.push({ pathname: "/activate" as any, params: { email } }),
          },
          { text: "إلغاء", style: "cancel" },
        ]);
        return;
      } else if (error?.response?.data?.code === "inactive_account") {
        errMsg = "تم تعطيل الحساب الخاص بك.";
      }
      Alert.alert("خطأ في تسجيل الدخول", errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white items-center justify-center"
    >
      <View className="w-4/5">
        <View className="mb-8 items-center">
          <Text className="text-3xl font-bold text-primary">تطبيق السائق</Text>
          <Text className="text-gray-500 mt-2">قم بتسجيل الدخول للبدء</Text>
        </View>
        <View className="space-y-4">
          <TextInput
            placeholder="البريد الإلكتروني"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            className="w-full h-12 border border-gray-300 rounded-lg px-4 text-right bg-gray-50"
          />

          <View className="relative w-full h-12 justify-center">
            <TextInput
              placeholder="كلمة المرور"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
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

          <View className="items-end mt-1">
            <TouchableOpacity
              onPress={() => router.push("/forgot-password" as any)}
            >
              <Text className="text-sm text-blue-600 font-bold">
                نسيت كلمة المرور؟
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{ marginTop: 8 }}
            className={`w-full h-14 rounded-xl items-center justify-center shadow-sm ${
              loading ? "bg-primary/70" : "bg-primary"
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">دخول</Text>
            )}
          </TouchableOpacity>

          <View className="items-center mt-4">
            <TouchableOpacity onPress={() => router.push("/activate" as any)}>
              <Text className="text-sm font-bold text-gray-500 underline">
                تسجيل الدخول لأول مرة؟
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
