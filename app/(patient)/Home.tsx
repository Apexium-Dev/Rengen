import { View, Text, ScrollView } from "react-native";
import React from "react";
import ProfileBanner from "./components/ProfileBanner";

export default function Home() {
  return (
    <ScrollView>
      <View className="flex-1 bg-white">
        <ProfileBanner />
      </View>
    </ScrollView>
  );
}
