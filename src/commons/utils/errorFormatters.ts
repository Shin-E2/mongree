import { z } from 'zod';

/**
 * ZodFormattedError 객체를 읽기 쉬운 문자열 형식으로 변환합니다.
 * @param error - ZodFormattedError 객체
 * @returns 포맷된 에러 메시지 문자열
 */
export function formatZodError(error: z.ZodFormattedError<any, any>): string {
  let errorMessage = "";
  const errors = error._errors; // 필드 특정 오류가 아닌 일반 오류

  if (errors.length > 0) {
      errorMessage += `General Errors: ${errors.join(", ")}
`;
  }

  // 필드별 오류 처리
  for (const key in error) {
    if (key !== "_errors") {
      const fieldError = (error as Record<string, any>)[key];
      if (fieldError && typeof fieldError === 'object' && '_errors' in fieldError) {

        const fieldErrors = fieldError._errors;
        if (fieldErrors && fieldErrors.length > 0) {
             errorMessage += `${String(key)}: ${fieldErrors.join(", ")}
`;
        }
      }
    }
  }
  return errorMessage.trim();
}