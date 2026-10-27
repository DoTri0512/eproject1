import React from 'react';
import Modal from '../../../../components/common/Modal';
import Button from '../../../../components/common/Button';

export const CollectionDeleteModal = ({
  isOpen,
  onClose,
  collection,
  onConfirm,
  isLoading = false,
}) => {
  if (!collection) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Xác Nhận Xóa Bộ Sưu Tập"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 font-black text-lg flex items-center justify-center shrink-0 border border-amber-500/20">
            <span className="material-symbols-outlined text-[24px]">collections_bookmark</span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-900 truncate">
              {collection.name}
            </h4>
            <p className="text-xs text-slate-500 truncate">
              {collection.destinations?.length || 0} điểm đến trong bộ sưu tập
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Bạn có chắc chắn muốn xóa bộ sưu tập này không? Các điểm đến bên trong sẽ không bị xóa khỏi cơ sở dữ liệu, nhưng sẽ được giải phóng khỏi bộ sưu tập này.
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

export default CollectionDeleteModal;
