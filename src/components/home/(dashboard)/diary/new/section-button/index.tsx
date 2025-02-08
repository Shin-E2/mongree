import {
  ButtonIconNext,
  ButtonIconPrev,
} from "@/commons/components/button-icon";
import { useFormContext } from "react-hook-form";
import type { DiaryNewFormType } from "../form.schema";

export interface IDiaryNewSectionButton {
  currentStep: number;
  handleNext: () => void;
  handlePrev: () => void;
  isLastStep: boolean;
}

export default function DiaryNewSectionButton({
  currentStep,
  handleNext,
  handlePrev,
  isLastStep,
}: IDiaryNewSectionButton) {
  const { watch } = useFormContext<DiaryNewFormType>();
  const emotions = watch("emotions") || [];
  console.log("emotions", emotions);

  return (
    <div className="flex justify-center mt-8 space-x-4">
      {currentStep > 0 && <ButtonIconPrev onClick={handlePrev} type="button" />}
      {!isLastStep && emotions.length > 0 && (
        <ButtonIconNext onClick={handleNext} type="button" />
      )}
    </div>
  );
}
