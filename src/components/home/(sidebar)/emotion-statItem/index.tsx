import Image from "next/image";

interface EmotionStatItemProps {
  emotion: string;
  percentage: number;
  color: string;
}

export function HomeEmotionStatItem({
  emotion,
  percentage,
  color,
}: EmotionStatItemProps) {
  return (
    <div className="flex gap-4 items-center justify-between w-full">
      <Image
        src={emotion}
        alt="감정이모지"
        width={100}
        height={100}
        className="w-8 h-8 rounded-full"
      />

      <div className="relative w-full h-2 bg-gray-300 rounded-full overflow-hidden">
        <div
          className={`h-2 bg-${color}-500 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium">{percentage}%</span>
    </div>
  );
}
