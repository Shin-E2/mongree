export type MongreeThemeScene = "day" | "night" | "rain" | "snow";

export interface MongreeThemeContextValue {
  scene: MongreeThemeScene;
  setScene: (scene: MongreeThemeScene) => void;
}
