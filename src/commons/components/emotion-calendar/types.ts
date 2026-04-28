export interface EmotionCalendarEntry {
  date: string;
  count: number;
  emotion: {
    id: string;
    label: string;
    image: string;
  };
}

export interface EmotionCalendarProps {
  monthLabel: string;
  monthDate: string;
  entries: EmotionCalendarEntry[];
  variant?: "compact" | "full";
  selectedDate?: string | null;
  getDayHref?: (date: string) => string;
}
