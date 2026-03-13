import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../../../global.css";
import { PRIMARY_COLOR } from "../../../constants/api";
import { STRINGS } from "../../../constants/strings";

export default function CitizenAppLayout() {
  return (
    <>
      {/* Single authoritative StatusBar for the entire Citizen-app stack. */}
      <StatusBar style="light" />
      <Stack initialRouteName="onboarding">
        <Stack.Screen
          name="index"
          options={{
            title: STRINGS.NAV_REPORT_TITLE,
            headerStyle: { backgroundColor: PRIMARY_COLOR },
            headerTintColor: "#fff",
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
