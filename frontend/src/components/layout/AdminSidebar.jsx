import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export const AdminSidebar = ({ isMobileOpen, onCloseMobile, isCollapsed = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Tổng quan', icon: 'dashboard' },
    { to: '/admin/destinations', label: 'Quản lý Điểm đến', icon: 'landscape' },
    { to: '/admin/tours', label: 'Quản lý Tours', icon: 'calendar_month' },
    { to: '/admin/bookings', label: 'Quản lý Đơn hàng', icon: 'receipt_long' },
    { to: '/admin/booking-plans', label: 'Đoàn khởi hành', icon: 'groups' },
    { to: '/admin/guides', label: 'Hướng dẫn viên', icon: 'badge' },
    { to: '/admin/collections', label: 'Bộ sưu tập', icon: 'collections_bookmark' },
    { to: '/admin/contacts', label: 'Quản lý Liên hệ', icon: 'mail' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full bg-[#0f172a] text-slate-200 z-50
          flex flex-col justify-between shadow-xl no-scrollbar
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-[68px]' : 'lg:w-72'}
          w-72
        `}
      >
        {/* Top section */}
        <div className="flex flex-col gap-1 flex-1 overflow-hidden min-h-0">

          {/* Logo Brand */}
          <div
            className={`flex items-center gap-3 px-4 py-4 border-b border-slate-800 shrink-0 ${
              isCollapsed ? 'lg:justify-center lg:px-0' : ''
            }`}
          >
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 shrink-0"
              onClick={onCloseMobile}
            >
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
                <span className="material-symbols-outlined text-[22px]">explore</span>
              </div>
              {/* Brand text — hidden when collapsed */}
              <div
                className={`flex flex-col overflow-hidden ${
                  isCollapsed ? 'lg:hidden' : 'flex'
                }`}
              >
                <span className="font-extrabold text-base tracking-tight text-white leading-tight whitespace-nowrap">
                  Travel<span className="text-sky-400">Trail</span>
                </span>
                <span className="inline-block px-1.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold text-[9px] uppercase tracking-wider w-fit whitespace-nowrap">
                  Admin Panel
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden ml-auto text-slate-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 rounded-xl font-semibold text-sm transition-all group
                  ${isCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5' : 'px-3.5 py-2.5'}
                  ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-sky-600/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">
                  {item.icon}
                </span>

                {/* Label — hidden when collapsed */}
                <span
                  className={`truncate whitespace-nowrap ${
                    isCollapsed ? 'lg:hidden' : 'inline'
                  }`}
                >
                  {item.label}
                </span>
              </NavLink>
            ))}

            <div className="my-1.5 h-px bg-slate-800 shrink-0" />

            {/* Về trang user */}
            <Link
              to="/"
              title={isCollapsed ? 'Về trang người dùng' : undefined}
              className={`relative flex items-center gap-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm font-semibold group
                ${isCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5' : 'px-3.5 py-2.5'}`}
            >
              <span className="material-symbols-outlined text-[20px] shrink-0">open_in_new</span>
              <span
                className={`truncate whitespace-nowrap ${
                  isCollapsed ? 'lg:hidden' : 'inline'
                }`}
              >
                Về trang người dùng
              </span>
            </Link>

            {/* Đăng xuất */}
            <button
              type="button"
              onClick={handleLogout}
              title={isCollapsed ? 'Đăng xuất' : undefined}
              className={`relative flex items-center gap-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors text-sm font-semibold text-left group
                ${isCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5' : 'px-3.5 py-2.5'}`}
            >
              <span className="material-symbols-outlined text-[20px] shrink-0">logout</span>
              <span
                className={`truncate whitespace-nowrap ${
                  isCollapsed ? 'lg:hidden' : 'inline'
                }`}
              >
                Đăng xuất
              </span>
            </button>
          </nav>
        </div>

        {/* Admin Profile Footer */}
        <div
          className={`shrink-0 border-t border-slate-800 transition-all duration-300 ${
            isCollapsed ? 'lg:px-2 lg:py-3' : 'p-3'
          }`}
        >
          <div
            className={`rounded-xl bg-slate-800/60 border border-slate-800 flex items-center gap-3 transition-all duration-300 ${
              isCollapsed ? 'lg:justify-center lg:p-2' : 'p-3'
            }`}
          >
            <div
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-cyan-400 text-white flex items-center justify-center font-bold text-sm shrink-0"
              title={isCollapsed ? (user?.name || 'Admin') : undefined}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div
              className={`flex flex-col min-w-0 flex-1 overflow-hidden ${
                isCollapsed ? 'lg:hidden' : 'flex'
              }`}
            >
              <span className="text-sm font-bold text-white truncate whitespace-nowrap">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-xs text-slate-400 truncate whitespace-nowrap">
                Quản trị viên hệ thống
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
