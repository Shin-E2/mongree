"use client";

import SideBar from "./sidebar";
import TopBar from "./topbar";
import ChatBot from "./chatbot";
import useLayout from "./hook";

interface ILayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: ILayoutProps) {
  const { hideLayout } = useLayout();

  // 레이아웃이 숨겨져야 하는 경우
  if (hideLayout) {
    return children;
  }

  // 기본 레이아웃
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />
      <div className="flex-1 ml-64">
        <TopBar />
        <main className="pt-16">{children}</main>
        <ChatBot />
      </div>
    </div>
  );
}
