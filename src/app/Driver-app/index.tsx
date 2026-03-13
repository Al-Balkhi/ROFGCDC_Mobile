import React from "react";
import { Text, View } from "react-native";

export default function DriverHomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <Text className="text-xl font-bold text-gray-800">
        شاشة السائق الرئيسية
      </Text>
      <Text className="mt-2 text-gray-500">
        ابدأ من هنا لبناء تجربة السائق.
      </Text>
    </View>
  );
}

