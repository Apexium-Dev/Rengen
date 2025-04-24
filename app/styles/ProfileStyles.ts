import { StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export const useProfileStyles = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      paddingTop: 20,
      alignItems: "center",
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      width: "90%",
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      alignItems: "center",
    },
    header: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 24,
      color: colors.text,
      alignSelf: "center",
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.card,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 12,
      width: "100%",
    },
    leftSection: {
      flexDirection: "row",
      alignItems: "center",
    },
    icon: {
      marginRight: 12,
    },
    label: {
      fontSize: 16,
      color: colors.text,
    },
    value: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    editText: {
      color: "#FFFFFF",
      fontWeight: "600",
      fontSize: 14,
    },
    editButton: {
      marginTop: 24,
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    email: {
      fontSize: 14,
      color: colors.secondary,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 16,
    },
    name: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 4,
      color: colors.text,
    },
  });
};
