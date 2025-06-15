"use client";

import { usePathname } from "next/navigation";
// import Link from "next/link"; // Link 임포트 제거
import styles from "./styles.module.css";
import { MOBILE_NAV_ITEMS } from "../constants";
import { URL } from "@/commons/constants/global-url";
import MobileNavItem from "@/commons/components/mobile-nav-item"; // MobileNavItem 임포트

export default function MobileNavigation() {
  const pathname = usePathname();

  return (
    <div className={styles.nav_container}>
      {MOBILE_NAV_ITEMS.map((item) => (
        <MobileNavItem
          key={item.path}
          path={item.path}
          icon={item.icon}
          label={item.label}
          isActive={pathname === item.path}
          isHome={item.path === URL().HOME}
        />
      ))}
    </div>
  );
}
