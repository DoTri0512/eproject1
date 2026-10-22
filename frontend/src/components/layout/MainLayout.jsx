import React from "react";
import { Outlet } from "react-router-dom";
import UnifiedHeader from "./UnifiedHeader";
import UnifiedFooter from "./UnifiedFooter";
import ChatbotWidget from "../../features/user/chatbot/components/ChatbotWidget";

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] text-slate-800 antialiased selection:bg-sky-100 selection:text-sky-700">
      <UnifiedHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <UnifiedFooter />
      <ChatbotWidget />
    </div>
  );
};

export default MainLayout;
