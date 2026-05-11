import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import driverApi from "../../../../services/driverApi";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  type: string;
  related_id: number | null;
  created_at: string;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await driverApi.get("/notifications/");
      const results = res.data?.results ?? res.data ?? [];
      setNotifications(results);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  }, []);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    await fetchNotifications();
    if (isRefresh) setRefreshing(false);
    else setLoading(false);
  };

  useEffect(() => {
    load();
  }, [fetchNotifications]);

  const markAsRead = async (id: number) => {
    try {
      await driverApi.post(`/notifications/${id}/read/`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
    } catch {
      Alert.alert("خطأ", "فشل في تحديث حالة الإشعار");
    }
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const isTaskAssigned = item.type === "task_assigned";
    return (
      <TouchableOpacity
        onPress={() => !item.is_read && markAsRead(item.id)}
        activeOpacity={0.8}
        className={`mx-4 my-2 p-4 rounded-xl border ${
          item.is_read
            ? "bg-white border-gray-200"
            : "bg-blue-50 border-blue-200"
        }`}
      >
        <View className="flex-row items-start gap-3">
          <View
            className={`w-10 h-10 rounded-full items-center justify-center ${
              isTaskAssigned ? "bg-green-100" : "bg-blue-100"
            }`}
          >
            <MaterialIcons
              name={isTaskAssigned ? "assignment" : "notifications"}
              size={20}
              color={isTaskAssigned ? "#16a34a" : "#1d4ed8"}
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-gray-800 text-right">
              {item.title}
            </Text>
            <Text className="text-xs text-gray-600 mt-1 text-right leading-5">
              {item.message}
            </Text>
            <Text className="text-[10px] text-gray-400 mt-2 text-right">
              {new Date(item.created_at).toLocaleString("ar-SA")}
            </Text>
          </View>
          {!item.is_read && (
            <View className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#1A6B96" />
        <Text className="mt-3 text-gray-500">جاري تحميل الإشعارات...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-4 py-4 border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800 text-right">
          الإشعارات
        </Text>
        <Text className="text-sm text-gray-500 text-right mt-1">
          {notifications.filter((n) => !n.is_read).length} إشعارات جديدة
        </Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 8 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load(true)}
          />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <MaterialIcons
              name="notifications-none"
              size={48}
              color="#9ca3af"
            />
            <Text className="text-gray-500 mt-3 text-base">
              لا توجد إشعارات
            </Text>
          </View>
        }
      />
    </View>
  );
}
