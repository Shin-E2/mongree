export const EMOTIONS = [
  {
    id: "happy",
    label: "행복",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-400",
    textColor: "text-yellow-800",
    image: "/image/emotions/happy.svg",
  },
  {
    id: "sad",
    label: "슬픔",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-400",
    textColor: "text-blue-800",
    image: "/image/emotions/sad.svg",
  },
  {
    id: "angry",
    label: "분노",
    bgColor: "bg-red-100",
    borderColor: "border-red-400",
    textColor: "text-red-800",
    image: "/image/emotions/angry.svg",
  },
  {
    id: "scared",
    label: "두려움",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-400",
    textColor: "text-purple-800",
    description: "걱정되고 불안한 감정",
    image: "/image/emotions/scared.svg",
  },
  {
    id: "anxious",
    label: "불안",
    bgColor: "bg-green-100",
    borderColor: "border-green-400",
    textColor: "text-green-800",
    image: "/image/emotions/anxious.svg",
  },
  {
    id: "joyful",
    label: "기쁨",
    bgColor: "bg-sky-100",
    borderColor: "border-sky-400",
    textColor: "text-sky-800",
    image: "/image/emotions/joyful.svg",
  },
  {
    id: "disappointed",
    label: "실망",
    bgColor: "bg-pink-100",
    borderColor: "border-pink-400",
    textColor: "text-pink-800",
    image: "/image/emotions/disappointed.svg",
  },
  {
    id: "calm",
    label: "평온",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-400",
    textColor: "text-gray-800",
    image: "/image/emotions/calm.svg",
  },
  {
    id: "excited",
    label: "흥분",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-400",
    textColor: "text-orange-800",
    image: "/image/emotions/excited.svg",
  },
  {
    id: "confused",
    label: "외로움",
    bgColor: "bg-indigo-100",
    borderColor: "border-indigo-400",
    textColor: "text-indigo-800",
    image: "/image/emotions/confused.svg",
  },
];

export interface Emotion {
  id: string;
  label: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  image: string;
}
