import React, { useState, useEffect } from 'react';
import formatDate from '../../../../utils/formatDate';

export const PersonalInfoTab = ({
  user,
  isUpdating,
  onSubmit,
  isUploadingAvatar,
  onUploadAvatar,
}) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-2xl bg-sky-50 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[22px]">badge</span>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Thông Tin Cá Nhân
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Cập nhật tên hiển thị tài khoản và ảnh đại diện của bạn trên TravelTrail.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Display Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Họ và tên hiển thị <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
                person
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập họ và tên của bạn"
                required
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Tên này sẽ hiển thị trên Header, hóa đơn và voucher du lịch của bạn.
            </p>
          </div>

          {/* Email (Readonly) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Địa chỉ Email <span className="text-slate-400 font-normal">(Cố định)</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
                mail
              </span>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Email dùng để đăng nhập và nhận thông báo xác nhận đơn đặt tour.
            </p>
          </div>
        </div>

        {/* Avatar URL & Live Preview */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Đường dẫn ảnh đại diện (Avatar URL)
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
                image
              </span>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/your-photo.jpg"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono text-xs"
              />
            </div>

            <label className="shrink-0 w-full sm:w-auto px-4 py-3 rounded-2xl border border-dashed border-primary text-primary hover:bg-sky-50 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors">
              <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
              <span>{isUploadingAvatar ? 'Đang tải lên...' : 'Chọn file tải lên'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploadingAvatar}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onUploadAvatar(f);
                }}
              />
            </label>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Hỗ trợ dán trực tiếp link ảnh HTTPS (Unsplash, Imgur, Cloudinary) hoặc tải file từ máy tính.
          </p>
        </div>

        {/* Account Details Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Vai trò hệ thống</span>
            <strong className="text-slate-800 uppercase font-bold">
              {user?.role === 'admin' ? 'Quản trị viên toàn quyền' : 'Khách hàng thân thiết'}
            </strong>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Ngày kích hoạt tài khoản</span>
            <strong className="text-slate-800 font-semibold">
              {user?.createdAt ? formatDate(user.createdAt) : 'Mới tham gia'}
            </strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isUpdating}
            className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md shadow-sky-500/20 hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isUpdating ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
                <span>Đang lưu thay đổi...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Lưu thông tin cá nhân</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoTab;
