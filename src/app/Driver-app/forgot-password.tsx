import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import driverApi from '../../../services/driverApi';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    setLoading(true);
    try {
      await driverApi.post('/auth/password/reset/request/', { email });
      Alert.alert('نجاح', 'تم إرسال رمز التحقق إلى بريدك الإلكتروني');
      router.replace({ pathname: '/reset-password' as any, params: { email } });
    } catch (error: any) {
      console.warn('Forgot Password error:', error?.response?.data || error.message);
      const msg = error?.response?.data?.detail || 'فشل إرسال رمز التحقق';
      Alert.alert('خطأ', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-white items-center justify-center p-4"
    >
      <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center', width: '100%', minWidth: '80%'}} showsVerticalScrollIndicator={false} className="w-full">
        <View className="items-center mb-8">
          <Text className="text-2xl font-bold text-gray-800">نسيت كلمة المرور؟</Text>
          <Text className="mt-2 text-gray-500 text-center px-4">أدخل بريدك الإلكتروني وسنرسل لك رمزاً لإعادة تعيين كلمة المرور.</Text>
        </View>

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
            onPress={handleSubmit}
            disabled={loading}
            className={`w-full h-12 rounded-lg items-center justify-center mb-4 ${
              loading ? 'bg-blue-400' : 'bg-blue-600'
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">إرسال رمز التحقق</Text>
            )}
          </TouchableOpacity>

          <View className="items-center mt-2">
            <TouchableOpacity onPress={() => router.replace('/login' as any)}>
              <Text className="text-sm font-bold text-gray-500 underline">العودة لتسجيل الدخول</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
