import React from "react";

export interface ISignupStepProps {
  id: number;
  label: string;
  Component: React.ComponentType<any>;
  fields: string[];
}

export interface IstepProgressSectionProps {
  progress: number;
  currentStepData: {
    id: number;
    label: string;
  };
}
