import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/app/context/ThemeContext";
import { LocationContext } from "@/app/context/LocationService";
import { LineChart } from "react-native-chart-kit";

type TimeRange = "24 Hours" | "Week" | "Month";
type DataType = "AQI" | "Temperature" | "Humidity";

interface AQIData {
  aqi: number;
  time: string;
}

interface LegendItem {
  color: string;
  label: string;
}

interface AQIForecast {
  avg: number;
  day: string;
  max: number;
  min: number;
}

interface APIResponse {
  status: string;
  data?: {
    aqi: number;
    forecast?: {
      daily?: {
        pm25?: AQIForecast[];
      };
    };
  };
}

const LEGEND_ITEMS: LegendItem[] = [
  { color: "#4CAF50", label: "Good" },
  { color: "#FFC107", label: "Moderate" },
  { color: "#F44336", label: "Poor" },
];

const TIME_RANGES: TimeRange[] = ["24 Hours", "Week", "Month"];
const DATA_TYPES: DataType[] = ["AQI", "Temperature", "Humidity"];

const HOURS = ["12 AM", "4 AM", "8 AM", "12 PM", "4 PM", "8 PM", "12 AM"];

const getEnvironmentalAdvice = (
  aqi: number,
  temp: number,
  humidity: number
) => {
  const recommendations = [];

  // Air Quality Based Recommendations
  if (aqi > 150) {
    recommendations.push({
      type: "protection",
      icon: "😷",
      title: "Air Quality Protection",
      advice: "Consider wearing a mask when outdoors for extended periods.",
    });
  }

  if (aqi > 100) {
    recommendations.push({
      type: "activity",
      icon: "🏠",
      title: "Activity Suggestion",
      advice: "Consider indoor activities during peak hours (12 PM - 3 PM).",
    });
  }

  // Hydration recommendation based on temperature and humidity
  if (temp > 25 || humidity < 30) {
    recommendations.push({
      type: "hydration",
      icon: "💧",
      title: "Stay Hydrated",
      advice: "Remember to drink water regularly throughout the day.",
    });
  }

  return recommendations;
};

export default function Stats() {
  const { colors } = useTheme();
  const { location } = useContext(LocationContext);
  const [timeRange, setTimeRange] = useState<TimeRange>("24 Hours");
  const [dataType, setDataType] = useState<DataType>("AQI");
  const [aqiData, setAqiData] = useState<AQIData[]>([]);
  const [currentAQI, setCurrentAQI] = useState<number>(0);
  const [averageAQI, setAverageAQI] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location?.latitude && location?.longitude) {
      fetchAirQualityData();
    }
  }, [location, timeRange]);

  const fetchAirQualityData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiKey = "2e8f0569cfb5efb15070d3d71bf99389af43ae35";
      const url = `https://api.waqi.info/feed/geo:${location?.latitude};${location?.longitude}/?token=${apiKey}`;
      console.log("Fetching AQI data from:", url);

      const response = await fetch(url);
      const data: APIResponse = await response.json();
      console.log("API Response:", data);

      if (
        data.status === "ok" &&
        data.data &&
        typeof data.data.aqi === "number"
      ) {
        const aqi = data.data.aqi;
        console.log("Current AQI:", aqi);
        setCurrentAQI(aqi);

        // Generate historical data based on forecast if available
        let historicalData: AQIData[];
        if (data.data.forecast?.daily?.pm25) {
          historicalData = data.data.forecast.daily.pm25.map((item) => ({
            time: new Date(item.day).toLocaleTimeString([], {
              hour: "numeric",
            }),
            aqi: item.avg,
          }));
        } else {
          historicalData = generateMockData(aqi);
        }

        console.log("Historical Data:", historicalData);
        setAqiData(historicalData);

        // Calculate average from actual data
        const avg =
          historicalData.reduce(
            (sum: number, item: AQIData) => sum + item.aqi,
            0
          ) / historicalData.length;
        setAverageAQI(Math.round(avg));
      } else {
        console.error("Invalid API response:", data);
        setError("Invalid data received from the server");
      }
    } catch (error) {
      console.error("Error fetching air quality data:", error);
      setError("Failed to fetch air quality data");
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockData = (currentAQI: number): AQIData[] => {
    const baseVariations = [5, 10, 15, 10, 5, 8, 12]; // Base variations for each hour
    const timeOfDay = new Date().getHours();

    return HOURS.map((time, index) => {
      // Add time-based variation
      const timeVariation =
        Math.sin(((timeOfDay + index) * Math.PI) / 12) * baseVariations[index];
      // Add some randomness but keep it consistent for the same hour
      const randomVariation = Math.sin(timeOfDay + index) * 5;

      const aqi = Math.max(
        0,
        Math.round(currentAQI + timeVariation + randomVariation)
      );
      return { time, aqi };
    });
  };

  const getAQIStatus = (aqi: number): string => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return "#4CAF50";
    if (aqi <= 100) return "#FFC107";
    if (aqi <= 150) return "#FF9800";
    if (aqi <= 200) return "#F44336";
    if (aqi <= 300) return "#9C27B0";
    return "#880E4F";
  };

  const chartData = useMemo(
    () => ({
      labels: aqiData.map((data) => data.time),
      datasets: [{ data: aqiData.map((data) => data.aqi) }],
    }),
    [aqiData]
  );

  const renderAQIIndicator = () => {
    if (!location) return null;

    const color = getAQIColor(currentAQI);
    return (
      <View style={styles.aqiIndicatorContainer}>
        <View style={[styles.aqiIndicator, { backgroundColor: `${color}20` }]}>
          <View style={[styles.aqiDot, { backgroundColor: color }]} />
          <Text style={[styles.aqiValue, { color: colors.text }]}>
            {currentAQI}
          </Text>
          <Text style={[styles.aqiLabel, { color: colors.secondary }]}>
            Current AQI at your location
          </Text>
          <Text style={[styles.aqiStatus, { color }]}>
            {getAQIStatus(currentAQI)}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.error, { color: colors.text }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={fetchAirQualityData}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          Health Monitor
        </Text>
        <View style={styles.timeRangeContainer}>
          {TIME_RANGES.map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeRangeButton,
                timeRange === range && { backgroundColor: colors.primary },
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  { color: timeRange === range ? "white" : colors.text },
                ]}
              >
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* AQI Indicator */}
      <View style={[styles.mapContainer, { backgroundColor: colors.card }]}>
        <View style={styles.mapHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Air Quality Index
          </Text>
        </View>
        {renderAQIIndicator()}
        <View style={styles.legend}>
          {LEGEND_ITEMS.map((item) => (
            <View key={item.label} style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: item.color }]}
              />
              <Text style={[styles.legendText, { color: colors.text }]}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Data Type Selector */}
      <View style={styles.dataTypeContainer}>
        {DATA_TYPES.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.dataTypeButton,
              dataType === type && { backgroundColor: colors.primary },
            ]}
            onPress={() => setDataType(type)}
          >
            <Text
              style={[
                styles.dataTypeText,
                { color: dataType === type ? "white" : colors.text },
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Trend Chart */}
      <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          AQI Trend
        </Text>
        <LineChart
          data={chartData}
          width={Dimensions.get("window").width - 32}
          height={220}
          chartConfig={{
            backgroundColor: colors.card,
            backgroundGradientFrom: colors.card,
            backgroundGradientTo: colors.card,
            decimalPlaces: 0,
            color: () => colors.primary,
            labelColor: () => colors.text,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: colors.primary,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>

      {/* Current Stats */}
      <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: colors.secondary }]}>
            Current AQI
          </Text>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {currentAQI}
          </Text>
          <Text style={[styles.statStatus, { color: getAQIColor(currentAQI) }]}>
            {getAQIStatus(currentAQI)}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: colors.secondary }]}>
            24h Average
          </Text>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {averageAQI}
          </Text>
          <Text style={[styles.statStatus, { color: getAQIColor(averageAQI) }]}>
            {getAQIStatus(averageAQI)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  header: {
    padding: 16,
    margin: 16,
    borderRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
  },
  timeRangeContainer: {
    flexDirection: "row",
    gap: 8,
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  mapContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  mapHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  aqiIndicatorContainer: {
    padding: 16,
  },
  aqiIndicator: {
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  aqiDot: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 16,
  },
  aqiValue: {
    fontSize: 48,
    fontWeight: "700",
    marginBottom: 8,
  },
  aqiLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  aqiStatus: {
    fontSize: 16,
    fontWeight: "600",
  },
  legend: {
    flexDirection: "row",
    padding: 16,
    justifyContent: "space-around",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
  dataTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  dataTypeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  dataTypeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  chartContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  statsContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statBox: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "600",
    marginBottom: 4,
  },
  statStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
});
