import EmotionCalendar from "@/commons/components/emotion-calendar";
import type { HomeCalendarEntry } from "@/app/(dashboard)/home/action";

interface HomeEmotionalCalendarProps {
  monthLabel: string;
  monthDate: string;
  entries: HomeCalendarEntry[];
}

export default function HomeEmotionalCalendar({
  monthLabel,
  monthDate,
  entries,
}: HomeEmotionalCalendarProps) {
  const calendarEntries = entries.map((entry) => ({
    date: entry.date,
    count: entry.count,
    emotion: {
      id: entry.emotionId,
      label: entry.emotionLabel,
      image: entry.emotionImage,
    },
  }));

  return (
    <EmotionCalendar
      monthLabel={monthLabel}
      monthDate={monthDate}
      entries={calendarEntries}
      variant="compact"
    />
  );
}
