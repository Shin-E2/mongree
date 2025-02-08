import Image from "next/image";
import { EMOTIONS } from "../../../../../../../mock/emotions";
import { useFormContext } from "react-hook-form";

export default function DiaryNewStepWriteDiaryEmotionTags() {
  const { watch } = useFormContext();
  const selectedEmotions = watch("emotions");

  return (
    <div className="flex flex-wrap gap-2">
      {selectedEmotions.map((emotionId: string) => {
        const emotion = EMOTIONS.find((e) => e.id === emotionId);
        return (
          <span
            key={emotionId}
            className={`inline-flex items-center px-3 py-1 rounded-full 
                  ${emotion?.bgColor} ${emotion?.textColor} transition-all duration-200`}
          >
            <Image
              src={emotion?.image!}
              alt={emotion?.label!}
              width={4}
              height={4}
              className="w-4 h-4 mr-1"
            />
            {emotion?.label}
          </span>
        );
      })}
    </div>
  );
}
