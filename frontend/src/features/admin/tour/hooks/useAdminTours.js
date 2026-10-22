import { useState, useEffect, useCallback, useMemo } from 'react';
import adminApi from '../../adminApi';

export const useAdminTours = () => {
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestinationId, setSelectedDestinationId] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [toursRes, destsRes] = await Promise.allSettled([
        adminApi.getTours(),
        adminApi.getDestinations(),
      ]);

      if (toursRes.status === 'fulfilled' && toursRes.value) {
        const items = Array.isArray(toursRes.value)
          ? toursRes.value
          : toursRes.value.items || toursRes.value.data || [];
        setTours(items);
      }

      if (destsRes.status === 'fulfilled' && destsRes.value) {
        const destItems = Array.isArray(destsRes.value)
          ? destsRes.value
          : destsRes.value.items || destsRes.value.data || [];
        setDestinations(destItems);
      }
    } catch (err) {
      console.error('Error loading tours data:', err);
      showToast('Không thể tải dữ liệu tours từ server', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered tours list
  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const titleMatch =
        !searchTerm.trim() ||
        tour.title?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        tour.slug?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        tour.destinationId?.name?.toLowerCase().includes(searchTerm.trim().toLowerCase());

      const destId =
        typeof tour.destinationId === 'object'
          ? tour.destinationId?._id
          : tour.destinationId;
      const destMatch =
        selectedDestinationId === 'all' || destId === selectedDestinationId;

      const statusMatch =
        selectedStatus === 'all' || (tour.status || 'active') === selectedStatus;

      return titleMatch && destMatch && statusMatch;
    });
  }, [tours, searchTerm, selectedDestinationId, selectedStatus]);

  // Statistics
  const stats = useMemo(() => {
    const total = tours.length;
    const active = tours.filter((t) => (t.status || 'active') === 'active').length;
    const totalAvailableSeats = tours.reduce(
      (sum, t) => sum + (t.availableSeats ?? t.maxPassengers ?? 0),
      0
    );
    const avgPrice =
      total > 0
        ? Math.round(
            tours.reduce((sum, t) => {
              const p =
                t.durationOptions?.length > 0
                  ? Math.min(...t.durationOptions.map((o) => Number(o.price) || 0))
                  : Number(t.price) || 0;
              return sum + p;
            }, 0) / total
          )
        : 0;

    return { total, active, totalAvailableSeats, avgPrice };
  }, [tours]);

  const handleOpenCreate = () => {
    setSelectedTour(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (tour) => {
    setSelectedTour(tour);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (tour) => {
    setSelectedTour(tour);
    setIsDeleteModalOpen(true);
  };

  const handleSaveTour = async (tourData) => {
    setIsSubmitting(true);
    try {
      if (selectedTour?._id) {
        // Update
        await adminApi.updateTour(selectedTour._id, tourData);
        showToast(`Cập nhật tour "${tourData.title}" thành công!`);
      } else {
        // Create
        await adminApi.createTour(tourData);
        showToast(`Thêm mới tour "${tourData.title}" thành công!`);
      }
      setIsFormModalOpen(false);
      setSelectedTour(null);
      await loadData();
      return true;
    } catch (err) {
      const msg = err.message || 'Có lỗi xảy ra khi lưu tour';
      showToast(msg, 'error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTour = async () => {
    if (!selectedTour?._id) return;
    setIsSubmitting(true);
    try {
      await adminApi.deleteTour(selectedTour._id);
      showToast(`Đã xóa tour "${selectedTour.title}" khỏi hệ thống!`);
      setIsDeleteModalOpen(false);
      setSelectedTour(null);
      await loadData();
    } catch (err) {
      const msg = err.message || 'Không thể xóa tour này';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (tour) => {
    const newStatus = (tour.status || 'active') === 'active' ? 'inactive' : 'active';
    try {
      const res = await adminApi.updateTour(tour._id, { status: newStatus });
      const updated = res.data || res;
      setTours((prev) =>
        prev.map((t) => (t._id === tour._id ? { ...t, status: newStatus, ...updated } : t))
      );
      showToast(
        `Đã chuyển tour sang trạng thái ${newStatus === 'active' ? 'Đang mở bán' : 'Tạm dừng bán'}!`
      );
    } catch (err) {
      showToast(err.response?.data?.message || 'Không thể đổi trạng thái tour', 'error');
    }
  };

  return {
    tours,
    destinations,
    filteredTours,
    stats,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedDestinationId,
    setSelectedDestinationId,
    selectedStatus,
    setSelectedStatus,
    isFormModalOpen,
    setIsFormModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedTour,
    isSubmitting,
    toastMessage,
    showToast,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDelete,
    handleSaveTour,
    handleDeleteTour,
    handleToggleStatus,
    reloadTours: loadData,
  };
};

export default useAdminTours;
