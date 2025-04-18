import { View, Image, StyleSheet, Text } from "react-native";
import React from "react";

export default function ProfileBanner() {
  return (
    <View>
      <Image
        style={style.pfp}
        source={require("./../../../assets/images/splash-icon.png")}
      />
      <Text>Welcome, Name!</Text>
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
