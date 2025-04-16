import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../Firebase";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { role } = useLocalSearchParams();

  // Prevent doctor registration through the app
  useEffect(() => {
    if (role === "doctor") {
      Alert.alert(
        "Restricted Access",
        "Doctor accounts can only be created by administrators. Please contact support for more information.",
        [
          {
            text: "Go Back",
            onPress: () => router.push("/(auth)/RoleSelection"),
          },
        ]
      );
    }
  }, [role]);

  const handleSignUp = () => {
    // Prevent doctor registration
    if (role === "doctor") {
      Alert.alert(
        "Restricted Access",
        "Doctor accounts can only be created by administrators. Please contact support for more information."
      );
      return;
    }

    if (!email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    if (password.length > 20) {
      alert("Password must not exceed 20 characters");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      alert("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[a-z]/.test(password)) {
      alert("Password must contain at least one lowercase letter");
      return;
    }
    if (!/[0-9]/.test(password)) {
      alert("Password must contain at least one number");
      return;
    }
    if (!/[!@#$%^&*,.]/.test(password)) {
      alert("Password must contain at least one special character");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        const user = auth.currentUser;
        if (user) {
          console.log("User signed up:", user.email, "Role:", role);
        }
        router.push({
          pathname: "/(auth)/Login",
          params: { role: "patient" },
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  // If it's a doctor trying to register, don't show the form
  if (role === "doctor") {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.signupText}>Create Your Patient Account</Text>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
        />
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          secureTextEntry
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          style={[styles.signupButton, styles.patientButton]}
          onPress={handleSignUp}
        >
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>Already have an account? </Text>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(auth)/Login",
              params: { role: "patient" },
            })
          }
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "center",
  },
  signupText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  roleText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    textTransform: "capitalize",
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
  signupButton: {
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    alignItems: "center",
  },
  patientButton: {
    backgroundColor: "#EF4444",
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  orText: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
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
