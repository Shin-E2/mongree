import { ReactNode } from "react";

export interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  containerClassName?: string;
  itemClassName?: string;
} 