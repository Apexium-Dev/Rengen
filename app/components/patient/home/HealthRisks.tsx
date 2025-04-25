import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function HealthRisks() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Seasonal Health Risks
      </Text>

      <View style={styles.riskItem}>
        <View style={styles.iconContainer}>
          <Ionicons name="flower-outline" size={24} color={colors.error} />
        </View>
        <View style={styles.riskInfo}>
          <Text style={[styles.riskTitle, { color: colors.text }]}>
            Pollen Alert
          </Text>
          <Text style={[styles.riskSubtitle, { color: colors.secondary }]}>
            High levels expected today
          </Text>
        </View>
      </View>

      <View style={styles.riskItem}>
        <View style={styles.iconContainer}>
          <Ionicons name="sunny-outline" size={24} color={colors.warning} />
        </View>
        <View style={styles.riskInfo}>
          <Text style={[styles.riskTitle, { color: colors.text }]}>
            UV Index
          </Text>
          <Text style={[styles.riskSubtitle, { color: colors.secondary }]}>
            Moderate exposure risk
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  riskItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  riskInfo: {
    flex: 1,
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  riskSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
});
