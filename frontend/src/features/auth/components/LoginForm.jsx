import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import useLogin from '../hooks/useLogin';

export const LoginForm = () => {
  const {
    formData,
    formErrors,
    isLoading,
    error,
    handleChange,
    handleSubmit,
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4.5 w-full">
      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5 animate-in fade-in">
          <span className="material-symbols-outlined text-[20px] shrink-0 text-red-600">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Email Field */}
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

      {/* Password Field */}
      <Input
        label="Mật khẩu"
        type={showPassword ? 'text' : 'password'}
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
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

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5">
        <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="w-4 h-4 rounded text-primary border-slate-300 focus:ring-primary focus:ring-offset-0 cursor-pointer"
          />
          <span>Ghi nhớ thiết bị</span>
        </label>
        <a
          href="#forgot"
          onClick={(e) => {
            e.preventDefault();
            alert('Vui lòng liên hệ quản trị viên qua email admin@traveltrail.vn để đặt lại mật khẩu.');
          }}
          className="font-medium text-primary hover:text-primary-dark transition-colors"
        >
          Quên mật khẩu?
        </a>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full mt-2 font-bold shadow-md shadow-sky-500/20"
      >
        Đăng Nhập
      </Button>

      {/* Divider */}
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-slate-400 font-medium">Hoặc đăng nhập với</span>
        </div>
      </div>

      {/* Social Login Options */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => alert('Đăng nhập bằng Google đang được cập nhật!')}
          className="h-11 flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Google</span>
        </button>

        <button
          type="button"
          onClick={() => alert('Đăng nhập bằng Facebook đang được cập nhật!')}
          className="h-11 flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 shadow-sm"
        >
          <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span>Facebook</span>
        </button>
      </div>

      {/* Switch to Register */}
      <p className="text-center text-xs sm:text-sm text-slate-500 mt-2">
        Chưa có tài khoản TravelTrail?{' '}
        <Link to="/register" className="font-bold text-primary hover:text-primary-dark underline">
          Đăng ký tài khoản mới
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
