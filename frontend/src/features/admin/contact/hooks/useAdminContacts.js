import { useState } from 'react';
import useGetAdminContacts from './useGetAdminContacts';
import useUpdateContact from './useUpdateContact';
import useDeleteContact from './useDeleteContact';

export {
  useGetAdminContacts,
  useUpdateContact,
  useDeleteContact,
};

export const useAdminContacts = () => {
  const query = useGetAdminContacts();
  const { updateContactStatus, isUpdating } = useUpdateContact();
  const { deleteContact, isDeleting } = useDeleteContact();

  // Modals & Active items
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenDetail = (contact) => {
    setSelectedContact(contact);
    setIsDetailModalOpen(true);
    if (contact.status === 'new') {
      handleStatusChange(contact._id, 'read', false);
    }
  };

  const handleStatusChange = async (contactId, newStatus, showSuccessToast = true) => {
    try {
      await updateContactStatus(contactId, newStatus);
      query.setContacts((prev) =>
        prev.map((c) => (c._id === contactId ? { ...c, status: newStatus } : c))
      );
      if (selectedContact && selectedContact._id === contactId) {
        setSelectedContact((prev) => ({ ...prev, status: newStatus }));
      }
      if (showSuccessToast) {
        showToast('Cập nhật trạng thái thành công!');
      }
      query.refetchStats();
    } catch {
      showToast('Không thể cập nhật trạng thái', 'error');
    }
  };

  const handleOpenDelete = (contact) => {
    setContactToDelete(contact);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteContact = async () => {
    if (!contactToDelete?._id) return;
    try {
      await deleteContact(contactToDelete._id);
      showToast('Đã xóa liên hệ thành công!');
      setIsDeleteModalOpen(false);
      setContactToDelete(null);
      if (selectedContact?._id === contactToDelete._id) {
        setIsDetailModalOpen(false);
        setSelectedContact(null);
      }
      await query.refetch();
      await query.refetchStats();
    } catch {
      showToast('Không thể xóa liên hệ', 'error');
    }
  };

  const isSubmitting = isUpdating || isDeleting;

  return {
    ...query,
    isSubmitting,
    selectedContact,
    setSelectedContact,
    isDetailModalOpen,
    setIsDetailModalOpen,
    contactToDelete,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    toastMessage,
    handleOpenDetail,
    handleStatusChange,
    handleOpenDelete,
    handleDeleteContact,
    refreshContacts: query.refetch,
  };
};

export default useAdminContacts;
