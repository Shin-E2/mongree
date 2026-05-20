import { normalizeDiaryTags } from "./tag-normalizer";

export interface DiaryImagePayload {
  image_url: string;
  sort_order: number;
  file_name: string;
  mime_type: string;
  file_size: number | null;
}

export interface CreateDiaryFormData {
  title: string;
  content: string;
  isPrivate: boolean;
  emotions: string[];
  tags: string[];
  imageUrls: string[];
}

const DEFAULT_DIARY_IMAGE_MIME_TYPE = "image/jpeg";
const buildDefaultDiaryImageName = (index: number) =>
  `diary_image_${index + 1}.jpg`;

const getStringValue = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "");

const getStringList = (formData: FormData, key: string) =>
  formData
    .getAll(key)
    .map((value) => String(value))
    .filter((value) => value.length > 0);

const buildDiaryImagePayload = (
  imageUrl: string,
  index: number
): DiaryImagePayload => ({
  image_url: imageUrl,
  sort_order: index + 1,
  file_name: buildDefaultDiaryImageName(index),
  mime_type: DEFAULT_DIARY_IMAGE_MIME_TYPE,
  file_size: null,
});

export function extractCreateDiaryFormData(
  formData: FormData
): CreateDiaryFormData {
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
  return imageUrls.map(buildDiaryImagePayload);
}
