import {View, Text, ScrollView} from "react-native";
import React from "react";
import ProfileBanner from "../../components/patient/home/ProfileBanner";
import Emergency from "@/app/components/patient/home/emergency";

export default function Home() {
    return (
        <ScrollView>
            <View className="flex-1 bg-white">
                <ProfileBanner/>
                <Emergency/>
            </View>
        </ScrollView>
    );
}
