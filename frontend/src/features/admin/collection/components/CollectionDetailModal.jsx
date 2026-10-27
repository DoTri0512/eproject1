import React, { useState } from 'react';
import Modal from '../../../../components/common/Modal';
import Button from '../../../../components/common/Button';
import Badge from '../../../../components/common/Badge';

export const CollectionDetailModal = ({
  isOpen,
  onClose,
  collection,
  allDestinations = [],
  allCollections = [],
  onAddDestinations,
  onRemoveDestination,
  isLoading = false,
}) => {
  const [selectedToAdd, setSelectedToAdd] = useState([]);
  const [isAddingOpen, setIsAddingOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  if (!collection) return null;

  const currentDestinations = Array.isArray(collection.destinations)
    ? collection.destinations
    : [];

  const currentDestIds = currentDestinations.map((d) =>
    (typeof d === 'object' ? d._id : d).toString()
  );

  // Map to determine which other collection owns a destination
  // otherCollections: collections where _id !== collection._id
  const destinationToOtherCollectionMap = {};
  allCollections.forEach((col) => {
    if (col._id !== collection._id && Array.isArray(col.destinations)) {
      col.destinations.forEach((d) => {
        const dId = (typeof d === 'object' ? d._id : d).toString();
        destinationToOtherCollectionMap[dId] = col.name;
      });
    }
  });

  const handleToggleAddSelect = (destId) => {
    // If it belongs to another collection, ignore click
    if (destinationToOtherCollectionMap[destId]) return;
    if (currentDestIds.includes(destId)) return;

    setSelectedToAdd((prev) =>
      prev.includes(destId) ? prev.filter((id) => id !== destId) : [...prev, destId]
    );
  };

  const handleConfirmAdd = async () => {
    if (selectedToAdd.length === 0) return;
    try {
      setActionLoading(true);
      setActionError(null);
      await onAddDestinations(collection._id, selectedToAdd);
      setSelectedToAdd([]);
      setIsAddingOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi thêm điểm đến vào bộ sưu tập';
      setActionError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemove = async (destId) => {
    if (!window.confirm('Bạn có chắc muốn xóa điểm đến này khỏi bộ sưu tập?')) return;
    try {
      setActionLoading(true);
      setActionError(null);
      await onRemoveDestination(collection._id, destId);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi xóa điểm đến khỏi bộ sưu tập';
      setActionError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi Tiết Bộ Sưu Tập"
      subtitle={`Quản lý danh sách điểm đến trong bộ sưu tập "${collection.name}"`}
      size="xl"
    >
      <div className="flex flex-col gap-6 p-1 max-h-[75vh] overflow-y-auto pr-1">
        {/* Collection Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-extrabold flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
              <span className="material-symbols-outlined text-[28px]">collections_bookmark</span>
            </div>
            <div>
              <h3 className="text-xl font-black text-white">{collection.name}</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Slug: <span className="font-mono text-slate-400">/{collection.slug}</span>
              </p>
              {collection.description && (
                <p className="text-xs text-slate-300 mt-1 max-w-xl line-clamp-2">
                  {collection.description}
                </p>
              )}
            </div>
          </div>

          <div className="px-4 py-2.5 rounded-xl bg-slate-700/50 border border-slate-600/50 text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Tổng số điểm đến
            </span>
            <span className="text-lg font-black text-amber-400">
              {currentDestinations.length} địa điểm
            </span>
          </div>
        </div>

        {/* Action Error Alert */}
        {actionError && (
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium animate-in fade-in">
            <span className="material-symbols-outlined text-[18px] text-rose-600 shrink-0 mt-0.5">
              error
            </span>
            <div className="flex-1">
              <p className="font-bold">Không thể thực hiện thao tác:</p>
              <p className="mt-0.5">{actionError}</p>
            </div>
            <button
              type="button"
              onClick={() => setActionError(null)}
              className="text-rose-400 hover:text-rose-700"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )}

        {/* Section: Danh sách điểm đến trong collection */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  view_in_ar
                </span>
                Các điểm đến trong bộ sưu tập ({currentDestinations.length})
              </h4>
              <p className="text-xs text-slate-500">
                Mỗi điểm đến chỉ thuộc về tối đa 1 bộ sưu tập duy nhất
              </p>
            </div>

            <Button
              type="button"
              variant={isAddingOpen ? 'ghost' : 'primary'}
              size="sm"
              onClick={() => {
                setIsAddingOpen(!isAddingOpen);
                setActionError(null);
              }}
              className="flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isAddingOpen ? 'close' : 'add_circle'}
              </span>
              <span>{isAddingOpen ? 'Đóng bộ chọn' : 'Thêm điểm đến vào bộ sưu tập'}</span>
            </Button>
          </div>

          {/* Collapsible: Add Destinations with exclusivity enforcement */}
          {isAddingOpen && (
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div>
                  <span className="text-xs font-bold text-amber-950 uppercase tracking-wider block">
                    Chọn điểm đến hợp lệ ({selectedToAdd.length} đã chọn)
                  </span>
                  <span className="text-[11px] text-slate-600">
                    Chỉ những điểm đến chưa nằm trong bất kỳ bộ sưu tập nào mới có thể được chọn.
                  </span>
                </div>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-1 mt-3">
                {allDestinations.map((dest) => {
                  const destId = dest._id.toString();
                  const isCurrent = currentDestIds.includes(destId);
                  const otherCollectionName = destinationToOtherCollectionMap[destId];
                  const isConflict = !!otherCollectionName;
                  const isSelected = selectedToAdd.includes(destId);

                  let statusBadge = null;
                  if (isCurrent) {
                    statusBadge = (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-600">
                        Đã trong BST này
                      </span>
                    );
                  } else if (isConflict) {
                    statusBadge = (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 truncate max-w-[130px] block" title={`Đã thuộc bộ sưu tập "${otherCollectionName}"`}>
                        Đã thuộc: {otherCollectionName}
                      </span>
                    );
                  } else {
                    statusBadge = (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        Khả dụng
                      </span>
                    );
                  }

                  const isDisabled = isCurrent || isConflict;

                  return (
                    <div
                      key={destId}
                      onClick={() => handleToggleAddSelect(destId)}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
                        isDisabled
                          ? 'bg-slate-100/80 border-slate-200 opacity-60 cursor-not-allowed'
                          : isSelected
                          ? 'bg-white border-primary ring-2 ring-primary/30 shadow-xs cursor-pointer'
                          : 'bg-white border-slate-200 hover:border-slate-300 cursor-pointer'
                      }`}
                    >
                      <img
                        src={dest.image || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=120&q=80'}
                        alt={dest.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1 text-xs">
                        <p className="font-bold text-slate-800 truncate">{dest.name}</p>
                        <div className="mt-0.5">{statusBadge}</div>
                      </div>
                      {!isDisabled && (
                        <span
                          className={`material-symbols-outlined text-[20px] ${
                            isSelected ? 'text-primary' : 'text-slate-300'
                          }`}
                        >
                          {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Current Destinations Grid */}
          {currentDestinations.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <span className="material-symbols-outlined text-slate-400 text-[36px] mb-2">
                collections
              </span>
              <p className="text-sm font-semibold text-slate-600">
                Bộ sưu tập này hiện chưa có điểm đến nào.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Nhấp nút "Thêm điểm đến vào bộ sưu tập" phía trên để chọn các điểm đến chưa thuộc bộ sưu tập nào khác.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentDestinations.map((dest) => {
                const isObj = typeof dest === 'object';
                const destId = isObj ? dest._id : dest;
                const destName = isObj ? dest.name : `ID: ${dest}`;
                const destRegion = isObj ? dest.region : '';
                const destTheme = isObj ? dest.theme : '';
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
                      <p className="text-[11px] text-slate-500 truncate">
                        {destRegion} {destTheme ? `• ${destTheme}` : ''}
                      </p>
                    </div>
                    {/* Delete action button */}
                    <button
                      type="button"
                      onClick={() => handleRemove(destId)}
                      disabled={actionLoading}
                      title="Xóa điểm đến khỏi bộ sưu tập"
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

export default CollectionDetailModal;
