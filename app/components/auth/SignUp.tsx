import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../Firebase";
import { setDoc, doc } from "firebase/firestore";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    if (!email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Create user with Firebase Authentication
    createUserWithEmailAndPassword(auth, email, password)
      .then(async () => {
        const user = auth.currentUser;
        if (user) {
          // Create user data object to save in Firestore
          const userData = {
            email: user.email,
            role: "patient",
            createdAt: new Date(),
          };

          // Save user data to Firestore
          try {
            await setDoc(doc(db, "users", user.uid), userData);
            console.log("User signed up:", user.email);
          } catch (error) {
            console.error("Error saving user data to Firestore:", error);
            alert("Error creating user record in database.");
          }
        }
        router.push("/(auth)/Login");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.signupText}>Create Your Account</Text>
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
        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/Login")}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  signupText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
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
  signupButton: {
    backgroundColor: "#EF4444",
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    alignItems: "center",
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
