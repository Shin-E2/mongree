import { z } from "zod";

type FormattedZodError = z.ZodFormattedError<unknown, string> & {
  [key: string]: unknown;
};

type FieldErrorNode = {
  _errors?: string[];
};

export function formatZodError(error: FormattedZodError): string {
  let errorMessage = "";
  const errors = error._errors;

  if (errors.length > 0) {
    errorMessage += `공통 오류: ${errors.join(", ")}\n`;
  }

  for (const key in error) {
    if (key !== "_errors") {
      const fieldError = error[key] as FieldErrorNode | undefined;
      const fieldErrors = fieldError?._errors;

      if (fieldErrors && fieldErrors.length > 0) {
        errorMessage += `${String(key)}: ${fieldErrors.join(", ")}\n`;
      }
    }
  }

  return errorMessage.trim();
}
