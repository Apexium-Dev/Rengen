import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

interface HealthMetric {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  unit: string;
  trend?: "up" | "down" | "stable";
}

const { width } = Dimensions.get("window");
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - 48 - CARD_MARGIN * 2) / 2;

export default function HealthMonitor() {
  const { colors } = useTheme();

  const healthMetrics: HealthMetric[] = [
    {
      icon: "heart",
      title: "Heart Rate",
      value: "72",
      unit: "bpm",
      trend: "stable",
    },
    {
      icon: "fitness",
      title: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      trend: "down",
    },
    {
      icon: "thermometer",
      title: "Temperature",
      value: "98.6",
      unit: "°F",
      trend: "stable",
    },
    {
      icon: "water",
      title: "Blood Oxygen",
      value: "98",
      unit: "%",
      trend: "up",
    },
  ];

  const renderTrendIcon = (trend?: "up" | "down" | "stable") => {
    if (!trend) return null;

    const iconName =
      trend === "up" ? "arrow-up" : trend === "down" ? "arrow-down" : "remove";

    const iconColor =
      trend === "up"
        ? colors.success
        : trend === "down"
        ? colors.error
        : colors.secondary;

    return (
      <Ionicons
        name={iconName}
        size={16}
        color={iconColor}
        style={styles.trendIcon}
      />
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Health Monitor
        </Text>
        <TouchableOpacity
          style={[
            styles.refreshButton,
            { backgroundColor: `${colors.primary}15` },
          ]}
        >
          <Ionicons name="refresh" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.metricsGrid}>
        {healthMetrics.map((metric, index) => (
          <View
            key={index}
            style={[styles.metricCard, { backgroundColor: colors.card }]}
          >
            <View style={styles.metricHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${colors.primary}15` },
                ]}
              >
                <Ionicons name={metric.icon} size={24} color={colors.primary} />
              </View>
              {renderTrendIcon(metric.trend)}
            </View>
            <Text style={[styles.metricTitle, { color: colors.secondary }]}>
              {metric.title}
            </Text>
            <View style={styles.valueContainer}>
              <Text style={[styles.metricValue, { color: colors.text }]}>
                {metric.value}
              </Text>
              <Text style={[styles.metricUnit, { color: colors.secondary }]}>
                {metric.unit}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.activityCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Daily Activity
        </Text>
        <View style={styles.activityMetrics}>
          <View style={styles.activityItem}>
            <View
              style={[
                styles.activityIcon,
                { backgroundColor: `${colors.primary}15` },
              ]}
            >
              <Ionicons name="footsteps" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.activityValue, { color: colors.text }]}>
              8,432
            </Text>
            <Text style={[styles.activityLabel, { color: colors.secondary }]}>
              steps
            </Text>
          </View>
          <View style={styles.activityItem}>
            <View
              style={[
                styles.activityIcon,
                { backgroundColor: `${colors.error}15` },
              ]}
            >
              <Ionicons name="flame" size={24} color={colors.error} />
            </View>
            <Text style={[styles.activityValue, { color: colors.text }]}>
              2,345
            </Text>
            <Text style={[styles.activityLabel, { color: colors.secondary }]}>
              kcal
            </Text>
          </View>
          <View style={styles.activityItem}>
            <View
              style={[
                styles.activityIcon,
                { backgroundColor: `${colors.success}15` },
              ]}
            >
              <Ionicons name="time" size={24} color={colors.success} />
            </View>
            <Text style={[styles.activityValue, { color: colors.text }]}>
              45
            </Text>
            <Text style={[styles.activityLabel, { color: colors.secondary }]}>
              min active
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 8,
  },
  metricCard: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  trendIcon: {
    marginLeft: 4,
  },
  metricTitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  metricValue: {
    fontSize: 28,
    fontWeight: "700",
    marginRight: 4,
  },
  metricUnit: {
    fontSize: 14,
  },
  activityCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
  },
  activityMetrics: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  activityItem: {
    alignItems: "center",
  },
  activityIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  activityValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  activityLabel: {
    fontSize: 14,
  },
});
