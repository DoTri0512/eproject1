import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import useAuth from '../../hooks/useAuth';

export const AdminLayout = () => {
  const { user } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 flex">
      {/* Sidebar */}
      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Mở Sidebar"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>

            {/* Quick Search */}
            <div className="relative hidden sm:flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Tìm nhanh đơn hàng, tour, điểm đến..."
                className="w-64 md:w-80 h-9.5 pl-9 pr-4 rounded-lg bg-slate-100 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* System status & Profile */}
          <div className="flex items-center gap-4">
            {/* Status pills */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-700">MongoDB Atlas: Connected</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <span className="font-semibold text-slate-700">API v1: Active</span>
              </div>
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors"
              title="Thông báo hệ thống"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {/* User Mini Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-xs">
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
