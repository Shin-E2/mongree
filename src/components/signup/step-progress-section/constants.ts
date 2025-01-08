import SignupStepBasicInfo from "../step-basic-info";
import SignupStepProfileCheck from "../step-profile-check";

// 회원가입의 각 단계
// fields는 각 단계에서 검증해야 할 폼 필드들을 나타냄
export const SIGNUP_STEPS = [
  {
    id: 1,
    label: "기본정보",
    Component: SignupStepBasicInfo,
    fields: [
      "name",
      "nickname",
      "email",
      "password",
      "passwordConfirm",
      "address.zoneCode",
      "address.address",
      "address.detailAddress",
    ],
  },
  {
    id: 2,
    label: "프로필설정",
    Component: SignupStepProfileCheck,
    fields: [],
  },
] as const;
