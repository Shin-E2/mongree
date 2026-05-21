export type MongreeThemeScene = "day" | "night" | "rain" | "snow";

export interface MongreeThemeContextValue {
  scene: MongreeThemeScene;
  setScene: (scene: MongreeThemeScene) => void;
}

export type MongiEmotion = "happy" | "excited" | "calm" | "sad" | "tired";
