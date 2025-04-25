import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import ProfileBanner from "../../components/patient/home/ProfileBanner";
import Emergency from "@/app/components/patient/home/emergency";
import Air from "@/app/components/patient/home/Air";
import { useTheme } from "@/app/context/ThemeContext";
import HealthRisks from "@/app/components/patient/home/HealthRisks";
import QuickActions from "@/app/components/patient/home/QuickActions";
import TodayMedications from "@/app/components/patient/home/TodayMedications";

export default function HomePatient() {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <ProfileBanner />
      <View style={styles.content}>
        <Air />
        <HealthRisks />
        <Emergency />
        <QuickActions />
        <TodayMedications />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
});
