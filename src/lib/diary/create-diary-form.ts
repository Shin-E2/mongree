import { normalizeDiaryTags } from "./tag-normalizer";

export interface DiaryImagePayload {
  image_url: string;
  sort_order: number;
  file_name: string;
  mime_type: string;
  file_size: number | null;
}

const getStringValue = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "");

const getStringList = (formData: FormData, key: string) =>
  formData
    .getAll(key)
    .map((value) => String(value))
    .filter((value) => value.length > 0);

export function extractCreateDiaryFormData(formData: FormData) {
  const imageUrls = getStringList(formData, "imageUrls");

  return {
    title: getStringValue(formData, "title"),
    content: getStringValue(formData, "content"),
    isPrivate: formData.get("isPrivate") === "true",
    emotions: getStringList(formData, "emotions"),
    tags: normalizeDiaryTags(getStringValue(formData, "tags")),
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
