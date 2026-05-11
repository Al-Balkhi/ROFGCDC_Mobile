import React from "react";
import { View, Text } from "react-native";
import { WorkSchedule, DAYS_ARABIC } from "../types";

interface ScheduleTabProps {
  workSchedule?: WorkSchedule;
}

export function ScheduleTab({ workSchedule }: ScheduleTabProps) {
  if (!workSchedule) {
    return (
      <View>
        <Text className="text-gray-700 font-bold mb-4 text-right text-lg">
          جدول أعمالي
        </Text>
        <View className="bg-gray-50 p-4 rounded-lg items-center">
          <Text className="text-gray-500 text-center">
            لا يوجد جدول عمل محدد
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text className="text-gray-700 font-bold mb-4 text-right text-lg">
        جدول أعمالي
      </Text>
      <View className="space-y-2">
        {Object.entries(DAYS_ARABIC).map(([dayKey, dayLabel]) => {
          const dayData = workSchedule[dayKey as keyof WorkSchedule];
          const isEnabled = dayData?.enabled ?? false;
          const startTime = dayData?.start_time ?? "--:--";
          const endTime = dayData?.end_time ?? "--:--";

          return (
            <View
              key={dayKey}
              className={`flex-row items-center justify-between p-3 rounded-lg border ${
                isEnabled
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-100 border-gray-200"
              }`}
            >
              <View className="flex-row items-center gap-2">
                <View
                  className={`px-2 py-1 rounded ${
                    isEnabled
                      ? "bg-green-200"
                      : "bg-red-200"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      isEnabled ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {isEnabled ? "يوم عمل" : "إجازة"}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-3">
                {isEnabled ? (
                  <Text
                    className="text-gray-600 text-sm"
                    style={{ textAlign: "left" }}
                  >
                    {startTime} - {endTime}
                  </Text>
                ) : (
                  <Text className="text-gray-400 text-sm">-</Text>
                )}
                <Text className="font-bold text-gray-800 min-w-[50px] text-right">
                  {dayLabel}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
