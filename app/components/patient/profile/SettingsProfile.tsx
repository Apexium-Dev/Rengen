import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { auth, db } from "../../../../Firebase";
import { router } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { ProfileStyles } from "@/app/styles/ProfileStyles";
import {useFocusEffect} from "@react-navigation/native";

export default function SettingsProfile() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useFocusEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setEmail(currentUser.email || "");
      loadUserProfile();
    } else {
      setLoading(false);
    }
  });

  const loadUserProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || user.displayName || "Test");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    }
    setLoading(false);
  };

  const handleEditPage = (): void => {
    router.push("/(patient)/EditProfile");
  };

  return (
    <View style={ProfileStyles.container}>
      <View style={ProfileStyles.card}>
        <Image
          source={require("../../../../assets/images/react-logo.png")}
          style={ProfileStyles.avatar}
        />
        <Text style={ProfileStyles.name}>{name}</Text>
        <Text style={ProfileStyles.email}>{email}</Text>

        <TouchableOpacity
          style={ProfileStyles.editButton}
          onPress={handleEditPage}
        >
          <Text style={ProfileStyles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
