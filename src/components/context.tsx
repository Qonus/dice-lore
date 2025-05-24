"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

export interface ICharacter {
  id: number;
  name: string;
  description: string;
  abilities: string;
  equipment: string;
}

interface MainContextType {
  campaign: string;
  setCampaign: Dispatch<SetStateAction<string>>;
  characters: ICharacter[];
  setCharacters: Dispatch<SetStateAction<ICharacter[]>>;
}

const MainContext = createContext<MainContextType | undefined>(undefined);

function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  // Use a function for initial state to avoid localStorage access on every render
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      // Return initial value if not in a browser environment
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // useEffect to update localStorage when the state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(`Error writing localStorage key "${key}":`, error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export function MainProvider({ children }: { children: ReactNode }) {
  const [campaign, setCampaign] = useLocalStorage<string>("dnd_campaign", "");
  const [characters, setCharacters] = useLocalStorage<ICharacter[]>("dnd_characters", []);

  return (
    <MainContext.Provider
      value={{
        campaign,
        setCampaign,
        characters,
        setCharacters,
      }}
    >
      {children}
    </MainContext.Provider>
  );
}

export function useMainContext() {
  const context = useContext(MainContext);
  if (context === undefined) {
    throw new Error("useMainContext must be used within a MainProvider");
  }
  return context;
}