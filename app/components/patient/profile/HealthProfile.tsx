import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { auth, db } from "../../../../Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { useProfileStyles } from "@/app/styles/ProfileStyles";
import { router } from "expo-router";
import { useTheme } from "@/app/context/ThemeContext";

export default function HealthProfile() {
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medications, setMedications] = useState("");
  const [loading, setLoading] = useState(true);
  const ProfileStyles = useProfileStyles();
  const { colors } = useTheme();

  useFocusEffect(
    useCallback(() => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        loadUserProfile();
      } else {
        setLoading(false);
      }
    }, [])
  );

  const loadUserProfile = async () => {
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
        console.log("Error loading profile:", error);
      }
    }
    setLoading(false);
  };

  const navigateToEditHealth = () => {
    router.push("/(patient)/EditHealthProfile");
  };

  return (
    <View style={ProfileStyles.container}>
      <View style={[ProfileStyles.card, { backgroundColor: colors.card }]}>
        <Text style={[ProfileStyles.header, { color: colors.text }]}>
          Health Profile
        </Text>

        <TouchableOpacity
          style={ProfileStyles.item}
          onPress={navigateToEditHealth}
        >
          <View style={ProfileStyles.leftSection}>
            <Ionicons
              name="heart"
              size={20}
              color={colors.error}
              style={ProfileStyles.icon}
            />
            <Text style={[ProfileStyles.label, { color: colors.text }]}>
              Blood Type
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[ProfileStyles.value, { color: colors.text }]}>
              {bloodType || "Not set"}
            </Text>
            <Entypo
              name="chevron-right"
              size={20}
              color={colors.secondary}
              style={{ marginLeft: 8 }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={ProfileStyles.item}
          onPress={navigateToEditHealth}
        >
          <View style={ProfileStyles.leftSection}>
            <Ionicons
              name="medkit"
              size={20}
              color={colors.accent}
              style={ProfileStyles.icon}
            />
            <Text style={[ProfileStyles.label, { color: colors.text }]}>
              Allergies
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[ProfileStyles.value, { color: colors.text }]}>
              {allergies ? "Set" : "Not set"}
            </Text>
            <Entypo
              name="chevron-right"
              size={20}
              color={colors.secondary}
              style={{ marginLeft: 8 }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={ProfileStyles.item}
          onPress={navigateToEditHealth}
        >
          <View style={ProfileStyles.leftSection}>
            <Ionicons
              name="bandage"
              size={20}
              color={colors.error}
              style={ProfileStyles.icon}
            />
            <Text style={[ProfileStyles.label, { color: colors.text }]}>
              Medications
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[ProfileStyles.value, { color: colors.text }]}>
              {medications ? "Set" : "Not set"}
            </Text>
            <Entypo
              name="chevron-right"
              size={20}
              color={colors.secondary}
              style={{ marginLeft: 8 }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
