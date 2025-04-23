import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { ProfileStyles } from "@/app/styles/ProfileStyles";

export default function AppSettings() {
  return (
    <View style={ProfileStyles.container}>
      <View style={ProfileStyles.card}>
        <Text style={ProfileStyles.header}>App Settings</Text>

        <TouchableOpacity style={ProfileStyles.item}>
          <View style={ProfileStyles.leftSection}>
            <Ionicons
              name="moon"
              size={20}
              color="#F97316"
              style={ProfileStyles.icon}
            />
            <Text style={ProfileStyles.label}>Dark Mode</Text>
          </View>
          <Entypo name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={ProfileStyles.item}>
          <View style={ProfileStyles.leftSection}>
            <Ionicons
              name="notifications"
              size={20}
              color="#3B82F6"
              style={ProfileStyles.icon}
            />
            <Text style={ProfileStyles.label}>Notifications</Text>
          </View>
          <Entypo name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={ProfileStyles.item}>
          <View style={ProfileStyles.leftSection}>
            <Ionicons
              name="shield-checkmark"
              size={20}
              color="#10B981"
              style={ProfileStyles.icon}
            />
            <Text style={ProfileStyles.label}>Privacy & Security</Text>
          </View>
          <Entypo name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={ProfileStyles.item}>
          <View style={ProfileStyles.leftSection}>
            <Ionicons
              name="language"
              size={20}
              color="#8B5CF6"
              style={ProfileStyles.icon}
            />
            <Text style={ProfileStyles.label}>Language</Text>
          </View>
          <Entypo name="chevron-right" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
