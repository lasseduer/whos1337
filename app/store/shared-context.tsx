"use client"
// SharedContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Store, User } from "./store.model";

// Create the context with an initial value
const SharedContext = createContext<Store | undefined>(undefined);

// Provider component
interface SharedProviderProps {
  children: ReactNode;
}

export const SharedProvider: React.FC<SharedProviderProps> = ({ children }) => {
  // Define initial values for each piece of the store
  const [user, setUser] = useState<User | null>(null);

  const value: Store = {
    user,
    setUser,
  };

  return (
    <SharedContext.Provider value={value}>{children}</SharedContext.Provider>
  );
};

// Custom hook to consume the context
export const useSharedContext = (): Store => {
  const context = useContext(SharedContext);

  if (!context) {
    throw new Error("useSharedContext must be used within a SharedProvider");
  }

  return context;
};
