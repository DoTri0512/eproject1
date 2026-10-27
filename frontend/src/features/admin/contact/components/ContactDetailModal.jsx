import React, { useState } from 'react';
import Modal from '../../../../components/common/Modal';
import ContactStatusBadge from './ContactStatusBadge';
import formatDate from '../../../../utils/formatDate';

export const ContactDetailModal = ({
  isOpen,
  onClose,
  contact,
  onUpdateStatus,
  onDeleteClick,
  isSubmitting,
}) => {
  const [copied, setCopied] = useState(false);

  if (!contact) return null;

  const handleCopyEmail = () => {
    if (contact.email) {
      navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const mailtoLink = `mailto:${contact.email}?subject=${encodeURIComponent(
    `[TravelTrail] Phản hồi yêu cầu liên hệ: ${contact.subject || 'Thông tin hỗ trợ'}`
  )}&body=${encodeURIComponent(
    `Xin chào ${contact.name},\n\nTravelTrail đã nhận được yêu cầu liên hệ của bạn với nội dung:\n"${contact.message}"\n\n-------------------------\n`
  )}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết Yêu Cầu Liên Hệ"
      subtitle={`Mã liên hệ: #${(contact._id || '').slice(-6).toUpperCase()}`}
      size="lg"
    >
      <div className="flex flex-col gap-6 py-1">
        {/* Contact Sender Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-sky-50/70 via-blue-50/40 to-slate-50 border border-sky-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-sky-500/20 shrink-0">
              {getInitials(contact.name)}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  {contact.name || 'Khách vãng lai'}
                </h4>
                <ContactStatusBadge status={contact.status} size="sm" />
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-sky-600">mail</span>
                  <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors hover:underline">
                    {contact.email}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                    title="Sao chép email"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copied ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </span>

                {contact.phone && (
                  <span className="flex items-center gap-1 text-slate-700 font-medium">
                    <span className="text-slate-300">•</span>
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">call</span>
                    <a href={`tel:${contact.phone}`} className="hover:text-emerald-700 transition-colors">
                      {contact.phone}
                    </a>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Contact Action Buttons */}
          <div className="flex items-center gap-2 sm:self-center shrink-0">
            <a
              href={mailtoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-3.5 rounded-xl bg-primary hover:bg-sky-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-sky-500/20 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">reply</span>
              <span>Gửi Email phản hồi</span>
            </a>
          </div>
        </div>

        {/* Message Subject and Timing Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm">
          <div>
            <div className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
              Chủ đề yêu cầu
            </div>
            <div className="text-slate-800 font-bold mt-0.5 text-sm">
              {contact.subject || 'Không có tiêu đề cụ thể'}
            </div>
          </div>
          <div>
            <div className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
              Thời gian gửi
            </div>
            <div className="text-slate-800 font-medium mt-0.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-slate-400">schedule</span>
              <span>{formatDate(contact.createdAt, true)}</span>
            </div>
          </div>
        </div>

        {/* Message Content Body */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">chat</span>
            <span>Nội dung tin nhắn từ người dùng</span>
          </label>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap font-normal selection:bg-sky-100 shadow-inner">
            {contact.message}
          </div>
        </div>

        {/* Status Transition Control */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-amber-500">sync_alt</span>
              <span>Chuyển đổi trạng thái xử lý</span>
            </span>
            <span className="text-xs text-slate-400">
              Cập nhật trực tiếp vào cơ sở dữ liệu MongoDB
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              disabled={isSubmitting || contact.status === 'new'}
              onClick={() => onUpdateStatus(contact._id, 'new')}
              className={`h-11 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                contact.status === 'new'
                  ? 'bg-rose-50 border-rose-200 text-rose-700 ring-2 ring-rose-400/20 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'
              } disabled:opacity-50`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Chưa đọc (New)</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting || contact.status === 'read'}
              onClick={() => onUpdateStatus(contact._id, 'read')}
              className={`h-11 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                contact.status === 'read'
                  ? 'bg-sky-50 border-sky-200 text-primary ring-2 ring-sky-400/20 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-sky-50 hover:text-primary hover:border-sky-200'
              } disabled:opacity-50`}
            >
              <span className="material-symbols-outlined text-[16px] text-sky-600">mark_email_read</span>
              <span>Đã đọc (Read)</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting || contact.status === 'resolved'}
              onClick={() => onUpdateStatus(contact._id, 'resolved')}
              className={`h-11 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                contact.status === 'resolved'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 ring-2 ring-emerald-400/20 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
              } disabled:opacity-50`}
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
              <span>Đã giải quyết (Resolved)</span>
            </button>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onDeleteClick(contact)}
            className="h-10 px-3.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            <span>Xóa liên hệ</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ContactDetailModal;
