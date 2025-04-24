import { View, Text, TouchableOpacity, Alert, Switch } from "react-native";
import React from "react";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useProfileStyles } from "@/app/styles/ProfileStyles";
import { auth } from "../../../../Firebase";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSettings } from "@/app/context/SettingsContext";

export default function AppSettings() {
  const { darkMode, notifications, toggleDarkMode, toggleNotifications } =
    useSettings();
  const ProfileStyles = useProfileStyles();

  const handlePrivacySecurity = () => {
    Alert.alert("Privacy & Security", "This feature is coming soon!");
  };

  const handleLanguage = () => {
    Alert.alert("Language", "This feature is coming soon!");
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await auth.signOut();
              await AsyncStorage.removeItem("user");
              router.replace("/(auth)/Login");
            } catch (error) {
              console.error("Error logging out:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={ProfileStyles.container}>
      <View style={ProfileStyles.card}>
        <Text style={ProfileStyles.header}>App Settings</Text>

        <TouchableOpacity style={ProfileStyles.item} onPress={toggleDarkMode}>
          <View style={ProfileStyles.leftSection}>
            <Ionicons
              name="moon"
              size={20}
              color="#F97316"
              style={ProfileStyles.icon}
            />
            <Text style={ProfileStyles.label}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: "#D1D5DB", true: "#F97316" }}
            thumbColor={darkMode ? "#FFFFFF" : "#F3F4F6"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={ProfileStyles.item}
          onPress={toggleNotifications}
        >
          <View style={ProfileStyles.leftSection}>
            <Ionicons
              name="notifications"
              size={20}
              color="#3B82F6"
              style={ProfileStyles.icon}
            />
            <Text style={ProfileStyles.label}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
            thumbColor={notifications ? "#FFFFFF" : "#F3F4F6"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={ProfileStyles.item}
          onPress={handlePrivacySecurity}
        >
          <View style={ProfileStyles.leftSection}>
            <Ionicons
              name="shield-checkmark"
              size={20}
              color="#10B981"
              style={ProfileStyles.icon}
            />
            <Text style={ProfileStyles.label}>Privacy & Security</Text>
          </View>
          <Entypo name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={ProfileStyles.item} onPress={handleLanguage}>
          <View style={ProfileStyles.leftSection}>
            <Ionicons
              name="language"
              size={20}
              color="#8B5CF6"
              style={ProfileStyles.icon}
            />
            <Text style={ProfileStyles.label}>Language</Text>
          </View>
          <Entypo name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <View style={[ProfileStyles.card, { marginTop: 20 }]}>
        <Text style={ProfileStyles.header}>Account</Text>

        <TouchableOpacity style={ProfileStyles.item} onPress={handleLogout}>
          <View style={ProfileStyles.leftSection}>
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#EF4444"
              style={ProfileStyles.icon}
            />
            <Text style={[ProfileStyles.label, { color: "#EF4444" }]}>
              Logout
            </Text>
          </View>
          <Entypo name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
