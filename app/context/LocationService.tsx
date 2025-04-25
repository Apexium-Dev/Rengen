import React, { createContext, useState, useEffect } from "react";
import * as Location from "expo-location";

type LocationData = {
  location: Location.LocationObjectCoords | null;
  address: string | null;
  errorMsg: string | null;
};

export const LocationContext = createContext<LocationData>({
  location: null,
  address: null,
  errorMsg: null,
});

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
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
    };

    fetchLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, address, errorMsg }}>
      {children}
    </LocationContext.Provider>
  );
}

export default LocationProvider;
