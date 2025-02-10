import styles from "./styles.module.css";
import SidebarNavigation from "./navigation";
import SidebarUserProfileSection from "./user-profile-section";
import { ButtonTextLogo } from "@/commons/components/button-text";
import { URL } from "@/commons/constants/global-url";
import MobileNavigation from "./navigation/mobile-navigation";

export default function SideBar() {
  return (
    <>
      {/* 데스크탑 사이드바 */}
      <aside className={styles.aside}>
        <div className={styles.aside_div}>
          <ButtonTextLogo href={URL().HOME} title="mongree" />
          <SidebarNavigation />
          <SidebarUserProfileSection />
        </div>
      </aside>

      {/* 모바일 하단 네비게이션 */}
      <nav className={styles.mobile_nav}>
        <div className={styles.mobile_nav_container}>
          <MobileNavigation />
        </div>
      </nav>
    </>
  );
}
