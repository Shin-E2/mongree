// 비밀번호 최소 길이
export const PASSWORD_MIN_LENGTH = 8;

// 비밀번호 정규식
export const PASSWORD_REGXP = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/
);

// 비밀번호 에러
export const PASSWORD_REGXP_ERROR =
  "비밀번호는 소문자, 대문자, 숫자, 특수문자를 포함해야합니다.";
