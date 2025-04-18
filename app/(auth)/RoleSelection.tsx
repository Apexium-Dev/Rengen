import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import React, { useEffect } from "react";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth as patientAuth } from "./../../Firebase";

export default function RoleSelection() {
  useEffect(() => {
    const checkLogin = onAuthStateChanged(patientAuth, async (user) => {
      if (user) {
        const role = await AsyncStorage.getItem("role");
        if (role === "doctor") {
          router.replace("/(doctor)/Home");
        } else {
          router.replace("/(patient)/(tabs)/HomePatient");
        }
      } else {
        router.replace("/(auth)/Login");
      }
    });
    return () => checkLogin();
  }, []);
  const handleRoleSelect = (role: "doctor" | "patient") => {
    if (role === "doctor") {
      Alert.alert(
        "Doctor Login",
        "This section is for verified doctors only. New doctor accounts can only be created by administrators.",
        [
          {
            text: "Continue to Login",
            onPress: () =>
              router.push({
                pathname: "/(auth)/Login",
                params: { role },
              }),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    } else {
      router.push({
        pathname: "/(auth)/Login",
        params: { role },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("./../../assets/img/logo-removebg-preview.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerText}>Welcome to Rengen</Text>
        <Text style={styles.subText}>Please select your role</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.roleButton}
            onPress={() => handleRoleSelect("doctor")}
          >
            <Text style={styles.roleButtonText}>I'm a Doctor</Text>
            <Text style={styles.restrictedText}>(Verified doctors only)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleButton, styles.patientButton]}
            onPress={() => handleRoleSelect("patient")}
          >
            <Text style={styles.roleButtonText}>I'm a Patient</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },
  subText: {
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 40,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  roleButton: {
    backgroundColor: "#3B82F6",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  patientButton: {
    backgroundColor: "#EF4444",
  },
  roleButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  restrictedText: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.8,
    marginTop: 4,
  },
});
