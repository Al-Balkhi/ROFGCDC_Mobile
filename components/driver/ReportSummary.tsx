/**
 * components/driver/ReportSummary.tsx
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Read-only report display shown after task completion.
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Report {
  id: number;
  scenario_name?: string;
  collection_date?: string;
  total_time_seconds: number;
  total_distance_km: number;
  fuel_litres: number;
  actual_fuel_litres?: number | null;
  co2_kg: number;
  driver_notes?: string;
  is_submitted: boolean;
  submitted_at?: string | null;
  stops?: { reason: string; reason_display?: string; duration_seconds: number; note?: string }[];
  deviations?: { reason: string; reason_display?: string; note?: string }[];
}

interface Props {
  report: Report;
}

function KpiRow({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <View className="flex-row justify-end items-center py-3 border-b border-gray-100">
      <Text className="text-gray-800 font-bold flex-1 text-right ml-2">{value}</Text>
      <Text className="text-gray-500 text-sm text-right mr-2">{label}</Text>
      <MaterialIcons name={icon as any} size={18} color="#6b7280" />
    </View>
  );
}

export default function ReportSummary({ report }: Props) {
  const durationMins = Math.round(report.total_time_seconds / 60);

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 py-6" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="bg-green-600 rounded-xl p-5 mb-5">
        <Text className="text-white font-bold text-xl text-center mb-1">
          تقرير المهمة #{report.id}
        </Text>
        {report.scenario_name ? (
          <Text className="text-green-100 text-center text-sm">{report.scenario_name}</Text>
        ) : null}
        <View className={`mt-3 px-3 py-1 rounded-full self-center ${report.is_submitted ? 'bg-white' : 'bg-yellow-400'}`}>
          <Text className={`text-xs font-bold ${report.is_submitted ? 'text-green-700' : 'text-white'}`}>
            {report.is_submitted ? 'تم التقديم ✓' : 'في انتظار التقديم'}
          </Text>
        </View>
      </View>

      {/* KPI Card */}
      <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5">
        <Text className="text-gray-700 font-bold text-base text-right mb-2">مؤشرات الأداء</Text>
        <KpiRow label="المسافة الكلية" value={`${report.total_distance_km.toFixed(2)} كم`} icon="route" />
        <KpiRow label="مدة الرحلة" value={`${durationMins} دقيقة`} icon="access-time" />
        <KpiRow
          label="الوقود المستهلك"
          value={`${(report.actual_fuel_litres ?? report.fuel_litres).toFixed(2)} لتر`}
          icon="local-gas-station"
        />
        <KpiRow label="انبعاثات CO₂" value={`${report.co2_kg.toFixed(2)} كغم`} icon="cloud" />
      </View>

      {/* Stops */}
      {report.stops && report.stops.length > 0 && (
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5">
          <Text className="text-gray-700 font-bold text-base text-right mb-3">
            التوقفات ({report.stops.length})
          </Text>
          {report.stops.map((stop, i) => (
            <View key={i} className="flex-row justify-end items-start mb-2 pb-2 border-b border-gray-50">
              <View className="items-end flex-1">
                <Text className="font-bold text-gray-700 text-sm">
                  {stop.reason_display ?? stop.reason}
                </Text>
                <Text className="text-gray-400 text-xs">{stop.duration_seconds}ث</Text>
                {stop.note ? <Text className="text-gray-500 text-xs mt-1">{stop.note}</Text> : null}
              </View>
              <View className="w-2 h-2 rounded-full bg-blue-500 mt-1 ml-3" />
            </View>
          ))}
        </View>
      )}

      {/* Deviations */}
      {report.deviations && report.deviations.length > 0 && (
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5">
          <Text className="text-gray-700 font-bold text-base text-right mb-3">
            الانحرافات ({report.deviations.length})
          </Text>
          {report.deviations.map((dev, i) => (
            <View key={i} className="flex-row justify-end items-start mb-2 pb-2 border-b border-gray-50">
              <View className="items-end flex-1">
                <Text className="font-bold text-gray-700 text-sm">
                  {dev.reason_display ?? dev.reason}
                </Text>
                {dev.note ? <Text className="text-gray-500 text-xs mt-1">{dev.note}</Text> : null}
              </View>
              <View className="w-2 h-2 rounded-full bg-red-500 mt-1 ml-3" />
            </View>
          ))}
        </View>
      )}

      {/* Driver Notes */}
      {report.driver_notes ? (
        <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-5">
          <Text className="text-gray-700 font-bold text-base text-right mb-2">ملاحظات السائق</Text>
          <Text className="text-gray-600 text-sm text-right leading-6">{report.driver_notes}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}
