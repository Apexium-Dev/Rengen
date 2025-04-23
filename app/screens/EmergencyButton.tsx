import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { auth, db } from "@/Firebase";
import { doc, getDoc } from "firebase/firestore";

const { width } = Dimensions.get('window');
const BUTTON_SIZE = width - 200;

export default function EmergencyButton() {
    const animation = useRef(new Animated.Value(0)).current;
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [bloodType, setBloodType] = useState("");
    const [medConditional, setMedConditional] = useState("test");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }

                let loc = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Highest,
                });

                setLocation(loc.coords);

                let addr = await Location.reverseGeocodeAsync(loc.coords);
                if (addr.length > 0) {
                    const { street, name, city, region } = addr[0];
                    setAddress(`${street || name}, ${city}, ${region}`);
                }
            } catch (err) {
                console.log("Error getting location:", err);
                setErrorMsg("Failed to get location.");
            }

            loadUserProfil();
        };

        fetchData();
    }, []);

    const loadUserProfil = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setName(data.name);
                    setBloodType(data.bloodType);
                }
            } catch (error) {
                console.log(error);
            }
            setLoading(false)
        }
    }

    const backgroundColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['#DF4141', '#FF6B6B'],
    });

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Animated.View style={[styles.bigButton, { backgroundColor }]}>
                <TouchableOpacity style={styles.content}>
                    <Ionicons name="call" size={28} color="white" />
                    <Text style={styles.text}>Emergency</Text>
                    <Text style={styles.subtext}>Tap to call</Text>
                </TouchableOpacity>
            </Animated.View>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View style={styles.card}>
                    <Text style={styles.header}>Emergency Profile</Text>
                    <Text style={styles.label}>Name: <Text style={styles.value}>{name}</Text></Text>
                    <Text style={styles.label}>Blood Type: <Text style={styles.value}>{bloodType}</Text></Text>
                    <Text style={styles.label}>Medical Condition: <Text style={styles.value}>{medConditional}</Text></Text>
                </View>
            )}

            <View style={styles.card}>
                <Text style={styles.header}>Current Location</Text>
                {errorMsg && <Text style={styles.label}>Error: {errorMsg}</Text>}
                {address ? (
                    <Text style={styles.value}>{address}</Text>
                ) : (
                    <Text style={styles.label}>Fetching address...</Text>
                )}
                {location && (
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        }}
                    >
                        <Marker coordinate={location} />
                    </MapView>
                )}
            </View>

            <View style={styles.card}>
                <Text style={styles.header}>Emergency Numbers</Text>
                <Text style={styles.label}>Ambulance: <Text style={styles.value}>194</Text></Text>
                <Text style={styles.label}>Local Hospital: <Text style={styles.value}>+389 2 3147 147</Text></Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        backgroundColor: "#F2F2F2",
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    bigButton: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_SIZE / 2,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 30,
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 5,
    },
    subtext: {
        color: 'white',
        fontSize: 14,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#1F2937",
    },
    label: {
        fontSize: 16,
        color: "#374151",
        marginBottom: 8,
    },
    value: {
        fontWeight: "600",
        color: "#1F2937",
    },
    map: {
        marginTop: 20,
        width: "100%",
        height: 200,
        borderRadius: 16,
        marginBottom: 20,
    },
});
