import React from 'react';
import Badge from '../../../../components/common/Badge';

export const ContactStatusBadge = ({ status, size = 'sm', className = '' }) => {
  switch (status) {
    case 'new':
      return (
        <Badge
          variant="danger"
          size={size}
          className={`font-bold tracking-wide uppercase ${className}`}
          icon={<span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
        >
          Chưa đọc
        </Badge>
      );
    case 'read':
      return (
        <Badge
          variant="primary"
          size={size}
          className={`font-bold tracking-wide uppercase ${className}`}
          icon={<span className="material-symbols-outlined text-[13px]">mark_email_read</span>}
        >
          Đã đọc
        </Badge>
      );
    case 'resolved':
      return (
        <Badge
          variant="success"
          size={size}
          className={`font-bold tracking-wide uppercase ${className}`}
          icon={<span className="material-symbols-outlined text-[13px]">check_circle</span>}
        >
          Đã giải quyết
        </Badge>
      );
    default:
      return (
        <Badge variant="neutral" size={size} className={className}>
          {status || 'Không xác định'}
        </Badge>
      );
  }
};

export default ContactStatusBadge;
