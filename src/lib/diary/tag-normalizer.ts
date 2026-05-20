const splitTagText = (tagText: string) => tagText.replaceAll(",", " ").split(" ");

export function normalizeDiaryTags(rawTags: string | string[]): string[] {
  const tagNames = Array.isArray(rawTags)
    ? rawTags.flatMap(splitTagText)
    : splitTagText(rawTags);

  return Array.from(
    new Set(
      tagNames
        .map((tagName) => tagName.replace(/^#/, "").trim())
        .filter((tagName) => tagName.length > 0)
    )
  );
}
