import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import ProfileBanner from "../../components/patient/home/ProfileBanner";
import Emergency from "@/app/components/patient/home/emergency";
import Air from "@/app/components/patient/home/Air";
import { useTheme } from "@/app/context/ThemeContext";

export default function Home() {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ProfileBanner />
      <View style={styles.content}>
        <Air />
        <Emergency />
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
