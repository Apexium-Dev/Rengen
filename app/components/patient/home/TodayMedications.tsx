import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

interface Medication {
  id: string;
  name: string;
  time: string;
  dosage: string;
  taken: boolean;
}

export default function TodayMedications() {
  const { colors } = useTheme();

  const medications: Medication[] = [
    {
      id: "1",
      name: "Aspirin",
      time: "8:00 AM",
      dosage: "1 tablet",
      taken: false,
    },
    {
      id: "2",
      name: "Vitamin D",
      time: "2:00 PM",
      dosage: "1 capsule",
      taken: false,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Today's Medications
        </Text>
        <TouchableOpacity>
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {medications.map((med) => (
        <View key={med.id} style={styles.medicationItem}>
          <View style={styles.medicationIcon}>
            <Ionicons name="medical" size={20} color={colors.primary} />
          </View>
          <View style={styles.medicationInfo}>
            <Text style={[styles.medicationName, { color: colors.text }]}>
              {med.name}
            </Text>
            <Text style={[styles.medicationTime, { color: colors.secondary }]}>
              {med.time} - {med.dosage}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.checkButton,
              {
                backgroundColor: med.taken
                  ? colors.primary
                  : "rgba(0,0,0,0.05)",
              },
            ]}
          >
            <Ionicons
              name={med.taken ? "checkmark" : "checkmark-outline"}
              size={20}
              color={med.taken ? "white" : colors.primary}
            />
          </TouchableOpacity>
        </View>
      ))}
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
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  medicationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  medicationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: "500",
  },
  medicationTime: {
    fontSize: 14,
    marginTop: 2,
  },
  checkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
