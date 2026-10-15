# CẤU TRÚC THƯ MỤC FRONTEND REACTJS VITE (FRONTEND STRUCTURE SPECIFICATION)

**Dự án:** TravelTrail - Full-stack Travel & Tour Booking System  
**Công nghệ:** ReactJS (Vite) + Redux Toolkit + TailwindCSS + Axios  
**Kiến trúc:** Feature / Module-based Architecture

---

## I. SƠ ĐỒ CẤU TRÚC THƯ MỤC (DIRECTORY TREE)

```text
frontend/
├── public/
│   └── images/
├── src/
│   ├── api/
│   │   ├── axiosClient.js
│   │   └── endpoints.js
│   ├── app/
│   │   ├── store.js
│   │   └── rootReducer.js
│   ├── assets/
│   │   ├── icons/
│   │   ├── images/
│   │   └── styles/
│   │       ├── tailwind.css
│   │       └── main.css
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Badge.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── layout/
│   │   │   ├── UnifiedHeader.jsx
│   │   │   ├── UnifiedFooter.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── MainLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   └── guard/
│   │       ├── PrivateRoute.jsx
│   │       └── AdminRoute.jsx
│   ├── features/
│   │   │
│   │   ├── auth/                          # Dùng chung cho cả user và admin
│   │   │   ├── authSlice.js
│   │   │   ├── authApi.js
│   │   │   ├── hooks/
│   │   │   │   ├── useLogin.js
│   │   │   │   └── useRegister.js
│   │   │   ├── pages/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── Profile.jsx
│   │   │   └── components/
│   │   │       ├── LoginForm.jsx
│   │   │       └── RegisterForm.jsx
│   │   │
│   │   ├── user/                          # Các module chức năng phía User
│   │   │   ├── destination/
│   │   │   │   ├── destinationSlice.js
│   │   │   │   ├── destinationApi.js
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useDestinations.js
│   │   │   │   │   └── useDestinationFilter.js
│   │   │   │   ├── pages/
│   │   │   │   │   ├── DestinationsList.jsx
│   │   │   │   │   └── DestinationDetail.jsx
│   │   │   │   └── components/
│   │   │   │       ├── DestinationCard.jsx
│   │   │   │       ├── DestinationFilter.jsx
│   │   │   │       └── DestinationSearch.jsx
│   │   │   ├── tour/
│   │   │   │   ├── tourSlice.js
│   │   │   │   ├── tourApi.js
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useTourDetail.js
│   │   │   │   ├── pages/
│   │   │   │   │   └── TourDetail.jsx
│   │   │   │   └── components/
│   │   │   │       ├── TourCard.jsx
│   │   │   │       ├── TourItinerary.jsx
│   │   │   │       └── DepartureDatePicker.jsx
│   │   │   ├── booking/
│   │   │   │   ├── bookingSlice.js
│   │   │   │   ├── bookingApi.js
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useBookingForm.js
│   │   │   │   │   └── useMyBookings.js
│   │   │   │   ├── pages/
│   │   │   │   │   ├── TourBooking.jsx
│   │   │   │   │   └── MyBookings.jsx
│   │   │   │   └── components/
│   │   │   │       ├── BookingSummary.jsx
│   │   │   │       ├── PassengerForm.jsx
│   │   │   │       └── BookingStatusBadge.jsx
│   │   │   ├── favourite/
│   │   │   │   ├── favouriteSlice.js
│   │   │   │   ├── favouriteApi.js
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useFavourites.js
│   │   │   │   ├── pages/
│   │   │   │   │   └── FavouritesList.jsx
│   │   │   │   └── components/
│   │   │   │       └── FavouriteButton.jsx
│   │   │   ├── guide/
│   │   │   │   ├── guideSlice.js
│   │   │   │   ├── guideApi.js
│   │   │   │   ├── hooks/
│   │   │   │   │   └── useGuides.js
│   │   │   │   ├── pages/
│   │   │   │   │   └── TravelGuides.jsx
│   │   │   │   └── components/
│   │   │   │       └── GuideCard.jsx
│   │   │   ├── gallery/
│   │   │   │   └── pages/
│   │   │   │       └── Gallery.jsx
│   │   │   ├── region/
│   │   │   │   └── pages/
│   │   │   │       └── RegionExplorer.jsx
│   │   │   ├── collection/
│   │   │   │   ├── collectionSlice.js
│   │   │   │   ├── collectionApi.js
│   │   │   │   └── pages/
│   │   │   │       └── SeasonalCollections.jsx
│   │   │   ├── home/
│   │   │   │   └── pages/
│   │   │   │       └── Home.jsx
│   │   │   └── static/
│   │   │       └── pages/
│   │   │           ├── About.jsx
│   │   │           └── Contact.jsx
│   │   │
│   │   └── admin/                         # Các module chức năng phía Admin
│   │       ├── dashboard/
│   │       │   ├── dashboardSlice.js
│   │       │   ├── dashboardApi.js
│   │       │   ├── hooks/
│   │       │   │   └── useAdminStats.js
│   │       │   ├── pages/
│   │       │   │   └── AdminDashboard.jsx
│   │       │   └── components/
│   │       │       ├── StatCard.jsx
│   │       │       └── AnalyticsChart.jsx
│   │       ├── destination/
│   │       │   ├── hooks/
│   │       │   │   └── useAdminDestinations.js
│   │       │   ├── pages/
│   │       │   │   └── AdminDestinations.jsx
│   │       │   └── components/
│   │       │       ├── DestinationFormModal.jsx
│   │       │       └── DestinationDeleteModal.jsx
│   │       ├── tour/
│   │       │   ├── hooks/
│   │       │   │   └── useAdminTours.js
│   │       │   ├── pages/
│   │       │   │   └── AdminTours.jsx
│   │       │   └── components/
│   │       │       ├── TourFormModal.jsx
│   │       │       └── TourDeleteModal.jsx
│   │       ├── booking/
│   │       │   ├── hooks/
│   │       │   │   └── useAdminBookings.js
│   │       │   ├── pages/
│   │       │   │   └── AdminBookings.jsx
│   │       │   └── components/
│   │       │       └── BookingStatusControl.jsx
│   │       ├── bookingPlan/
│   │       │   ├── hooks/
│   │       │   │   └── useAdminBookingPlans.js
│   │       │   ├── pages/
│   │       │   │   └── AdminBookingPlans.jsx
│   │       │   └── components/
│   │       │       ├── AssignGuideModal.jsx
│   │       │       └── PassengersListModal.jsx
│   │       └── guide/
│   │           ├── hooks/
│   │           │   └── useAdminGuides.js
│   │           ├── pages/
│   │           │   └── AdminGuides.jsx
│   │           └── components/
│   │               ├── GuideFormModal.jsx
│   │               └── GuideDeleteModal.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useDebounce.js
│   │   └── useLocalStorage.js
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── routesConfig.js
│   ├── utils/
│   │   ├── formatCurrency.js
│   │   ├── formatDate.js
│   │   └── storage.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── .env.example
└── .gitignore
```

---

## II. CHI TIẾT VAI TRÒ CÁC CẤU PHẦN

### 1. Thư mục Root Frontend

| File                 | Vai trò                                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `index.html`         | HTML template chính chứa `<div id="root">` để mount React SPA, khai báo Google Fonts (Inter/Roboto)               |
| `vite.config.js`     | Cấu hình Vite bundler, alias `@/` → `src/`, Proxy API về Backend (`http://localhost:5000`)                        |
| `tailwind.config.js` | Bảng màu thương hiệu (ocean-blue, sapphire-blue, soft-ice-blue), Font chữ, Breakpoints responsive                 |
| `postcss.config.js`  | Kích hoạt plugin TailwindCSS và Autoprefixer cho CSS                                                              |
| `package.json`       | Dependencies: react, react-dom, @reduxjs/toolkit, react-redux, axios, react-router-dom, tailwindcss, lucide-react |
| `.env.example`       | Template biến môi trường: VITE_API_BASE_URL, VITE_APP_NAME                                                        |

---

### 2. Thư mục `src/api/`

| File             | Vai trò                                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| `axiosClient.js` | Instance Axios với baseURL từ .env, interceptor tự động gắn Authorization Bearer token và xử lý lỗi 401 (auto logout) |
| `endpoints.js`   | Object tập trung toàn bộ URL API endpoint theo từng module (AUTH, TOURS, BOOKINGS, DESTINATIONS...)                   |

---

### 3. Thư mục `src/app/`

| File             | Vai trò                                                                   |
| ---------------- | ------------------------------------------------------------------------- |
| `store.js`       | Khởi tạo Redux Store, kết hợp tất cả reducers từ các feature slice        |
| `rootReducer.js` | Gộp tất cả slice reducers của các feature thành một root reducer duy nhất |

---

### 4. Thư mục `src/components/`

#### `common/` – UI Components dùng chung toàn hệ thống

| File                 | Vai trò                                                                       |
| -------------------- | ----------------------------------------------------------------------------- |
| `Button.jsx`         | Button đa dạng variant (primary, secondary, outline, ghost) với loading state |
| `Input.jsx`          | Input field có label, validation error message và icon hỗ trợ                 |
| `Modal.jsx`          | Overlay modal dùng chung, hỗ trợ đóng khi click backdrop                      |
| `Badge.jsx`          | Label trạng thái màu sắc (pending, confirmed, cancelled...)                   |
| `LoadingSpinner.jsx` | Spinner loading animation dùng trong mọi trạng thái chờ                       |

#### `layout/` – Khung bố cục trang

| File                | Vai trò                                                                            |
| ------------------- | ---------------------------------------------------------------------------------- |
| `UnifiedHeader.jsx` | Header dùng chung user site: Logo, Navigation, Search bar, Auth buttons/Avatar     |
| `UnifiedFooter.jsx` | Footer dùng chung user site: Links, Social, Copyright                              |
| `AdminSidebar.jsx`  | Sidebar điều hướng Admin: Dashboard, Destinations, Tours, Bookings, Booking Plans  |
| `MainLayout.jsx`    | Layout bọc các trang user: UnifiedHeader + Outlet + UnifiedFooter                  |
| `AdminLayout.jsx`   | Layout bọc các trang admin: AdminSidebar + Outlet, kiểm tra quyền role === 'admin' |

#### `guard/` – Route Guards bảo vệ đường dẫn

| File               | Vai trò                                                     |
| ------------------ | ----------------------------------------------------------- |
| `PrivateRoute.jsx` | Chặn truy cập nếu chưa đăng nhập → redirect /login          |
| `AdminRoute.jsx`   | Chặn truy cập nếu không có quyền admin → redirect trang chủ |

---

### 5. Thư mục `src/features/`

Mỗi feature module bao gồm: `*Slice.js` (Redux state) · `*Api.js` (Axios calls) · `hooks/` (custom hooks) · `pages/` (trang) · `components/` (UI riêng)

#### `auth/` – Xác thực người dùng

| Thành phần                    | Vai trò                                                                  |
| ----------------------------- | ------------------------------------------------------------------------ |
| `authSlice.js`                | Quản lý state: user, token, isAuthenticated, loading                     |
| `authApi.js`                  | Gọi API: POST /auth/login, POST /auth/register, POST /auth/logout        |
| `hooks/useLogin.js`           | Xử lý logic submit form đăng nhập, dispatch action, điều hướng sau login |
| `hooks/useRegister.js`        | Xử lý logic submit form đăng ký, validate dữ liệu phía client            |
| `pages/Login.jsx`             | Trang đăng nhập                                                          |
| `pages/Register.jsx`          | Trang đăng ký tài khoản mới                                              |
| `pages/Profile.jsx`           | Trang thông tin cá nhân, cập nhật avatar và mật khẩu                     |
| `components/LoginForm.jsx`    | Form đăng nhập với validation                                            |
| `components/RegisterForm.jsx` | Form đăng ký với validation                                              |

#### `destination/` – Điểm đến du lịch

| Thành phần                         | Vai trò                                                        |
| ---------------------------------- | -------------------------------------------------------------- |
| `destinationSlice.js`              | State: danh sách destinations, destination đang xem, bộ lọc    |
| `destinationApi.js`                | Gọi API: GET /destinations, GET /destinations/:id              |
| `hooks/useDestinations.js`         | Fetch danh sách destinations, xử lý phân trang                 |
| `hooks/useDestinationFilter.js`    | Quản lý state bộ lọc (region, price range, rating)             |
| `pages/DestinationsList.jsx`       | Trang danh sách tất cả điểm đến với filter và search           |
| `pages/DestinationDetail.jsx`      | Trang chi tiết điểm đến, gallery ảnh, danh sách tour liên quan |
| `components/DestinationCard.jsx`   | Card hiển thị thumbnail, tên, rating điểm đến                  |
| `components/DestinationFilter.jsx` | Panel bộ lọc theo khu vực, loại hình, giá                      |
| `components/DestinationSearch.jsx` | Thanh tìm kiếm điểm đến với debounce                           |

#### `tour/` – Tour du lịch

| Thành phần                           | Vai trò                                                          |
| ------------------------------------ | ---------------------------------------------------------------- |
| `tourSlice.js`                       | State: chi tiết tour đang xem, danh sách ngày khởi hành          |
| `tourApi.js`                         | Gọi API: GET /tours/:id, GET /tours/:id/departure-dates          |
| `hooks/useTourDetail.js`             | Fetch chi tiết tour, tính toán giá theo số lượng khách           |
| `pages/TourDetail.jsx`               | Trang chi tiết tour: lịch trình, giá, chọn ngày đi, CTA đặt tour |
| `components/TourCard.jsx`            | Card tour: ảnh, tên, thời lượng, giá, rating                     |
| `components/TourItinerary.jsx`       | Hiển thị lịch trình chi tiết từng ngày của tour                  |
| `components/DepartureDatePicker.jsx` | Chọn ngày khởi hành từ danh sách departureDates của tour         |

#### `booking/` – Đặt tour

| Thành phần                          | Vai trò                                                            |
| ----------------------------------- | ------------------------------------------------------------------ |
| `bookingSlice.js`                   | State: thông tin booking đang tạo, danh sách booking của user      |
| `bookingApi.js`                     | Gọi API: POST /bookings, GET /bookings/my, GET /bookings/:id       |
| `hooks/useBookingForm.js`           | Quản lý multi-step form: chọn tour → nhập hành khách → xác nhận    |
| `hooks/useMyBookings.js`            | Fetch danh sách booking của user hiện tại                          |
| `pages/TourBooking.jsx`             | Trang đặt tour: form thông tin hành khách, chọn số lượng, xác nhận |
| `pages/MyBookings.jsx`              | Trang lịch sử đặt tour của user                                    |
| `components/BookingSummary.jsx`     | Tóm tắt thông tin tour, ngày đi, tổng tiền trước khi xác nhận      |
| `components/PassengerForm.jsx`      | Form nhập thông tin từng hành khách (họ tên, CCCD, loại khách)     |
| `components/BookingStatusBadge.jsx` | Badge trạng thái booking (pending / confirmed / cancelled)         |

#### `favourite/` – Danh sách yêu thích

| Thành phần                       | Vai trò                                                            |
| -------------------------------- | ------------------------------------------------------------------ |
| `favouriteSlice.js`              | State: danh sách tour/destination đã yêu thích                     |
| `favouriteApi.js`                | Gọi API: GET /favourites, POST /favourites, DELETE /favourites/:id |
| `hooks/useFavourites.js`         | Toggle yêu thích, đồng bộ state với server                         |
| `pages/FavouritesList.jsx`       | Trang danh sách yêu thích của user                                 |
| `components/FavouriteButton.jsx` | Nút tim toggle yêu thích, dùng trong TourCard / DestinationCard    |

#### `guide/` – Hướng dẫn du lịch (Travel Guides)

| Thành phần                 | Vai trò                                                   |
| -------------------------- | --------------------------------------------------------- |
| `guideSlice.js`            | State: danh sách bài viết guide, bài đang đọc             |
| `guideApi.js`              | Gọi API: GET /guides, GET /guides/:id                     |
| `hooks/useGuides.js`       | Fetch danh sách guide, lọc theo điểm đến                  |
| `pages/TravelGuides.jsx`   | Trang danh sách bài viết hướng dẫn du lịch                |
| `components/GuideCard.jsx` | Card bài viết: ảnh thumbnail, tiêu đề, tóm tắt, ngày đăng |

#### `admin/` – Quản trị hệ thống

| Thành phần                              | Vai trò                                                                                         |
| --------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `adminSlice.js`                         | State: thống kê dashboard, danh sách dữ liệu admin                                              |
| `adminApi.js`                           | Gọi API: GET /admin/dashboard/stats, GET /admin/bookings, GET /admin/booking-plans              |
| `hooks/useAdminStats.js`                | Fetch số liệu thống kê: tổng booking, doanh thu, tour phổ biến                                  |
| `hooks/useAdminBookings.js`             | Fetch và lọc danh sách booking toàn hệ thống                                                    |
| `hooks/useAdminBookingPlans.js`         | Fetch danh sách kế hoạch chuyến đi (nhóm booking theo tour + ngày khởi hành)                    |
| `pages/AdminDashboard.jsx`              | Trang tổng quan: biểu đồ doanh thu, số liệu nhanh, booking mới nhất                             |
| `pages/AdminDestinations.jsx`           | CRUD quản lý điểm đến                                                                           |
| `pages/AdminTours.jsx`                  | CRUD quản lý tour, thiết lập ngày khởi hành                                                     |
| `pages/AdminBookings.jsx`               | Xem & cập nhật trạng thái tất cả đơn đặt tour                                                   |
| `pages/AdminBookingPlans.jsx`           | Xem kế hoạch chuyến đi: nhóm hành khách theo tour + ngày, phân công HDV                         |
| `components/StatCard.jsx`               | Card số liệu dashboard (tổng doanh thu, booking, khách...)                                      |
| `components/AnalyticsChart.jsx`         | Biểu đồ doanh thu / booking theo tháng (recharts)                                               |
| `components/AssignGuideModal.jsx`       | Modal phân công hướng dẫn viên cho một chuyến đi                                                |
| `components/PassengersListModal.jsx`    | Modal xem danh sách hành khách của một booking plan                                             |
| `components/DestinationFormModal.jsx`   | Dialog tạo mới / chỉnh sửa thông tin điểm đến (dùng ở trang AdminDestinations)                  |
| `components/DestinationDeleteModal.jsx` | Dialog xác nhận xóa điểm đến (dùng ở trang AdminDestinations)                                   |
| `components/TourFormModal.jsx`          | Dialog tạo mới / chỉnh sửa tour: tên, lịch trình, giá, ngày khởi hành (dùng ở trang AdminTours) |
| `components/TourDeleteModal.jsx`        | Dialog xác nhận xóa tour (dùng ở trang AdminTours)                                              |
| `components/GuideFormModal.jsx`         | Dialog tạo mới / chỉnh sửa bài viết hướng dẫn du lịch (dùng ở trang AdminGuides)                |
| `components/GuideDeleteModal.jsx`       | Dialog xác nhận xóa bài viết hướng dẫn (dùng ở trang AdminGuides)                               |

---

### 6. Thư mục `src/hooks/` – Global Hooks dùng chung

| File                 | Vai trò                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| `useAuth.js`         | Trả về { user, isAuthenticated, role } từ Redux store, dùng trong mọi component cần kiểm tra đăng nhập |
| `useDebounce.js`     | Debounce giá trị input, tránh gọi API quá nhiều khi user đang gõ (delay 300-500ms)                     |
| `useLocalStorage.js` | Đọc/ghi dữ liệu vào LocalStorage đồng bộ với React state                                               |

---

### 7. Thư mục `src/routes/`

| File              | Vai trò                                                                                                                                   |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `AppRoutes.jsx`   | Định nghĩa cây Routing toàn hệ thống (React Router DOM v6), bọc Route với MainLayout / AdminLayout, bảo vệ bằng PrivateRoute / AdminRoute |
| `routesConfig.js` | Mảng config route dạng data (path, component, layout, guard) để AppRoutes.jsx render động                                                 |

---

### 8. Thư mục `src/utils/`

| File                | Vai trò                                                            |
| ------------------- | ------------------------------------------------------------------ |
| `formatCurrency.js` | Chuyển số thành chuỗi tiền tệ VND (ví dụ: 5400000 → "5.400.000 đ") |
| `formatDate.js`     | Format chuỗi ngày ISO sang DD/MM/YYYY hoặc DD/MM/YYYY HH:mm        |
| `storage.js`        | Tiện ích đọc/ghi Token vào Cookie và LocalStorage an toàn          |
