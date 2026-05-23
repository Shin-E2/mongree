"use client";

import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";

interface ReportViewTrackerProps {
  month: string;
  hasSavedReport: boolean;
}

export function ReportViewTracker({ month, hasSavedReport }: ReportViewTrackerProps) {
  const posthog = usePostHog();

  useEffect(() => {
    posthog?.capture("ai_report_viewed", { month, has_saved_report: hasSavedReport });
  }, [posthog, month, hasSavedReport]);

  return null;
}
