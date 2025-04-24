import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { LocationProvider } from "./context/LocationService";
import { SettingsProvider } from "./context/SettingsContext";
import { ThemeProvider } from "./context/ThemeContext";

export default function RootLayout() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <LocationProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </SafeAreaProvider>
          </SafeAreaView>
        </LocationProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}
