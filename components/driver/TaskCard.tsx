/**
 * components/driver/TaskCard.tsx
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Reusable card for displaying a DriverTask summary in lists.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import type { DriverTaskSummary } from '../../hooks/useDriverTasks';

interface Props {
  task: DriverTaskSummary;
  onPress?: () => void;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; color: string }> = {
  assigned:    { bg: 'bg-yellow-100', text: 'text-yellow-700', color: '#a16207' },
  in_progress: { bg: 'bg-blue-100',   text: 'text-blue-700',   color: '#1d4ed8' },
  completed:   { bg: 'bg-green-100',  text: 'text-green-700',  color: '#15803d' },
  cancelled:   { bg: 'bg-gray-100',   text: 'text-gray-500',   color: '#6b7280' },
};

export default function TaskCard({ task, onPress }: Props) {
  const cfg = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.assigned;

  return (
    <TouchableOpacity
      className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-3"
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* Header row */}
      <View className="flex-row justify-between items-start mb-3">
        <View className={`px-2 py-1 rounded-md ${cfg.bg}`}>
          <Text className={`text-xs font-bold ${cfg.text}`}>{task.status_display}</Text>
        </View>
        <Text className="text-gray-800 font-bold text-base text-right flex-1 ml-3">
          {task.scenario_name || `مهمة #${task.id}`}
        </Text>
      </View>

      {/* Date row */}
      <View className="flex-row justify-end items-center mb-2">
        <Text className="text-gray-500 mr-2 text-sm">
          {task.collection_date ?? '—'}
        </Text>
        <MaterialIcons name="date-range" size={14} color="#9ca3af" />
      </View>

      {/* Footer */}
      <View className="border-t border-gray-100 mt-2 pt-2 flex-row justify-between items-center">
        <MaterialIcons
          name={task.status === 'completed' ? 'done-all' : 'chevron-left'}
          size={20}
          color={cfg.color}
        />
        <Text style={{ color: cfg.color }} className="text-sm font-bold">
          {task.status === 'completed' ? 'عرض التقرير' : 'عرض التفاصيل'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
