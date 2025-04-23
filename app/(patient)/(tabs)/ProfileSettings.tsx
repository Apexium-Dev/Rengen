import { View, Text, ScrollView } from "react-native";
import React from "react";
import SettingsProfile from "../../components/patient/profile/SettingsProfile";
import HealthProfile from "../../components/patient/profile/HealthProfile";
import AppSettings from "@/app/components/patient/profile/AppSettings";
export default function Profile() {
  return (
    <ScrollView>
      <View
        style={{
          backgroundColor: "#F9FAFB",
        }}
      >
        <SettingsProfile />
        <HealthProfile />
        <AppSettings />
      </View>
    </ScrollView>
  );
}
