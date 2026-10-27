import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Compass,
  Eye,
  Globe,
  Heart,
  HeartHandshake,
  Map,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import axiosClient from "../../../../api/axiosClient";
import { ENDPOINTS } from "../../../../api/endpoints";

/* ─────────────────────── data ─────────────────────── */
const coreValues = [
  {
    icon: ShieldCheck,
    title: "Minh bạch giá cả",
    description:
      "Giá tour được niêm yết rõ ràng, không phát sinh ẩn phí. Bạn luôn biết chính xác mình đang trả tiền cho điều gì.",
    color: "from-emerald-500 to-teal-400",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    icon: Star,
    title: "Chất lượng dịch vụ vượt trội",
    description:
      "Từng điểm đến và tour được chọn lọc kỹ lưỡng, đảm bảo tiêu chuẩn cao nhất cho trải nghiệm của bạn.",
    color: "from-amber-500 to-orange-400",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  {
    icon: HeartHandshake,
    title: "Hỗ trợ tận tâm 24/7",
    description:
      "Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc, từ lúc lên kế hoạch đến khi kết thúc hành trình.",
    color: "from-rose-500 to-pink-400",
    bg: "bg-rose-50",
    text: "text-rose-600",
  },
  {
    icon: Zap,
    title: "Đổi mới trải nghiệm số",
    description:
      "Ứng dụng công nghệ hiện đại để đặt tour, theo dõi hành trình và khám phá điểm đến trở nên dễ dàng hơn bao giờ hết.",
    color: "from-violet-500 to-purple-400",
    bg: "bg-violet-50",
    text: "text-violet-600",
  },
];

/* ─────────── animated counter hook ─────────── */
function useCountUp(target, duration = 1600, shouldStart = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart || !target) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, shouldStart]);
  return count;
}

/* ─────────── stats card ─────────── */
function StatCard({ icon: Icon, label, value, suffix = "+", color, delay }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const animated = useCountUp(value, 1600, visible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group relative flex flex-col items-center rounded-3xl border border-white/60 bg-white/70 p-8 text-center shadow-lg shadow-sky-900/5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-900/10"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg`}
      >
        <Icon className="h-7 w-7 text-white" />
      </div>
      <p className="text-4xl font-black tabular-nums text-slate-900">
        {animated.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-1.5 text-sm font-semibold text-slate-500">{label}</p>
    </div>
  );
}

// Giá trị mặc định fix cứng cho UI theo yêu cầu
const DEFAULT_STATS = {
  totalDestinations: 64,
  totalTours: 120,
  totalBookings: 2500,
  totalRegions: 3,
};

/* ─────────── main component ─────────── */
export const About = () => {
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    // Tự động cập nhật nếu API backend khả dụng, nếu không giữ số liệu fix cứng mặc định
    axiosClient
      .get(ENDPOINTS.STATS.SUMMARY)
      .then((res) => {
        const data = res?.data ?? res;
        if (data && typeof data === "object") {
          setStats((prev) => ({
            totalDestinations: data.totalDestinations || prev.totalDestinations,
            totalTours: data.totalTours || prev.totalTours,
            totalBookings: data.totalBookings || prev.totalBookings,
            totalRegions: data.totalRegions || prev.totalRegions,
          }));
        }
      })
      .catch(() => {
        // Giữ nguyên số liệu mặc định
      });
  }, []);

  const statItems = [
    {
      icon: Map,
      label: "Điểm đến",
      value: stats.totalDestinations,
      color: "from-sky-500 to-cyan-400",
      delay: 0,
    },
    {
      icon: Compass,
      label: "Tour du lịch",
      value: stats.totalTours,
      color: "from-violet-500 to-purple-400",
      delay: 100,
    },
    {
      icon: Users,
      label: "Lượt đặt thành công",
      value: stats.totalBookings,
      color: "from-rose-500 to-pink-400",
      delay: 200,
    },
    {
      icon: Globe,
      label: "Vùng miền",
      value: stats.totalRegions,
      color: "from-emerald-500 to-teal-400",
      delay: 300,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-[110px] pb-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Banner Section */}
        <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-400 text-white p-8 sm:p-12 shadow-md">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 backdrop-blur-md text-white font-medium mb-3">
              <span className="material-symbols-outlined text-[14px]">
                explore
              </span>
              <span className="text-[14px]">VỀ CHÚNG TÔI</span>
            </span>
            <h1 className="text-3xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white">
              Người Đồng Hành Du Lịch Tin Cậy
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl mx-auto">
              Kết nối du khách tới những vẻ đẹp ẩn giấu của thiên nhiên và văn
              hóa Việt Nam thông qua nền tảng công nghệ du lịch hiện đại, minh
              bạch và tiện lợi.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/destinations"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-3 text-sm font-bold text-sky-700 shadow-md transition-all hover:-translate-y-0.5 hover:bg-sky-50 hover:shadow-lg"
              >
                <span>Khám phá điểm đến</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/tours"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <span>Xem các tour</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════ MISSION & VISION ══════════════ */}
      <section className="px-4 py-14 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-stretch">
          {/* Mission */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 to-cyan-500 p-8 text-white shadow-2xl shadow-sky-700/30 sm:p-10">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl" />
            <div className="relative">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <Heart className="h-7 w-7" />
              </div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-cyan-100">
                Sứ mệnh
              </p>
              <h2 className="text-2xl font-black leading-snug sm:text-3xl">
                Our Mission
              </h2>
              <p className="mt-4 text-sm leading-7 text-sky-50/90 sm:text-base">
                Kết nối du khách tới những vẻ đẹp ẩn giấu của thiên nhiên và văn
                hóa Việt Nam thông qua nền tảng công nghệ du lịch hiện đại, minh
                bạch và tiện lợi. Chúng tôi tin rằng mỗi hành trình là một câu
                chuyện đáng được kể.
              </p>
              <ul className="mt-6 space-y-2">
                {[
                  "Kết nối con người với thiên nhiên",
                  "Hành trình cá nhân hóa",
                  "Công nghệ minh bạch",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-sky-50"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                      <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Vision */}
          <div className="group relative overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-600 to-purple-500 p-8 text-white shadow-2xl shadow-violet-700/30 sm:p-10">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-300/20 blur-2xl" />
            <div className="relative">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <Eye className="h-7 w-7" />
              </div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-purple-100">
                Tầm nhìn
              </p>
              <h2 className="text-2xl font-black leading-snug sm:text-3xl">
                Our Vision
              </h2>
              <p className="mt-4 text-sm leading-7 text-purple-50/90 sm:text-base">
                Trở thành ứng dụng đặt tour và khám phá điểm đến hàng đầu Việt
                Nam — cung cấp các hành trình cá nhân hóa chất lượng cao, giúp
                mỗi chuyến đi trở thành một kỷ niệm đáng nhớ.
              </p>
              <ul className="mt-6 space-y-2">
                {[
                  "Dẫn đầu về trải nghiệm số",
                  "Cá nhân hóa từng hành trình",
                  "Chất lượng cao nhất",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-purple-50"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                      <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ STATS SECTION ══════════════ */}
      <section className="mt-10 relative overflow-hidden bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 px-4 py-20 sm:py-18">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.15)_0%,transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-2xl font-bold uppercase tracking-widest text-sky-400">
              Con số nói lên tất cả
            </p>
            <h2 className="text-2xl font-black text-white sm:text-4xl">
              TravelTrail trong{" "}
              <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                những con số
              </span>
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statItems.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CORE VALUES ══════════════ */}
      <section id="values" className="px-4 py-20 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-sky-600">
              Giá trị cốt lõi
            </p>
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">
              Những điều chúng tôi
              <span className="ml-2 bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">
                cam kết
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              Bốn giá trị nền tảng định hình mọi quyết định và dịch vụ của
              TravelTrail.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map(
              ({ icon: Icon, title, description, color, bg, text }, i) => (
                <article
                  key={title}
                  className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-900/10"
                >
                  {/* top gradient stripe on hover */}
                  <div
                    className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${bg}`}
                  >
                    <Icon className={`h-6 w-6 ${text}`} />
                  </div>
                  <h3 className="text-base font-black text-slate-900">
                    {title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-6 text-slate-500">
                    {description}
                  </p>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ══════════════ STORY SPLIT ══════════════ */}
      <section className="px-4 pb-24 sm:pb-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-xl shadow-sky-900/5">
          <div className="grid lg:grid-cols-2">
            {/* left text */}
            <div className="flex flex-col justify-center p-10 sm:p-14">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-sky-600">
                Câu chuyện của chúng tôi
              </p>
              <h2 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
                Một nơi để cảm hứng du lịch thành hành trình thực sự
              </h2>
              <div className="mt-6 space-y-4 text-sm leading-7 text-slate-500 sm:text-base">
                <p>
                  TravelTrail ra đời từ niềm tin rằng việc tìm kiếm và đặt chỗ
                  cho một chuyến đi đáng nhớ không nên là điều phức tạp. Từ ý
                  tưởng ban đầu đến hiện thực, chúng tôi đã xây dựng một nền
                  tảng kết hợp dữ liệu điểm đến phong phú với trải nghiệm đặt
                  tour liền mạch.
                </p>
                <p>
                  Với đội ngũ am hiểu du lịch và công nghệ, TravelTrail không
                  chỉ là một trang web — đây là người bạn đồng hành đáng tin cậy
                  trên mỗi hành trình.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/destinations"
                  className="group inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-600/30 transition-all hover:-translate-y-0.5 hover:bg-sky-700"
                >
                  Khám phá ngay
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                >
                  Liên hệ chúng tôi
                </Link>
              </div>
            </div>

            {/* right visual */}
            <div className="relative hidden items-center justify-center overflow-hidden bg-gradient-to-br from-sky-600 to-cyan-500 p-12 lg:flex">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-cyan-300/15 blur-3xl" />
              <div className="relative grid grid-cols-2 gap-4">
                {[
                  { label: "Điểm đến", icon: Map },
                  { label: "Tour", icon: Compass },
                  { label: "Khách hàng", icon: Users },
                  { label: "Đánh giá", icon: Sparkles },
                ].map(({ label, icon: Ic }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/15 p-6 backdrop-blur-sm transition-all hover:bg-white/25"
                  >
                    <Ic className="h-8 w-8 text-white" />
                    <span className="text-xs font-bold text-white">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ CTA BANNER ══════════════ */}
      <section className="px-4 pb-5 sm:pb-5">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-500" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-300/15 blur-3xl" />

          <div className="relative px-8 py-14 text-center text-white sm:px-12 sm:py-20">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/90 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Sẵn sàng khám phá?
            </span>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              Hành trình tiếp theo của bạn
              <br className="hidden sm:block" /> sẽ bắt đầu ở đâu?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-sky-50/90">
              Dạo quanh hàng trăm điểm đến và bộ sưu tập của TravelTrail để tìm
              ý tưởng cho chuyến đi mà bạn đang mong đợi.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/destinations"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-sm font-bold text-sky-700 shadow-xl shadow-sky-900/20 transition-all hover:-translate-y-0.5 hover:bg-sky-50"
              >
                Bắt đầu khám phá
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/collections"
                className="inline-flex items-center justify-center rounded-2xl border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                Xem bộ sưu tập
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
