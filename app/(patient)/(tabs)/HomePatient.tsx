import { View, Text, ScrollView } from "react-native";
import React from "react";
import ProfileBanner from "../../components/patient/home/ProfileBanner";
import Emergency from "@/app/components/patient/home/emergency";
import Air from "@/app/components/patient/home/Air";
import { useTheme } from "@/app/context/ThemeContext";

export default function Home() {
  const { colors } = useTheme();

  return (
    <ScrollView>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ProfileBanner />
        <Air />
        <Emergency />
      </View>
    </ScrollView>
  );
}
