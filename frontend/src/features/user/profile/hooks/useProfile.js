import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { profileApi } from '../profileApi';
import { updateUser } from '../../../auth/authSlice';

export const useProfile = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);

  const [userProfile, setUserProfile] = useState(authUser || null);
  const [customerProfile, setCustomerProfile] = useState({
    fullName: '',
    email: authUser?.email || '',
    phone: '',
    address: '',
    city: '',
    country: 'Việt Nam',
    idCardNumber: '',
  });

  const [stats, setStats] = useState({
    bookingsCount: 0,
    completedBookingsCount: 0,
    favouritesCount: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [isSavingCustomer, setIsSavingCustomer] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  const fetchProfileData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Auth Profile
      const userRes = await profileApi.getUserProfile().catch(() => null);
      if (userRes) {
        const u = userRes.data || userRes;
        setUserProfile(u);
        dispatch(updateUser(u));
      }

      // 2. Fetch Customer Record
      const custRes = await profileApi.getCustomerProfile().catch(() => null);
      const cust = custRes?.data || custRes;
      if (cust && cust._id) {
        setCustomerProfile({
          fullName: cust.fullName || '',
          email: cust.email || authUser?.email || '',
          phone: cust.phone || '',
          address: cust.address || '',
          city: cust.city || '',
          country: cust.country || 'Việt Nam',
          idCardNumber: cust.idCardNumber || '',
        });
      } else {
        // Fallback with auth info
        setCustomerProfile((prev) => ({
          ...prev,
          fullName: authUser?.name || '',
          email: authUser?.email || '',
        }));
      }

      // 3. Fetch Bookings and Favourites for quick KPI stats
      const [bookingsRes, favsRes] = await Promise.allSettled([
        profileApi.getMyBookings(),
        profileApi.getMyFavourites(),
      ]);

      let bCount = 0;
      let completedCount = 0;
      if (bookingsRes.status === 'fulfilled' && bookingsRes.value) {
        const bookingsList = Array.isArray(bookingsRes.value)
          ? bookingsRes.value
          : bookingsRes.value.data || bookingsRes.value.bookings || [];
        bCount = bookingsList.length;
        completedCount = bookingsList.filter((b) => b.bookingStatus === 'completed').length;
      }

      let fCount = 0;
      if (favsRes.status === 'fulfilled' && favsRes.value) {
        const favList = Array.isArray(favsRes.value)
          ? favsRes.value
          : favsRes.value.data || favsRes.value.items || [];
        fCount = favList.length;
      }

      setStats({
        bookingsCount: bCount,
        completedBookingsCount: completedCount,
        favouritesCount: fCount,
      });
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, authUser?.email, authUser?.name]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Update Personal Info (User model: name, avatar)
  const handleUpdatePersonalInfo = async ({ name, avatar }) => {
    if (!name || !name.trim()) {
      showToast('error', 'Họ và tên hiển thị không được để trống!');
      return false;
    }

    setIsUpdatingUser(true);
    try {
      const res = await profileApi.updateUserProfile({ name: name.trim(), avatar });
      const updated = res.data || res;
      setUserProfile((prev) => ({ ...prev, ...updated }));
      dispatch(updateUser(updated));
      showToast('success', 'Cập nhật thông tin cá nhân thành công!');
      return true;
    } catch (err) {
      showToast('error', err.response?.data?.message || err.message || 'Cập nhật thất bại');
      return false;
    } finally {
      setIsUpdatingUser(false);
    }
  };

  // Upload Avatar File
  const handleUploadAvatarFile = async (file) => {
    if (!file) return null;
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WebP)!');
      return null;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Dung lượng ảnh tối đa là 5MB!');
      return null;
    }

    setIsUploadingAvatar(true);
    try {
      const res = await profileApi.uploadAvatar(file);
      const fileData = res.data || res;
      const uploadedUrl = fileData.url || fileData.path;

      if (uploadedUrl) {
        // Automatically save new avatar URL to user profile
        const updateRes = await profileApi.updateUserProfile({
          name: userProfile?.name || authUser?.name,
          avatar: uploadedUrl,
        });
        const updated = updateRes.data || updateRes;
        setUserProfile((prev) => ({ ...prev, ...updated, avatar: uploadedUrl }));
        dispatch(updateUser(updated));
        showToast('success', 'Tải lên và đổi ảnh đại diện thành công!');
        return uploadedUrl;
      }
      return null;
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Không thể tải ảnh lên. Vui lòng thử lại!');
      return null;
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Save Customer Profile (Customer model: phone, address, idCardNumber, etc.)
  const handleSaveCustomerInfo = async (customerData) => {
    if (!customerData.fullName || !customerData.fullName.trim()) {
      showToast('error', 'Vui lòng nhập họ và tên liên hệ!');
      return false;
    }
    if (!customerData.email || !customerData.email.trim()) {
      showToast('error', 'Vui lòng nhập email liên hệ!');
      return false;
    }
    if (!customerData.phone || !customerData.phone.trim()) {
      showToast('error', 'Vui lòng nhập số điện thoại liên hệ!');
      return false;
    }

    setIsSavingCustomer(true);
    try {
      const res = await profileApi.saveCustomerProfile(customerData);
      const saved = res.data || res;
      setCustomerProfile((prev) => ({ ...prev, ...saved }));
      showToast('success', 'Lưu hồ sơ khách hàng thành công!');
      return true;
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        err.message ||
        'Lưu hồ sơ thất bại';
      showToast('error', msg);
      return false;
    } finally {
      setIsSavingCustomer(false);
    }
  };

  // Change Password
  const handleChangePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
    if (!currentPassword) {
      showToast('error', 'Vui lòng nhập mật khẩu hiện tại!');
      return false;
    }
    if (!newPassword || newPassword.length < 6) {
      showToast('error', 'Mật khẩu mới phải có ít nhất 6 ký tự!');
      return false;
    }
    if (newPassword !== confirmPassword) {
      showToast('error', 'Mật khẩu xác nhận không khớp với mật khẩu mới!');
      return false;
    }

    setIsChangingPassword(true);
    try {
      await profileApi.changePassword({ currentPassword, newPassword });
      showToast('success', 'Đổi mật khẩu thành công!');
      return true;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Đổi mật khẩu thất bại. Mật khẩu hiện tại không đúng!';
      showToast('error', msg);
      return false;
    } finally {
      setIsChangingPassword(false);
    }
  };

  return {
    user: userProfile || authUser,
    customerProfile,
    setCustomerProfile,
    stats,
    isLoading,
    isUpdatingUser,
    isSavingCustomer,
    isChangingPassword,
    isUploadingAvatar,
    toast,
    showToast,
    clearToast: () => setToast(null),
    handleUpdatePersonalInfo,
    handleUploadAvatarFile,
    handleSaveCustomerInfo,
    handleChangePassword,
    reloadProfile: fetchProfileData,
  };
};

export default useProfile;
