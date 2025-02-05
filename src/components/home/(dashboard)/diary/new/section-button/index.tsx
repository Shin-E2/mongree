import {
  ButtonIconNext,
  ButtonIconPrev,
} from "@/commons/components/button-icon";

export interface IDiaryNewSectionButton {
  currentStep: number;
  handleNext: () => void;
  handlePrev: () => void;
  isLastStep: boolean;
  isNextButtonEnabled: boolean;
}

export default function DiaryNewSectionButton({
  currentStep,
  handleNext,
  handlePrev,
  isLastStep,
  isNextButtonEnabled,
}: IDiaryNewSectionButton) {
  return (
    <div className="flex justify-center mt-8 space-x-4">
      {currentStep > 0 && <ButtonIconPrev onClick={handlePrev} type="button" />}
      {!isLastStep && isNextButtonEnabled && (
        <ButtonIconNext onClick={handleNext} type="button" />
      )}
    </div>
  );
}
