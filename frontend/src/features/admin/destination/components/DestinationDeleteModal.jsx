import React from 'react';
import Modal from '../../../../components/common/Modal';
import Button from '../../../../components/common/Button';

export const DestinationDeleteModal = ({
  isOpen,
  onClose,
  destination,
  onConfirm,
  isLoading = false,
}) => {
  if (!destination) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xác Nhận Xóa Điểm Đến"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <img
            src={destination.image || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=200&q=80'}
            alt={destination.name}
            className="w-14 h-14 rounded-lg object-cover shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-900 truncate">
              {destination.name}
            </h4>
            <p className="text-xs text-slate-500 truncate">
              {destination.region} • {destination.theme || 'Chung'}
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Bạn có chắc chắn muốn xóa điểm đến này khỏi cơ sở dữ liệu MongoDB Atlas không? Hành động này sẽ không thể khôi phục lại.
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

export default DestinationDeleteModal;
