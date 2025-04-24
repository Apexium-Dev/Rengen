import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LocationProvider } from "./context/LocationService";

export default function RootLayout() {
  return (
    <LocationProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaProvider>
      </SafeAreaView>
    </LocationProvider>
  );
}
