import React, { useState } from 'react';
import Modal from '../../../../components/common/Modal';
import Button from '../../../../components/common/Button';
import Badge from '../../../../components/common/Badge';

export const GuideDetailModal = ({
  isOpen,
  onClose,
  guide,
  allDestinations = [],
  onAddDestinations,
  onRemoveDestination,
  isLoading = false,
}) => {
  const [selectedToAdd, setSelectedToAdd] = useState([]);
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  if (!guide) return null;

  const currentDestinations = Array.isArray(guide.destinations)
    ? guide.destinations
    : [];

  const currentDestIds = currentDestinations.map((d) =>
    typeof d === 'object' ? d._id : d
  );

  // Available destinations that this guide does NOT have yet
  const availableToAdd = allDestinations.filter(
    (d) => !currentDestIds.includes(d._id)
  );

  const handleToggleAddSelect = (destId) => {
    setSelectedToAdd((prev) =>
      prev.includes(destId) ? prev.filter((id) => id !== destId) : [...prev, destId]
    );
  };

  const handleConfirmAdd = async () => {
    if (selectedToAdd.length === 0) return;
    try {
      setActionLoading(true);
      await onAddDestinations(guide._id, selectedToAdd);
      setSelectedToAdd([]);
      setIsAddingOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = async (destId) => {
    if (!window.confirm('Bạn có chắc muốn gỡ điểm đến này khỏi danh sách phụ trách?')) return;
    try {
      setActionLoading(true);
      await onRemoveDestination(guide._id, destId);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi Tiết Hướng Dẫn Viên"
      subtitle={`Hồ sơ chi tiết & Điểm đến phụ trách của "${guide.name}"`}
      size="xl"
    >
      <div className="flex flex-col gap-6 p-1 max-h-[75vh] overflow-y-auto pr-1">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-primary text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-sky-500/30 shrink-0">
              {guide.name ? guide.name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-black text-white">{guide.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  {guide.specialisation || 'Chuyên môn'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Slug: <span className="font-mono text-slate-400">{guide.slug}</span>
              </p>
              {/* Languages */}
              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                <span className="text-xs text-slate-400">Ngôn ngữ:</span>
                {(guide.languages || ['Tiếng Việt']).map((lang, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-slate-700/60 text-slate-200 text-[11px] rounded-md font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="px-3.5 py-2 rounded-xl bg-slate-700/50 border border-slate-600/50 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Điểm đến phụ trách
              </span>
              <span className="text-lg font-extrabold text-sky-400">
                {currentDestinations.length} địa điểm
              </span>
            </div>
          </div>
        </div>

        {/* Info Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">
                school
              </span>
              Kinh nghiệm & Bối cảnh (Background)
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {guide.background || 'Chưa cập nhật thông tin background.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">
                person_celebrate
              </span>
              Tiểu sử & Phong cách (Biography)
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {guide.biography || 'Chưa cập nhật tiểu sử hướng dẫn viên.'}
            </p>
          </div>
        </div>

        {/* Section: Danh sách điểm đến phụ trách (CORE BA REQUIREMENT) */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  map
                </span>
                Danh sách điểm đến phụ trách ({currentDestinations.length})
              </h4>
              <p className="text-xs text-slate-500">
                Các địa danh du lịch hướng dẫn viên này có chuyên môn phụ trách dẫn tour
              </p>
            </div>

            <Button
              type="button"
              variant={isAddingOpen ? 'ghost' : 'primary'}
              size="sm"
              onClick={() => setIsAddingOpen(!isAddingOpen)}
              className="flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isAddingOpen ? 'close' : 'add_location_alt'}
              </span>
              <span>{isAddingOpen ? 'Đóng bộ chọn' : 'Thêm điểm đến phụ trách'}</span>
            </Button>
          </div>

          {/* Collapsible: Add Destinations Picker */}
          {isAddingOpen && (
            <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-sky-900 uppercase tracking-wider">
                  Chọn điểm đến muốn phân công ({selectedToAdd.length} đã chọn)
                </span>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleConfirmAdd}
                  disabled={selectedToAdd.length === 0 || actionLoading}
                  isLoading={actionLoading}
                >
                  Xác nhận thêm ({selectedToAdd.length})
                </Button>
              </div>

              {availableToAdd.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-3 text-center bg-white rounded-lg">
                  Tất cả điểm đến hiện có đã được gán cho hướng dẫn viên này.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-52 overflow-y-auto p-1">
                  {availableToAdd.map((dest) => {
                    const isSelected = selectedToAdd.includes(dest._id);
                    return (
                      <div
                        key={dest._id}
                        onClick={() => handleToggleAddSelect(dest._id)}
                        className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer border transition-all ${
                          isSelected
                            ? 'bg-white border-primary shadow-xs ring-1 ring-primary'
                            : 'bg-white/80 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={dest.image || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=120&q=80'}
                          alt={dest.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1 text-xs">
                          <p className="font-bold text-slate-800 truncate">{dest.name}</p>
                          <p className="text-[11px] text-slate-500 truncate">{dest.region}</p>
                        </div>
                        <span
                          className={`material-symbols-outlined text-[20px] ${
                            isSelected ? 'text-primary' : 'text-slate-300'
                          }`}
                        >
                          {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Current Destinations Grid */}
          {currentDestinations.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <span className="material-symbols-outlined text-slate-400 text-[36px] mb-2">
                location_off
              </span>
              <p className="text-sm font-semibold text-slate-600">
                Hướng dẫn viên này chưa được phân công điểm đến nào.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Nhấp nút "Thêm điểm đến phụ trách" phía trên để gán địa danh cho guide.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentDestinations.map((dest) => {
                const isObj = typeof dest === 'object';
                const destId = isObj ? dest._id : dest;
                const destName = isObj ? dest.name : `ID: ${dest}`;
                const destRegion = isObj ? dest.region : '';
                const destImage = isObj?.image || dest?.image || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=300&q=80';

                return (
                  <div
                    key={destId}
                    className="relative group flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-soft transition-all"
                  >
                    <img
                      src={destImage}
                      alt={destName}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {destName}
                      </h5>
                      {destRegion && (
                        <p className="text-[11px] text-slate-500 truncate">
                          {destRegion} • {dest.theme || 'Chung'}
                        </p>
                      )}
                    </div>
                    {/* Delete action button */}
                    <button
                      type="button"
                      onClick={() => handleRemove(destId)}
                      disabled={actionLoading}
                      title="Gỡ khỏi danh sách phụ trách"
                      className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 shrink-0"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        delete
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default GuideDetailModal;
