import React, { useState } from 'react';

export const BookingPlanStatusControl = ({
  status = 'scheduled',
  onChange,
  disabled = false,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const normalized = (status || 'scheduled').toLowerCase();

  const getStyle = (st) => {
    switch (st) {
      case 'in_progress':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'scheduled':
      default:
        return 'bg-sky-50 text-sky-700 border-sky-200';
    }
  };

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === normalized || !onChange) return;

    try {
      setIsUpdating(true);
      await onChange(newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={normalized}
      disabled={disabled || isUpdating}
      onChange={handleChange}
      className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all focus:outline-none cursor-pointer ${
        disabled || isUpdating ? 'opacity-50 cursor-not-allowed' : ''
      } ${getStyle(normalized)}`}
    >
      <option value="scheduled">Đã lên lịch</option>
      <option value="in_progress">Đang diễn ra</option>
      <option value="completed">Đã hoàn thành</option>
      <option value="cancelled">Đã hủy</option>
    </select>
  );
};

export default BookingPlanStatusControl;
