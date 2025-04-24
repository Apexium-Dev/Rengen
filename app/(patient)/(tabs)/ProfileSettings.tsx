import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from "react-native";
import React, { useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/app/context/ThemeContext";
import { useSettings } from "@/app/context/SettingsContext";
import { auth, db } from "../../../Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import Avatar from "../../components/ui/ProfileAvatar";

export default function Profile() {
  const { colors } = useTheme();
  const { darkMode, toggleDarkMode } = useSettings();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");

  useFocusEffect(
    useCallback(() => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setEmail(currentUser.email || "");
        loadUserProfile();
      }
    }, [])
  );

  const loadUserProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || "");
          setBloodType(data.bloodType || "");
          setAllergies(data.allergies || "");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      router.replace("/(auth)/Login");
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Profile Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Avatar seed={name} size={80} />
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.email, { color: colors.secondary }]}>{email}</Text>
        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/(patient)/EditProfile")}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Health Information */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Health Information
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(patient)/EditHealthProfile")}
          >
            <Ionicons name="create-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="water" size={24} color={colors.error} />
            <Text style={[styles.infoLabel, { color: colors.secondary }]}>
              Blood Type
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {bloodType || "Not set"}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="medkit" size={24} color={colors.accent} />
            <Text style={[styles.infoLabel, { color: colors.secondary }]}>
              Allergies
            </Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {allergies ? "Set" : "Not set"}
            </Text>
          </View>
        </View>
      </View>

      {/* Settings */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Settings
        </Text>
        <TouchableOpacity style={styles.settingRow} onPress={toggleDarkMode}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon" size={24} color={colors.primary} />
            <Text style={[styles.settingText, { color: colors.text }]}>
              Dark Mode
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.error }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out" size={24} color="white" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: "center",
    margin: 16,
    borderRadius: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 12,
  },
  email: {
    fontSize: 16,
    marginTop: 4,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  infoItem: {
    alignItems: "center",
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    marginTop: 8,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
