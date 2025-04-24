import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "@/app/context/ThemeContext";

export default function Emergency() {
  const { colors } = useTheme();

  const handleButton = () => {
    router.push("../../screens/EmergencyButton");
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.error }]}
      onPress={handleButton}
    >
      <View style={styles.content}>
        <Ionicons name="warning" size={32} color="white" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Emergency Help</Text>
          <Text style={styles.subtitle}>Tap for immediate assistance</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    color: "white",
    opacity: 0.8,
    fontSize: 14,
    marginTop: 4,
  },
});
