import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import RouteMap from "../../../../components/driver/RouteMap";
import driverApi from "../../../../services/driverApi";

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const resp = await driverApi.get(`/driver/tasks/${id}/`);
        setTask(resp.data);
      } catch {
        Alert.alert("خطأ", "فشل في تحميل تفاصيل المهمة");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTask();
  }, [id]);

  const handleStartTask = async () => {
    try {
      setStarting(true);
      if (task.status === "assigned") {
        await driverApi.post(`/driver/tasks/${id}/start/`);
      }
      // Navigate to navigation map!
      router.push({
        pathname: "/navigation/[id]",
        params: { id: String(id) },
      } as any);
    } catch {
      Alert.alert("خطأ", "فشل في بدء المهمة");
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#15803d"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  if (!task) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>المهمة غير موجودة</Text>
      </View>
    );
  }

  const bins = task.scenario?.bins ?? [];
  const landfill = task.scenario?.end_landfill;

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 py-8">
      <View className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
        <Text className="text-xl font-bold text-primary text-right mb-4">
          تفاصيل مسار الجمع
        </Text>

        <View className="flex-row justify-end items-center mb-3">
          <Text className="text-gray-700 font-bold mr-2">
            {task.scenario?.name || task.scenario_name}
          </Text>
          <FontAwesome5 name="route" size={16} color="#4b5563" />
        </View>

        <View className="flex-row justify-end items-center mb-3">
          <Text className="text-gray-500 mr-2">
            التاريخ: {task.scenario?.collection_date || task.collection_date}
          </Text>
          <MaterialIcons name="date-range" size={16} color="#9ca3af" />
        </View>

        <View className="flex-row justify-end items-center mb-3">
          <Text className="text-gray-500 mr-2">السائق: {task.driver_name}</Text>
          <FontAwesome5 name="user" size={16} color="#9ca3af" />
        </View>

        <View className="flex-row justify-end items-center mb-3">
          <View
            className={`px-2 py-1 rounded-md ${task.status === "in_progress" ? "bg-blue-100" : task.status === "assigned" ? "bg-yellow-100" : "bg-success/20"}`}
          >
            <Text
              className={`text-xs font-bold ${task.status === "in_progress" ? "text-blue-700" : task.status === "assigned" ? "text-yellow-700" : "text-success"}`}
            >
              {task.status_display}
            </Text>
          </View>
          <Text className="text-gray-500 mr-2 ml-2">حالة المهمة:</Text>
        </View>

        {task.scenario?.status_display && (
          <View className="flex-row justify-end items-center mb-5">
            <View
              className={`px-2 py-1 rounded-md ${task.scenario.status === "in_progress" ? "bg-blue-100" : task.scenario.status === "completed" ? "bg-green-100" : "bg-yellow-100"}`}
            >
              <Text
                className={`text-xs font-bold ${task.scenario.status === "in_progress" ? "text-blue-700" : task.scenario.status === "completed" ? "text-green-700" : "text-yellow-700"}`}
              >
                {task.scenario.status_display}
              </Text>
            </View>
            <Text className="text-gray-500 mr-2 ml-2">حالة الخطة:</Text>
          </View>
        )}

        {/* Map preview */}
        <View
          className="mb-5 rounded-lg overflow-hidden border border-gray-100"
          style={{ height: 240 }}
        >
          <RouteMap
            bins={bins}
            landfill={landfill}
            plannedRoute={task.scenario?.planned_solution?.geometry}
            height={240}
          />
        </View>

        <View className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-5 items-end">
          <Text className="font-bold text-gray-800 border-b border-gray-200 pb-2 w-full text-right mb-2">
            إحصائيات المخطط
          </Text>
          <Text className="text-gray-600 mb-1">
            الزمن المقدر:{" "}
            {Math.floor(
              (task.scenario?.planned_solution?.total_time || 0) / 60,
            )}{" "}
            دقيقة
          </Text>
          <Text className="text-gray-600 mb-1">
            المسافة المقدرة:{" "}
            {(task.scenario?.planned_solution?.total_distance || 0).toFixed(1)}{" "}
            كم
          </Text>
          <Text className="text-gray-600">إجمالي الحاويات: {bins.length}</Text>
        </View>

        {/* Bins list */}
        {bins.length > 0 && (
          <View className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-5">
            <Text className="font-bold text-gray-800 border-b border-gray-200 pb-2 w-full text-right mb-2">
              الحاويات ({bins.length})
            </Text>
            {bins.map((bin: any) => (
              <View
                key={bin.id}
                className="flex-row justify-end items-center py-2 border-b border-gray-100 last:border-0"
              >
                <Text className="text-gray-600 text-right flex-1">
                  {bin.name || `حاوية #${bin.id}`}
                </Text>
                <MaterialIcons
                  name="delete"
                  size={16}
                  color="#16a34a"
                  style={{ marginLeft: 8 }}
                />
              </View>
            ))}
          </View>
        )}

        {/* Completion info for completed tasks */}
        {task.status === "completed" && task.completed_at && (
          <View className="bg-green-50 p-3 rounded-lg border border-green-100 mb-5">
            <Text className="font-bold text-green-800 text-right mb-1">
              تم إنجاز المهمة
            </Text>
            <Text className="text-green-600 text-right text-sm">
              تاريخ الإنجاز: {task.completed_at}
            </Text>
          </View>
        )}

        {task.status === "completed" && task.report_id && (
          <TouchableOpacity
            className="bg-blue-600 py-4 rounded-lg items-center mb-5"
            onPress={() =>
              router.push({
                pathname: "/report/[id]",
                params: { id: String(task.report_id) },
              } as any)
            }
          >
            <Text className="text-white font-bold text-lg">عرض التقرير</Text>
          </TouchableOpacity>
        )}

        {task.status !== "completed" && (
          <TouchableOpacity
            className="bg-primary py-4 rounded-lg items-center"
            onPress={handleStartTask}
            disabled={starting}
          >
            {starting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">
                {task.status === "in_progress"
                  ? "متابعة الملاحة"
                  : "بدء المهمة"}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
