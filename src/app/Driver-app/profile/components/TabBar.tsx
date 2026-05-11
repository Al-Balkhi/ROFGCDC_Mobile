import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Tab } from "../types";

interface TabBarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onTabChange?: () => void;
}

interface TabConfig {
  key: Tab;
  label: string;
}

const TABS: TabConfig[] = [
  { key: "profile", label: "المعلومات الشخصية" },
  { key: "password", label: "كلمة المرور" },
  { key: "schedule", label: "جدول العمل" },
];

export function TabBar({ activeTab, setActiveTab, onTabChange }: TabBarProps) {
  const handleTabPress = (tab: Tab) => {
    if (onTabChange) {
      onTabChange();
    }
    setActiveTab(tab);
  };

  return (
    <View className="flex-row border-b border-gray-200">
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => handleTabPress(tab.key)}
          className={`flex-1 py-4 items-center border-b-2 ${
            activeTab === tab.key
              ? "border-blue-600"
              : "border-transparent"
          }`}
        >
          <Text
            className={`font-semibold text-sm ${
              activeTab === tab.key ? "text-blue-600" : "text-gray-500"
            }`}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
