import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export const AdminSidebar = ({ isMobileOpen, onCloseMobile }) => {
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
    { to: '/admin/booking-plans', label: 'Quản lý Đoàn khởi hành', icon: 'groups' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-[#0f172a] text-slate-200 z-50 flex flex-col justify-between p-5 shadow-xl transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Logo Brand */}
          <div className="flex items-center justify-between px-1">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                <span className="material-symbols-outlined text-[24px]">explore</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-white leading-tight">
                  Travel<span className="text-sky-400">Trail</span>
                </span>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold text-[10px] uppercase tracking-wider w-fit">
                  Admin Panel
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 pt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-sky-600/30 font-bold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}

            <div className="my-3 h-px bg-slate-800" />

            <Link
              to="/"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm font-semibold"
            >
              <span className="material-symbols-outlined text-[20px]">open_in_new</span>
              <span>Về trang người dùng</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors text-sm font-semibold text-left"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span>Đăng xuất</span>
            </button>
          </nav>
        </div>

        {/* Admin Profile Footer */}
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-cyan-400 text-white flex items-center justify-center font-bold text-sm shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-bold text-white truncate">{user?.name || 'Administrator'}</span>
            <span className="text-xs text-slate-400 truncate">Quản trị viên hệ thống</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
