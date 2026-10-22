import React, { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import useLogin from "../hooks/useLogin";

export const LoginForm = () => {
  const { formData, formErrors, isLoading, error, handleChange, handleSubmit } =
    useLogin();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {/* Error Alert */}
      {error && (
        <div className="p-3.5 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5 animate-in fade-in">
          <span className="material-symbols-outlined text-[20px] shrink-0 text-red-600">
            error
          </span>
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
        startIcon={
          <span className="material-symbols-outlined text-[19px]">mail</span>
        }
      />

      {/* Password Field */}
      <Input
        label="Mật khẩu"
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        error={formErrors.password}
        required
        startIcon={
          <span className="material-symbols-outlined text-[19px]">lock</span>
        }
        endIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="hover:text-primary transition-colors focus:outline-none"
            aria-label="Toggle password visibility"
          >
            <span className="material-symbols-outlined text-[20px]">
              {showPassword ? "visibility_off" : "visibility"}
            </span>
          </button>
        }
      />

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between text-xs sm:text-sm">
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
            alert(
              "Vui lòng liên hệ quản trị viên qua email admin@traveltrail.vn để đặt lại mật khẩu.",
            );
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
        className="w-full font-bold shadow-md shadow-sky-500/20"
      >
        Đăng Nhập
      </Button>

      {/* Switch to Register */}
      <p className="text-center text-xs sm:text-sm text-slate-500">
        Chưa có tài khoản TravelTrail?{" "}
        <Link
          to="/register"
          className="font-bold text-primary hover:text-primary-dark underline"
        >
          Đăng ký tài khoản mới
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
