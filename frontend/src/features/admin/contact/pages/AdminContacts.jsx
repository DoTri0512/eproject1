import React from 'react';
import useAdminContacts from '../hooks/useAdminContacts';
import ContactStatusBadge from '../components/ContactStatusBadge';
import ContactDetailModal from '../components/ContactDetailModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import formatDate from '../../../../utils/formatDate';

export const AdminContacts = () => {
  const {
    contacts,
    isLoading,
    isSubmitting,
    activeTab,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    stats,
    selectedContact,
    isDetailModalOpen,
    setIsDetailModalOpen,
    contactToDelete,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    toastMessage,
    handleOpenDetail,
    handleUpdateStatus,
    handleDeleteClick,
    handleConfirmDelete,
    handleTabChange,
    refreshContacts,
  } = useAdminContacts();

  const tabs = [
    { id: 'all', label: 'Tất cả liên hệ', count: stats.total },
    {
      id: 'new',
      label: 'Chưa đọc',
      count: stats.newCount,
      alert: stats.newCount > 0,
    },
    { id: 'read', label: 'Đã đọc', count: stats.readCount },
    { id: 'resolved', label: 'Đã giải quyết', count: stats.resolvedCount },
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleExportCSV = () => {
    if (!contacts.length) {
      alert('Không có dữ liệu liên hệ để xuất!');
      return;
    }
    const headers = ['Mã', 'Họ tên', 'Email', 'Số điện thoại', 'Chủ đề', 'Nội dung', 'Trạng thái', 'Ngày gửi'];
    const rows = contacts.map((c) => [
      `"${c._id}"`,
      `"${c.name || ''}"`,
      `"${c.email || ''}"`,
      `"${c.phone || ''}"`,
      `"${(c.subject || '').replace(/"/g, '""')}"`,
      `"${(c.message || '').replace(/"/g, '""')}"`,
      `"${c.status || 'new'}"`,
      `"${formatDate(c.createdAt, true)}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TravelTrail_Contacts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-modal border border-slate-200 animate-in fade-in slide-in-from-right duration-200">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              toastMessage.type === 'error'
                ? 'bg-rose-100 text-rose-600'
                : 'bg-emerald-100 text-emerald-600'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {toastMessage.type === 'error' ? 'error' : 'check_circle'}
            </span>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-slate-800">
            {toastMessage.message}
          </span>
        </div>
      )}

      {/* 1. Header Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[16px]">database</span>
            <span>MongoDB Atlas • Collection: contacts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quản Lý Yêu Cầu Liên Hệ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tiếp nhận, xử lý phản hồi và chăm sóc các yêu cầu thông tin gửi từ khách hàng & du khách
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={refreshContacts}
            disabled={isLoading}
            className="h-11 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
            title="Làm mới danh sách"
          >
            <span className={`material-symbols-outlined text-[18px] ${isLoading ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span className="hidden sm:inline">Làm mới</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="h-11 px-4 rounded-xl bg-primary hover:bg-sky-600 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm shadow-sky-500/20 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Metric Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng liên hệ */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">mark_email_unread</span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Tổng Liên Hệ
            </div>
            <div className="text-2xl font-black text-slate-800">{stats.total}</div>
          </div>
        </div>

        {/* Card 2: Chưa đọc (New) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-4 relative overflow-hidden">
          {stats.newCount > 0 && (
            <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          )}
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">fiber_new</span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Chưa Đọc (New)
            </div>
            <div className="text-2xl font-black text-rose-600">{stats.newCount}</div>
          </div>
        </div>

        {/* Card 3: Đã đọc (Read) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">mark_email_read</span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Đã Đọc (Đang xử lý)
            </div>
            <div className="text-2xl font-black text-blue-600">{stats.readCount}</div>
          </div>
        </div>

        {/* Card 4: Đã giải quyết (Resolved) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">check_circle</span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              Đã Giải Quyết
            </div>
            <div className="text-2xl font-black text-emerald-600">{stats.resolvedCount}</div>
          </div>
        </div>
      </div>

      {/* 3. Filter Tabs & Search Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`h-10 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : tab.alert
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên, email, sđt, chủ đề..."
            className="w-full h-10.5 pl-10 pr-9 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-primary transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Contact Inquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-4 px-5">Khách hàng gửi</th>
                <th className="py-4 px-5">Chủ đề & Nội dung</th>
                <th className="py-4 px-5">Thời gian gửi</th>
                <th className="py-4 px-5 text-center">Trạng thái</th>
                <th className="py-4 px-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {isLoading ? (
                // Skeleton loading state
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200" />
                        <div className="flex flex-col gap-1.5">
                          <div className="w-28 h-3.5 bg-slate-200 rounded" />
                          <div className="w-36 h-3 bg-slate-100 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="w-48 h-3.5 bg-slate-200 rounded mb-1.5" />
                      <div className="w-64 h-3 bg-slate-100 rounded" />
                    </td>
                    <td className="py-4 px-5">
                      <div className="w-24 h-3 bg-slate-200 rounded" />
                    </td>
                    <td className="py-4 px-5 text-center">
                      <div className="w-20 h-6 bg-slate-200 rounded-full mx-auto" />
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="w-24 h-8 bg-slate-200 rounded-lg ml-auto" />
                    </td>
                  </tr>
                ))
              ) : contacts.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan="5" className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[36px]">inbox</span>
                      </div>
                      <div className="text-base font-bold text-slate-800">
                        Không có yêu cầu liên hệ nào
                      </div>
                      <p className="text-xs text-slate-400 max-w-md">
                        {searchTerm
                          ? `Không tìm thấy kết quả nào khớp với từ khóa "${searchTerm}". Vui lòng thử từ khóa khác.`
                          : 'Hiện chưa có người dùng nào gửi tin nhắn liên hệ theo trạng thái này.'}
                      </p>
                      {searchTerm && (
                        <button
                          type="button"
                          onClick={() => setSearchTerm('')}
                          className="mt-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                        >
                          Xóa tìm kiếm
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      contact.status === 'new' ? 'bg-rose-50/20 font-medium' : ''
                    }`}
                  >
                    {/* Customer column */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            contact.status === 'new'
                              ? 'bg-rose-100 text-rose-700 ring-2 ring-rose-300'
                              : 'bg-sky-100 text-primary'
                          }`}
                        >
                          {getInitials(contact.name)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-extrabold text-slate-900 truncate">
                            {contact.name || 'Khách vãng lai'}
                          </span>
                          <span className="text-slate-500 text-xs truncate">
                            {contact.email}
                          </span>
                          {contact.phone && (
                            <span className="text-slate-400 text-[11px] truncate flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px] text-emerald-600">call</span>
                              <span>{contact.phone}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Subject & Message Preview */}
                    <td className="py-4 px-5 max-w-xs sm:max-w-sm">
                      <div className="flex flex-col">
                        <div className="font-bold text-slate-800 truncate">
                          {contact.subject || 'Không có tiêu đề'}
                        </div>
                        <div className="text-slate-500 text-xs line-clamp-2 mt-0.5 leading-relaxed">
                          {contact.message}
                        </div>
                      </div>
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <span className="material-symbols-outlined text-[16px] text-slate-400">schedule</span>
                        <span>{formatDate(contact.createdAt, true)}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-5 text-center whitespace-nowrap">
                      <ContactStatusBadge status={contact.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick View Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(contact)}
                          className="h-8.5 px-3 rounded-lg bg-sky-50 hover:bg-sky-100 text-primary font-bold text-xs flex items-center gap-1 transition-colors"
                          title="Xem chi tiết nội dung"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          <span>Chi tiết</span>
                        </button>

                        {/* Quick Status Toggle Button */}
                        {contact.status !== 'resolved' ? (
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => handleUpdateStatus(contact._id, 'resolved')}
                            className="h-8.5 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1 transition-colors disabled:opacity-50"
                            title="Đánh dấu đã giải quyết"
                          >
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            <span className="hidden lg:inline">Xong</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => handleUpdateStatus(contact._id, 'read')}
                            className="h-8.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1 transition-colors disabled:opacity-50"
                            title="Chuyển lại về trạng thái Đã đọc"
                          >
                            <span className="material-symbols-outlined text-[16px]">undo</span>
                            <span className="hidden lg:inline">Mở lại</span>
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleDeleteClick(contact)}
                          className="h-8.5 w-8.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors disabled:opacity-50"
                          title="Xóa liên hệ"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination Footer */}
        {!isLoading && totalItems > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 font-medium">
              Hiển thị <span className="font-bold text-slate-800">{contacts.length}</span> trên tổng số{' '}
              <span className="font-bold text-slate-800">{totalItems}</span> liên hệ
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1 || isLoading}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="h-9 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                <span>Trước</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  // Show current page, edges, and near current
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                          currentPage === pageNum
                            ? 'bg-primary text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return (
                      <span key={pageNum} className="w-6 text-center text-slate-400 text-xs">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                type="button"
                disabled={currentPage >= totalPages || isLoading}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="h-9 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Tiếp</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. Contact Detail Modal */}
      <ContactDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        contact={selectedContact}
        onUpdateStatus={handleUpdateStatus}
        onDeleteClick={(contact) => {
          setIsDetailModalOpen(false);
          handleDeleteClick(contact);
        }}
        isSubmitting={isSubmitting}
      />

      {/* 7. Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setContactToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        contactName={contactToDelete?.name}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AdminContacts;
