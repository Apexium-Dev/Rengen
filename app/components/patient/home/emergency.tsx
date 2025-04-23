import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from "@expo/vector-icons";
import {router} from "expo-router";

export default function Emergency() {

    const handleButton = () => {
        router.push("../../screens/EmergencyButton")
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handleButton}>
                <Ionicons name="call" size={20} color="white" style={styles.icon} />
                <Text style={styles.buttonText}>Emergency Assistance</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#EF4444',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginRight: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    }
});
