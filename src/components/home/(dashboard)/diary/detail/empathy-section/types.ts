import { EmpathyActionResult, UserBasicInfo } from "../types";

export interface EmpathySectionProps {
  optimisticEmpathies: NonNullable<EmpathyActionResult['empathies']>;
  isEmpathized: boolean;
  isPending: boolean;
  loginUser: UserBasicInfo | null;
  handleEmpathyToggle: () => Promise<void>;
  isPrivate: boolean | undefined;
} 