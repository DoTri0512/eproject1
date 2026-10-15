import React from 'react';
import Modal from '../../../../components/common/Modal';

export const TourDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  tour,
  isSubmitting = false,
}) => {
  if (!tour) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Xác nhận xóa Tour Du Lịch">
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3">
          <span className="material-symbols-outlined text-rose-600 text-[24px] shrink-0 mt-0.5">
            warning
          </span>
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Bạn có chắc chắn muốn xóa tour <strong className="text-slate-900 font-bold">{tour.title}</strong> không?
            Hành động này sẽ xóa vĩnh viễn tour khỏi cơ sở dữ liệu và không thể hoàn tác.
          </div>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl space-y-1">
          <p>Mã tour: <strong className="font-mono text-slate-700">{tour._id}</strong></p>
          <p>Điểm đến: <strong>{tour.destinationId?.name || 'Chưa liên kết'}</strong></p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs sm:text-sm hover:bg-rose-700 shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? 'Đang xóa...' : 'Xóa vĩnh viễn Tour'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TourDeleteModal;
