import React from "react";
import AdminDestinationItem from "./AdminDestinationItem";
import Pagination from "@/components/common/Pagination";

export const AdminDestinationList = ({
  isLoading,
  destinations = [],
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
  onOpenDetail,
  onOpenEdit,
  onOpenDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-50 text-slate-500 font-bold text-[11px] uppercase tracking-wider border-b border-slate-100">
            <tr className="whitespace-nowrap">
              <th className="py-3.5 px-4">Hình Ảnh</th>
              <th className="py-3.5 px-4">Tên Điểm Đến</th>
              <th className="py-3.5 px-4">Vùng Miền</th>
              <th className="py-3.5 px-4">Chủ Đề</th>
              <th className="py-3.5 px-4">Ngân Sách</th>
              <th className="py-3.5 px-4">Thời Lượng & Mùa Đi</th>
              <th className="py-3.5 px-4 text-center">Thao Tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 rounded-full border-2 border-primary border-r-transparent animate-spin" />
                    <span>Đang tải danh sách điểm đến từ MongoDB...</span>
                  </div>
                </td>
              </tr>
            ) : destinations.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  Không tìm thấy điểm đến nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              destinations.map((dest) => (
                <AdminDestinationItem
                  key={dest._id}
                  destination={dest}
                  onOpenDetail={onOpenDetail}
                  onOpenEdit={onOpenEdit}
                  onOpenDelete={onOpenDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && destinations.length > 0 && onPageChange && (
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-medium">
            Hiển thị{" "}
            <strong>
              {(currentPage - 1) * limit + 1} -{" "}
              {Math.min(currentPage * limit, totalItems || destinations.length)}
            </strong>{" "}
            trong tổng số{" "}
            <strong>{totalItems || destinations.length}</strong> điểm đến
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDestinationList;

