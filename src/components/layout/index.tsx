"use client";

import SideBar from "./sidebar";
import TopBar from "./topbar";
import ChatBot from "./chatbot";
import useLayout from "./hook";

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
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />
      <div className="flex-1 md:ml-64">
        {!hidePartialLayout && <TopBar />}
        <main className={`${!hidePartialLayout ? "pt-16" : ""}`}>
          {children}
        </main>
        {!hidePartialLayout && <ChatBot />}
      </div>
    </div>
  );
}
