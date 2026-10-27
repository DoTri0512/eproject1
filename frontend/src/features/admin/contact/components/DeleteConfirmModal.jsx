import React from 'react';
import Modal from '../../../../components/common/Modal';

export const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  contactName,
  isSubmitting,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xác nhận xóa liên hệ"
      subtitle="Hành động này không thể hoàn tác sau khi thực hiện"
      size="sm"
    >
      <div className="flex flex-col gap-5 py-1">
        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-800">
          <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-rose-600">
            <span className="material-symbols-outlined text-[20px]">warning</span>
          </div>
          <div className="text-xs sm:text-sm">
            Bạn có chắc chắn muốn xóa thư liên hệ từ người gửi{' '}
            <strong className="font-bold text-rose-900">{contactName || 'khách hàng'}</strong>?
            Toàn bộ nội dung tin nhắn sẽ bị xóa vĩnh viễn khỏi hệ thống MongoDB.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang xóa...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">delete</span>
                <span>Xóa vĩnh viễn</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
