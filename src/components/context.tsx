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

export interface IStoryEntry {
  role: string;
  content: string;
}

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
  story: IStoryEntry[];
  setStory: Dispatch<SetStateAction<IStoryEntry[]>>;
}

const MainContext = createContext<MainContextType | undefined>(undefined);

function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
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
  const [story, setStory] = useLocalStorage<IStoryEntry[]>("dnd_story", []);

  return (
    <MainContext.Provider
      value={{
        campaign,
        setCampaign,
        characters,
        setCharacters,
        story,
        setStory,
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