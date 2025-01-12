"use client";

import { ButtonTextWithPaddingMM } from "@/commons/components/button-text";
import { InputStandardSFull } from "@/commons/components/input";
import styles from "./styles.module.css";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { checkNickname } from "./action";
import { InputTitleStandardSFull } from "@/commons/components/input-title";

export default function SignupNicknameContainer() {
  const { register, getValues } = useFormContext();
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckNickname = async () => {
    const nickname = getValues("nickname");
    console.log("현재 입력한 닉네임:", nickname);

    try {
      setIsChecking(true);
      const result = await checkNickname(nickname);

      if (result?.fieldErrors) {
        // 에러 처리
        console.log("닉네임 실패:", result.fieldErrors);
      } else {
        // 성공 처리
        console.log("닉네임 성공");
      }
    } catch (error) {
      console.error("닉네임 실패:", error);
    } finally {
      setIsChecking(false);
    }
  };
  return (
    <section className={styles.section}>
      <InputTitleStandardSFull title="닉네임" required />
      <div className={styles.section_nickname_duplication}>
        <InputStandardSFull
          placeholder="닉네임을 입력해주세요"
          name="nickname"
          register={register}
        />
        <ButtonTextWithPaddingMM
          title={isChecking ? "확인 중..." : "중복 확인"}
          type="button"
          onClick={handleCheckNickname}
          disabled={isChecking}
        />
      </div>
    </section>
  );
}
