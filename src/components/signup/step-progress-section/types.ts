export interface ISignupStepProps {
  id: number;
  label: string;
  Component: React.FC<{ state?: any }>;
  fields: string[];
}

export interface IstepProgressSectionProps {
  progress: number;
  currentStepData: {
    id: number;
    label: string;
  };
}
