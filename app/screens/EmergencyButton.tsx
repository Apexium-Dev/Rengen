import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Linking,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { auth, db } from "@/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { LocationContext } from "../context/LocationService";
import { useTheme } from "../context/ThemeContext";
import { router } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import emergencyData from "../../data/phones.json";

const { width } = Dimensions.get("window");
const BUTTON_SIZE = width - 100;

interface EmergencyNumbers {
  general?: string;
  police?: string;
  ambulance?: string;
  fire?: string;
}

interface CountryEmergencyData {
  country: string;
  iso_code: string;
  country_code: string;
  emergency_numbers: EmergencyNumbers;
}

export default function EmergencyButton() {
  const { colors } = useTheme();
  const { location, address } = useContext(LocationContext);
  const [name, setName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [loading, setLoading] = useState(true);
  const [countryCode, setCountryCode] = useState("");
  const [emergencyNumbers, setEmergencyNumbers] = useState<EmergencyNumbers>({
    general: "112",
    ambulance: "112",
  });

  useEffect(() => {
    loadUserProfile();
    if (location) {
      getCountryFromCoordinates();
    }
  }, [location]);

  const loadUserProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || "");
          setBloodType(data.bloodType || "");
          setAllergies(data.allergies || "");
          setMedicalConditions(data.medicalConditions || "");
        }
      } catch (error) {
        console.log("Error loading user profile:", error);
      }
      setLoading(false);
    }
  };

  const getCountryFromCoordinates = async () => {
    if (!location) return;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=YOUR_GOOGLE_API_KEY`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        const country = addressComponents.find(
          (component: { types: string[] }) =>
            component.types.includes("country")
        );

        if (country) {
          const code = country.short_name;
          setCountryCode(code);

          // Find emergency numbers for the country
          const countryData = emergencyData.emergency_numbers.find(
            (item: CountryEmergencyData) => item.iso_code === code
          );

          if (countryData) {
            setEmergencyNumbers(countryData.emergency_numbers);
          }
        }
      }
    } catch (error) {
      console.log("Error getting country:", error);
    }
  };

  const handleEmergencyCall = () => {
    const number =
      emergencyNumbers.general || emergencyNumbers.ambulance || "112";
    Linking.openURL(`tel:${number}`);
  };

  const navigateToEditProfile = () => {
    router.push("/(patient)/EditHealthProfile");
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: colors.text }]}>
          Emergency
        </Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.emergencyButton, { backgroundColor: colors.error }]}
        onPress={handleEmergencyCall}
      >
        <Ionicons name="call" size={40} color="white" />
        <Text style={styles.emergencyText}>EMERGENCY</Text>
        <Text style={styles.tapText}>Tap to Call Help</Text>
      </TouchableOpacity>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Emergency Profile
          </Text>
          <TouchableOpacity onPress={navigateToEditProfile}>
            <Text style={[styles.editButton, { color: colors.primary }]}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileItem}>
          <Text style={[styles.label, { color: colors.secondary }]}>Name</Text>
          <Text style={[styles.value, { color: colors.text }]}>{name}</Text>
        </View>

        <View style={styles.profileItem}>
          <Text style={[styles.label, { color: colors.secondary }]}>
            Blood Type
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {bloodType || "Not set"}
          </Text>
        </View>

        <View style={styles.profileItem}>
          <Text style={[styles.label, { color: colors.secondary }]}>
            Allergies
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {allergies || "None"}
          </Text>
        </View>

        <View style={styles.profileItem}>
          <Text style={[styles.label, { color: colors.secondary }]}>
            Medical Conditions
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {medicalConditions || "None"}
          </Text>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Current Location
          </Text>
          <View style={styles.activeStatus}>
            <View style={styles.activeDot} />
            <Text style={[styles.activeText, { color: colors.success }]}>
              Active
            </Text>
          </View>
        </View>

        <Text style={[styles.address, { color: colors.text }]}>
          {address || "Loading address..."}
        </Text>

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
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Your Location"
            />
          </MapView>
        )}
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Emergency Numbers
        </Text>

        <TouchableOpacity
          style={styles.emergencyNumber}
          onPress={() => {
            const number =
              emergencyNumbers.general || emergencyNumbers.ambulance || "112";
            Linking.openURL(`tel:${number}`);
          }}
        >
          <View style={styles.numberIcon}>
            <Ionicons name="medical" size={24} color={colors.error} />
          </View>
          <View style={styles.numberInfo}>
            <Text style={[styles.numberLabel, { color: colors.text }]}>
              Ambulance
            </Text>
            <Text style={[styles.numberValue, { color: colors.text }]}>
              {emergencyNumbers.general || emergencyNumbers.ambulance || "112"}
            </Text>
          </View>
        </TouchableOpacity>

        {emergencyNumbers.police && (
          <TouchableOpacity
            style={styles.emergencyNumber}
            onPress={() => Linking.openURL(`tel:${emergencyNumbers.police}`)}
          >
            <View style={styles.numberIcon}>
              <Ionicons name="shield" size={24} color={colors.primary} />
            </View>
            <View style={styles.numberInfo}>
              <Text style={[styles.numberLabel, { color: colors.text }]}>
                Police
              </Text>
              <Text style={[styles.numberValue, { color: colors.text }]}>
                {emergencyNumbers.police}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {emergencyNumbers.fire && (
          <TouchableOpacity
            style={styles.emergencyNumber}
            onPress={() => Linking.openURL(`tel:${emergencyNumbers.fire}`)}
          >
            <View style={styles.numberIcon}>
              <Ionicons name="flame" size={24} color={colors.error} />
            </View>
            <View style={styles.numberInfo}>
              <Text style={[styles.numberLabel, { color: colors.text }]}>
                Fire Department
              </Text>
              <Text style={[styles.numberValue, { color: colors.text }]}>
                {emergencyNumbers.fire}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
  },
  emergencyButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  emergencyText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  tapText: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  editButton: {
    fontSize: 16,
  },
  profileItem: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
  activeStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginRight: 6,
  },
  activeText: {
    fontSize: 14,
  },
  address: {
    fontSize: 16,
    marginBottom: 12,
  },
  map: {
    height: 200,
    borderRadius: 12,
    marginTop: 12,
  },
  emergencyNumber: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  numberIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  numberInfo: {
    flex: 1,
  },
  numberLabel: {
    fontSize: 14,
  },
  numberValue: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 2,
  },
});
