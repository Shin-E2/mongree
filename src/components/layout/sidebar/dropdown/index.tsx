import { ButtonOptionStandardSFull } from "@/commons/components/button-option";
import { URL } from "@/commons/constants/global-url";
import { LogOut, Settings } from "lucide-react";
import styles from "./styles.module.css";
import { logOut } from "@/lib/logout";

export default function SidebarDropdown() {
  return (
    <div className={styles.div}>
      {/* 프로필 설정*/}
      <ButtonOptionStandardSFull
        cssprop={styles.profile}
        title="프로필 설정"
        titleColor={styles.profile_title}
        icon={<Settings className={styles.profile_icon} />}
        href={URL().PROFILE}
      />
      {/* 로그아웃 */}
      <ButtonOptionStandardSFull
        cssprop={styles.logout}
        title="로그아웃"
        titleColor={styles.logout_title}
        icon={<LogOut className={styles.logout_icon} />}
        onClick={logOut}
      />
    </div>
  );
}
