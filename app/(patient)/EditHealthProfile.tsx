import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { auth, db } from "../../Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useTheme } from "@/app/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function EditHealthProfile() {
  const { colors } = useTheme();
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medications, setMedications] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserHealthProfile();
  }, []);

  const loadUserHealthProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setBloodType(data.bloodType || "");
          setAllergies(data.allergies || "");
          setMedications(data.medications || "");
        }
      } catch (error) {
        console.error("Error loading health profile:", error);
        Alert.alert("Error", "Failed to load health information");
      }
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "You must be logged in to save changes");
      return;
    }

    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        bloodType,
        allergies,
        medications,
        updatedAt: new Date(),
      });
      Alert.alert("Success", "Health information updated successfully");
      router.back();
    } catch (error) {
      console.error("Error updating health profile:", error);
      Alert.alert("Error", "Failed to update health information");
    } finally {
      setSaving(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    header: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: colors.text,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: colors.text,
    },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      color: colors.text,
    },
    multilineInput: {
      height: 100,
      textAlignVertical: "top",
    },
    saveButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 20,
    },
    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    cancelButton: {
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cancelButtonText: {
      color: colors.text,
      fontSize: 16,
    },
  });

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 16,
            color: colors.text,
          }}
        >
          Edit Health Profile
        </Text>
      </View>

      <Text style={styles.label}>Blood Type</Text>
      <TextInput
        style={styles.input}
        value={bloodType}
        onChangeText={setBloodType}
        placeholder="Enter your blood type (e.g., A+, B-, O+)"
        placeholderTextColor={colors.secondary}
      />

      <Text style={styles.label}>Allergies</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={allergies}
        onChangeText={setAllergies}
        placeholder="List your allergies (e.g., peanuts, penicillin)"
        placeholderTextColor={colors.secondary}
        multiline
      />

      <Text style={styles.label}>Medications</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={medications}
        onChangeText={setMedications}
        placeholder="List your current medications"
        placeholderTextColor={colors.secondary}
        multiline
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.saveButtonText}>Save Changes</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
