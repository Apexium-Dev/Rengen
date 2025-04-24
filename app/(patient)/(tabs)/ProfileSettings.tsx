import { View, Text, ScrollView } from "react-native";
import React from "react";
import SettingsProfile from "../../components/patient/profile/SettingsProfile";
import HealthProfile from "../../components/patient/profile/HealthProfile";
import AppSettings from "@/app/components/patient/profile/AppSettings";
import { useTheme } from "@/app/context/ThemeContext";

export default function Profile() {
  const { colors } = useTheme();

  return (
    <ScrollView style={{ backgroundColor: colors.background }}>
      <View
        style={{
          backgroundColor: colors.background,
        }}
      >
        <SettingsProfile />
        <HealthProfile />
        <AppSettings />
      </View>
    </ScrollView>
  );
}
