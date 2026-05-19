export interface AiReportDiaryForGeneration {
  title: string;
  content: string;
  created_at: string | null;
  diary_emotions:
    | {
        emotions: { label: string } | null;
      }[]
    | null;
}

export interface AiGeneratedReport {
  summary: string;
  dominantEmotions: string[];
  gentleInsight: string;
  recommendations: string[];
  source: "openai" | "local";
}

export interface AiReport extends AiGeneratedReport {
  month: string;
}

export interface StoredAiReportRow {
  month?: string;
  summary: string;
  dominant_emotions: string[] | null;
  gentle_insight: string;
  recommendations: string[] | null;
  source: string;
}

export const AI_FREE_MONTHLY_LIMIT = 1;
export const AI_PAID_MONTHLY_LIMIT = 20;
export const monthPattern = /^\d{4}-\d{2}$/;

export const reportSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string" },
    dominantEmotions: {
      type: "array",
      items: { type: "string" },
    },
    gentleInsight: { type: "string" },
    recommendations: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["summary", "dominantEmotions", "gentleInsight", "recommendations"],
};

export function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getValidMonth(year?: string, month?: string) {
  const now = new Date();
  const parsedYear = Number(year);
  const parsedMonth = Number(month);

  if (
    Number.isInteger(parsedYear) &&
    Number.isInteger(parsedMonth) &&
    parsedYear >= 2000 &&
    parsedYear <= 2100 &&
    parsedMonth >= 1 &&
    parsedMonth <= 12
  ) {
    return { year: parsedYear, month: parsedMonth };
  }

  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function getMonthRange(month: string) {
  const [year, monthIndex] = month.split("-").map(Number);
  const start = new Date(Date.UTC(year, monthIndex - 1, 1));
  const end = new Date(Date.UTC(year, monthIndex, 1));

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export function parseMonthFromRequest(request: Request) {
  const url = new URL(request.url);
  const month = url.searchParams.get("month") ?? currentMonth();
  return monthPattern.test(month) ? month : null;
}

export function serializeStoredReport(row: StoredAiReportRow): AiReport {
  return {
    month: row.month ?? currentMonth(),
    summary: row.summary,
    dominantEmotions: row.dominant_emotions ?? [],
    gentleInsight: row.gentle_insight,
    recommendations: row.recommendations ?? [],
    source: row.source === "openai" ? "openai" : "local",
  };
}

export function buildLocalReport(
  month: string,
  diaries: AiReportDiaryForGeneration[]
): AiReport {
  const emotionCounts = new Map<string, number>();

  for (const diary of diaries) {
    for (const item of diary.diary_emotions ?? []) {
      const label = item.emotions?.label;
      if (label) emotionCounts.set(label, (emotionCounts.get(label) ?? 0) + 1);
    }
  }

  const dominantEmotions = [...emotionCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([label]) => label);

  if (diaries.length === 0) {
    return {
      month,
      summary: "아직 분석할 일기가 없습니다.",
      dominantEmotions: [],
      gentleInsight:
        "짧은 문장 하나라도 남기면 다음 리포트에서 감정 흐름을 더 구체적으로 정리할 수 있습니다.",
      recommendations: [
        "오늘의 감정 하나를 골라 짧게 기록해보세요.",
        "장소, 사람, 사건처럼 감정에 영향을 준 단서를 함께 남겨보세요.",
      ],
      source: "local",
    };
  }

  return {
    month,
    summary: `${month}에는 ${diaries.length}개의 일기를 바탕으로 감정 흐름을 정리했습니다.`,
    dominantEmotions,
    gentleInsight:
      dominantEmotions.length > 0
        ? `${dominantEmotions[0]} 감정이 가장 자주 나타났습니다. 반복되는 상황과 함께 보면 다음 선택을 더 부드럽게 정리할 수 있습니다.`
        : "감정 선택이 적어 정량 흐름은 약하지만, 기록 자체가 다음 분석의 좋은 출발점입니다.",
    recommendations: [
      "가장 자주 나온 감정을 만든 상황을 한 줄로 정리해보세요.",
      "다음 일기에는 감정의 강도와 몸 상태를 함께 적어보세요.",
      "좋았던 시간도 같은 비중으로 남겨 균형 있게 돌아보세요.",
    ],
    source: "local",
  };
}

export async function buildOpenAiReport(
  month: string,
  diaries: AiReportDiaryForGeneration[]
) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || diaries.length === 0) return null;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "너는 감정 일기 월간 리포트를 작성하는 한국어 제품 분석가다. 진단이나 치료 표현을 피하고, 사용자가 자신의 패턴을 부드럽게 돌아볼 수 있도록 짧고 구체적으로 쓴다. JSON 스키마에 맞춰 응답한다.",
        },
        {
          role: "user",
          content: JSON.stringify({
            month,
            diaries: diaries.map((diary) => ({
              title: diary.title,
              content: diary.content.slice(0, 700),
              createdAt: diary.created_at,
              emotions:
                diary.diary_emotions
                  ?.map((item) => item.emotions?.label)
                  .filter(Boolean) ?? [],
            })),
          }),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "mongree_monthly_emotion_report",
          strict: true,
          schema: reportSchema,
        },
      },
    }),
  });

  if (!response.ok) return null;

  const payload = await response.json();
  const outputText =
    payload.output_text ??
    payload.output
      ?.flatMap((item: { content?: { text?: string }[] }) => item.content ?? [])
      ?.map((content: { text?: string }) => content.text)
      ?.filter(Boolean)
      ?.join("");

  if (!outputText) return null;

  return JSON.parse(outputText) as Omit<AiReport, "month" | "source">;
}
