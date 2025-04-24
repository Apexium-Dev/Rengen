import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SettingsContextType = {
  darkMode: boolean;
  notifications: boolean;
  toggleDarkMode: () => Promise<void>;
  toggleNotifications: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    // Load saved settings from AsyncStorage
    const loadSettings = async () => {
      try {
        const darkModeValue = await AsyncStorage.getItem("darkMode");
        const notificationsValue = await AsyncStorage.getItem("notifications");

        if (darkModeValue !== null) {
          setDarkMode(darkModeValue === "true");
        }

        if (notificationsValue !== null) {
          setNotifications(notificationsValue === "true");
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadSettings();
  }, []);

  const toggleDarkMode = async () => {
    try {
      const newValue = !darkMode;
      setDarkMode(newValue);
      await AsyncStorage.setItem("darkMode", newValue.toString());
    } catch (error) {
      console.error("Error saving dark mode setting:", error);
    }
  };

  const toggleNotifications = async () => {
    try {
      const newValue = !notifications;
      setNotifications(newValue);
      await AsyncStorage.setItem("notifications", newValue.toString());
    } catch (error) {
      console.error("Error saving notifications setting:", error);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        darkMode,
        notifications,
        toggleDarkMode,
        toggleNotifications,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
