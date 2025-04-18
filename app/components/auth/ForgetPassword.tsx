import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { auth as patientAuth } from "../../../Firebase";
import { auth as doctorAuth } from "../../../FireBaseDoctors";
import { sendPasswordResetEmail } from "firebase/auth";
import { router, useLocalSearchParams } from "expo-router";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const { role } = useLocalSearchParams();

  const handleResetPassword = () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Use the appropriate Firebase instance based on role
    const auth = role === "doctor" ? doctorAuth : patientAuth;

    // Firebase password reset logic
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert(
          "Password Reset",
          "Check your email for reset instructions."
        );
      })
      .catch((error) => {
        console.error(error);
        if (role === "doctor") {
          Alert.alert(
            "Error",
            "If you are a verified doctor, please contact the administrator for assistance with password reset."
          );
        } else {
          Alert.alert(
            "Error",
            "There was an issue with resetting your password."
          );
        }
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.headerText}>Forgot Password?</Text>
        {role === "doctor" && (
          <Text style={styles.roleText}>Doctor Account Recovery</Text>
        )}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity
            style={[
              styles.resetButton,
              role === "doctor" ? styles.doctorButton : styles.patientButton,
            ]}
            onPress={handleResetPassword}
          >
            <Text style={styles.resetButtonText}>Reset Password</Text>
          </TouchableOpacity>
          <Text style={styles.orText}>Remember your password?</Text>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(auth)/Login",
                params: { role },
              })
            }
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    color: "#111827",
  },
  roleText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  label: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 6,
    marginTop: 12,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#111",
  },
  resetButton: {
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    alignItems: "center",
  },
  doctorButton: {
    backgroundColor: "#3B82F6",
  },
  patientButton: {
    backgroundColor: "#EF4444",
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  orText: {
    textAlign: "center",
    marginTop: 20,
    color: "#6B7280",
    fontSize: 14,
  },
  loginText: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
