import React from 'react';

export const PaymentStatusBadge = ({ status }) => {
  const normalized = (status || 'pending').toLowerCase();

  const configs = {
    pending: {
      label: 'Chờ thanh toán',
      className: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: 'hourglass_empty',
    },
    confirmed: {
      label: 'Đã thanh toán',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: 'check_circle',
    },
    completed: {
      label: 'Hoàn tất thanh toán',
      className: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: 'verified',
    },
  };

  const config = configs[normalized] || configs.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-xs ${config.className}`}
      title={`Tình trạng thanh toán: ${config.label}`}
    >
      <span className="material-symbols-outlined text-[13px]">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};

export default PaymentStatusBadge;
