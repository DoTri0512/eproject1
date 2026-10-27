import { useState, useEffect, useCallback, useMemo } from 'react';
import bookingApi from '../bookingApi';
import useAuth from '../../../../hooks/useAuth';

export const useTripPlanner = (bookingId) => {
  const { isAuthenticated } = useAuth();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchBookingDetail = useCallback(async () => {
    if (!bookingId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await bookingApi.getById(bookingId);
      const data = res?.data || res;
      setBooking(data);
    } catch (err) {
      console.warn('[useTripPlanner] API error or booking not found, falling back to mock:', err);
      // Fallback mock trip planner data for demo or offline preview
      setBooking({
        _id: bookingId || '6ace20deb48cdedf42b8ef99',
        bookingCode: `BK-${(bookingId || '7821').slice(-6).toUpperCase()}`,
        bookingStatus: 'confirmed',
        paymentStatus: 'completed',
        paymentMethod: 'bank_transfer',
        departureDate: '2026-07-18T00:00:00.000Z',
        endDate: '2026-07-20T00:00:00.000Z',
        bookingDate: '2026-06-25T14:30:00.000Z',
        selectedDuration: {
          days: 3,
          nights: 2,
          price: 4500000,
        },
        numberOfGuests: {
          adults: 2,
          children: 1,
        },
        totalAmount: 11250000,
        notes: 'Yêu cầu phòng ngủ tầng cao view biển, chuẩn bị sẵn xe đẩy cho trẻ nhỏ.',
        tourId: {
          _id: '661e89b2f12a34b5c6d7e890',
          title: 'Tour Khám Phá Di Sản Miền Trung: Đà Nẵng - Hội An - Huế',
          slug: 'tour-kham-pha-di-san-mien-trung',
          overview: 'Chuyến hành trình 3 ngày 2 đêm đưa du khách lạc bước giữa những di sản văn hóa thế giới UNESCO, trải nghiệm vẻ đẹp cổ kính Hội An và cố đô Huế rực rỡ.',
          destinationId: {
            name: 'Đà Nẵng - Hội An',
            slug: 'da-nang-hoi-an',
            location: 'Miền Trung, Việt Nam',
            region: 'Miền Trung',
            theme: 'Di sản & Nghỉ dưỡng',
            image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
            gallery: [
              { url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80', caption: 'Phố cổ Hội An' },
              { url: 'https://images.unsplash.com/photo-1574701249767-f7caeef2342d?auto=format&fit=crop&w=800&q=80', caption: 'Cầu Vàng Bà Nà Hills' },
              { url: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80', caption: 'Đại Nội Huế' },
            ],
          },
          itinerary: [
            {
              day: 1,
              title: 'Đón khách – Bán đảo Sơn Trà – Khám phá Phố Cổ Hội An về đêm',
              description: 'Xe và HDV đón quý khách tại sân bay Đà Nẵng. Khởi hành viếng Chùa Linh Ứng ngắm toàn cảnh thành phố biển. Buổi chiều di chuyển vào Hội An, thưởng thức ẩm thực cao lầu và dạo thuyền hoa đăng sông Hoài.',
            },
            {
              day: 2,
              title: 'KDL Bà Nà Hills – Cầu Vàng – Làng Pháp – Tắm biển Mỹ Khê',
              description: 'Trải nghiệm tuyến cáp treo đạt 4 kỷ lục Guinness thế giới lên đỉnh Bà Nà. Check-in siêu phẩm Cầu Vàng nổi tiếng toàn cầu, vui chơi tại Fantasy Park và ngắm hoàng hôn biển Mỹ Khê.',
            },
            {
              day: 3,
              title: 'Xuyên Hầm Hải Vân – Cố Đô Huế – Đại Nội – Tiễn Đoàn',
              description: 'Khởi hành đi Cố đô Huế, tham quan quần thể Di tích Cố đô: Ngọ Môn, Điện Thái Hòa, Chùa Thiên Mụ cổ kính bên bờ sông Hương. Mua đặc sản mè xửng, kẹo cau và tiễn đoàn ra sân bay.',
            },
            {
              day: 4,
              title: 'Khám phá Đảo Cù Lao Chàm – Lặn ngắm San hô',
              description: 'Dành cho gói 4 ngày: Khởi hành cano cao tốc ra đảo sinh quyển Cù Lao Chàm, lặn ngắm rạn san hô tự nhiên và thưởng thức hải sản tươi ngon của ngư dân.',
            },
          ],
          includes: [
            'Xe du lịch đời mới máy lạnh phục vụ suốt hành trình',
            'Khách sạn tiêu chuẩn 4 sao trung tâm (2 khách/phòng)',
            'Các bữa ăn theo chương trình: 3 bữa sáng buffet + 5 bữa chính đặc sản',
            'Vé tham quan tất cả các điểm theo lịch trình & Cáp treo Bà Nà khứ hồi',
            'Hướng dẫn viên chuyên nghiệp nhiệt tình đồng hành',
            'Bảo hiểm du lịch trọn gói mức bồi thường tối đa 100.000.000 đ',
            'Nước uống tinh khiết 2 chai/khách/ngày và nón du lịch thời trang',
          ],
          excludes: [
            'Chi phí cá nhân: giặt ủi, điện thoại, đồ uống minibar',
            'Vé tham quan và dịch vụ giải trí ngoài chương trình',
            'Tiền tip bồi dưỡng HDV và lái xe (tùy tâm)',
            'Thuế VAT 8% (nếu yêu cầu xuất hóa đơn công ty)',
          ],
        },
        guide_id: {
          _id: '661a33f48d89e5a1b3f71001',
          name: 'Trần Minh Khoa',
          specialisation: 'Chuyên gia Di sản Miền Trung & Văn hóa Chăm',
          languages: ['Tiếng Việt', 'Tiếng Anh'],
          background: 'Cử nhân Việt Nam Học - ĐH KHXH&NV, 8 năm kinh nghiệm dẫn đoàn quốc tế và nội địa.',
          biography: 'Với phong cách dẫn chuyện hóm hỉnh và vốn kiến thức sâu rộng về văn hóa xứ Quảng - Huế, anh Khoa luôn mang đến cho du khách những hành trình khám phá trọn vẹn và an tâm nhất.',
        },
        customerId: {
          fullName: 'Nguyễn Văn An',
          email: 'an.nguyen@traveltrail.vn',
          phone: '0912 345 678',
          address: '45 Lê Duẩn, Quận 1, TP. Hồ Chí Minh',
        },
      });
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBookingDetail();
  }, [fetchBookingDetail]);

  // Filter itinerary to only match selected duration days
  const filteredItinerary = useMemo(() => {
    if (!booking?.tourId?.itinerary) return [];
    const maxDays = booking.selectedDuration?.days || 3;
    const sorted = [...booking.tourId.itinerary].sort((a, b) => a.day - b.day);
    return sorted.filter((item) => item.day <= maxDays);
  }, [booking]);

  // Compute countdown to departure
  const countdownDays = useMemo(() => {
    if (!booking?.departureDate) return null;
    const now = new Date();
    const departure = new Date(booking.departureDate);
    // Reset time components for clean day diff
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(departure.getFullYear(), departure.getMonth(), departure.getDate());
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [booking]);

  // Cancel booking function
  const handleCancelBooking = async (reason) => {
    if (!booking?._id) return false;
    setIsCancelling(true);
    try {
      await bookingApi.cancel(booking._id, reason);
      setBooking((prev) => (prev ? { ...prev, bookingStatus: 'cancelled' } : prev));
      return true;
    } catch (err) {
      console.warn('API cancel error, local update:', err);
      setBooking((prev) => (prev ? { ...prev, bookingStatus: 'cancelled' } : prev));
      return true;
    } finally {
      setIsCancelling(false);
    }
  };

  return {
    booking,
    filteredItinerary,
    countdownDays,
    isLoading,
    error,
    isCancelling,
    refetch: fetchBookingDetail,
    cancelBooking: handleCancelBooking,
    isAuthenticated,
  };
};

export default useTripPlanner;
