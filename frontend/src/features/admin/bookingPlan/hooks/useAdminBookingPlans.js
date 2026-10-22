import { useState, useEffect, useCallback, useMemo } from 'react';
import adminApi from '../../adminApi';

export const useAdminBookingPlans = () => {
  const [plans, setPlans] = useState([]);
  const [tours, setTours] = useState([]);
  const [guides, setGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedTourId, setSelectedTourId] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPassengersModalOpen, setIsPassengersModalOpen] = useState(false);
  const [isAssignGuideModalOpen, setIsAssignGuideModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [plansRes, toursRes, guidesRes] = await Promise.allSettled([
        adminApi.getBookingPlans(),
        adminApi.getTours(),
        adminApi.getGuides(),
      ]);

      if (plansRes.status === 'fulfilled' && plansRes.value) {
        const items = Array.isArray(plansRes.value)
          ? plansRes.value
          : plansRes.value.items || plansRes.value.data || [];
        setPlans(items);
      }

      if (toursRes.status === 'fulfilled' && toursRes.value) {
        const tourItems = Array.isArray(toursRes.value)
          ? toursRes.value
          : toursRes.value.items || toursRes.value.data || [];
        setTours(tourItems);
      }

      if (guidesRes.status === 'fulfilled' && guidesRes.value) {
        const guideItems = Array.isArray(guidesRes.value)
          ? guidesRes.value
          : guidesRes.value.items || guidesRes.value.data || [];
        setGuides(guideItems);
      }
    } catch (err) {
      console.error('Error loading booking plans data:', err);
      showToast('Không thể tải dữ liệu đoàn khởi hành', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Statistics
  const stats = useMemo(() => {
    const total = plans.length;
    const scheduled = plans.filter((p) => (p.status || 'scheduled') === 'scheduled').length;
    const inProgress = plans.filter((p) => p.status === 'in_progress').length;
    const unassignedGuides = plans.filter(
      (p) => !p.guideId && ['scheduled', 'in_progress'].includes(p.status || 'scheduled')
    ).length;
    const totalPassengers = plans.reduce((sum, p) => sum + (p.totalPassengers || 0), 0);

    return { total, scheduled, inProgress, unassignedGuides, totalPassengers };
  }, [plans]);

  // Filtered list
  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      // Tour filter
      const tId = typeof p.tourId === 'object' ? p.tourId?._id : p.tourId;
      if (selectedTourId !== 'all' && tId !== selectedTourId) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && (p.status || 'scheduled') !== selectedStatus) {
        return false;
      }

      // Date filter
      if (selectedDate && p.departureDate) {
        const depStr = new Date(p.departureDate).toISOString().slice(0, 10);
        if (depStr !== selectedDate) return false;
      }

      // Search keyword
      if (searchTerm.trim()) {
        const query = searchTerm.trim().toLowerCase();
        const tourTitle = (p.tourId?.title || '').toLowerCase();
        const guideName = (p.guideId?.name || '').toLowerCase();
        return tourTitle.includes(query) || guideName.includes(query);
      }

      return true;
    });
  }, [plans, selectedTourId, selectedStatus, selectedDate, searchTerm]);

  // Open Passengers Modal
  const handleOpenPassengers = (plan) => {
    setSelectedPlan(plan);
    setIsPassengersModalOpen(true);
  };

  // Open Assign Guide Modal
  const handleOpenAssignGuide = (plan) => {
    setSelectedPlan(plan);
    setIsAssignGuideModalOpen(true);
  };

  // Assign Guide with conflict check
  const handleAssignGuide = async (planId, guideId) => {
    setIsSubmitting(true);
    try {
      const res = await adminApi.assignGuideToPlan(planId, guideId);
      const updated = res.data || res;
      setPlans((prev) =>
        prev.map((p) => (p._id === planId ? { ...p, ...updated } : p))
      );
      if (selectedPlan?._id === planId) {
        setSelectedPlan((prev) => ({ ...prev, ...updated }));
      }
      showToast('Phân công Hướng dẫn viên cho đoàn thành công!');
      setIsAssignGuideModalOpen(false);
      return true;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Không thể phân công Hướng dẫn viên';
      showToast(msg, 'error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Status
  const handleUpdateStatus = async (planId, status) => {
    try {
      const res = await adminApi.updatePlanStatus(planId, status);
      const updated = res.data || res;
      setPlans((prev) =>
        prev.map((p) => (p._id === planId ? { ...p, ...updated } : p))
      );
      if (selectedPlan?._id === planId) {
        setSelectedPlan((prev) => ({ ...prev, ...updated }));
      }
      showToast('Cập nhật trạng thái chuyến đi thành công!');
      return true;
    } catch (err) {
      showToast(err.response?.data?.message || 'Cập nhật trạng thái thất bại', 'error');
      return false;
    }
  };

  // Sync booking plans from bookings
  const handleSyncPlans = async () => {
    try {
      setIsSyncing(true);
      const res = await adminApi.syncBookingPlans();
      showToast(res.message || 'Đồng bộ đoàn khởi hành từ các đơn tour thành công!');
      await loadAllData();
      return true;
    } catch (err) {
      showToast(err.response?.data?.message || 'Đồng bộ thất bại', 'error');
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  // Create Manual Plan
  const handleCreatePlan = async (planData) => {
    setIsSubmitting(true);
    try {
      await adminApi.createBookingPlan(planData);
      showToast('Tạo đoàn khởi hành mới thành công!');
      setIsCreateModalOpen(false);
      await loadAllData();
      return true;
    } catch (err) {
      showToast(err.response?.data?.message || err.message || 'Không thể tạo đoàn khởi hành', 'error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Plan
  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đoàn khởi hành này?')) return false;
    try {
      await adminApi.deleteBookingPlan(planId);
      showToast('Đã xóa đoàn khởi hành thành công!');
      setPlans((prev) => prev.filter((p) => p._id !== planId));
      return true;
    } catch (err) {
      showToast(err.response?.data?.message || 'Xóa đoàn khởi hành thất bại', 'error');
      return false;
    }
  };

  return {
    plans,
    filteredPlans,
    tours,
    guides,
    stats,
    isLoading,
    isSyncing,
    selectedTourId,
    setSelectedTourId,
    selectedStatus,
    setSelectedStatus,
    selectedDate,
    setSelectedDate,
    searchTerm,
    setSearchTerm,
    selectedPlan,
    isPassengersModalOpen,
    setIsPassengersModalOpen,
    isAssignGuideModalOpen,
    setIsAssignGuideModalOpen,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isSubmitting,
    toastMessage,
    showToast,
    handleOpenPassengers,
    handleOpenAssignGuide,
    handleAssignGuide,
    handleUpdateStatus,
    handleSyncPlans,
    handleCreatePlan,
    handleDeletePlan,
    reloadPlans: loadAllData,
  };
};

export default useAdminBookingPlans;
