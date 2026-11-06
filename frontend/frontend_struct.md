# Frontend Structure — Viet Travel (ReactJS + Vite + TailwindCSS)

> Cập nhật: 2026-11-05  
> Alias Vite: `@/` → `src/`

---

## Quy ước kiến trúc

### 3-Tier List Pattern
Mỗi trang danh sách đều tách thành 3 lớp:
```
[Entity]Page    →  điều phối dữ liệu + hooks
[Entity]List    →  render danh sách, nhận props
[Entity]Item    →  render 1 phần tử
```

### Atomic CRUD Hook Pattern
Mỗi chức năng CRUD tách thành hook riêng + 1 composer hook:
```
useGet[Entity].js       →  fetch danh sách / chi tiết
useCreate[Entity].js    →  POST
useUpdate[Entity].js    →  PUT / PATCH
useDelete[Entity].js    →  DELETE
use[Entity]s.js         →  composer: gộp tất cả, quản lý modal & toast
```

---

## Chi tiết Kiến trúc CRUD phía Admin (Admin CRUD Architecture)

Hệ thống quản trị (Admin) áp dụng mô hình phân tách 4 tầng rõ rệt (**API Client** → **Atomic Hooks** → **Composer Hook** → **View/Modals**):

```
┌────────────────────────────────────────────────────────┐
│                      UI View                           │
│   (AdminPage: Toolbar, Search, Table, Pagination)      │
└───────────┬────────────────────────────────┬───────────┘
            │                                │
            ▼                                ▼
┌────────────────────────┐      ┌────────────────────────┐
│      Action Modals     │      │   Composer Hook        │
│  - FormModal (Add/Edit)│◄────►│   (useAdmin[Entity]s)  │
│  - DeleteModal         │      │   - Modal state        │
│  - Detail/AssignModal  │      │   - Selected item      │
└────────────────────────┘      │   - Toast notification │
                                │   - Refetch / Sync     │
                                └────────────┬───────────┘
                                             │
      ┌──────────────────────────────────────┼──────────────────────────────────────┐
      ▼                                      ▼                                      ▼
┌──────────────────┐               ┌──────────────────┐                   ┌──────────────────┐
│  useGetAdmin...  │               │  useCreate...    │                   │  useUpdate...    │
│  - Query params  │               │  - POST payload  │                   │  - PUT payload   │
│  - Pagination    │               │  - isCreating    │                   │  - isUpdating    │
└─────────┬────────┘               └────────┬─────────┘                   └────────┬─────────┘
          │                                 │                                      │
          └─────────────────────────────────┼──────────────────────────────────────┘
                                            ▼
                                ┌────────────────────────┐
                                │     adminApi.js        │
                                │ (Axios central client) │
                                └────────────────────────┘
```

### 1. Phân bổ trách nhiệm từng tầng

| Tầng | Vai trò & Trách nhiệm |
|---|---|
| **1. API Client (`adminApi.js`)** | Điểm tập trung duy nhất gọi HTTP request sang backend cho toàn bộ nghiệp vụ admin. Tự động đính kèm token, chuẩn hóa endpoint và xử lý interceptor. |
| **2. Atomic CRUD Hooks** | Mỗi hook độc lập chỉ làm **đúng 1 thao tác**: <br>• `useGetAdmin[Entity]`: fetch danh sách, phân trang (`page`, `limit`), tìm kiếm (`searchTerm`), loading & error.<br>• `useCreate[Entity]`: xử lý gửi payload tạo mới, trạng thái `isCreating`.<br>• `useUpdate[Entity]`: xử lý gửi payload cập nhật theo ID, trạng thái `isUpdating`.<br>• `useDelete[Entity]`: xử lý gọi API xóa theo ID, trạng thái `isDeleting`. |
| **3. Composer Hook (`useAdmin[Entity]s`)** | **Bộ điều phối trung tâm** của trang:<br>• Tích hợp các atomic hook lại với nhau.<br>• Quản lý state đóng/mở các Modal (`isFormModalOpen`, `isDeleteModalOpen`, `isDetailModalOpen`).<br>• Quản lý đối tượng đang chọn (`selectedItem`).<br>• Quản lý thông báo toast phản hồi thành công / thất bại (`showToast`).<br>• Tự động kích hoạt `refetch()` làm mới bảng sau khi mutation hoàn tất.<br>• Tính toán cờ trạng thái tổng thể: `isSubmitting = isCreating \|\| isUpdating \|\| isDeleting`. |
| **4. View & Modals** | • `Admin[Entity]Page.jsx`: Chỉ nhận dữ liệu từ composer hook, tập trung render giao diện, không chứa logic nghiệp vụ phức tạp.<br>• `[Entity]FormModal`: Form nhập liệu có validate client-side trước khi submit.<br>• `[Entity]DeleteModal`: Hộp thoại xác nhận thao tác xóa an toàn.<br>• `[Entity]DetailModal`: Xem thông tin sâu hoặc xử lý nghiệp vụ con (ví dụ: gắn/bỏ điểm đến trong BST, phân công HDV). |

### 2. Vòng đời xử lý 1 thao tác CRUD (Lifecycle Flow)

```
[Người dùng click Sửa]
       │
       ▼
handleOpenEdit(record)  ──► setSelected(record) ──► setIsFormModalOpen(true)
       │
[Người dùng ấn Lưu Form]
       │
       ▼
handleSave(formData)    ──► Gọi useUpdate() ──► adminApi.update(id, formData)
       │                                                 │
       ▼                                                 ▼ (Thành công)
Đóng Modal ◄── Hiển thị Toast ◄── query.refetch() ◄──────┘
```

### 3. Bảng tổng hợp CRUD các module Admin

| Module | Read (Get) | Create (Post) | Update (Put) | Delete | Nghiệp vụ đặc thù |
|---|---|---|---|---|---|
| **Destination** | `useGetAdminDestinations` | `useCreateDestination` | `useUpdateDestination` | `useDeleteDestination` | Đã tách 3-tier: Page → List → Item |
| **Tour** | `useGetAdminTours` | `useCreateTour` | `useUpdateTour` | `useDeleteTour` | Quản lý đa gói giá & thời lượng |
| **Guide** | `useGetAdminGuides` | `useCreateGuide` | `useUpdateGuide` | `useDeleteGuide` | Quản lý kinh nghiệm, ngôn ngữ |
| **BookingPlan** | `useGetAdminBookingPlans` | `useCreateBookingPlan` | `useUpdateBookingPlan` | `useDeleteBookingPlan` | Phân công HDV, danh sách hành khách |
| **Collection** | `useGetAdminCollections` | ❌ *(Đã bỏ)* | `useUpdateCollection` | `useDeleteCollection` | Thêm / bớt điểm đến vào BST |
| **Contact** | `useGetAdminContacts` | ❌ | `useUpdateContact` | `useDeleteContact` | Cập nhật trạng thái xử lý liên hệ |
| **Booking** | `useGetAdminBookings` | ❌ *(Người dùng đặt)* | `useUpdateBooking` | ❌ | Duyệt / hủy / đổi trạng thái đặt chỗ |

---

## Cây thư mục

```
src/
├── App.jsx
├── App.css
├── index.css
├── main.jsx
│
├── api/
│   ├── axiosClient.js          # Axios instance + interceptors
│   ├── endpoints.js            # Tất cả API endpoint constants
│   └── chatbotApi.js
│
├── app/
│   ├── store.js                # Redux store
│   └── rootReducer.js
│
├── assets/
│   ├── hero.png
│   ├── react.svg
│   ├── vite.svg
│   ├── icons/
│   ├── images/
│   └── styles/
│       ├── main.css
│       └── tailwind.css
│
├── components/
│   ├── common/
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Modal.jsx
│   │   ├── Pagination.jsx
│   │   └── ScrollToTop.jsx
│   ├── guard/
│   │   ├── AdminRoute.jsx      # Chặn route nếu không phải admin
│   │   └── PrivateRoute.jsx    # Chặn route nếu chưa đăng nhập
│   └── layout/
│       ├── AdminLayout.jsx
│       ├── AdminSidebar.jsx
│       ├── MainLayout.jsx
│       ├── UnifiedFooter.jsx
│       └── UnifiedHeader.jsx
│
├── hooks/                      # Global shared hooks
│   ├── useAuth.js
│   ├── useDebounce.js
│   └── useLocalStorage.js
│
├── routes/
│   ├── AppRoutes.jsx           # Khai báo toàn bộ routes
│   └── routesConfig.js
│
├── utils/
│   ├── formatCurrency.js
│   ├── formatDate.js
│   └── storage.js
│
└── features/
    ├── auth/
    │   ├── authApi.js
    │   ├── authSlice.js
    │   ├── components/
    │   │   ├── LoginForm.jsx
    │   │   └── RegisterForm.jsx
    │   ├── hooks/
    │   │   ├── useLogin.js
    │   │   └── useRegister.js
    │   └── pages/
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       └── Profile.jsx
    │
    ├── admin/
    │   ├── adminApi.js         # Tất cả admin API calls
    │   ├── adminSlice.js
    │   │
    │   ├── booking/
    │   │   ├── components/
    │   │   │   ├── BookingDetailModal.jsx
    │   │   │   └── BookingStatusControl.jsx
    │   │   ├── hooks/
    │   │   │   ├── useAdminBookings.js      # composer
    │   │   │   ├── useGetAdminBookings.js
    │   │   │   └── useUpdateBooking.js
    │   │   └── pages/
    │   │       └── AdminBookings.jsx
    │   │
    │   ├── bookingPlan/
    │   │   ├── components/
    │   │   │   ├── AssignGuideModal.jsx
    │   │   │   ├── BookingPlanStatusControl.jsx
    │   │   │   ├── CreateBookingPlanModal.jsx
    │   │   │   └── PassengersListModal.jsx
    │   │   ├── hooks/
    │   │   │   ├── useAdminBookingPlans.js  # composer
    │   │   │   ├── useCreateBookingPlan.js
    │   │   │   ├── useDeleteBookingPlan.js
    │   │   │   ├── useGetAdminBookingPlans.js
    │   │   │   └── useUpdateBookingPlan.js
    │   │   └── pages/
    │   │       └── AdminBookingPlans.jsx
    │   │
    │   ├── collection/
    │   │   ├── components/
    │   │   │   ├── CollectionDeleteModal.jsx
    │   │   │   ├── CollectionDetailModal.jsx  # Quản lý điểm đến trong BST
    │   │   │   └── CollectionFormModal.jsx    # Edit-only (tạo mới đã bỏ)
    │   │   ├── hooks/
    │   │   │   ├── useAdminCollections.js    # composer (không dùng create)
    │   │   │   ├── useCreateCollection.js    # Giữ trên disk, không dùng
    │   │   │   ├── useDeleteCollection.js
    │   │   │   ├── useGetAdminCollections.js
    │   │   │   └── useUpdateCollection.js
    │   │   └── pages/
    │   │       └── AdminCollections.jsx
    │   │
    │   ├── contact/
    │   │   ├── components/
    │   │   │   ├── ContactDetailModal.jsx
    │   │   │   ├── ContactStatusBadge.jsx
    │   │   │   └── DeleteConfirmModal.jsx
    │   │   ├── hooks/
    │   │   │   ├── useAdminContacts.js       # composer
    │   │   │   ├── useDeleteContact.js
    │   │   │   ├── useGetAdminContacts.js
    │   │   │   └── useUpdateContact.js
    │   │   └── pages/
    │   │       └── AdminContacts.jsx
    │   │
    │   ├── dashboard/
    │   │   ├── components/
    │   │   │   ├── AnalyticsChart.jsx
    │   │   │   └── StatCard.jsx
    │   │   ├── dashboardApi.js
    │   │   ├── dashboardSlice.js
    │   │   ├── hooks/
    │   │   │   └── useAdminStats.js
    │   │   └── pages/
    │   │       └── AdminDashboard.jsx
    │   │
    │   ├── destination/
    │   │   ├── components/
    │   │   │   ├── AdminDestinationItem.jsx  # Row item trong bảng
    │   │   │   ├── AdminDestinationList.jsx  # Bảng danh sách
    │   │   │   ├── DestinationDeleteModal.jsx
    │   │   │   ├── DestinationDetailModal.jsx
    │   │   │   └── DestinationFormModal.jsx
    │   │   ├── hooks/
    │   │   │   ├── useAdminDestinations.js  # composer
    │   │   │   ├── useCreateDestination.js
    │   │   │   ├── useDeleteDestination.js
    │   │   │   ├── useGetAdminDestinations.js
    │   │   │   └── useUpdateDestination.js
    │   │   └── pages/
    │   │       ├── AdminDestinationPage.jsx  # Trang chính
    │   │       └── AdminDestinations.jsx     # Re-export alias
    │   │
    │   ├── guide/
    │   │   ├── components/
    │   │   │   ├── GuideDeleteModal.jsx
    │   │   │   ├── GuideDetailModal.jsx
    │   │   │   └── GuideFormModal.jsx
    │   │   ├── hooks/
    │   │   │   ├── useAdminGuides.js        # composer
    │   │   │   ├── useCreateGuide.js
    │   │   │   ├── useDeleteGuide.js
    │   │   │   ├── useGetAdminGuides.js
    │   │   │   └── useUpdateGuide.js
    │   │   └── pages/
    │   │       └── AdminGuides.jsx
    │   │
    │   └── tour/
    │       ├── components/
    │       │   ├── TourDeleteModal.jsx
    │       │   ├── TourDetailModal.jsx
    │       │   └── TourFormModal.jsx
    │       ├── hooks/
    │       │   ├── useAdminTours.js         # composer
    │       │   ├── useCreateTour.js
    │       │   ├── useDeleteTour.js
    │       │   ├── useGetAdminTours.js
    │       │   └── useUpdateTour.js
    │       └── pages/
    │           └── AdminTours.jsx
    │
    └── user/
        │
        ├── booking/
        │   ├── bookingApi.js
        │   ├── bookingSlice.js
        │   ├── components/
        │   │   ├── BookingItem.jsx
        │   │   ├── BookingList.jsx
        │   │   ├── BookingStatusBadge.jsx
        │   │   ├── BookingSummary.jsx
        │   │   ├── PassengerForm.jsx
        │   │   ├── PaymentStatusBadge.jsx
        │   │   ├── TripCancelModal.jsx
        │   │   ├── TripHeroBanner.jsx
        │   │   ├── TripItineraryTimeline.jsx
        │   │   ├── TripServicesChecklist.jsx
        │   │   ├── TripSpecsCard.jsx
        │   │   ├── TripSupportCard.jsx
        │   │   └── TripVoucherModal.jsx
        │   ├── hooks/
        │   │   ├── useMyBookings.js         # composer
        │   │   ├── useBookingForm.js
        │   │   ├── useCancelBooking.js
        │   │   ├── useGetMyBookings.js
        │   │   └── useTripPlanner.js
        │   └── pages/
        │       ├── BookingPage.jsx          # Trang chính danh sách booking
        │       ├── MyBookings.jsx           # Re-export alias
        │       ├── TourBooking.jsx          # Form đặt tour
        │       └── TripPlanner.jsx          # Chi tiết kế hoạch chuyến đi
        │
        ├── chatbot/
        │   ├── components/
        │   │   ├── ChatbotWidget.jsx
        │   │   ├── ChatMessage.jsx
        │   │   ├── DestinationCard.jsx
        │   │   └── TourCard.jsx
        │   └── hooks/
        │       └── useChatbot.js
        │
        ├── collection/
        │   ├── collectionApi.js
        │   ├── collectionSlice.js
        │   ├── components/
        │   │   ├── CollectionItem.jsx
        │   │   └── CollectionList.jsx
        │   └── pages/
        │       ├── CollectionPage.jsx       # Trang chính
        │       └── SeasonalCollections.jsx  # Re-export alias
        │
        ├── destination/
        │   ├── destinationApi.js
        │   ├── destinationSlice.js
        │   ├── components/
        │   │   ├── DestinationCard.jsx      # Re-export alias → DestinationItem
        │   │   ├── DestinationFilter.jsx
        │   │   ├── DestinationItem.jsx      # Card item trong danh sách
        │   │   ├── DestinationList.jsx      # Grid danh sách
        │   │   ├── DestinationSearch.jsx
        │   │   ├── detail/                  # Sub-components trang chi tiết
        │   │   │   ├── DestinationBookingSidebar.jsx
        │   │   │   ├── DestinationContentTabs.jsx
        │   │   │   ├── DestinationHero.jsx
        │   │   │   ├── DestinationLightboxModal.jsx
        │   │   │   ├── DestinationPackageSelector.jsx
        │   │   │   ├── DestinationQuickStats.jsx
        │   │   │   └── DestinationRelatedSection.jsx
        │   │   └── list/                    # Sub-components trang danh sách
        │   │       ├── DestinationBanner.jsx
        │   │       ├── DestinationGrid.jsx
        │   │       ├── DestinationMobileFilterDrawer.jsx
        │   │       └── DestinationResultsHeader.jsx
        │   ├── hooks/
        │   │   ├── useDestinationDetail.js
        │   │   ├── useDestinationFilter.js
        │   │   ├── useDestinations.js
        │   │   └── useDestinationsListState.js
        │   └── pages/
        │       ├── DestinationPage.jsx      # Trang chính danh sách
        │       ├── DestinationsList.jsx     # Re-export alias
        │       └── DestinationDetail.jsx    # Trang chi tiết điểm đến
        │
        ├── favourite/
        │   ├── favouriteApi.js
        │   ├── favouriteSlice.js
        │   ├── components/
        │   │   ├── FavouriteButton.jsx
        │   │   ├── FavouriteItem.jsx
        │   │   └── FavouriteList.jsx
        │   ├── hooks/
        │   │   ├── useFavourites.js         # composer
        │   │   ├── useClearFavourites.js
        │   │   ├── useGetFavourites.js
        │   │   └── useToggleFavourite.js
        │   └── pages/
        │       ├── FavouritePage.jsx        # Trang chính
        │       └── FavouritesList.jsx       # Re-export alias
        │
        ├── gallery/
        │   └── pages/
        │       └── Gallery.jsx
        │
        ├── guide/
        │   ├── guideApi.js
        │   ├── guideSlice.js
        │   ├── components/
        │   │   ├── GuideCard.jsx            # Re-export alias → GuideItem
        │   │   ├── GuideDetailModal.jsx
        │   │   ├── GuideItem.jsx
        │   │   └── GuideList.jsx
        │   ├── hooks/
        │   │   └── useGuides.js
        │   └── pages/
        │       ├── GuidePage.jsx            # Trang chính
        │       └── TravelGuides.jsx         # Re-export alias
        │
        ├── home/
        │   └── pages/
        │       └── Home.jsx
        │
        ├── profile/
        │   ├── profileApi.js
        │   ├── components/
        │   │   ├── CustomerInfoTab.jsx
        │   │   ├── PersonalInfoTab.jsx
        │   │   ├── ProfileHero.jsx
        │   │   └── SecurityTab.jsx
        │   ├── hooks/
        │   │   └── useProfile.js
        │   └── pages/
        │       └── MyProfile.jsx
        │
        ├── region/
        │   ├── components/
        │   │   ├── RegionOverviewCard.jsx
        │   │   └── RegionSelector.jsx
        │   ├── constants/
        │   │   └── regionsData.js
        │   └── pages/
        │       ├── RegionPage.jsx           # Trang chính
        │       └── RegionExplorer.jsx       # Re-export alias
        │
        ├── static/
        │   └── pages/
        │       ├── About.jsx
        │       └── Contact.jsx
        │
        └── tour/
            ├── tourApi.js
            ├── tourSlice.js
            ├── components/
            │   ├── DepartureDatePicker.jsx
            │   ├── TourCard.jsx
            │   └── TourItinerary.jsx
            ├── hooks/
            │   └── useTourDetail.js
            └── pages/
                ├── TourDetail.jsx
                └── ToursList.jsx
```

---

## Ghi chú quan trọng

### Re-export Aliases
Các file dưới đây chỉ là alias để tương thích với `AppRoutes.jsx` — không xóa:

| Alias file | Trỏ tới |
|---|---|
| `DestinationsList.jsx` | `DestinationPage.jsx` |
| `FavouritesList.jsx` | `FavouritePage.jsx` |
| `TravelGuides.jsx` | `GuidePage.jsx` |
| `SeasonalCollections.jsx` | `CollectionPage.jsx` |
| `MyBookings.jsx` | `BookingPage.jsx` |
| `RegionExplorer.jsx` | `RegionPage.jsx` |
| `AdminDestinations.jsx` | `AdminDestinationPage.jsx` |

### Admin Collection — chức năng bị bỏ
- **Tạo mới bộ sưu tập** đã bị loại bỏ theo yêu cầu
- `useCreateCollection.js` còn tồn tại trên disk nhưng không được import
- `CollectionFormModal.jsx` chỉ dùng cho **Edit** (không có create flow)
- Điểm đến có thể thuộc **nhiều bộ sưu tập** (backend đã bỏ ràng buộc 1-BST)

### Import convention
- Luôn dùng alias `@/` thay vì relative path: `@/utils/formatCurrency`
- `adminApi.js` tập trung toàn bộ admin API, không tạo api riêng per-feature trong admin
