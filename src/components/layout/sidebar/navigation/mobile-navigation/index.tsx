"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./styles.module.css";
import { MOBILE_NAV_ITEMS } from "../constants";
import { URL } from "@/commons/constants/global-url";

export default function MobileNavigation() {
  const pathname = usePathname();

  return (
    <div className={styles.nav_container}>
      {MOBILE_NAV_ITEMS.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`${styles.nav_item} ${
            pathname === item.path
              ? styles.nav_item_active
              : styles.nav_item_inactive
          } ${item.path === URL().HOME ? styles.nav_item_home : ""}`}
        >
          <item.icon
            className={`${styles.nav_icon} ${
              item.path === URL().HOME ? styles.nav_icon_home : ""
            }`}
          />
          <span className={styles.nav_label}>{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
