import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getUser } from "@/lib/get-user";

export const dynamic = "force-dynamic";

interface DiaryForReport {
  title: string;
  content: string;
  created_at: string | null;
  diary_emotions:
    | {
        emotions: { label: string } | null;
      }[]
    | null;
}

interface AiReport {
  month: string;
  summary: string;
  dominantEmotions: string[];
  gentleInsight: string;
  recommendations: string[];
  source: "openai" | "local";
}

const reportSchema = {
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

const getMonthRange = (month: string) => {
  const [year, monthIndex] = month.split("-").map(Number);
  const start = new Date(Date.UTC(year, monthIndex - 1, 1));
  const end = new Date(Date.UTC(year, monthIndex, 1));

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};

const currentMonth = () => new Date().toISOString().slice(0, 7);

function buildLocalReport(month: string, diaries: DiaryForReport[]): AiReport {
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
      summary: "이번 달에는 아직 분석할 일기가 없습니다.",
      dominantEmotions: [],
      gentleInsight: "짧은 문장 하나라도 남기면 감정 흐름을 더 잘 돌아볼 수 있어요.",
      recommendations: [
        "오늘 기억나는 감정 하나를 먼저 기록해보세요.",
        "완벽한 글보다 짧고 솔직한 문장이 더 도움이 됩니다.",
      ],
      source: "local",
    };
  }

  return {
    month,
    summary: `${month}에는 ${diaries.length}개의 일기를 기준으로 감정 흐름을 정리했습니다.`,
    dominantEmotions,
    gentleInsight:
      dominantEmotions.length > 0
        ? `${dominantEmotions[0]} 감정이 자주 보였어요. 그 감정이 나타난 상황을 천천히 돌아보세요.`
        : "감정 선택이 적어 흐름을 단정하기는 어렵지만, 기록 자체가 이미 좋은 출발입니다.",
    recommendations: [
      "반복해서 등장한 상황을 한 줄로 메모해보세요.",
      "좋았던 순간과 힘들었던 순간을 같은 비중으로 남겨보세요.",
      "다음 일기에는 몸 상태나 수면도 함께 적어보세요.",
    ],
    source: "local",
  };
}

async function buildOpenAiReport(month: string, diaries: DiaryForReport[]) {
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
            "너는 한국어 감정 일기 앱의 월간 리포트 작성자다. 진단이나 치료 조언은 하지 말고, 사용자가 스스로 돌아볼 수 있게 따뜻하고 구체적으로 요약한다. JSON만 출력한다.",
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

export async function GET(request: Request) {
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 }
    );
  }

  const url = new URL(request.url);
  const month = url.searchParams.get("month") ?? currentMonth();
  const monthPattern = /^\d{4}-\d{2}$/;

  if (!monthPattern.test(month)) {
    return NextResponse.json(
      { error: "month는 YYYY-MM 형식이어야 합니다." },
      { status: 400 }
    );
  }

  const { start, end } = getMonthRange(month);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("diaries")
    .select(
      `
      title,
      content,
      created_at,
      diary_emotions (
        emotions (
          label
        )
      )
      `
    )
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .gte("created_at", start)
    .lt("created_at", end)
    .order("created_at", { ascending: true })
    .returns<DiaryForReport[]>();

  if (error) {
    return NextResponse.json(
      { error: `AI 리포트 데이터 조회 실패: ${error.message}` },
      { status: 500 }
    );
  }

  const diaries = data ?? [];
  const openAiReport = await buildOpenAiReport(month, diaries).catch(() => null);

  if (openAiReport) {
    const generatedReport = {
      month,
      ...openAiReport,
      source: "openai",
    } satisfies AiReport;

    await supabase
      .from("ai_reports")
      .upsert(
        {
          user_id: user.id,
          month,
          summary: generatedReport.summary,
          dominant_emotions: generatedReport.dominantEmotions,
          gentle_insight: generatedReport.gentleInsight,
          recommendations: generatedReport.recommendations,
          source: generatedReport.source,
          payload: JSON.parse(JSON.stringify(generatedReport)),
        },
        { onConflict: "user_id,month" }
      );
    await supabase.from("usage_events").insert({
      user_id: user.id,
      event_type: "ai_report.generated",
      source: "api",
      metadata: { month, source: generatedReport.source },
    });

    return NextResponse.json(generatedReport);
  }

  const localReport = buildLocalReport(month, diaries);
  await supabase
    .from("ai_reports")
    .upsert(
      {
        user_id: user.id,
        month,
        summary: localReport.summary,
        dominant_emotions: localReport.dominantEmotions,
        gentle_insight: localReport.gentleInsight,
        recommendations: localReport.recommendations,
        source: localReport.source,
        payload: JSON.parse(JSON.stringify(localReport)),
      },
      { onConflict: "user_id,month" }
    );
  await supabase.from("usage_events").insert({
    user_id: user.id,
    event_type: "ai_report.generated",
    source: "api",
    metadata: { month, source: localReport.source },
  });

  return NextResponse.json(localReport);
}
