import React, { createContext, useContext, useEffect } from "react";
import { useColorScheme } from "react-native";
import { useSettings } from "./SettingsContext";

type ThemeContextType = {
  isDarkMode: boolean;
  colors: {
    background: string;
    card: string;
    text: string;
    border: string;
    primary: string;
    secondary: string;
    accent: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
};

const lightColors = {
  background: "#F9FAFB",
  card: "#FFFFFF",
  text: "#1F2937",
  border: "#E5E7EB",
  primary: "#3B82F6",
  secondary: "#6B7280",
  accent: "#EF4444",
  error: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
  info: "#3B82F6",
};

const darkColors = {
  background: "#111827",
  card: "#1F2937",
  text: "#F9FAFB",
  border: "#374151",
  primary: "#60A5FA",
  secondary: "#9CA3AF",
  accent: "#F87171",
  error: "#F87171",
  success: "#34D399",
  warning: "#FBBF24",
  info: "#60A5FA",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const { darkMode } = useSettings();

  // Use the user's preference if set, otherwise use system preference
  const isDarkMode =
    darkMode !== undefined ? darkMode : systemColorScheme === "dark";

  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
