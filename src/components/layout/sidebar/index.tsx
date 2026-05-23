import Link from "next/link";
import styles from "./styles.module.css";
import SidebarNavigation from "./navigation";
import MobileNavigation from "./navigation/mobile-navigation";

export default function SideBar() {
  return (
    <>
      <aside className={styles.aside}>
        <SidebarNavigation />
        <div className={styles.legalLinks}>
          <Link href="/terms" className={styles.legalLink} aria-label="이용약관">
            약관
          </Link>
          <Link href="/privacy" className={styles.legalLink} aria-label="개인정보처리방침">
            개인정보
          </Link>
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
