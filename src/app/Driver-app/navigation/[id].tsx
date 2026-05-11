/**
 * Updated: navigation/[id].tsx
 * Uses StopEventModal, DeviationModal, RouteMap, and useGpsTracking hook.
 */

import { useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import DeviationModal from "../../../../components/driver/DeviationModal";
import DriverHeader from "../../../../components/driver/DriverHeader";
import RouteMap from "../../../../components/driver/RouteMap";
import StopEventModal from "../../../../components/driver/StopEventModal";
import { useGpsTracking } from "../../../../hooks/useGpsTracking";
import driverApi from "../../../../services/driverApi";

export default function NavigationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<any>(null);
  const [showStopModal, setShowStopModal] = useState(false);
  const [showDeviationModal, setShowDeviationModal] = useState(false);

  const {
    currentLocation,
    error: gpsError,
    startTracking,
    stopTracking,
    flushPings,
  } = useGpsTracking(id ?? null);

  // Fetch task data and start GPS tracking
  useEffect(() => {
    if (!id) return;
    driverApi
      .get(`/driver/tasks/${id}/`)
      .then((res) => setTask(res.data))
      .catch(console.error);

    const init = async () => {
      const granted = await startTracking();
      if (granted) {
        Speech.speak("بدأت الملاحة. اتبع المسار الموضح أمامك.", {
          language: "ar-SA",
        });
      }
    };
    init();

    return () => {
      stopTracking();
    };
    // startTracking and stopTracking are stable references from useCallback
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleComplete = () => {
    Alert.alert("إنهاء المهمة", "هل أنت متأكد من الانتهاء من جميع المحطات؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "نعم، اكتملت",
        onPress: async () => {
          try {
            await flushPings(); // Final GPS flush
            const completeResp = await driverApi.post(
              `/driver/tasks/${id}/complete/`,
            );
            const reportId = completeResp.data?.report_id;
            // Auto-submit the generated report
            if (reportId) {
              await driverApi.post(`/driver/reports/${reportId}/submit/`, {
                driver_notes: "",
              });
            }
            Speech.speak("تم إكمال المهمة بنجاح، شكراً لجهودك.", {
              language: "ar-SA",
            });
            Alert.alert("نجاح", "تم تسجيل التقرير الآلي.", [
              {
                text: "موافق",
                onPress: () =>
                  router.replace({
                    pathname: "/(drawer)/reports",
                  } as any),
              },
            ]);
          } catch {
            Alert.alert("خطأ", "تعذر إنهاء المهمة.");
          }
        },
      },
    ]);
  };

  if (!task) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#15803d" />
      </View>
    );
  }

  const landfill = task.scenario?.end_landfill;
  const bins = task.scenario?.bins ?? [];
  const gpsTrail = currentLocation
    ? [
        {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        },
      ]
    : [];

  return (
    <View style={{ flex: 1 }}>
      <DriverHeader title={`ملاحة: ${task.scenario?.name ?? "مسار الجمع"}`} />

      {/* GPS error banner */}
      {gpsError && (
        <View className="bg-red-100 px-4 py-2">
          <Text className="text-red-700 text-sm text-right">{gpsError}</Text>
        </View>
      )}

      {/* Map */}
      <RouteMap
        currentLocation={currentLocation?.coords ?? null}
        bins={bins}
        landfill={landfill}
        plannedRoute={task?.scenario?.planned_solution?.geometry}
        gpsTrail={gpsTrail}
      />

      {/* Bottom action bar */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: 20,
          backgroundColor: "rgba(255,255,255,0.97)",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 10,
        }}
      >
        <View className="flex-row justify-between mb-3">
          <TouchableOpacity
            className="flex-1 ml-2 bg-amber-500 py-4 rounded-xl items-center"
            onPress={() => setShowDeviationModal(true)}
          >
            <Text className="text-white font-bold">إبلاغ انحراف</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 mr-2 bg-blue-600 py-4 rounded-xl items-center"
            onPress={() => setShowStopModal(true)}
          >
            <Text className="text-white font-bold">تسجيل توقف</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="bg-primary py-4 rounded-xl items-center"
          onPress={handleComplete}
        >
          <Text className="text-white font-bold text-lg">إنهاء المهمة ✓</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <StopEventModal
        taskId={id!}
        visible={showStopModal}
        onClose={() => setShowStopModal(false)}
        onSuccess={() =>
          Speech.speak("تم تسجيل التوقف.", { language: "ar-SA" })
        }
      />
      <DeviationModal
        taskId={id!}
        visible={showDeviationModal}
        onClose={() => setShowDeviationModal(false)}
        onSuccess={() =>
          Speech.speak("تم تسجيل الانحراف، جاري إعادة توجيه المسار.", {
            language: "ar-SA",
          })
        }
      />
    </View>
  );
}
