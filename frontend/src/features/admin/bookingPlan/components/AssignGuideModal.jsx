import React, { useState, useEffect } from 'react';
import Modal from '../../../../components/common/Modal';
import formatDate from '../../../../utils/formatDate';

export const AssignGuideModal = ({
  isOpen,
  onClose,
  plan,
  guides = [],
  onAssign,
  isSubmitting = false,
}) => {
  if (!plan) return null;

  const [selectedGuideId, setSelectedGuideId] = useState('');

  useEffect(() => {
    if (plan) {
      const gId = typeof plan.guideId === 'object' ? plan.guideId?._id : plan.guideId;
      setSelectedGuideId(gId || '');
    }
  }, [plan]);

  const currentGuide = guides.find((g) => g._id === selectedGuideId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedGuideId) {
      alert('Vui lòng chọn Hướng dẫn viên');
      return;
    }
    onAssign(plan._id, selectedGuideId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Phân Công Hướng Dẫn Viên Cho Đoàn"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Departure Plan Summary */}
        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-xs space-y-1.5">
          <div className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
            Thông tin đợt khởi hành
          </div>
          <h4 className="font-bold text-slate-900 text-sm">
            {plan.tourId?.title || 'Tour du lịch'}
          </h4>
          <p className="text-slate-600">
            Khởi hành:{' '}
            <strong className="text-sky-800">{formatDate(plan.departureDate)}</strong>
            {plan.endDate && (
              <>
                {' '}— Về ngày:{' '}
                <strong className="text-sky-800">{formatDate(plan.endDate)}</strong>
              </>
            )}
          </p>
          <p className="text-slate-600">
            Tổng số hành khách trong đoàn:{' '}
            <strong className="text-slate-800">{plan.totalPassengers || 0} khách</strong>
          </p>
        </div>

        {/* Guide Selection Dropdown */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Chọn Hướng dẫn viên phụ trách <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedGuideId}
            onChange={(e) => setSelectedGuideId(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">-- Chọn Hướng Dẫn Viên --</option>
            {guides.map((g) => (
              <option key={g._id} value={g._id}>
                {g.name} • {g.languages?.join(', ') || 'Tiếng Việt'} ({g.experience || '3 năm KN'})
              </option>
            ))}
          </select>
        </div>

        {/* Selected Guide Detail Card */}
        {currentGuide && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 shrink-0 border-2 border-primary/20">
              <img
                src={
                  currentGuide.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
                }
                alt={currentGuide.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                }}
              />
            </div>
            <div className="flex-1 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-slate-900 text-sm">{currentGuide.name}</h5>
                <span className="text-amber-500 font-bold flex items-center gap-0.5 text-xs">
                  ★ {currentGuide.rating || '4.9'}
                </span>
              </div>
              <p className="text-slate-500">
                Chuyên môn: <strong className="text-slate-700">{currentGuide.specialty || 'Văn hóa & Lịch sử'}</strong>
              </p>
              <p className="text-slate-500">
                Ngôn ngữ: <span className="text-sky-700 font-semibold">{currentGuide.languages?.join(', ') || 'Tiếng Việt, Tiếng Anh'}</span>
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !selectedGuideId}
            className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-md shadow-sky-500/20 hover:bg-primary-dark transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                <span>Đang phân công...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">assignment_turned_in</span>
                <span>Xác Nhận Phân Công</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignGuideModal;
