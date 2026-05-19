const POSTGREST_OR_RESERVED_CHARS = /[,()]/g;
const LIKE_RESERVED_CHARS = /[%_\\]/g;

export function escapePostgrestLikePattern(value: string) {
  return value
    .trim()
    .replace(POSTGREST_OR_RESERVED_CHARS, " ")
    .replace(LIKE_RESERVED_CHARS, "\\$&")
    .replace(/\s+/g, " ");
}

export function buildDiarySearchOrFilter(value: string) {
  const pattern = escapePostgrestLikePattern(value);
  return `title.ilike.%${pattern}%,content.ilike.%${pattern}%`;
}
