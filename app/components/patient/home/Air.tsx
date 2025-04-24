import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LocationContext } from "@/app/context/LocationService";
import { useTheme } from "@/app/context/ThemeContext";

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
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const { colors } = useTheme();

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      const fetchAirQuality = async () => {
        const apiKey = "2e8f0569cfb5efb15070d3d71bf99389af43ae35";
        const url = `https://api.waqi.info/feed/geo:${location.latitude};${location.longitude}/?token=${apiKey}`;

        try {
          const response = await fetch(url);
          const data = await response.json();
          console.log("Fetched air quality data:", data);
          setAirQuality(data);
        } catch (error) {
          console.error("Error fetching air quality data:", error);
        }
      };

      fetchAirQuality();
    }
  }, [location]);

  if (!location) {
    return <Text style={{ color: colors.text }}>Loading location...</Text>;
  }

  const aqi = airQuality?.data?.aqi ?? null;
  const temperature = airQuality?.data?.iaqi?.t?.v ?? "N/A";
  const humidity = airQuality?.data?.iaqi?.h?.v ?? "N/A";

  const airQualityLevel =
    aqi !== null
      ? aqi <= 50
        ? "Good"
        : aqi <= 100
        ? "Moderate"
        : aqi <= 150
        ? "Unhealthy for Sensitive Groups"
        : aqi <= 200
        ? "Unhealthy"
        : aqi <= 300
        ? "Very Unhealthy"
        : "Hazardous"
      : "Unknown";

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.topRow}>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={20} color={colors.primary} />
          <Text style={[styles.locationText, { color: colors.text }]}>
            {address}
          </Text>
        </View>
        <Text style={[styles.temperatureText, { color: colors.text }]}>
          {temperature}°C
        </Text>
      </View>

      <View style={styles.bottomRow}>
        <Text style={[styles.updatedText, { color: colors.secondary }]}>
          Updated just now
        </Text>
        <Text style={[styles.humidityText, { color: colors.secondary }]}>
          Humidity: {humidity}%
        </Text>
      </View>

      <View style={styles.aqiContainer}>
        <Text style={[styles.aqiLabel, { color: colors.text }]}>
          Air Quality Index
        </Text>
        <Text style={[styles.aqiValue, { color: colors.text }]}>
          {airQualityLevel} - {aqi ?? "N/A"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
  },
  temperatureText: {
    fontSize: 18,
    fontWeight: "600",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  updatedText: {
    fontSize: 14,
  },
  humidityText: {
    fontSize: 14,
  },
  aqiContainer: {
    alignItems: "center",
  },
  aqiLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  aqiValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
