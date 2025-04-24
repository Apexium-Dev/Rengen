import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LocationContext } from "../../../context/LocationService";
import { useTheme } from "@/app/context/ThemeContext";

type AirQualityLevel =
  | "Unknown"
  | "Good"
  | "Moderate"
  | "Unhealthy for Sensitive Groups"
  | "Unhealthy"
  | "Very Unhealthy"
  | "Hazardous";

type AirQualityData = {
  data: {
    aqi: number;
    iaqi?: {
      t?: { v: number }; // temperature
      h?: { v: number }; // humidity
    };
  };
  status: string;
};

export default function Air() {
  const { location, address } = useContext(LocationContext);
  const { colors } = useTheme();
  const [temperature, setTemperature] = useState("--");
  const [humidity, setHumidity] = useState("--");
  const [aqi, setAqi] = useState<number | null>(null);

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      const fetchAirQuality = async () => {
        const apiKey = "2e8f0569cfb5efb15070d3d71bf99389af43ae35";
        const url = `https://api.waqi.info/feed/geo:${location.latitude};${location.longitude}/?token=${apiKey}`;

        try {
          const response = await fetch(url);
          const data: AirQualityData = await response.json();
          if (data.status === "ok") {
            setAqi(data.data.aqi);
            setTemperature(data.data.iaqi?.t?.v?.toFixed(1) ?? "--");
            setHumidity(data.data.iaqi?.h?.v?.toFixed(0) ?? "--");
          }
        } catch (error) {
          console.error("Error fetching air quality data:", error);
        }
      };

      fetchAirQuality();
    }
  }, [location]);

  const getAirQualityLevel = (aqi: number | null): AirQualityLevel => {
    if (!aqi) return "Unknown";
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  const airQualityLevel = getAirQualityLevel(aqi);

  const getAirQualityColor = (level: AirQualityLevel): string => {
    switch (level) {
      case "Good":
        return "#4CAF50";
      case "Moderate":
        return "#FFC107";
      case "Unhealthy for Sensitive Groups":
        return "#FF9800";
      case "Unhealthy":
        return "#F44336";
      case "Very Unhealthy":
        return "#9C27B0";
      case "Hazardous":
        return "#880E4F";
      default:
        return colors.secondary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={20} color={colors.primary} />
          <Text
            style={[styles.locationText, { color: colors.text }]}
            numberOfLines={1}
          >
            {address || "Loading location..."}
          </Text>
        </View>
        <Text style={[styles.temperature, { color: colors.text }]}>
          {temperature}°C
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Ionicons name="water-outline" size={24} color={colors.primary} />
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {humidity}%
          </Text>
          <Text style={[styles.infoLabel, { color: colors.secondary }]}>
            Humidity
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons
            name="leaf-outline"
            size={24}
            color={getAirQualityColor(airQualityLevel)}
          />
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {aqi || "--"}
          </Text>
          <Text style={[styles.infoLabel, { color: colors.secondary }]}>
            Air Quality
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 16,
  },
  locationText: {
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
  },
  temperature: {
    fontSize: 24,
    fontWeight: "600",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  infoItem: {
    alignItems: "center",
  },
  infoValue: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 14,
    marginTop: 2,
  },
});
