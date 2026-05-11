import { Drawer } from 'expo-router/drawer';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import DriverDrawer from '../../../../components/driver/DriverDrawer';

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <DriverDrawer {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#1A6B96' },
        headerTintColor: '#fff',
        drawerActiveBackgroundColor: '#e0f2fe',
        drawerActiveTintColor: '#1A6B96',
        drawerStyle: { backgroundColor: '#fff', width: 280 },
        headerTitleAlign: 'center',
        drawerPosition: 'right',
        drawerLabelStyle: { fontSize: 16, fontWeight: 'bold' },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'الرئيسية',
          drawerLabel: 'الرئيسية',
          drawerIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="tasks"
        options={{
          title: 'مهامي',
          drawerLabel: 'المهام المعينة',
          drawerIcon: ({ color, size }) => <FontAwesome5 name="route" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="reports"
        options={{
          title: 'تقاريري',
          drawerLabel: 'سجل التقارير',
          drawerIcon: ({ color, size }) => <MaterialIcons name="analytics" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="notifications"
        options={{
          title: 'الإشعارات',
          drawerLabel: 'الإشعارات',
          drawerIcon: ({ color, size }) => <Ionicons name="notifications" size={size} color={color} />,
        }}
      />
    </Drawer>
  );
}
