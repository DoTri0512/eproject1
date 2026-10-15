import React from 'react';

export const BookingStatusControl = ({
  status,
  onChange,
  disabled = false,
}) => {
  const normalized = (status || 'pending').toLowerCase();

  const getStyle = (st) => {
    switch (st) {
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'completed':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'pending':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <select
      value={normalized}
      disabled={disabled}
      onChange={(e) => onChange && onChange(e.target.value)}
      className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all focus:outline-none cursor-pointer ${getStyle(
        normalized
      )}`}
    >
      <option value="pending">Chờ xác nhận</option>
      <option value="confirmed">Đã xác nhận</option>
      <option value="completed">Đã hoàn thành</option>
      <option value="cancelled">Đã hủy</option>
    </select>
  );
};

export default BookingStatusControl;
