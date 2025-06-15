export const EMOTION_STYLES = {
  happy: {
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-400",
    textColor: "text-yellow-800"
  },
  sad: {
    bgColor: "bg-blue-100",
    borderColor: "border-blue-400",
    textColor: "text-blue-800"
  },
  angry: {
    bgColor: "bg-red-100",
    borderColor: "border-red-400",
    textColor: "text-red-800"
  },
  scared: {
    bgColor: "bg-purple-100",
    borderColor: "border-purple-400",
    textColor: "text-purple-800"
  },
  anxious: {
    bgColor: "bg-green-100",
    borderColor: "border-green-400",
    textColor: "text-green-800"
  },
  joyful: {
    bgColor: "bg-sky-100",
    borderColor: "border-sky-400",
    textColor: "text-sky-800"
  },
  disappointed: {
    bgColor: "bg-pink-100",
    borderColor: "border-pink-400",
    textColor: "text-pink-800"
  },
  calm: {
    bgColor: "bg-gray-100",
    borderColor: "border-gray-400",
    textColor: "text-gray-800"
  },
  excited: {
    bgColor: "bg-orange-100",
    borderColor: "border-orange-400",
    textColor: "text-orange-800"
  },
  confused: {
    bgColor: "bg-indigo-100",
    borderColor: "border-indigo-400",
    textColor: "text-indigo-800"
  }
} as const;

export type EmotionId = keyof typeof EMOTION_STYLES;
