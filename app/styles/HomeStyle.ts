import { StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export const useHomeStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: colors.background,
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
      color: colors.text,
    },
    greetingText: {
      fontSize: 14,
      color: colors.secondary,
    },
  });
};
