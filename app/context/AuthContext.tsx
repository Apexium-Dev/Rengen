import React, { createContext, useState, useEffect } from "react";
import { User } from "../types";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../config/firebase";

type FirestoreUser = Omit<User, "email"> & {
  createdAt: { toDate: () => Date };
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize with test data for development
  const [user, setUser] = useState<User | null>({
    email: "test@example.com",
    name: "John Doe",
    role: "patient",
    photoURL: null,
    createdAt: new Date(),
  });

  useEffect(() => {
    console.log("AuthProvider mounted");

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        console.log("Auth state changed:", firebaseUser?.email);

        if (firebaseUser) {
          // Subscribe to user document changes
          const userDocRef = doc(db, "users", firebaseUser.uid);
          console.log("Fetching user doc for:", firebaseUser.uid);

          const unsubscribeDoc = onSnapshot(
            userDocRef,
            (doc) => {
              console.log("User doc updated:", doc.exists(), doc.data());

              if (doc.exists()) {
                const userData = doc.data() as FirestoreUser;
                setUser({
                  ...userData,
                  email: firebaseUser.email,
                  createdAt: userData.createdAt?.toDate() || new Date(),
                  role: userData.role || "patient",
                });
              } else {
                console.log("No user document found, using default data");
                // If no document exists, create default user data
                setUser({
                  email: firebaseUser.email,
                  name: firebaseUser.displayName || "User",
                  role: "patient",
                  photoURL: firebaseUser.photoURL,
                  createdAt: new Date(),
                });
              }
            },
            (error) => {
              console.error("Error fetching user data:", error);
              // Keep the default data on error
            }
          );

          return () => {
            unsubscribeDoc();
          };
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Log user state changes
  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
