import { normalizeDiaryTags } from "./tag-normalizer";

export interface DiaryImagePayload {
  image_url: string;
  sort_order: number;
  file_name: string;
  mime_type: string;
  file_size: number | null;
}

export function extractCreateDiaryFormData(formData: FormData) {
  const imageUrls = formData
    .getAll("imageUrls")
    .map((url) => String(url))
    .filter(Boolean);

  return {
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
    isPrivate: formData.get("isPrivate") === "true",
    emotions: formData.getAll("emotions").map((emotion) => String(emotion)),
    tags: normalizeDiaryTags(String(formData.get("tags") ?? "")),
    imageUrls,
  };
}

export function buildDiaryImagePayloads(imageUrls: string[]): DiaryImagePayload[] {
  return imageUrls.map((url, index) => ({
    image_url: url,
    sort_order: index + 1,
    file_name: `diary_image_${index + 1}.jpg`,
    mime_type: "image/jpeg",
    file_size: null,
  }));
}
