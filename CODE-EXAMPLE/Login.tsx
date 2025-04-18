import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { auth as patientAuth } from "../../../Firebase";
import { auth as doctorAuth } from "../../../FireBaseDoctors";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [email, SetEmail] = React.useState("");
  const [password, SetPassword] = React.useState("");
  const { role } = useLocalSearchParams();

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Special case for test account
    if (email !== "test@gmail.com") {
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
    }

    // Use the appropriate Firebase instance based on role
    const auth = role === "doctor" ? doctorAuth : patientAuth;

    signInWithEmailAndPassword(auth, email, password)
      .then(async () => {
        const user = auth.currentUser;
        if (user) {
          await AsyncStorage.setItem(
            "user",
            JSON.stringify({ email: user.email, role })
          );
          alert("Login successful");
          console.log("User logged in:", user.email, "Role:", role);
          router.push({
            pathname: role === "doctor" ? "/(doctor)/Home" : "/(patient)/Home",
            params: { role },
          });
        }
      })
      .catch((error) => {
        if (role === "doctor") {
          alert(
            "Invalid doctor credentials. Please contact administrator if you need access."
          );
        } else {
          alert(error.message);
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.loginText}>Welcome Back 👋</Text>
      <Text style={styles.roleText}>Logging in as: {role}</Text>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={SetEmail}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
          placeholderTextColor="#888"
          value={password}
          onChangeText={SetPassword}
        />
        <TouchableOpacity>
          <Text
            style={styles.forgotPassword}
            onPress={() => router.push("/(auth)/ForgotPassword")}
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.loginButton,
            role === "doctor" ? styles.doctorButton : styles.patientButton,
          ]}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        {role !== "doctor" && (
          <>
            <Text style={styles.orText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(auth)/SignUp",
                  params: { role },
                })
              }
            >
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </>
        )}
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
  forgotPassword: {
    color: "#3B82F6",
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
  doctorButton: {
    backgroundColor: "#3B82F6",
  },
  patientButton: {
    backgroundColor: "#EF4444",
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
    color: "#6B7280",
    fontSize: 14,
  },
  signupText: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});
