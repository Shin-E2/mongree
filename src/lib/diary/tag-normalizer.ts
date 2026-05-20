export function normalizeDiaryTags(rawTags: string | string[]): string[] {
  const tagNames = Array.isArray(rawTags)
    ? rawTags
    : rawTags.replaceAll(",", " ").split(" ");

  return Array.from(
    new Set(
      tagNames
        .map((tagName) => tagName.replace(/^#/, "").trim())
        .filter((tagName) => tagName.length > 0)
    )
  );
}
