import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useFavourites from '../../features/user/favourite/hooks/useFavourites';

export const UnifiedHeader = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { count: favouriteCount } = useFavourites();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/destinations', label: 'Điểm đến' },
    { to: '/regions', label: 'Vùng miền' },
    { to: '/collections', label: 'Bộ sưu tập' },
    { to: '/guides', label: 'Hướng dẫn viên' },
    { to: '/about', label: 'Giới thiệu' },
    { to: '/contact', label: 'Liên hệ' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all h-[72px]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 group-hover:scale-105 transition-transform shadow-xs">
            <span className="material-symbols-outlined text-[24px]">explore</span>
          </div>
          <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
            Travel<span className="text-primary">Trail</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 h-full">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `h-full flex items-center text-sm font-semibold transition-colors border-b-2 ${
                  isActive
                    ? 'text-primary border-primary'
                    : 'text-slate-600 border-transparent hover:text-primary'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Wishlist Link */}
          <Link
            to="/favourites"
            className="relative p-2 rounded-full text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors"
            title="Điểm đến yêu thích"
          >
            <span className="material-symbols-outlined text-[22px]">favorite</span>
            {favouriteCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
                {favouriteCount}
              </span>
            )}
          </Link>

          {/* Guest State */}
          {!isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg border border-sky-200 text-primary font-semibold text-xs sm:text-sm hover:bg-sky-50 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold text-xs sm:text-sm hover:opacity-95 transition-all shadow-sm shadow-sky-500/20"
              >
                Đăng ký
              </Link>
            </div>
          ) : (
            /* Authenticated User State */
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-200 bg-white hover:border-slate-300 transition-all focus:outline-none"
              >
                <span className="text-xs font-bold text-slate-700 max-w-[120px] truncate hidden md:inline">
                  {user?.name || 'Thành viên'}
                </span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-cyan-400 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-white">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span>{(user?.name || 'U').charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-400 pr-1">
                  expand_more
                </span>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-hover border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs text-slate-400">Đăng nhập với</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{user?.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-primary">
                        Quản trị viên (Admin)
                      </span>
                    )}
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-slate-400">person</span>
                    <span>Hồ sơ cá nhân</span>
                  </Link>

                  <Link
                    to="/my-bookings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-slate-400">receipt_long</span>
                    <span>Đơn đặt tour của tôi</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm text-primary font-semibold hover:bg-sky-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary">dashboard</span>
                      <span>Trang Quản trị Admin</span>
                    </Link>
                  )}

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-rose-500">logout</span>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Mở menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[72px] bg-white border-b border-slate-200 shadow-xl p-5 flex flex-col gap-3 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-sky-50 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {!isAuthenticated ? (
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg border border-sky-200 text-primary font-semibold text-sm hover:bg-sky-50"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-dark"
              >
                Đăng ký tài khoản
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 rounded-lg text-slate-700 font-semibold text-sm flex items-center gap-2 hover:bg-slate-50"
              >
                <span className="material-symbols-outlined text-[18px] text-slate-400">person</span>
                <span>Hồ sơ cá nhân</span>
              </Link>
              <Link
                to="/my-bookings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 rounded-lg text-slate-700 font-semibold text-sm flex items-center gap-2 hover:bg-slate-50"
              >
                <span className="material-symbols-outlined text-[18px] text-slate-400">receipt_long</span>
                <span>Đơn đặt tour của tôi</span>
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 px-3 rounded-lg bg-sky-50 text-primary font-semibold text-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">dashboard</span>
                  <span>Trang Quản trị Admin</span>
                </Link>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full py-2.5 px-3 rounded-lg text-rose-600 font-semibold text-sm text-left flex items-center gap-2 hover:bg-rose-50"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default UnifiedHeader;
