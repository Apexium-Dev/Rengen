import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import { useTheme } from "../context/ThemeContext";

export default function RoleSelection() {
  const { colors } = useTheme();

  const handleRoleSelect = () => {
    router.push({
      pathname: "/(auth)/Login",
      params: { role: "patient" },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Image
          source={require("./../../assets/img/logo-removebg-preview.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.headerText, { color: colors.text }]}>
          Welcome to Rengen
        </Text>
        <Text style={[styles.subText, { color: colors.secondary }]}>
          Your Emergency Health Companion
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.roleButton, { backgroundColor: colors.accent }]}
            onPress={handleRoleSelect}
          >
            <Text style={styles.roleButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logo: {
    width: 300,
    height: 50,
    marginBottom: 40,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  subText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  roleButton: {
    padding: 20,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  roleButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
