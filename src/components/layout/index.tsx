"use client";

import SideBar from "./sidebar";
import TopBar from "./topbar";
import ChatBot from "./chatbot";
import useLayout from "./hook";
import styles from "./styles.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { hideFullLayout, hidePartialLayout } = useLayout();

  // 전체 레이아웃 숨김
  if (hideFullLayout) {
    return children;
  }

  return (
    <div className={styles.mainLayout}>
      <SideBar />
      <div className={styles.contentWrapper}>
        {!hidePartialLayout && <TopBar />}
        <main
          className={`${
            !hidePartialLayout ? styles.mainContentWithPadding : ""
          }`}
        >
          {children}
        </main>
        {!hidePartialLayout && <ChatBot />}
      </div>
    </div>
  );
}
