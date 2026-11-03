import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import useAuth from '../../hooks/useAuth';

export const AdminLayout = () => {
  const { user } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      // Mobile: overlay open/close
      setIsMobileSidebarOpen((prev) => !prev);
    } else {
      // Desktop: collapse to icon-only mode
      setIsCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 flex">
      {/* Sidebar */}
      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isCollapsed}
      />

      {/* Main Content — shrinks/grows based on sidebar width */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-[padding] duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-[68px]' : 'lg:pl-72'
        }`}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Toggle Button */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-primary transition-all duration-200"
            aria-label="Toggle Sidebar"
            title={isCollapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'}
          >
            <span className="material-symbols-outlined text-[24px]">
              {isCollapsed ? 'menu_open' : 'menu'}
            </span>
          </button>

          {/* Right: Notification + Avatar */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              type="button"
              className="relative w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors"
              title="Thông báo hệ thống"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {/* User Mini Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="text-xs font-bold text-slate-700 hidden sm:inline">
                {user?.name || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-5 sm:p-7 lg:p-10 pt-6 sm:pt-8 lg:pt-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
