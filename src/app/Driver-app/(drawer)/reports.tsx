import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import driverApi from "../../../../services/driverApi";

export default function ReportsScreen() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchReports = async () => {
    try {
      const resp = await driverApi.get("/driver/reports/");
      // Django DRF paginates by default, so data.results should hold the array
      setReports(resp.data.results || resp.data);
    } catch (e) {
      console.warn("Failed to fetch reports", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports();
  };

  const renderReportCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-3"
      onPress={() =>
        router.push({
          pathname: "/report/[id]",
          params: { id: String(item.id) },
        } as any)
      }
    >
      <View className="flex-row justify-between mb-2">
        <View
          className={`px-2 py-1 rounded-md ${item.is_submitted ? "bg-success/20" : "bg-yellow-100"}`}
        >
          <Text
            className={`text-xs font-bold ${item.is_submitted ? "text-success" : "text-yellow-700"}`}
          >
            {item.is_submitted ? "مكتمل" : "غير مكتمل الإرسال"}
          </Text>
        </View>
        <Text className="text-gray-800 font-bold text-lg text-right">
          {item.scenario_name ||
            item.task?.scenario?.name ||
            `تقرير #${item.id}`}
        </Text>
      </View>

      <View className="flex-row justify-end items-center mb-1">
        <Text className="text-gray-500 mr-2 text-sm">
          {item.collection_date || item.task?.scenario?.collection_date || "—"}
        </Text>
        <MaterialIcons name="date-range" size={14} color="#6b7280" />
      </View>

      <View className="flex-row justify-between border-t border-gray-100 mt-2 pt-2">
        <View className="items-center">
          <Text className="text-xs text-gray-500">CO₂</Text>
          <Text className="text-sm font-bold text-gray-700">
            {item.co2_kg?.toFixed(1) || 0} كغ
          </Text>
        </View>
        <View className="items-center border-l border-gray-100 pl-2 ml-2">
          <Text className="text-xs text-gray-500">الوقود</Text>
          <Text className="text-sm font-bold text-gray-700">
            {item.fuel_litres?.toFixed(1) || 0} ل
          </Text>
        </View>
        <View className="items-center border-l border-gray-100 pl-2 ml-2">
          <Text className="text-xs text-gray-500">الزمن</Text>
          <Text className="text-sm font-bold text-gray-700">
            {Math.floor((item.total_time_seconds || 0) / 60)} د
          </Text>
        </View>
        <View className="items-center border-l border-gray-100 pl-2 ml-2">
          <Text className="text-xs text-gray-500">المسافة</Text>
          <Text className="text-sm font-bold text-gray-700">
            {item.total_distance_km?.toFixed(1) || 0} كم
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
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
      {reports.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <MaterialIcons name="folder-open" size={48} color="#d1d5db" />
          <Text className="text-gray-500 mt-4 font-bold">
            لا يوجد تقارير سابقة
          </Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderReportCard}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}
