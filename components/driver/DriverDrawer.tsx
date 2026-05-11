/**
 * components/driver/DriverDrawer.tsx
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Custom drawer content component. Extracted from (drawer)/_layout.tsx
 * to be a standalone reusable component.
 *
 * Usage: pass as the `drawerContent` prop to the Drawer navigator.
 *   <Drawer drawerContent={(props) => <DriverDrawer {...props} />} ...>
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDriverAuth } from '../../hooks/useDriverAuth';

export default function DriverDrawer(props: DrawerContentComponentProps) {
  const { user, logout } = useDriverAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login' as any);
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} style={{ backgroundColor: '#fff' }}>
        {/* Profile Header */}
        <TouchableOpacity 
          className="bg-primary p-6 items-center justify-center mb-4"
          onPress={() => router.push('/profile' as any)}
          activeOpacity={0.8}
        >
          <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-3">
            <MaterialIcons name="local-shipping" size={40} color="#1A6B96" />
          </View>
          <Text className="text-white text-lg font-bold">
            {user?.username || 'السائق'}
          </Text>
          <Text className="text-blue-100 text-sm mt-1">{user?.email || ''}</Text>
          <View className="mt-2 bg-primary/40 px-3 py-1 rounded-full">
            <Text className="text-blue-100 text-xs font-bold">سائق</Text>
          </View>
        </TouchableOpacity>

        {/* Drawer nav items — injected by Expo Router */}
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Footer: logout button */}
      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity
          className="flex-row items-center justify-center bg-red-50 p-3 rounded-lg border border-red-200"
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={22} color="#dc2626" />
          <Text className="text-red-600 font-bold ml-2">تسجيل الخروج</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
