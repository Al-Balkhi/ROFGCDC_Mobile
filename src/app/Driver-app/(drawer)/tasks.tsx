import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    View,
} from "react-native";
import TaskCard from "../../../../components/driver/TaskCard";
import { useDriverTasks } from "../../../../hooks/useDriverTasks";

export default function TasksScreen() {
  const router = useRouter();
  const { tasks, loading, refreshing, fetchTasks, refreshTasks } =
    useDriverTasks();

  // Refresh tasks every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks]),
  );

  if (loading && tasks.length === 0) {
    return (
      <ActivityIndicator
        size="large"
        color="#15803d"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-4">
      {tasks.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <FontAwesome5 name="route" size={48} color="#d1d5db" />
          <Text className="text-gray-500 mt-4 font-bold">
            لا يوجد مهام مجدولة لك حالياً
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onPress={() => {
                if (item.status === "completed" && item.report_id) {
                  router.push({
                    pathname: "/report/[id]",
                    params: { id: String(item.report_id) },
                  } as any);
                } else {
                  router.push({
                    pathname: "/task/[id]",
                    params: { id: String(item.id) },
                  } as any);
                }
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshTasks} />
          }
        />
      )}
    </View>
  );
}
