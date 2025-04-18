import { View, Image, StyleSheet, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../../Firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProfileBanner() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setName(currentUser.displayName || "");
      loadUserProfle();
    } else {
      setLoading(false);
    }
  }, []);

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
    <View>
      <Image
        style={style.pfp}
        source={require("./../../../assets/images/splash-icon.png")}
      />
      <Text>Welcome, {name}!</Text>
      <Text>Good Morning</Text>
    </View>
  );
}

const style = StyleSheet.create({
  pfp: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    borderRadius: 50,
  },
});
