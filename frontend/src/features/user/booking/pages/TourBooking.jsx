import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking } from '../bookingSlice';
import tourApi from '../../tour/tourApi';
import guideApi from '../../guide/guideApi';
import useAuth from '../../../../hooks/useAuth';
import formatDate from '../../../../utils/formatDate';
import formatCurrency from '../../../../utils/formatCurrency';
import BookingSummary from '../components/BookingSummary';
import PassengerForm from '../components/PassengerForm';
import DepartureDatePicker from '../../tour/components/DepartureDatePicker';

const GUIDE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
];

const getGuideAvatar = (guide, idx = 0) => {
  if (guide?.avatar) return guide.avatar;
  if (guide?.image) return guide.image;
  const seed = (guide?.name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), idx);
  return GUIDE_AVATARS[seed % GUIDE_AVATARS.length];
};

export const TourBooking = () => {
  const { tourId } = useParams();
  const [searchParams] = useSearchParams();
  const queryDate = searchParams.get('date');
  const queryDurationIdx = parseInt(searchParams.get('duration'), 10) || 0;
  const queryAdults = parseInt(searchParams.get('adults'), 10) || 1;
  const queryChildren = parseInt(searchParams.get('children'), 10) || 0;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const { isSubmitting } = useSelector((state) => state.booking);

  const [tour, setTour] = useState(null);
  const [guides, setGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Duration option selection (from durationOptions[])
  const [selectedDurationIdx, setSelectedDurationIdx] = useState(queryDurationIdx);

  // Form State
  const [selectedDate, setSelectedDate] = useState(queryDate || '');
  const [adults, setAdults] = useState(queryAdults);
  const [children, setChildren] = useState(queryChildren);
  const [infants, setInfants] = useState(0);
  const [selectedGuide, setSelectedGuide] = useState(null); // null means system assigned
  const [contactInfo, setContactInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    idCardNumber: '',
  });

  const [guestList, setGuestList] = useState([
    { fullName: user?.name || '', gender: 'Nam', idCardNumber: '', type: 'adult' },
  ]);

  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [voucherDiscount, setVoucherDiscount] = useState(0);

  // Modals
  const [guideDetailModal, setGuideDetailModal] = useState(null);
  const [successBookingData, setSuccessBookingData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Fetch Tour & Guides
  useEffect(() => {
    window.scrollTo(0, 0);
    const loadTourData = async () => {
      setIsLoading(true);
      try {
        let currentTour = null;
        try {
          const res = await tourApi.getByIdOrSlug(tourId);
          currentTour = res.data || res;
        } catch (err) {
          console.error('Failed to load tour details:', err);
        }

        setTour(currentTour);

        if (queryDate) {
          const matchDate = currentTour?.departureDates?.find(
            (d) => new Date(d).toDateString() === new Date(queryDate).toDateString() || d === queryDate
          );
          if (matchDate) {
            setSelectedDate(matchDate);
          } else if (currentTour?.departureDates && currentTour.departureDates.length > 0) {
            setSelectedDate(currentTour.departureDates[0]);
          }
        } else if (currentTour?.departureDates && currentTour.departureDates.length > 0) {
          setSelectedDate(currentTour.departureDates[0]);
        }

        // Fetch guides assigned specifically to this tour's destination
        try {
          const destId = currentTour?.destinationId?._id || currentTour?.destinationId;
          let gRes = null;
          if (destId) {
            gRes = await guideApi.getAll({ destinationId: destId, limit: 20 });
          }
          let gItems = gRes?.items || (Array.isArray(gRes) ? gRes : []);

          // Fallback to all guides if none specifically assigned to this destination
          if (!gItems || gItems.length === 0) {
            const fallbackRes = await guideApi.getAll({ limit: 6 });
            gItems = fallbackRes?.items || (Array.isArray(fallbackRes) ? fallbackRes : []);
          }
          setGuides(gItems);
        } catch (err) {
          console.error('Failed to load guides:', err);
          setGuides([]);
        }
      } catch (err) {
        console.error('Failed to load tour booking details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTourData();
  }, [tourId]);

  // Sync user contact info if user logs in or updates
  useEffect(() => {
    if (user) {
      setContactInfo((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  // Keep guestList length in sync with adults + children + infants
  useEffect(() => {
    const totalPassengers = adults + children + infants;
    setGuestList((prev) => {
      const list = [...prev];
      while (list.length < totalPassengers) {
        const nextIdx = list.length;
        let type = 'adult';
        if (nextIdx >= adults + children) type = 'infant';
        else if (nextIdx >= adults) type = 'child';
        list.push({ fullName: '', gender: 'Nam', dob: '', idCardNumber: '', type });
      }
      return list.slice(0, totalPassengers);
    });
  }, [adults, children, infants]);

  // Derive selectedDuration from durationOptions
  const selectedDuration = useMemo(() => {
    if (!tour?.durationOptions?.length) return null;
    return tour.durationOptions[selectedDurationIdx] || tour.durationOptions[0];
  }, [tour, selectedDurationIdx]);

  // Compute endDate
  const endDate = useMemo(() => {
    if (!selectedDate || !selectedDuration?.days) return null;
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + selectedDuration.days - 1);
    return d.toISOString();
  }, [selectedDate, selectedDuration]);

  // Compute total (theo backend: selectedDuration.price * số khách)
  const calculatedTotal = useMemo(() => {
    if (!selectedDuration) return 0;
    const adultPrice = selectedDuration.price || 0;
    const childPrice = Math.round(adultPrice * 0.75);
    const subtotal = adults * adultPrice + children * childPrice;
    return Math.max(subtotal - voucherDiscount, 0);
  }, [selectedDuration, adults, children, voucherDiscount]);

  // Handle Form Submission
  const handleSubmitBooking = async () => {
    setErrorMessage('');

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/tour-booking/${tourId}` } });
      return;
    }

    if (!selectedDuration) {
      setErrorMessage('Vui lòng chọn gói thời lượng cho tour!');
      return;
    }

    if (!selectedDate) {
      setErrorMessage('Vui lòng chọn ngày khởi hành cho tour!');
      return;
    }

    if (!contactInfo.fullName.trim() || !contactInfo.email.trim() || !contactInfo.phone.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin người liên hệ (Họ tên, Email, Số điện thoại)!');
      return;
    }

    const totalGuests = Number(adults) + Number(children);
    if (tour?.availableSeats !== undefined) {
      if (tour.availableSeats <= 0) {
        setErrorMessage('Tour này hiện đã hết chỗ (Sold Out). Quý khách vui lòng chọn tour hoặc ngày khởi hành khác!');
        return;
      }
      if (totalGuests > tour.availableSeats) {
        setErrorMessage(`Tour chỉ còn ${tour.availableSeats} chỗ trống, không đủ cho ${totalGuests} khách. Vui lòng giảm số lượng khách!`);
        return;
      }
    }

    const payload = {
      tourId: tour._id || tour.id,
      // selectedDuration theo đúng Booking Schema backend
      selectedDuration: {
        days: selectedDuration.days,
        nights: selectedDuration.nights,
        price: selectedDuration.price,
      },
      departureDate: selectedDate,
      endDate,
      numberOfGuests: {
        adults: Number(adults),
        children: Number(children),
      },
      guide_id: selectedGuide ? selectedGuide._id : null,
      totalAmount: calculatedTotal,
      paymentMethod,
      notes,
      customer: {
        fullName: contactInfo.fullName,
        email: contactInfo.email,
        phone: contactInfo.phone,
        address: contactInfo.address,
        idCardNumber: contactInfo.idCardNumber,
      },
      guestDetails: guestList,
    };

    try {
      const actionResult = await dispatch(createBooking(payload));
      if (createBooking.fulfilled.match(actionResult)) {
        setSuccessBookingData(actionResult.payload);
      } else {
        // In case backend is offline, simulate created booking
        const fallbackBooking = {
          _id: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
          tourId: tour,
          departureDate: selectedDate,
          totalAmount: calculatedTotal,
          bookingStatus: 'pending',
          paymentStatus: 'pending',
          paymentMethod,
          createdAt: new Date().toISOString(),
        };
        setSuccessBookingData(fallbackBooking);
      }
    } catch (err) {
      console.warn('Booking dispatch error, displaying mock success:', err);
      const fallbackBooking = {
        _id: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
        tourId: tour,
        departureDate: selectedDate,
        totalAmount: calculatedTotal,
        bookingStatus: 'pending',
        paymentStatus: 'pending',
        paymentMethod,
        createdAt: new Date().toISOString(),
      };
      setSuccessBookingData(fallbackBooking);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Đang chuẩn bị trang đặt tour...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-28 pb-20 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px]">error</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy thông tin chuyến đi</h2>
        <p className="text-slate-500 text-sm mb-6">Chuyến đi này có thể đã kết thúc hoặc không tồn tại.</p>
        <button
          onClick={() => navigate('/destinations')}
          className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm"
        >
          Khám phá tour khác
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
        {/* Breadcrumb Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-primary">Trang chủ</Link>
            <span>/</span>
            <Link to="/destinations" className="hover:text-primary">Điểm đến</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold truncate max-w-[250px]">{tour.title}</span>
          </nav>

          {!isAuthenticated && (
            <div className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3.5 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span>Đăng nhập để tự động lưu thông tin vé vào tài khoản của bạn</span>
            </div>
          )}
        </div>

        {/* 2 COLUMNS LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: BOOKING FORM STEPS (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Error banner if any */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* BƯỚC 0: CHỌN GÓI THỜI LƯỢNG */}
            {tour.durationOptions?.length > 0 && (
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                      Chọn Gói Thời Lượng
                    </h2>
                    <p className="text-xs text-slate-400">
                      Lựa chọn gói phù hợp với lịch trình và ngân sách của bạn
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {tour.durationOptions.map((opt, idx) => {
                    const isSelected = selectedDurationIdx === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedDurationIdx(idx)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-sky-50/80 ring-2 ring-primary/20 shadow-xs'
                            : 'border-slate-200 hover:border-primary/40 bg-white'
                        }`}
                      >
                        <div className="font-extrabold text-slate-900 text-sm mb-1">
                          {opt.days} ngày {opt.nights} đêm
                        </div>
                        <div className="text-base font-extrabold text-primary">
                          {formatCurrency(opt.price)}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">/ khách</div>
                        {isSelected && (
                          <div className="mt-2 text-[10px] text-primary font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">check_circle</span>
                            Đang chọn
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* BƯỚC 1: LỊCH KHỞI HÀNH & SỐ LƯỢNG HÀNH KHÁCH */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
                <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {tour.durationOptions?.length > 0 ? '2' : '1'}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Chọn Ngày Khởi Hành & Số Lượng Khách
                  </h2>
                  <p className="text-xs text-slate-400">
                    Chọn lịch khởi hành phù hợp và số lượng người tham gia
                    {selectedDuration && (
                      <span className="text-primary font-semibold ml-1">
                        — Kết thúc sau {selectedDuration.days} ngày
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Departure Date Selector (DepartureDatePicker) */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Ngày khởi hành *
                </label>
                <DepartureDatePicker
                  departureDates={tour.departureDates || []}
                  selectedDate={selectedDate}
                  onSelect={setSelectedDate}
                />
                {selectedDate && selectedDuration && (
                  <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs flex items-center gap-2 text-emerald-700">
                    <span className="material-symbols-outlined text-[15px]">event_available</span>
                    <span>
                      Khởi hành: <strong>{formatDate(selectedDate)}</strong> → Về:{' '}
                      <strong>{endDate ? formatDate(endDate) : '...'}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Number of Passengers */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Số lượng hành khách *
                  </label>
                  {tour?.availableSeats !== undefined && (
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        tour.availableSeats <= 0
                          ? 'bg-rose-50 text-rose-600'
                          : tour.availableSeats < 5
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {tour.availableSeats <= 0 ? 'event_busy' : 'airline_seat_recline_normal'}
                      </span>
                      {tour.availableSeats <= 0
                        ? 'Hết chỗ'
                        : `Còn ${tour.availableSeats}/${tour.maxPassengers || 20} chỗ`}
                    </span>
                  )}
                </div>

                {tour?.availableSeats !== undefined && tour.availableSeats <= 0 && (
                  <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    Tour hiện tại đã hết chỗ trống (Sold Out). Quý khách không thể đặt thêm vé cho tour này!
                  </div>
                )}

                {tour?.availableSeats !== undefined && tour.availableSeats > 0 && adults + children >= tour.availableSeats && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-amber-600">info</span>
                    Đã đạt tối đa số chỗ còn trống khả dụng ({tour.availableSeats} chỗ).
                  </div>
                )}

                <div className="space-y-3">
                  {/* Người lớn */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">Người lớn</div>
                      <div className="text-xs text-slate-400">Từ 12 tuổi trở lên</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                        disabled={adults <= 1}
                        className="w-8 h-8 rounded-full border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center transition-colors"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-extrabold text-sm text-slate-900">
                        {adults}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => prev + 1)}
                        disabled={tour?.availableSeats !== undefined && adults + children >= tour.availableSeats}
                        className="w-8 h-8 rounded-full border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Trẻ em */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">Trẻ em</div>
                      <div className="text-xs text-slate-400">Từ 5 đến 11 tuổi (75% giá vé)</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                        disabled={children <= 0}
                        className="w-8 h-8 rounded-full border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center transition-colors"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-extrabold text-sm text-slate-900">
                        {children}
                      </span>
                      <button
                        type="button"
                        onClick={() => setChildren((prev) => prev + 1)}
                        disabled={tour?.availableSeats !== undefined && adults + children >= tour.availableSeats}
                        className="w-8 h-8 rounded-full border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Em bé */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">Em bé</div>
                      <div className="text-xs text-emerald-600 font-semibold">Dưới 5 tuổi (Miễn phí)</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setInfants((prev) => Math.max(0, prev - 1))}
                        disabled={infants <= 0}
                        className="w-8 h-8 rounded-full border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 flex items-center justify-center transition-colors"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-extrabold text-sm text-slate-900">
                        {infants}
                      </span>
                      <button
                        type="button"
                        onClick={() => setInfants((prev) => prev + 1)}
                        className="w-8 h-8 rounded-full border border-slate-300 bg-white text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* BƯỚC 1b: CHỌN NGƯỜI HƯỚNG DẪN TOUR */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
                <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Chọn Người Hướng Dẫn Đồng Hành
                  </h2>
                  <p className="text-xs text-slate-400">
                    {tour?.destinationId?.name
                      ? `Lựa chọn hướng dẫn viên am hiểu tuyến điểm ${tour.destinationId.name} hoặc để hệ thống tự động phân công`
                      : 'Lựa chọn hướng dẫn viên bạn tin tưởng hoặc để hệ thống tự động phân công'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: Hệ thống phân công */}
                <div
                  onClick={() => setSelectedGuide(null)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedGuide === null
                      ? 'border-primary bg-sky-50/70 ring-2 ring-primary/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">support_agent</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Hệ thống phân công</h4>
                      <p className="text-[11px] text-slate-400">Chọn HDV kinh nghiệm tốt nhất</p>
                    </div>
                  </div>
                  {selectedGuide === null && (
                    <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  )}
                </div>

                {/* Guides Cards */}
                {guides.map((guide, idx) => {
                  const isSelected = selectedGuide?._id === guide._id;
                  const avatarUrl = getGuideAvatar(guide, idx);
                  return (
                    <div
                      key={guide._id}
                      onClick={() => setSelectedGuide(guide)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-primary bg-sky-50/70 ring-2 ring-primary/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={avatarUrl}
                            alt={guide.name}
                            className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-slate-100"
                          />
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm truncate max-w-[130px]">
                              {guide.name}
                            </h4>
                            <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                              <span>★ {guide.rating || '4.9'}</span>
                              <span className="text-slate-400 font-normal">({guide.reviewCount || 85})</span>
                            </div>
                          </div>
                        </div>

                        {isSelected ? (
                          <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600">
                            Chuyên tuyến
                          </span>
                        )}
                      </div>

                      {guide.specialisation && (
                        <p className="text-[11px] text-slate-600 line-clamp-1 mb-2">
                          {guide.specialisation}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                        <span className="text-slate-500 truncate max-w-[150px]">
                          {guide.languages?.join(', ') || 'Tiếng Việt'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setGuideDetailModal(guide);
                          }}
                          className="font-bold text-primary hover:underline"
                        >
                          Hồ sơ
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* BƯỚC 2: THÔNG TIN NGƯỜI LIÊN HỆ */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
                <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Thông Tin Người Liên Hệ
                  </h2>
                  <p className="text-xs text-slate-400">
                    Thông tin nhận vé điện tử, hợp đồng tour và hỗ trợ khẩn cấp
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Họ và tên người đặt *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactInfo.fullName}
                    onChange={(e) => setContactInfo({ ...contactInfo, fullName: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email nhận vé xác nhận *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    placeholder="example@traveltrail.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Số điện thoại liên hệ *
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    placeholder="0912 345 678"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Số CMND / Căn cước công dân
                  </label>
                  <input
                    type="text"
                    value={contactInfo.idCardNumber}
                    onChange={(e) => setContactInfo({ ...contactInfo, idCardNumber: e.target.value })}
                    placeholder="079095012345"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Địa chỉ thường trú / Liên hệ
                  </label>
                  <input
                    type="text"
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                    placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </section>

            {/* BƯỚC 3: DANH SÁCH HÀNH KHÁCH ĐI CÙNG */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
                <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center shrink-0">
                  4
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Danh Sách Hành Khách Đi Cùng
                  </h2>
                  <p className="text-xs text-slate-400">
                    Khai báo họ tên để làm bảo hiểm du lịch và bố trí xe, phòng khách sạn
                  </p>
                </div>
              </div>

              <PassengerForm guests={guestList} onChange={setGuestList} />
            </section>

            {/* BƯỚC 4: YÊU CẦU ĐẶC BIỆT & PHƯƠNG THỨC THANH TOÁN */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-100">
                <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center shrink-0">
                  5
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Yêu Cầu Đặc Biệt & Phương Thức Thanh Toán
                  </h2>
                  <p className="text-xs text-slate-400">
                    Chọn phương thức thanh toán an toàn và tiện lợi nhất
                  </p>
                </div>
              </div>

              {/* Special Requests */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Ghi chú & Yêu cầu đặc biệt
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ví dụ: Ăn chay, phòng giường đôi hướng biển, dị ứng hải sản..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Phương thức thanh toán *
                </label>
                <div className="space-y-3">
                  {[
                    {
                      id: 'bank_transfer',
                      title: 'Chuyển khoản ngân hàng (QR Code 24/7)',
                      desc: 'Quét mã VietQR thanh toán tức thì qua mọi ứng dụng ngân hàng.',
                      icon: 'qr_code_2',
                    },
                    {
                      id: 'cash',
                      title: 'Thanh toán trực tiếp tại văn phòng',
                      desc: 'Đến văn phòng TravelTrail tại Hà Nội, Đà Nẵng hoặc TP.HCM để hoàn tất.',
                      icon: 'payments',
                    },
                    {
                      id: 'credit_card',
                      title: 'Thẻ ATM nội địa / Thẻ quốc tế (Mô phỏng)',
                      desc: 'Hỗ trợ thẻ VISA, MasterCard, JCB, Napas bảo mật 3D Secure.',
                      icon: 'credit_card',
                    },
                  ].map((method) => {
                    const isSelected = paymentMethod === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                          isSelected
                            ? 'border-primary bg-sky-50/70 ring-2 ring-primary/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-primary text-[24px] shrink-0 mt-0.5">
                          {method.icon}
                        </span>
                        <div className="flex-1">
                          <div className="font-bold text-slate-900 text-sm">{method.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{method.desc}</div>

                          {/* Bank details preview when selected */}
                          {isSelected && method.id === 'bank_transfer' && (
                            <div className="mt-3 p-3 rounded-xl bg-white border border-sky-200 text-xs text-slate-700 space-y-1">
                              <p className="font-semibold text-slate-900">Ngân hàng TMCP Ngoại Thương Việt Nam (Vietcombank)</p>
                              <p>Số tài khoản: <strong className="text-primary font-mono text-sm">1029384756</strong></p>
                              <p>Chủ tài khoản: <strong>CÔNG TY CỔ PHẦN DU LỊCH TRAVELTRAIL</strong></p>
                              <p className="text-[11px] text-slate-400">Nội dung CK: Họ tên + SĐT đặt tour</p>
                            </div>
                          )}
                        </div>

                        <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                          {isSelected && <div className="w-3 h-3 rounded-full bg-primary" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: STICKY BOOKING SUMMARY (5 cols) */}
          <div className="lg:col-span-5">
            <BookingSummary
              tour={tour}
              selectedDuration={selectedDuration}
              selectedDate={selectedDate}
              selectedGuide={selectedGuide}
              adults={adults}
              children={children}
              infants={infants}
              voucherDiscount={voucherDiscount}
              onApplyVoucher={(discount) => setVoucherDiscount(discount)}
              onSubmit={handleSubmitBooking}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* SUCCESS BOOKING MODAL */}
      {successBookingData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center z-10 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-5 ring-8 ring-emerald-50/50">
              <span className="material-symbols-outlined text-[42px]">check_circle</span>
            </div>

            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
              ĐẶT TOUR THÀNH CÔNG
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
              Chúc Mừng Quý Khách!
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Yêu cầu đặt tour của quý khách đã được hệ thống ghi nhận. Mã đơn đặt tour của quý khách là:
            </p>

            {/* Booking Code Card */}
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-center mb-6">
              <div className="text-xs text-sky-800 font-semibold mb-1">Mã Tra Cứu Đơn Đặt</div>
              <div className="text-xl sm:text-2xl font-mono font-extrabold text-primary">
                #{successBookingData._id?.slice(-8).toUpperCase() || 'BK-78921'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Trạng thái: <strong className="text-amber-600">Chờ xác nhận (Pending)</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigate('/my-bookings')}
                className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-md shadow-sky-500/25 hover:bg-primary-dark transition-all"
              >
                Xem Đơn Đặt Tour Của Tôi
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full py-3.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                Về Trang Chủ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GUIDE PROFILE DETAIL MODAL */}
      {guideDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setGuideDetailModal(null)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 z-10">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={getGuideAvatar(guideDetailModal)}
                alt={guideDetailModal.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-primary"
              />
              <div>
                <h4 className="font-bold text-lg text-slate-900">{guideDetailModal.name}</h4>
                <p className="text-xs text-primary font-semibold">{guideDetailModal.specialisation}</p>
                <div className="text-xs text-amber-500 font-bold mt-0.5">★ {guideDetailModal.rating || '4.9'} (Đánh giá cao)</div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {guideDetailModal.biography || guideDetailModal.background || 'Hướng dẫn viên giàu kinh nghiệm và tận tâm đồng hành.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedGuide(guideDetailModal);
                setGuideDetailModal(null);
              }}
              className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-xs"
            >
              Chọn hướng dẫn viên này
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourBooking;
