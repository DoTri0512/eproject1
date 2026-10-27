import React, { useState } from "react";
import {
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  Clock,
  Send,
  AlertCircle,
  MessageSquare,
  User,
  Smartphone,
  BookOpen,
} from "lucide-react";
import axiosClient from "../../../../api/axiosClient";
import ENDPOINTS from "../../../../api/endpoints";

const SUBJECTS = [
  "Hỏi về tour du lịch",
  "Hỗ trợ đặt chỗ / Booking",
  "Góp ý & phản hồi dịch vụ",
  "Báo lỗi hệ thống",
  "Hợp tác & đối tác",
  "Khác",
];

const INFO_ITEMS = [
  {
    icon: MapPin,
    label: "Địa chỉ văn phòng",
    value: "123 Đường Nguyễn Huệ, Quận 1\nThành phố Hồ Chí Minh, Việt Nam",
    color: "bg-sky-50 text-sky-600",
  },
  {
    icon: Phone,
    label: "Hotline hỗ trợ",
    value: "1800 1234 (Miễn phí)\n+84 28 3822 5678",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Mail,
    label: "Email hỗ trợ",
    value: "support@traveltrail.vn\ninfo@traveltrail.vn",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: Clock,
    label: "Giờ làm việc",
    value: "Thứ Hai – Thứ Sáu: 8:00 – 18:00\nThứ Bảy: 8:00 – 12:00",
    color: "bg-amber-50 text-amber-600",
  },
];

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState("");

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Vui lòng nhập họ và tên.";
    if (!form.email.trim()) {
      errs.email = "Vui lòng nhập địa chỉ email.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = "Địa chỉ email không hợp lệ.";
    }
    if (!form.message.trim()) errs.message = "Vui lòng nhập nội dung tin nhắn.";
    else if (form.message.trim().length < 10)
      errs.message = "Nội dung tối thiểu 10 ký tự.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMsg("");

    try {
      await axiosClient.post(ENDPOINTS.CONTACTS.BASE, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject || "Khác",
        message: form.message.trim(),
      });
      setSubmitStatus("success");
      setForm(initialForm);
    } catch (err) {
      setSubmitStatus("error");
      setErrorMsg(err.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-[110px] pb-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Banner Section */}
        <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-400 text-white p-8 sm:p-12 shadow-md">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 backdrop-blur-md text-white font-medium   mb-3">
              <span className="material-symbols-outlined text-[14px]">
                support_agent
              </span>
              <span className="text-[14px]">TRUNG TÂM HỖ TRỢ 24/7</span>
            </span>
            <h1 className="text-3xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-white">
              Liên Hệ & Hỗ Trợ Khách Hàng
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6 max-w-xl mx-auto">
              Bạn có thắc mắc về tour du lịch, cần hỗ trợ đặt chỗ hay muốn góp ý
              phản hồi? Đội ngũ TravelTrail luôn sẵn sàng lắng nghe và giải đáp
              tận tình.
            </p>

            {/* Quick contact pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs font-medium text-white/95">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xs">
                <span className="material-symbols-outlined text-[16px] text-sky-200">
                  call
                </span>
                Hotline: 1800 1234
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xs">
                <span className="material-symbols-outlined text-[16px] text-sky-200">
                  mail
                </span>
                support@traveltrail.vn
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xs">
                <span className="material-symbols-outlined text-[16px] text-sky-200">
                  schedule
                </span>
                Phản hồi trong 1-2h
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Left: Contact Info */}
            <aside className="space-y-5 lg:col-span-1">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Thông tin liên hệ
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Liên hệ trực tiếp qua các kênh bên dưới hoặc điền form để
                  chúng tôi phản hồi trong 1–2 ngày làm việc.
                </p>
              </div>

              <div className="space-y-4">
                {INFO_ITEMS.map(({ icon: Icon, label, value, color }) => (
                  <div
                    key={label}
                    className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
                  >
                    <div
                      className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${color}`}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {label}
                      </div>
                      {value.split("\n").map((line, i) => (
                        <div
                          key={i}
                          className="mt-0.5 text-sm font-semibold text-slate-800"
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <iframe
                  title="TravelTrail Office Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.445!2d106.700!3d10.773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38f9ed887b%3A0x14aded5703768989!2zTmd1eeG7hW4gSHXhu4csIFF14bqtbiAxLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2svn!4v1700000000000"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="opacity-90"
                />
                <div className="px-4 py-3 text-xs font-medium text-slate-500">
                  📍 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh
                </div>
              </div>
            </aside>

            {/* Right: Contact Form */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Gửi tin nhắn cho chúng tôi
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Điền thông tin vào form bên dưới, chúng tôi sẽ phản hồi trong
                  vòng 1–2 ngày làm việc.
                </p>

                {/* Success State */}
                {submitStatus === "success" && (
                  <div className="mt-6 flex items-start gap-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                    <CheckCircle
                      className="mt-0.5 shrink-0 text-emerald-500"
                      size={22}
                    />
                    <div>
                      <div className="font-bold text-emerald-800">
                        Gửi thành công! 🎉
                      </div>
                      <p className="mt-0.5 text-sm text-emerald-700">
                        Cảm ơn bạn đã liên hệ với TravelTrail. Đội ngũ của chúng
                        tôi sẽ phản hồi trong 1–2 ngày làm việc qua địa chỉ
                        email của bạn.
                      </p>
                      <button
                        type="button"
                        onClick={() => setSubmitStatus(null)}
                        className="mt-3 text-xs font-semibold text-emerald-600 underline underline-offset-2 hover:text-emerald-800"
                      >
                        Gửi thêm tin nhắn khác
                      </button>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {submitStatus === "error" && (
                  <div className="mt-6 flex items-start gap-4 rounded-2xl border border-rose-100 bg-rose-50 p-5">
                    <AlertCircle
                      className="mt-0.5 shrink-0 text-rose-500"
                      size={22}
                    />
                    <div>
                      <div className="font-bold text-rose-800">
                        Gửi thất bại
                      </div>
                      <p className="mt-0.5 text-sm text-rose-700">{errorMsg}</p>
                    </div>
                  </div>
                )}

                {submitStatus !== "success" && (
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="mt-7 space-y-5"
                  >
                    {/* Row 1: Name + Email */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500"
                        >
                          <User size={12} />
                          Họ và tên <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Nguyễn Văn A"
                          disabled={isSubmitting}
                          className={`w-full rounded-xl border px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400/60 transition-colors disabled:opacity-60 ${
                            errors.name
                              ? "border-rose-300 bg-rose-50"
                              : "border-slate-200 bg-slate-50 hover:border-slate-300"
                          }`}
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs font-medium text-rose-500">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500"
                        >
                          <Mail size={12} />
                          Địa chỉ Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="example@email.com"
                          disabled={isSubmitting}
                          className={`w-full rounded-xl border px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400/60 transition-colors disabled:opacity-60 ${
                            errors.email
                              ? "border-rose-300 bg-rose-50"
                              : "border-slate-200 bg-slate-50 hover:border-slate-300"
                          }`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs font-medium text-rose-500">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Phone + Subject */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500"
                        >
                          <Smartphone size={12} />
                          Số điện thoại
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="0901 234 567"
                          disabled={isSubmitting}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400/60 transition-colors hover:border-slate-300 disabled:opacity-60"
                        />
                      </div>

                      {/* Subject */}
                      <div>
                        <label
                          htmlFor="contact-subject"
                          className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500"
                        >
                          <BookOpen size={12} />
                          Chủ đề
                        </label>
                        <select
                          id="contact-subject"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400/60 transition-colors hover:border-slate-300 disabled:opacity-60 cursor-pointer"
                        >
                          <option value="">-- Chọn chủ đề --</option>
                          {SUBJECTS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="contact-message"
                        className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500"
                      >
                        <MessageSquare size={12} />
                        Nội dung tin nhắn{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Nhập nội dung bạn muốn chia sẻ hoặc câu hỏi cần hỗ trợ..."
                        disabled={isSubmitting}
                        className={`w-full resize-none rounded-xl border px-4 py-3 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400/60 transition-colors disabled:opacity-60 ${
                          errors.message
                            ? "border-rose-300 bg-rose-50"
                            : "border-slate-200 bg-slate-50 hover:border-slate-300"
                        }`}
                      />
                      <div className="mt-1 flex items-center justify-between">
                        {errors.message ? (
                          <p className="text-xs font-medium text-rose-500">
                            {errors.message}
                          </p>
                        ) : (
                          <span />
                        )}
                        <span
                          className={`text-xs font-medium ${form.message.length > 800 ? "text-rose-500" : "text-slate-400"}`}
                        >
                          {form.message.length} / 1000
                        </span>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-between pt-2">
                      <p className="text-xs text-slate-400">
                        Trường có dấu{" "}
                        <span className="text-rose-500 font-bold">*</span> là
                        bắt buộc.
                      </p>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-7 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/30 transition-all hover:from-sky-600 hover:to-sky-700 hover:shadow-lg hover:shadow-sky-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                            <span>Đang gửi...</span>
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            <span>Gửi tin nhắn</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* FAQ Section */}
              <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm">
                <h3 className="text-base font-extrabold text-slate-900">
                  Câu hỏi thường gặp
                </h3>
                <div className="mt-4 space-y-4">
                  {[
                    {
                      q: "Tôi có thể hủy tour đã đặt không?",
                      a: "Có, bạn có thể hủy đơn đặt tour khi đơn đang ở trạng thái Chờ xác nhận (Pending) qua trang Đơn đặt tour của tôi.",
                    },
                    {
                      q: "Thời gian xử lý yêu cầu liên hệ bao lâu?",
                      a: "Chúng tôi cam kết phản hồi tất cả yêu cầu trong vòng 1–2 ngày làm việc kể từ khi nhận được.",
                    },
                    {
                      q: "Tôi có thể đặt tour cho đoàn lớn hơn 20 người không?",
                      a: "Vui lòng liên hệ trực tiếp qua Hotline hoặc Email để được tư vấn và hỗ trợ đặt chỗ cho đoàn đặc biệt.",
                    },
                  ].map(({ q, a }) => (
                    <div
                      key={q}
                      className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="text-sm font-bold text-slate-800">
                        {q}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">{a}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
