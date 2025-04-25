export interface EnvironmentalData {
  aqi: number;
  temperature: number;
  humidity: number;
  timestamp: Date;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface User {
  email: string | null;
  role: string;
  name?: string;
  displayName?: string;
  photoURL: string | null;
  phone?: string;
  bloodType?: string;
  allergies?: string;
  medications?: string;
  medicalConditions?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface EmergencyNumbers {
  general: string;
  ambulance?: string;
  police?: string;
  fire?: string;
}
