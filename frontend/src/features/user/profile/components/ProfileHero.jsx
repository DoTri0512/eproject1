import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import formatDate from '../../../../utils/formatDate';

export const ProfileHero = ({
  user,
  stats,
  isUploadingAvatar,
  onUploadAvatar,
  activeTab,
  onSelectTab,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadAvatar(file);
      e.target.value = '';
    }
  };

  const isAdmin = user?.role === 'admin';
  const avatarUrl =
    user?.avatar ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';

  return (
    <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white shadow-xl">
      {/* Decorative background glow circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
        {/* Avatar with Camera upload overlay */}
        <div className="relative group shrink-0">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-slate-800">
            <img
              src={avatarUrl}
              alt={user?.name || 'User Avatar'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80';
              }}
            />
          </div>

          {/* Upload Button Overlay */}
          <button
            type="button"
            disabled={isUploadingAvatar}
            onClick={() => fileInputRef.current?.click()}
            title="Tải ảnh mới"
            className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-primary hover:bg-sky-500 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110 border-2 border-white disabled:opacity-50"
          >
            {isUploadingAvatar ? (
              <span className="material-symbols-outlined text-[20px] animate-spin">
                progress_activity
              </span>
            ) : (
              <span className="material-symbols-outlined text-[20px]">photo_camera</span>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* User Info Details */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {user?.name || 'Người dùng TravelTrail'}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                isAdmin
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {isAdmin ? 'admin_panel_settings' : 'verified_user'}
              </span>
              <span>{isAdmin ? 'Quản trị viên' : 'Thành viên'}</span>
            </span>
          </div>

          <p className="text-slate-300 text-sm flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span className="inline-flex items-center gap-1.5 text-sky-200">
              <span className="material-symbols-outlined text-[16px]">mail</span>
              <span>{user?.email}</span>
            </span>
            {user?.createdAt && (
              <span className="inline-flex items-center gap-1.5 text-slate-400">
                <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                <span>Thành viên từ {formatDate(user.createdAt)}</span>
              </span>
            )}
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-md mx-auto md:mx-0">
            <Link
              to="/my-bookings"
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center group"
            >
              <div className="text-xl sm:text-2xl font-black text-cyan-400 group-hover:scale-105 transition-transform">
                {stats.bookingsCount}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">Đơn đặt tour</div>
            </Link>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">
                {stats.completedBookingsCount}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">Chuyến hoàn thành</div>
            </div>

            <Link
              to="/favourites"
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center group"
            >
              <div className="text-xl sm:text-2xl font-black text-rose-400 group-hover:scale-105 transition-transform">
                {stats.favouritesCount}
              </div>
              <div className="text-[11px] text-slate-300 font-medium">Yêu thích</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;
