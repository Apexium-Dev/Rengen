import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useTheme } from "@/app/context/ThemeContext";

export default function QuickActions() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          styles.buttonShadow,
          { backgroundColor: colors.card },
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="heart" size={24} color={colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            Health Monitor
          </Text>
          <Text style={[styles.subtitle, { color: colors.secondary }]}>
            Track your vitals
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          styles.buttonShadow,
          { backgroundColor: colors.card },
        ]}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="medical" size={24} color={colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            Medications
          </Text>
          <Text style={[styles.subtitle, { color: colors.secondary }]}>
            View schedule
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
  },
  button: {
    padding: 16,
    borderRadius: 16,
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
  },
  buttonShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(230, 57, 70, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
});
