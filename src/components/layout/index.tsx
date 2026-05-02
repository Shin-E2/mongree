"use client";

import SideBar from "./sidebar";
import TopBar from "./topbar";
import ChatBot from "./chatbot";
import SceneCharacter from "./scene-character";
import useLayout from "./hook";
import styles from "./styles.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { hideFullLayout, hidePartialLayout } = useLayout();

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
          <div className={!hidePartialLayout ? styles.pageContainer : ""}>
            {children}
          </div>
        </main>
        {!hidePartialLayout && <ChatBot />}
        {!hidePartialLayout && <SceneCharacter />}
      </div>
    </div>
  );
}
