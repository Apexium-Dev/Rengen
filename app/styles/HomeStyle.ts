import { StyleSheet } from "react-native";

export const HomeStyle = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  pfp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  textContainer: {
    justifyContent: "center",
    marginLeft: 15,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  greetingText: {
    fontSize: 14,
    color: "#6B7280",
  },
});
