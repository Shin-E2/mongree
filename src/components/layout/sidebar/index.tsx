import styles from "./styles.module.css";
import SidebarNavigation from "./navigation";
import SidebarUserProfileSection from "./user-profile-section";
import { ButtonTextLogo } from "@/commons/components/button-text";
import { URL } from "@/commons/constants/global-url";
import MobileNavigation from "./navigation/mobile-navigation";

export default function SideBar() {
  return (
    <>
      <aside className={styles.aside}>
        <div className={styles.aside_div}>
          <div className={styles.brandBlock}>
            <ButtonTextLogo href={URL().HOME} title="mongree" />
            <p className={styles.brandCaption}>오늘의 감정을 하늘에 적어요</p>
          </div>
          <SidebarNavigation />
          <SidebarUserProfileSection />
        </div>
      </aside>

      <nav className={styles.mobile_nav}>
        <div className={styles.mobile_nav_container}>
          <MobileNavigation />
        </div>
      </nav>
    </>
  );
}
