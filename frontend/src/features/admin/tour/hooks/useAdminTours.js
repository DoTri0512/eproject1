import { useState, useEffect, useCallback, useMemo } from 'react';
import adminApi from '../../adminApi';

export const useAdminTours = () => {
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit, setLimit] = useState(10);
  const [allToursForStats, setAllToursForStats] = useState([]);

  // Filters & search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestinationId, setSelectedDestinationId] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDestinationId, selectedStatus, limit]);

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
      const params = {
        page: currentPage,
        limit,
      };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedDestinationId !== 'all') params.destinationId = selectedDestinationId;
      if (selectedStatus !== 'all') params.status = selectedStatus;

      const [toursRes, destsRes, allToursRes] = await Promise.allSettled([
        adminApi.getTours(params),
        adminApi.getDestinations({ limit: 100 }),
        adminApi.getTours({ limit: 1000 }),
      ]);

      if (toursRes.status === 'fulfilled' && toursRes.value) {
        const val = toursRes.value;
        const items = Array.isArray(val)
          ? val
          : val.items || val.data?.items || val.data || [];
        const paginationInfo = val.pagination || val.data?.pagination;

        setTours(items);
        setTotalItems(paginationInfo?.totalItems ?? val.totalItems ?? items.length);
        setTotalPages(paginationInfo?.totalPages ?? (Math.ceil((items.length) / limit) || 1));
      }

      if (destsRes.status === 'fulfilled' && destsRes.value) {
        const destItems = Array.isArray(destsRes.value)
          ? destsRes.value
          : destsRes.value.items || destsRes.value.data || [];
        setDestinations(destItems);
      }

      if (allToursRes.status === 'fulfilled' && allToursRes.value) {
        const allItems = Array.isArray(allToursRes.value)
          ? allToursRes.value
          : allToursRes.value.items || allToursRes.value.data || [];
        setAllToursForStats(allItems);
      }
    } catch (err) {
      console.error('Error loading tours data:', err);
      showToast('Không thể tải dữ liệu tours từ server', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, limit, searchTerm, selectedDestinationId, selectedStatus]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filtered tours list (server-side already filtered, fallback client guard)
  const filteredTours = tours;

  // Statistics from all tours
  const stats = useMemo(() => {
    const list = allToursForStats.length > 0 ? allToursForStats : tours;
    const total = totalItems || list.length;
    const active = list.filter((t) => (t.status || 'active') === 'active').length;
    const totalAvailableSeats = list.reduce(
      (sum, t) => sum + (t.availableSeats ?? t.maxPassengers ?? 0),
      0
    );
    const avgPrice =
      list.length > 0
        ? Math.round(
            list.reduce((sum, t) => {
              const p =
                t.durationOptions?.length > 0
                  ? Math.min(...t.durationOptions.map((o) => Number(o.price) || 0))
                  : Number(t.price) || 0;
              return sum + p;
            }, 0) / list.length
          )
        : 0;

    return { total, active, totalAvailableSeats, avgPrice };
  }, [allToursForStats, tours, totalItems]);

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
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    limit,
    setLimit,
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
