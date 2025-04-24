import React, { useState } from "react";
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
import { router } from "expo-router";
import { auth } from "../../../Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../Firebase";
import { useTheme } from "@/app/context/ThemeContext";

export default function LoginExample() {
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const { colors } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await AsyncStorage.setItem("user", JSON.stringify(userCredential.user));
      router.replace("/(patient)/(tabs)/HomePatient");
    } catch (error: any) {
      let errorMessage = "An error occurred during login";
      if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      }
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.loginText, { color: colors.text }]}>
        Welcome Back 👋
      </Text>
      <View style={[styles.formContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.label, { color: colors.text }]}>Email</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Enter your email"
          placeholderTextColor={colors.secondary}
          value={email}
          onChangeText={SetEmail}
        />
        <Text style={[styles.label, { color: colors.text }]}>Password</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Enter your password"
          secureTextEntry
          placeholderTextColor={colors.secondary}
          value={password}
          onChangeText={SetPassword}
        />
        <TouchableOpacity>
          <Text
            style={[styles.forgotPassword, { color: colors.primary }]}
            onPress={() => router.push("/(auth)/ForgotPassword")}
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: colors.accent }]}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <Text style={[styles.orText, { color: colors.secondary }]}>
          Don't have an account?{" "}
        </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/SignUp")}>
          <Text style={[styles.signupText, { color: colors.primary }]}>
            Sign Up
          </Text>
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
  loginText: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  formContainer: {
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
    marginBottom: 6,
    marginTop: 12,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  forgotPassword: {
    textAlign: "right",
    marginTop: 8,
    fontSize: 14,
  },
  loginButton: {
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  orText: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
    fontSize: 14,
  },
  signupText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
