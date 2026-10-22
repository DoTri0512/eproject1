import React from "react";
import RegisterForm from "../components/RegisterForm";

export const Register = () => {
  return (
    <div className="relative min-h-[calc(100vh-80px)] py-8 pt-[100px] px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden bg-[#f8fafc]">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-sky-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-[30rem] h-[30rem] rounded-full bg-cyan-200/30 blur-3xl pointer-events-none" />

      {/* Main 2-Column Card */}
      <div className="relative z-10 w-full max-w-[1140px] grid grid-cols-1 lg:grid-cols-12 rounded-2xl bg-white shadow-soft border border-slate-100 overflow-hidden">
        {/* Left Visual Column */}
        <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-7 overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80')`,
            }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/60 to-primary/40 backdrop-blur-[1px]" />

          {/* Top Badges */}
          <div className="relative z-10 flex flex-col items-start gap-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wide uppercase">
              <span className="material-symbols-outlined text-[16px] text-cyan-300">
                workspace_premium
              </span>
              <span>Đặc Quyền Thành Viên</span>
            </div>
            <div className="flex items-center gap-1.5 text-sky-200 text-xs font-semibold">
              <span className="material-symbols-outlined text-[18px]">
                card_giftcard
              </span>
              <span>Tặng voucher 300.000₫ khi kích hoạt tài khoản</span>
            </div>
          </div>

          {/* Center Story */}
          <div className="relative z-10 my-auto py-3">
            <div className="w-12 h-1 bg-cyan-400 rounded-full mb-4" />
            <h1 className="text-2xl xl:text-3xl font-extrabold text-white leading-tight mb-3">
              Mở Khóa Trải Nghiệm Du Lịch Đỉnh Cao
            </h1>
            <p className="text-sm text-slate-200/90 leading-relaxed mb-6">
              Đăng ký thành viên TravelTrail để lập kế hoạch du lịch không giới
              hạn, lưu địa danh yêu thích và đặt tour với mức giá ưu đãi nhất
              thị trường.
            </p>

            {/* Core Member Perks */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center text-cyan-300 shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    favorite
                  </span>
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">
                    Lưu danh sách yêu thích
                  </h2>
                  <p className="text-[11px] text-slate-300">
                    Đồng bộ mọi thiết bị với cơ sở dữ liệu thời gian thực
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center text-cyan-300 shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    calendar_month
                  </span>
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">
                    Lập kế hoạch chuyến đi (Trip Planner)
                  </h2>
                  <p className="text-[11px] text-slate-300">
                    Sắp xếp ngày đi, gợi ý điểm dừng chân & lộ trình tour
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center text-cyan-300 shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    local_offer
                  </span>
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white">
                    Chiết khấu tour độc quyền
                  </h2>
                  <p className="text-[11px] text-slate-300">
                    Giảm từ 10% - 25% cho các tour hot trong mùa hè này
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Footprint */}
          <div className="relative z-10 p-3.5 bg-white/10 backdrop-blur-md rounded-xl text-white text-xs">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold mb-1">
              <span className="material-symbols-outlined text-base">
                verified_user
              </span>
              <span>100% Cam kết bảo mật thông tin</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Thông tin cá nhân của bạn được mã hóa an toàn theo tiêu chuẩn quốc
              tế.
            </p>
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
                <h3>Tham gia cộng đồng</h3>
              </div>
              <h2 className="text-xl mt-2 sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Đăng Ký Tài Khoản Mới
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Trở thành thành viên để khám phá trọn vẹn mọi hành trình cùng
                TravelTrail
              </p>
            </div>

            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
