import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Polyline } from "react-native-maps";
import driverApi from "../../../../services/driverApi";

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [driverNotes, setDriverNotes] = useState("");
  const [actualFuel, setActualFuel] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const resp = await driverApi.get(`/driver/reports/${id}/`);
        setReport(resp.data);
        if (resp.data.driver_notes) setDriverNotes(resp.data.driver_notes);
        if (resp.data.actual_fuel_litres)
          setActualFuel(resp.data.actual_fuel_litres.toString());
      } catch {
        Alert.alert("خطأ", "فشل في تحميل التقرير");
        router.back();
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchReport();
  }, [id, router]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const payload: any = { is_submitted: true, driver_notes: driverNotes };
      if (actualFuel.trim() !== "") {
        payload.actual_fuel_litres = parseFloat(actualFuel);
      }
      await driverApi.post(`/driver/reports/${id}/submit/`, payload);
      Alert.alert("نجاح", "تم تقديم التقرير بنجاح وتنبيه المخطط.");
      router.back();
    } catch {
      Alert.alert("خطأ", "حدث خطأ أثناء تقديم التقرير.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#15803d"
        className="flex-1 justify-center"
      />
    );
  if (!report) return null;

  // Render polyline if geojson exists
  let polylineCoords = [];
  try {
    if (report.actual_route_geometry) {
      const geo = JSON.parse(report.actual_route_geometry);
      if (geo && geo.coordinates) {
        polylineCoords = geo.coordinates.map((c: any[]) => ({
          latitude: c[1],
          longitude: c[0],
        }));
      }
    }
  } catch {}

  const isSubmitted = report.is_submitted;

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 py-8">
      <View className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
        <Text className="text-xl font-bold text-primary text-right mb-4">
          تفاصيل التقرير #{report.id}
        </Text>

        <View className="flex-row justify-end items-center mb-3">
          <Text className="text-gray-700 font-bold mr-2">
            {report.scenario_name || report.task?.scenario?.name || "—"}
          </Text>
          <FontAwesome5 name="route" size={16} color="#4b5563" />
        </View>
        <View className="flex-row justify-end items-center mb-3">
          <Text className="text-gray-500 mr-2">
            السائق: {report.driver_name || report.task?.driver?.username || "—"}
          </Text>
          <FontAwesome5 name="user" size={16} color="#9ca3af" />
        </View>

        <View className="flex-row flex-wrap justify-between border-t border-gray-100 mt-4 pt-4">
          <View className="w-[48%] bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3 items-center">
            <Text className="text-xs text-gray-500 mb-1">المسافة الكلية</Text>
            <Text className="text-lg font-bold text-gray-800">
              {report.total_distance_km?.toFixed(2)} كم
            </Text>
          </View>
          <View className="w-[48%] bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3 items-center">
            <Text className="text-xs text-gray-500 mb-1">الزمن الكلي</Text>
            <Text className="text-lg font-bold text-gray-800">
              {Math.floor((report.total_time_seconds || 0) / 60)} دقيقة
            </Text>
          </View>
          <View className="w-[48%] bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3 items-center">
            <Text className="text-xs text-gray-500 mb-1">الوقود المقدر</Text>
            <Text className="text-lg font-bold text-gray-800">
              {report.fuel_litres?.toFixed(2)} لتر
            </Text>
          </View>
          <View className="w-[48%] bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3 items-center">
            <Text className="text-xs text-gray-500 mb-1">انبعاثات CO₂</Text>
            <Text className="text-lg font-bold text-gray-800">
              {report.co2_kg?.toFixed(2)} كغ
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
        <Text className="text-lg font-bold text-gray-700 text-right mb-3">
          مسار التنفيذ
        </Text>
        <View className="h-48 rounded-xl overflow-hidden bg-gray-100">
          <MapView
            style={{ width: "100%", height: "100%" }}
            initialRegion={
              polylineCoords.length > 0
                ? {
                    latitude: polylineCoords[0].latitude,
                    longitude: polylineCoords[0].longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }
                : {
                    latitude: 33.5138,
                    longitude: 36.2765,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }
            }
          >
            {polylineCoords.length > 0 && (
              <Polyline
                coordinates={polylineCoords}
                strokeColor="#ef4444"
                strokeWidth={4}
              />
            )}
          </MapView>
        </View>
      </View>

      <View className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-8">
        <Text className="text-lg font-bold text-gray-700 text-right mb-4">
          إنهاء التقرير وإرساله
        </Text>

        <Text className="text-gray-500 text-right mb-2">
          الوقود الفعلي المُستهلك (لتر) اختياري:
        </Text>
        <TextInput
          value={actualFuel}
          onChangeText={setActualFuel}
          placeholder="مثال: 4.5"
          keyboardType="numeric"
          editable={!isSubmitted}
          className="w-full h-12 border border-gray-300 rounded-lg px-4 text-right bg-gray-50 mb-4"
        />

        <Text className="text-gray-500 text-right mb-2">ملاحظات السائق:</Text>
        <TextInput
          value={driverNotes}
          onChangeText={setDriverNotes}
          placeholder="هل واجهت عراقيل في الطريق؟"
          multiline
          numberOfLines={3}
          editable={!isSubmitted}
          className="w-full border border-gray-300 rounded-lg p-4 text-right bg-gray-50 mb-6"
          style={{ minHeight: 80, textAlignVertical: "top" }}
        />

        {!isSubmitted ? (
          <TouchableOpacity
            className="w-full bg-primary h-12 rounded-lg items-center justify-center flex-row"
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text className="text-white font-bold text-lg mr-2">
                  إعتماد وإرسال التقرير
                </Text>
                <MaterialIcons name="send" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        ) : (
          <View className="w-full bg-gray-100 h-12 rounded-lg items-center justify-center flex-row border border-gray-200">
            <Text className="text-gray-500 font-bold text-lg mr-2">
              تم الإرسال للمخطط
            </Text>
            <MaterialIcons name="check-circle" size={20} color="#6b7280" />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
