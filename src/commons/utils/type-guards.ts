import type { FieldErrors, FieldValues } from "react-hook-form";

export function isFieldErrors<T extends FieldValues>(
  errors: FieldErrors<T> | string | undefined
): errors is FieldErrors<T> {
  return typeof errors !== "string" && errors !== undefined;
}
