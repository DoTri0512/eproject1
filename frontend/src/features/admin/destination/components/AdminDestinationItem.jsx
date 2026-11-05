import React from "react";
import Badge from "@/components/common/Badge";

export const AdminDestinationItem = ({
  destination,
  onOpenDetail,
  onOpenEdit,
  onOpenDelete,
}) => {
  const getRegionBadge = (region) => {
    switch (region) {
      case "Miền Bắc":
        return (
          <Badge variant="primary" size="sm">
            {region}
          </Badge>
        );
      case "Miền Trung":
        return (
          <Badge variant="secondary" size="sm">
            {region}
          </Badge>
        );
      case "Miền Nam":
        return (
          <Badge variant="cyan" size="sm">
            {region}
          </Badge>
        );
      case "Tây Nguyên":
        return (
          <Badge variant="amber" size="sm">
            {region}
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" size="sm">
            {region || "Khác"}
          </Badge>
        );
    }
  };

  return (
    <tr className="hover:bg-slate-50/70 transition-colors">
      {/* Thumbnail */}
      <td className="py-3 px-4">
        <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
          <img
            src={
              destination.image ||
              "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=200&q=80"
            }
            alt={destination.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </td>

      {/* Name & Location */}
      <td className="py-3 px-4">
        <div className="font-bold text-slate-900 line-clamp-1">
          {destination.name}
        </div>
        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
          <span className="material-symbols-outlined text-[13px]">
            location_on
          </span>
          <span>{destination.location || destination.region}</span>
        </div>
        {destination.slug && (
          <div className="text-[10px] text-sky-600 font-mono mt-0.5">
            /destinations/{destination.slug}
          </div>
        )}
      </td>

      {/* Region */}
      <td className="py-3 px-4 whitespace-nowrap">
        {getRegionBadge(destination.region)}
      </td>

      {/* Theme */}
      <td className="py-3 px-4 whitespace-nowrap">
        <Badge variant="slate" size="sm">
          {destination.theme || "Du lịch"}
        </Badge>
      </td>

      {/* Budget */}
      <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-600">
        {destination.budgetBand || "Tiêu chuẩn"}
      </td>

      {/* Duration & Season */}
      <td className="py-3 px-4 whitespace-nowrap">
        <div className="text-xs font-semibold text-slate-700">
          {destination.visitDuration || "2 - 3 ngày"}
        </div>
        <div className="text-[11px] text-amber-600 flex items-center gap-1 mt-0.5">
          <span className="material-symbols-outlined text-[13px]">
            wb_sunny
          </span>
          <span>Mùa đẹp: {destination.bestSeason || "Quanh năm"}</span>
        </div>
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-center whitespace-nowrap">
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => onOpenDetail(destination)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-sky-50 transition-colors cursor-pointer"
            title="Xem chi tiết"
          >
            <span className="material-symbols-outlined text-[18px]">
              visibility
            </span>
          </button>

          <button
            type="button"
            onClick={() => onOpenEdit(destination)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
            title="Chỉnh sửa điểm đến"
          >
            <span className="material-symbols-outlined text-[18px]">
              edit
            </span>
          </button>

          <button
            type="button"
            onClick={() => onOpenDelete(destination)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Xóa điểm đến"
          >
            <span className="material-symbols-outlined text-[18px]">
              delete
            </span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AdminDestinationItem;

