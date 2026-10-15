import React, { useState } from 'react';

export const SecurityTab = ({ isChanging, onSubmit }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'Chưa nhập', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Yếu', color: 'bg-rose-500', text: 'text-rose-500' };
      case 2:
        return { score: 50, label: 'Trung bình', color: 'bg-amber-500', text: 'text-amber-500' };
      case 3:
        return { score: 75, label: 'Khá', color: 'bg-sky-500', text: 'text-sky-500' };
      case 4:
        return { score: 100, label: 'Mạnh', color: 'bg-emerald-500', text: 'text-emerald-500' };
      default:
        return { score: 15, label: 'Rất ngắn', color: 'bg-rose-400', text: 'text-rose-400' };
    }
  };

  const strength = getPasswordStrength(formData.newPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword.length < 6) {
      setValidationError('Mật khẩu mới phải có tối thiểu 6 ký tự!');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setValidationError('Mật khẩu xác nhận không trùng khớp!');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm max-w-2xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <span className="material-symbols-outlined text-[22px]">lock_reset</span>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Đổi Mật Khẩu & Bảo Mật
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Để bảo vệ tài khoản, vui lòng đặt mật khẩu có ít nhất 6 ký tự kết hợp chữ và số.
          </p>
        </div>
      </div>

      {validationError && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-700 text-xs font-semibold">
          <span className="material-symbols-outlined text-[20px]">error</span>
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Mật khẩu hiện tại <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
              key
            </span>
            <input
              type={showCurrent ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Nhập mật khẩu đang dùng"
              required
              className="w-full pl-11 pr-12 py-3 rounded-2xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showCurrent ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Mật khẩu mới <span className="text-rose-500">*</span>
            </label>
            {formData.newPassword && (
              <span className={`text-xs font-bold ${strength.text}`}>
                Độ mạnh: {strength.label}
              </span>
            )}
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
              lock
            </span>
            <input
              type={showNew ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Ít nhất 6 ký tự"
              required
              className="w-full pl-11 pr-12 py-3 rounded-2xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showNew ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>

          {/* Strength Bar */}
          {formData.newPassword && (
            <div className="mt-2 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${strength.color} transition-all duration-300`}
                style={{ width: `${strength.score}%` }}
              />
            </div>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Xác nhận mật khẩu mới <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
              verified_user
            </span>
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu mới"
              required
              className="w-full pl-11 pr-12 py-3 rounded-2xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showConfirm ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={isChanging}
            className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/20 hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isChanging ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
                <span>Đang đổi mật khẩu...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">lock_clock</span>
                <span>Cập nhật mật khẩu mới</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecurityTab;
