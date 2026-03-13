import { Stack } from "expo-router";
import "../../../global.css";

export default function DriverAppLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "لوحة السائق",
          headerStyle: { backgroundColor: "#16a34a" },
          headerTintColor: "#fff",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
