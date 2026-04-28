"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { MongreeThemeContextValue, MongreeThemeScene } from "./theme.types";

const MongreeThemeContext = createContext<MongreeThemeContextValue | null>(null);

function getDefaultScene(): MongreeThemeScene {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? "day" : "night";
}

interface MongreeThemeProviderProps {
  children: ReactNode;
  initialScene?: MongreeThemeScene;
}

export function MongreeThemeProvider({
  children,
  initialScene,
}: MongreeThemeProviderProps) {
  const [scene, setScene] = useState<MongreeThemeScene>(
    initialScene ?? "day"
  );

  useEffect(() => {
    if (!initialScene) {
      setScene(getDefaultScene());
    }
  }, [initialScene]);

  useEffect(() => {
    document.documentElement.dataset.themeScene = scene;
  }, [scene]);

  const value = useMemo(
    () => ({
      scene,
      setScene,
    }),
    [scene]
  );

  return (
    <MongreeThemeContext.Provider value={value}>
      {children}
    </MongreeThemeContext.Provider>
  );
}

export function useMongreeTheme() {
  const context = useContext(MongreeThemeContext);

  if (!context) {
    throw new Error("useMongreeTheme must be used inside MongreeThemeProvider");
  }

  return context;
}
