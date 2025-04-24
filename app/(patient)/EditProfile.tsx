import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { auth } from "../../Firebase";
import { db } from "../../Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import Avatar from "../components/ui/ProfileAvatar";
import { useTheme } from "@/app/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function EditProfile() {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || "");
          setPhone(data.phone || "");
          setBloodType(data.bloodType || "");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    }
    setLoading(false);
  };

  const handleUpdateProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        name,
        phone,
        bloodType,
        updatedAt: new Date(),
      });
      setBloodType(bloodType);
      alert("Profile updated successfully");
      loadUserProfile();
      router.back();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View
        style={[
          styles.header,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
      </View>

      <View style={styles.imageContainer}>
        <Avatar seed={name} size={120} />
      </View>

      <View style={styles.form}>
        <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          value={name}
          onChangeText={setName}
          placeholder="Enter your full name"
          placeholderTextColor={colors.secondary}
        />

        <Text style={[styles.label, { color: colors.text }]}>Phone Number</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter your phone number"
          placeholderTextColor={colors.secondary}
          keyboardType="phone-pad"
        />

        <Text style={[styles.label, { color: colors.text }]}>Blood Type</Text>
        <View
          style={[
            styles.pickerContainer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Picker
            selectedValue={bloodType}
            onValueChange={(itemValue) => setBloodType(itemValue)}
            style={[styles.picker, { color: colors.text }]}
            dropdownIconColor={colors.text}
          >
            <Picker.Item
              label="Select your blood type"
              value=""
              color={colors.secondary}
            />
            <Picker.Item label="A+" value="A+" color={colors.text} />
            <Picker.Item label="A-" value="A-" color={colors.text} />
            <Picker.Item label="B+" value="B+" color={colors.text} />
            <Picker.Item label="B-" value="B-" color={colors.text} />
            <Picker.Item label="AB+" value="AB+" color={colors.text} />
            <Picker.Item label="AB-" value="AB-" color={colors.text} />
            <Picker.Item label="O+" value="O+" color={colors.text} />
            <Picker.Item label="O-" value="O-" color={colors.text} />
          </Picker>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleUpdateProfile}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  picker: {
    marginHorizontal: -8,
  },
  header: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  imageContainer: {
    alignItems: "center",
    padding: 20,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
