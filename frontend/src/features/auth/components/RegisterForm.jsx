import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import useRegister from '../hooks/useRegister';

export const RegisterForm = () => {
  const {
    formData,
    formErrors,
    passwordStrength,
    isLoading,
    error,
    successMessage,
    handleChange,
    handleSubmit,
  } = useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Strength label & color
  const strengthInfo = [
    { label: 'Rất yếu', color: 'bg-slate-200', text: 'text-slate-400' },
    { label: 'Yếu', color: 'bg-rose-500', text: 'text-rose-600' },
    { label: 'Trung bình', color: 'bg-amber-500', text: 'text-amber-600' },
    { label: 'Khá', color: 'bg-sky-500', text: 'text-sky-600' },
    { label: 'Rất mạnh', color: 'bg-emerald-500', text: 'text-emerald-600' },
  ][passwordStrength];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5 animate-in fade-in">
          <span className="material-symbols-outlined text-[20px] shrink-0 text-red-600">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-start gap-2.5 animate-in fade-in">
          <span className="material-symbols-outlined text-[20px] shrink-0 text-emerald-600">check_circle</span>
          <span>{successMessage} Đang chuyển hướng...</span>
        </div>
      )}

      {/* Full Name */}
      <Input
        label="Họ và tên"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nguyễn Văn A"
        error={formErrors.name}
        required
        startIcon={<span className="material-symbols-outlined text-[19px]">badge</span>}
      />

      {/* Email */}
      <Input
        label="Địa chỉ Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="nguyenvana@gmail.com"
        error={formErrors.email}
        required
        startIcon={<span className="material-symbols-outlined text-[19px]">mail</span>}
      />

      {/* Phone */}
      <Input
        label="Số điện thoại"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="0912345678"
        error={formErrors.phone}
        required
        startIcon={<span className="material-symbols-outlined text-[19px]">call</span>}
      />

      {/* Password */}
      <div>
        <Input
          label="Mật khẩu"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Tối thiểu 6 ký tự"
          error={formErrors.password}
          required
          startIcon={<span className="material-symbols-outlined text-[19px]">lock</span>}
          endIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:text-primary transition-colors focus:outline-none"
              aria-label="Toggle password visibility"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          }
        />

        {/* Password Strength Meter */}
        {formData.password && (
          <div className="mt-2 flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Độ mạnh mật khẩu:</span>
              <span className={`font-bold ${strengthInfo.text}`}>{strengthInfo.label}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 h-1.5">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`rounded-full transition-all duration-300 ${
                    passwordStrength >= step ? strengthInfo.color : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <Input
        label="Xác nhận mật khẩu"
        type={showConfirmPassword ? 'text' : 'password'}
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Nhập lại mật khẩu"
        error={formErrors.confirmPassword}
        required
        startIcon={<span className="material-symbols-outlined text-[19px]">verified_user</span>}
        endIcon={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="hover:text-primary transition-colors focus:outline-none"
            aria-label="Toggle password visibility"
          >
            <span className="material-symbols-outlined text-[20px]">
              {showConfirmPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        }
      />

      {/* Terms Agreement */}
      <div className="flex flex-col gap-1 pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-slate-600">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="w-4 h-4 mt-0.5 rounded text-primary border-slate-300 focus:ring-primary focus:ring-offset-0 cursor-pointer shrink-0"
          />
          <span>
            Tôi đồng ý với{' '}
            <a href="#terms" className="font-semibold text-primary hover:underline">
              Điều khoản dịch vụ
            </a>{' '}
            và{' '}
            <a href="#privacy" className="font-semibold text-primary hover:underline">
              Chính sách bảo mật
            </a>{' '}
            của TravelTrail.
          </span>
        </label>
        {formErrors.agreeTerms && (
          <span className="text-xs text-error font-medium">{formErrors.agreeTerms}</span>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full mt-2 font-bold shadow-md shadow-sky-500/20"
      >
        Đăng Ký Tài Khoản
      </Button>

      {/* Switch to Login */}
      <p className="text-center text-xs sm:text-sm text-slate-500 mt-2">
        Đã có tài khoản TravelTrail?{' '}
        <Link to="/login" className="font-bold text-primary hover:text-primary-dark underline">
          Đăng nhập ngay
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
