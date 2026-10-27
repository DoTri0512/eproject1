import React, { useState } from 'react';
import Modal from '../../../../components/common/Modal';

export const TripCancelModal = ({ isOpen, onClose, onConfirm, isCancelling }) => {
  const [selectedReason, setSelectedReason] = useState('Có việc bận gia đình đột xuất');
  const [customNote, setCustomNote] = useState('');

  const reasonOptions = [
    'Có việc bận gia đình đột xuất',
    'Thay đổi lịch trình công tác',
    'Muốn đổi sang tour hoặc ngày khởi hành khác',
    'Lý do sức khỏe',
    'Lý do khác',
  ];

  const handleCancelSubmit = () => {
    const finalReason =
      selectedReason === 'Lý do khác'
        ? (customNote.trim() || 'Lý do khác')
        : customNote.trim()
        ? `${selectedReason}: ${customNote.trim()}`
        : selectedReason;

    onConfirm(finalReason);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Xác Nhận Hủy Đơn Đặt Tour" size="md">
      <div className="space-y-4">
        {/* Warning Alert */}
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
          <span className="material-symbols-outlined text-[20px] text-rose-600 shrink-0 mt-0.5">
            warning
          </span>
          <div className="leading-relaxed">
            <strong className="font-bold block text-sm mb-0.5">Lưu ý quan trọng:</strong>
            Hành động hủy đơn đặt tour này là <strong>không thể hoàn tác</strong>. Sau khi hủy, hệ thống
            sẽ hoàn trả lại chỗ còn trống cho các hành khách khác.
          </div>
        </div>

        {/* Reason Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Vui lòng chọn lý do hủy tour:
          </label>
          <div className="space-y-2">
            {reasonOptions.map((opt) => (
              <label
                key={opt}
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedReason === opt
                    ? 'border-primary bg-sky-50 text-slate-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="cancelReason"
                  value={opt}
                  checked={selectedReason === opt}
                  onChange={() => setSelectedReason(opt)}
                  className="text-primary focus:ring-primary w-4 h-4"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Note */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Ghi chú chi tiết thêm (không bắt buộc):
          </label>
          <textarea
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            rows={3}
            placeholder="Nhập thêm thông tin phản hồi của bạn để TravelTrail nâng cao chất lượng dịch vụ..."
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isCancelling}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
          >
            Đóng, giữ lại đơn
          </button>
          <button
            type="button"
            onClick={handleCancelSubmit}
            disabled={isCancelling}
            className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5"
          >
            {isCancelling ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                <span>Đang xử lý hủy...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">cancel</span>
                <span>Xác nhận hủy đặt tour</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TripCancelModal;
