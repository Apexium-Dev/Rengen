import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { auth, db } from "../../../../Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { ProfileStyles } from "../../../styles/ProfileStyles";

export default function HealthProfile() {
  const [blood, setBlood] = useState("");
  const [loading, setLoading] = useState(true);
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
          setBlood(data.bloodType || "");
        }
      } catch (error) {
        console.log("Error loading profile:", error);
      }
    }
    setLoading(false);
  };
  return (
    <View style={ProfileStyles.container}>
      <View style={ProfileStyles.card}>
        <Text style={ProfileStyles.header}>Health Profile</Text>

        <TouchableOpacity style={ProfileStyles.item} disabled>
          <View style={ProfileStyles.leftSection}>
            <Ionicons
              name="heart"
              size={20}
              color="red"
              style={ProfileStyles.icon}
            />
            <Text style={ProfileStyles.label}>Blood Type</Text>
          </View>
          <Text style={ProfileStyles.value}>{blood}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={ProfileStyles.item}>
          <View style={ProfileStyles.leftSection}>
            <Ionicons
              name="medkit"
              size={20}
              color="#F97316"
              style={ProfileStyles.icon}
            />
            <Text style={ProfileStyles.label}>Allergies</Text>
          </View>
          <Entypo name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={ProfileStyles.item}>
          <View style={ProfileStyles.leftSection}>
            <Ionicons
              name="bandage"
              size={20}
              color="red"
              style={ProfileStyles.icon}
            />
            <Text style={ProfileStyles.label}>Medications</Text>
          </View>
          <Entypo name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
