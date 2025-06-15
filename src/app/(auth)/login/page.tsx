import LoginFormTitle from "@/components/login/form-title";
import LoginFormSection from "@/components/login/form-section";
import LoginSocialSection from "@/components/login/social-section";
import LoginSignupSection from "@/components/login/signup-section";
import AuthPageLayout from "@/components/layout/auth-page-layout";
import { CardStandardFullFull } from "@/commons/components/card";

export default function LoginPage() {
  return (
    <AuthPageLayout>
      <CardStandardFullFull>
        {/* 글씨 */}
        <LoginFormTitle />
        {/* 일반 로그인 */}
        <LoginFormSection />
        {/* 소셜 로그인 */}
        <LoginSocialSection />
        {/* 회원가입 */}
        <LoginSignupSection />
      </CardStandardFullFull>
    </AuthPageLayout>
  );
}
