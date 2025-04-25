import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: {
    time: string;
    taken: boolean;
  }[];
  instructions: string;
  pillsLeft: number;
}

export default function Medications() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<"today" | "all">("today");

  const medications: Medication[] = [
    {
      id: "1",
      name: "Aspirin",
      dosage: "81mg",
      schedule: [
        { time: "8:00 AM", taken: true },
        { time: "8:00 PM", taken: false },
      ],
      instructions: "Take with food",
      pillsLeft: 28,
    },
    {
      id: "2",
      name: "Vitamin D",
      dosage: "2000 IU",
      schedule: [{ time: "2:00 PM", taken: false }],
      instructions: "Take with meal",
      pillsLeft: 45,
    },
  ];

  const renderMedicationCard = (medication: Medication) => (
    <View
      key={medication.id}
      style={[styles.medicationCard, { backgroundColor: colors.card }]}
    >
      <View style={styles.medicationHeader}>
        <View style={styles.medicationInfo}>
          <Text style={[styles.medicationName, { color: colors.text }]}>
            {medication.name}
          </Text>
          <Text style={[styles.medicationDosage, { color: colors.secondary }]}>
            {medication.dosage}
          </Text>
        </View>
        <View
          style={[
            styles.pillsCounter,
            { backgroundColor: `${colors.primary}15` },
          ]}
        >
          <Text style={[styles.pillsCount, { color: colors.primary }]}>
            {medication.pillsLeft}
          </Text>
          <Text style={[styles.pillsLabel, { color: colors.primary }]}>
            pills left
          </Text>
        </View>
      </View>

      <View style={styles.scheduleContainer}>
        {medication.schedule.map((time, index) => (
          <View key={index} style={styles.scheduleItem}>
            <View style={styles.timeContainer}>
              <View
                style={[
                  styles.timeIcon,
                  { backgroundColor: `${colors.secondary}15` },
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={colors.secondary}
                />
              </View>
              <Text style={[styles.scheduleTime, { color: colors.text }]}>
                {time.time}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.checkButton,
                {
                  backgroundColor: time.taken
                    ? colors.primary
                    : `${colors.primary}15`,
                },
              ]}
            >
              <Ionicons
                name={time.taken ? "checkmark" : "checkmark-outline"}
                size={20}
                color={time.taken ? "white" : colors.primary}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Text style={[styles.instructions, { color: colors.secondary }]}>
        {medication.instructions}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Medications</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "today" && { backgroundColor: `${colors.primary}15` },
          ]}
          onPress={() => setActiveTab("today")}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === "today" ? colors.primary : colors.secondary,
              },
            ]}
          >
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "all" && { backgroundColor: `${colors.primary}15` },
          ]}
          onPress={() => setActiveTab("all")}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === "all" ? colors.primary : colors.secondary,
              },
            ]}
          >
            All Medications
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.medicationsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.medicationsListContent}
      >
        {medications.map(renderMedicationCard)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
  },
  medicationsList: {
    flex: 1,
  },
  medicationsListContent: {
    padding: 16,
    paddingTop: 8,
  },
  medicationCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  medicationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  medicationInfo: {
    flex: 1,
    marginRight: 16,
  },
  medicationName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  medicationDosage: {
    fontSize: 15,
  },
  pillsCounter: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  pillsCount: {
    fontSize: 18,
    fontWeight: "700",
  },
  pillsLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  scheduleContainer: {
    marginBottom: 16,
  },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  timeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  scheduleTime: {
    fontSize: 16,
    fontWeight: "500",
  },
  checkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  instructions: {
    fontSize: 14,
    fontStyle: "italic",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
});
