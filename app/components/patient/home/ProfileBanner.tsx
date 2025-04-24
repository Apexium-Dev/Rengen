import { View, Image, StyleSheet, Text } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { auth, db } from "../../../../Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useHomeStyle } from "@/app/styles/HomeStyle";
import { HoverEffect } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import Avatar from "../../ui/ProfileAvatar";

export default function ProfileBanner() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const HomeStyle = useHomeStyle();

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
          setName(data.name);
        }
      } catch (error) {
        console.log(error);
      }
    }
    setLoading(false);
  };

  return (
    <View style={HomeStyle.container}>
      <View style={HomeStyle.row}>
        <Avatar seed={name} size={70} />
        <View style={HomeStyle.textContainer}>
          <Text style={HomeStyle.welcomeText}>Welcome, {name}!</Text>
          <Text style={HomeStyle.greetingText}>Good Morning</Text>
        </View>
      </View>
    </View>
  );
}
