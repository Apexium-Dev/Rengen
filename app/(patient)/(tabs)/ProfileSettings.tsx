import { View, Text } from "react-native";
import React from "react";
import SettingsProfile from "../../components/patient/SettingsProfile";
import HealthProfile from "../../components/patient/HealthProfile";
export default function Profile() {
  return (
    <View
      style={{
        backgroundColor: "#F9FAFB",
      }}
    >
      <SettingsProfile />
      <HealthProfile />
    </View>
  );
}
