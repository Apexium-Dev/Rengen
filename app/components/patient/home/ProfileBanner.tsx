import { View, Image, StyleSheet, Text } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { auth, db } from "../../../../Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useHomeStyle } from "@/app/styles/HomeStyle";
import { HoverEffect } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import Avatar from "../../ui/ProfileAvatar";
import { useTheme } from "@/app/context/ThemeContext";

export default function ProfileBanner() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const HomeStyle = useHomeStyle();
  const { colors } = useTheme();

  useFocusEffect(
    useCallback(() => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        loadUserProfle();
      } else {
        setLoading(false);
      }
    }, [])
  );

  const loadUserProfle = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || user.displayName || "User");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setName(user.displayName || "User");
      }
    }
    setLoading(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (loading) {
    return (
      <View style={HomeStyle.container}>
        <View style={HomeStyle.row}>
          <Avatar seed="loading" size={70} />
          <View style={HomeStyle.textContainer}>
            <Text style={HomeStyle.welcomeText}>Loading...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[HomeStyle.container, { backgroundColor: colors.card }]}>
      <View style={HomeStyle.row}>
        <Avatar seed={name} size={70} />
        <View style={HomeStyle.textContainer}>
          <Text style={[HomeStyle.welcomeText, { color: colors.text }]}>
            Welcome, {name}!
          </Text>
          <Text style={[HomeStyle.greetingText, { color: colors.secondary }]}>
            {getGreeting()}
          </Text>
        </View>
      </View>
    </View>
  );
}
