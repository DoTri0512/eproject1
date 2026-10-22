import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

export const Login = () => {
  return (
    <div className="relative min-h-[calc(100vh-80px)] py-8 pt-[100px] px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden bg-[#f8fafc]">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] rounded-full bg-cyan-200/30 blur-3xl pointer-events-none" />

      {/* Main 2-Column Card */}
      <div className="relative z-10 w-full max-w-[1140px] grid grid-cols-1 lg:grid-cols-12 rounded-2xl bg-white shadow-soft border border-slate-100 overflow-hidden">
        {/* Left Visual Column */}
        <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-7 overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80')`,
            }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/60 to-primary/40 backdrop-blur-[1px]" />

          {/* Top Badges */}
          <div className="relative z-10 flex flex-col items-start gap-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wide uppercase">
              <span className="material-symbols-outlined text-[16px] text-cyan-300">
                verified
              </span>
              <span>Du Lịch Bản Địa Việt Nam</span>
            </div>
            <div className="flex items-center gap-1.5 text-sky-200 text-xs font-semibold">
              <span className="material-symbols-outlined text-[18px]">
                sailing
              </span>
              <span>Hơn 450+ tuyến đường trải nghiệm</span>
            </div>
          </div>

          {/* Center Story */}
          <div className="relative z-10 my-auto py-3">
            <div className="w-12 h-1 bg-cyan-400 rounded-full mb-4" />
            <h1 className="text-2xl xl:text-3xl font-extrabold text-white leading-tight mb-3">
              Đồng hành cùng TravelTrail trên mọi hành trình mơ ước
            </h1>
            <p className="text-sm text-slate-200/90 leading-relaxed mb-6">
              Mở cánh cửa đến những vùng đất di sản nguyên bản, phong vị địa
              phương và hệ thống hành trình cá nhân hoá dành riêng cho bạn.
            </p>

            {/* Core Benefits */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center text-cyan-300 shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    verified_user
                  </span>
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">
                    Bảo mật tài khoản tuyệt đối
                  </h2>
                  <p className="text-[11px] text-slate-300">
                    Xác thực mã hóa an toàn & chuẩn JWT token
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center text-cyan-300 shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    sync
                  </span>
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">
                    Đồng bộ lịch trình thông minh
                  </h2>
                  <p className="text-[11px] text-slate-300">
                    Truy cập tức thì vé tour, bản đồ & yêu thích
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center text-cyan-300 shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    loyalty
                  </span>
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">
                    Ưu đãi thành viên tới 20%
                  </h2>
                  <p className="text-[11px] text-slate-300">
                    Nhận giá đặc quyền cho tất cả các điểm đến
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Footer */}
          <div className="relative z-10 flex items-center justify-between p-3.5 bg-white/10 backdrop-blur-md rounded-xl text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white">
                  VN
                </div>
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white">
                  TT
                </div>
                <div className="w-7 h-7 rounded-full bg-cyan-600 flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white">
                  DA
                </div>
              </div>
              <div>
                <p className="text-xs font-bold">+82.000 Khách hàng</p>
                <p className="text-[11px] text-slate-300">Đánh giá 4.9/5 sao</p>
              </div>
            </div>
            <div className="flex items-center text-amber-300 text-xs font-bold gap-1">
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span>4.9</span>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-5 sm:p-8 xl:p-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Header Brand for Mobile */}
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100">
                <span className="material-symbols-outlined text-[24px]">
                  explore
                </span>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                TravelTrail
              </span>
            </div>

            <div className="mb-4">
              <div className="inline-flex items-center gap-1 text-xl font-bold text-primary uppercase tracking-wider mb-1">
                <h3>Chào mừng trở lại</h3>
              </div>
              <h2 className="text-xl mt-2 sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Đăng Nhập Tài Khoản
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Nhập email và mật khẩu của bạn để truy cập hệ thống TravelTrail
              </p>
            </div>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
