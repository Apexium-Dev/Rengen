import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function _layout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="RoleSelection" options={{ headerShown: false }} />
        <Stack.Screen name="Login" options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
