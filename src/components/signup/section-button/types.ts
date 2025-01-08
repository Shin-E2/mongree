export interface ISignupSectionButtonProps {
  currentStep: number;
  handlePrev: () => void;
  isLastStep: boolean;
  handleNext: () => void;
}
