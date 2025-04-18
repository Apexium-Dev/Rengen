import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import React from "react";
import Login from "../components/auth/Login";

export default function index() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.view}>
        <Image
          source={require("./../../assets/img/logo-removebg-preview.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.text}>Your Personal health companion</Text>
        <Login />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  view: {
    marginTop: 50,
    width: "100%",
  },
  container: {
    minHeight: Dimensions.get("window").height,
    flexGrow: 1,
  },
  loginContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  logo: {
    width: 300,
    height: 50,
    alignSelf: "center",
  },
  text: {
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
});
