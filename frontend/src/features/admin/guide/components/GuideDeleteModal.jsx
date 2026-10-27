import React from 'react';
import Modal from '../../../../components/common/Modal';
import Button from '../../../../components/common/Button';

export const GuideDeleteModal = ({
  isOpen,
  onClose,
  guide,
  onConfirm,
  isLoading = false,
}) => {
  if (!guide) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xác Nhận Xóa Hướng Dẫn Viên"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-black text-lg flex items-center justify-center shrink-0 border border-primary/20">
            {guide.name ? guide.name.charAt(0).toUpperCase() : 'G'}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-900 truncate">
              {guide.name}
            </h4>
            <p className="text-xs text-slate-500 truncate">
              {guide.specialisation || 'Chưa phân loại chuyên môn'}
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Bạn có chắc chắn muốn xóa hồ sơ hướng dẫn viên này không? Các tour đã phân công hướng dẫn viên này có thể bị ảnh hưởng. Hành động này không thể hoàn tác.
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Hủy bỏ
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Xác Nhận Xóa
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GuideDeleteModal;
