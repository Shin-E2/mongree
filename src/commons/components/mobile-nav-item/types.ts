import type { LucideIcon } from "lucide-react";

export interface IMobileNavItemProps {
  path: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  isHome?: boolean;
} 