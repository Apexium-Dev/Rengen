import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { auth, db } from "../../../Firebase";
import { doc, getDoc } from "firebase/firestore"; // Entypo used for chevron

export default function HealthProfile() {
  const [blood, setBlood] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setBlood(data.bloodType || "");
        }
      } catch (error) {
        console.log("Error loading profile:", error);
      }
    }
    setLoading(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Health Profile</Text>

        <TouchableOpacity style={styles.item} disabled>
          <View style={styles.leftSection}>
            <Ionicons name="heart" size={20} color="red" style={styles.icon} />
            <Text style={styles.label}>Blood Type</Text>
          </View>
          <Text style={styles.value}>{blood}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <View style={styles.leftSection}>
            <Ionicons
              name="medkit"
              size={20}
              color="#F97316"
              style={styles.icon}
            />
            <Text style={styles.label}>Allergies</Text>
          </View>
          <Entypo name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <View style={styles.leftSection}>
            <Ionicons
              name="bandage"
              size={20}
              color="red"
              style={styles.icon}
            />
            <Text style={styles.label}>Medications</Text>
          </View>
          <Entypo name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F2F2F2",
    paddingTop: 40,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#1F2937",
    alignSelf: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    width: "100%",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    color: "#374151",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
});
