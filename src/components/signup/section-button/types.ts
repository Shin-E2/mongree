export interface ISignupSectionButtonProps {
  currentStep: number;
  handlePrev: () => void;
  isLastStep: boolean;
  handleNext: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
