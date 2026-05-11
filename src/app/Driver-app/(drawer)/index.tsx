import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useDriverAuth } from "../../../../hooks/useDriverAuth";
import { useDriverTasks } from "../../../../hooks/useDriverTasks";

export default function DriverHomeScreen() {
  const { user } = useDriverAuth();
  const router = useRouter();
  const { getLatestTask, task, loading } = useDriverTasks();

  useFocusEffect(
    useCallback(() => {
      getLatestTask();
    }, [getLatestTask]),
  );

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 py-8">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-800 text-right">
          أهلاً بك، {user?.username} 👋
        </Text>
        <Text className="text-base text-gray-500 text-right mt-1">
          تتبع مهامك وأدر مساراتك من هنا.
        </Text>
      </View>

      <View className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
        <Text className="text-lg font-bold text-primary text-right mb-4">
          المهمة الحالية
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#1A6B96"
            style={{ marginVertical: 20 }}
          />
        ) : task ? (
          <View>
            <View className="flex-row justify-end items-center mb-3">
              <Text className="text-gray-700 font-bold mr-2">
                {task.scenario_name}
              </Text>
              <FontAwesome5 name="route" size={16} color="#4b5563" />
            </View>
            <View className="flex-row justify-end items-center mb-3">
              <Text className="text-gray-500 mr-2">
                التاريخ: {task.collection_date}
              </Text>
              <MaterialIcons name="date-range" size={16} color="#9ca3af" />
            </View>
            <View className="flex-row justify-end items-center mb-5">
              <View
                className={`px-2 py-1 rounded-md ${task.status === "in_progress" ? "bg-blue-100" : "bg-yellow-100"}`}
              >
                <Text
                  className={`text-xs font-bold ${task.status === "in_progress" ? "text-blue-700" : "text-yellow-700"}`}
                >
                  {task.status_display}
                </Text>
              </View>
              <Text className="text-gray-500 mr-2 ml-2">الحالة:</Text>
            </View>
            <TouchableOpacity
              className="bg-primary py-3 rounded-lg items-center"
              onPress={() =>
                router.push({
                  pathname: "/task/[id]",
                  params: { id: String(task.id) },
                } as any)
              }
            >
              <Text className="text-white font-bold text-base">
                {task.status === "in_progress" ? "متابعة المهمة" : "بدء المهمة"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="items-center justify-center py-6">
            <MaterialIcons name="done-all" size={48} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 font-bold text-center">
              لا توجد مهام حالية قيد الانتظار.
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row justify-between mt-2">
        <TouchableOpacity
          className="bg-white flex-1 mr-2 p-4 rounded-xl shadow-sm border border-gray-100 items-center"
          onPress={() => router.push("/(drawer)/reports" as any)}
        >
          <MaterialIcons name="history" size={28} color="#1A6B96" />
          <Text className="text-gray-700 font-bold mt-2">السجل</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white flex-1 ml-2 p-4 rounded-xl shadow-sm border border-gray-100 items-center"
          onPress={() => router.push("/(drawer)/notifications" as any)}
        >
          <Ionicons name="notifications-outline" size={28} color="#1A6B96" />
          <Text className="text-gray-700 font-bold mt-2">الإشعارات</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
