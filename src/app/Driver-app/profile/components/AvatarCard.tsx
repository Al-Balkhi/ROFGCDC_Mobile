import React from "react";
import { View, Text } from "react-native";
import { User } from "../types";

interface AvatarCardProps {
  user: User | null;
}

export function AvatarCard({ user }: AvatarCardProps) {
  const initial = user?.username?.charAt(0).toUpperCase() || "?";

  return (
    <View className="bg-white rounded-xl shadow-sm p-6 items-center mb-4">
      <View className="w-24 h-24 bg-blue-600/20 rounded-full items-center justify-center mb-4">
        <Text className="text-4xl text-blue-600 font-bold">{initial}</Text>
      </View>
      <Text className="text-xl font-bold text-gray-800 mb-1">
        {user?.username}
      </Text>
      <Text className="text-gray-500 text-sm">{user?.email}</Text>
    </View>
  );
}
