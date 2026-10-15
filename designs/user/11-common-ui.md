# Màn hình 12: Thành phần UI Dùng chung (Common UI Components)

## 1. Tổng quan màn hình
- **Tên file:** `12-common-ui.md`
- **Mục đích:** Quy chuẩn hệ thống màu sắc chủ đạo **Xanh - Trắng (Modern Blue & White)**, phong cách giao diện hiện đại mượt mà (Glassmorphism, Subtle Shadows) và thiết kế **Đồng bộ tuyệt đối Header & Footer** giữa tất cả các trang trên ứng dụng TravelTrail.
- **Quyền truy cập:** Tất cả (Public / All Roles).

---

## 2. Hệ Thống Màu Sắc Chủ Đạo & Phong Cách Hiện Đại (Blue & White Modern Design System)

### 2.1. Palette Màu Xanh - Trắng (Primary Color Tokens)
- **Primary Blue (Xanh Biển Chủ Đạo):** `#0284C7` (Sky Blue) & `#0F52BA` (Sapphire Blue)
  - Sử dụng cho: Logo thương hiệu, Buttons chính, Icon active, Thanh điều hướng, Thẻ nổi bật.
- **Accent Cyan (Xanh Lam Điểm Nhấn):** `#06B6D4` / `#38BDF8`
  - Sử dụng cho: Hover effects, Badges, Giá tiền, Progress indicators, Notification dots.
- **Pure White (Trắng Tinh Khôi):** `#FFFFFF`
  - Sử dụng cho: Background của các Cards, Form Controls, Modals, Header Bar surface.
- **Soft Ice Blue (Nền Xanh Băng Nhạt):** `#F0F6FA` / `#F8FAFC`
  - Sử dụng cho: Nền tổng thể của ứng dụng (Body background), tạo cảm giác dịu mát, sạch sẻ, dễ chịu cho mắt.
- **Dark Navy / Slate (Chữ & Chân trang):** `#0F172A` / `#1E293B`
  - Sử dụng cho: Chữ tiêu đề (Heading), Chữ thân bài (Body text) và Nền chân trang (Footer background).

### 2.2. Phong cách Thiết kế Hiện đại (Modern UI Aesthetics)
- **Glassmorphism (Hiệu ứng kính mờ):** Header bar và các Float panel có `backdrop-filter: blur(12px)` trên nền trắng mờ `rgba(255, 255, 255, 0.85)`.
- **Subtle Elevation Shadows:** Thẻ Card sử dụng bóng đổ mịn nhẹ (`box-shadow: 0 4px 20px -2px rgba(15, 82, 186, 0.08)`), biến đổi nổi nhẹ khi hover.
- **Modern Typography:** Sử dụng font chữ sans-serif hiện đại (Inter / Outfit / Roboto), phân cấp cỡ chữ rõ ràng.
- **Rounded Micro-interactions:** Bo góc mềm mại `border-radius: 12px` cho Cards và `border-radius: 8px` cho Buttons/Inputs.

---

## 3. Quy Chuẩn Đồng Bộ Header & Footer Trên Toàn Bộ Các Trang

Tất cả các trang phía Client (`01-home.md` đến `16-my-bookings.md`) bắt buộc nhúng chung 2 Component chuẩn hóa: `<UnifiedHeader />` và `<UnifiedFooter />`.

### 3.1. Thanh Header Đồng Bộ (`<UnifiedHeader />`)
- **Vị trí & Kiểu dáng:** Cố định ở đỉnh màn hình (`sticky top-0 z-50`), chiều cao 72px, hiệu ứng Glassmorphism Xanh-Trắng với đường viền dưới nhẹ `#E2E8F0`.
- **Bố cục 3 khối từ Trái sang Phải:**
  1. **Khối Logo:** Logo **TravelTrail** kết hợp Icon biểu tượng la bàn xanh bích `#0284C7` & Chữ thương hiệu màu Slate `#0F172A`. Click luôn chuyển về Trang chủ `01-home.md`.
  2. **Khối Danh mục Menu Chính (Centered Main Nav):**
     - `Trang chủ` (`01-home.md`)
     - `Điểm đến` (`02-destinations.md`)
     - `Vùng miền` (`06-region-explorer.md`)
     - `Bộ sưu tập` (`07-collections.md`)
     - `Hướng dẫn viên` (`04-travel-guides.md`)
     - `Giới thiệu` (`10-about.md`)
     - `Liên hệ` (`11-contact.md`)
     - *Hiệu ứng Active:* Trang đang đứng sẽ hiển thị gạch chân màu xanh `#0284C7` và chữ tô đậm `font-semibold`.
  3. **Khối Trạng thái Xác thực (Auth Dynamic Area):**
     - **Khi CHƯA ĐĂNG NHẬP (Guest State):**
       - Nút *"Đăng nhập"*: Outlined button màu Xanh `#0284C7`, background trắng -> Chuyển sang `13-login.md`.
       - Nút *"Đăng ký"*: Filled primary button màu Xanh `#0284C7`, chữ trắng -> Chuyển sang `14-register.md`.
     - **Khi ĐÃ ĐĂNG NHẬP (Authenticated User State):**
       - Icon Trái tim + Badge đếm số Yêu thích -> Link `08-favourites.md`.
       - Icon Kế hoạch + Badge đếm Trip Plan -> Link `09-trip-planner.md`.
       - User Avatar & Menu xổ xuống (Dropdown Menu):
         - `Hồ sơ cá nhân`
         - `Đơn đặt tour của tôi` -> Link `16-my-bookings.md`.
         - `Trang Quản trị Admin` -> Link `17-admin-dashboard.md` (Hiển thị đối với tài khoản `admin`).
         - `Đăng xuất` (Logout) -> Reset Auth State & chuyển về Home.

### 3.2. Menu Mobile Đồng Bộ (Responsive Mobile Drawer)
- Biểu tượng Hamburger (3 gạch) ở màn hình nhỏ (< 768px).
- Click mở Off-canvas Drawer hiệu ứng mượt màng từ bên phải, hiển thị đầy đủ Menu links và Auth Buttons với phong cách tông Xanh - Trắng đồng bộ.

### 3.3. Thanh Footer Đồng Bộ (`<UnifiedFooter />`)
- **Nền & Kiểu dáng:** Nền xanh đen mịt mờ sang trọng `Deep Navy #0F172A`, chữ màu sáng `#F8FAFC`, icon điểm nhấn xanh Cyan `#38BDF8`.
- **Cấu trúc 4 Cột Đồng Bộ giữa mọi trang:**
  - **Cột 1 - Thương hiệu TravelTrail:** Logo phong cách hiện đại, mô tả sứ mệnh du lịch, giấy phép hoạt động.
  - **Cột 2 - Điểm đến Hot & Khám phá:** Link nhanh sang Destinations, Region Explorer, Hot Tours.
  - **Cột 3 - Hỗ trợ & Chính sách:** Điều khoản dịch vụ, Chính sách bảo mật, Chính sách hủy tour, Hướng dẫn đặt tour.
  - **Cột 4 - Bản tin & Mạng xã hội:** Input đăng ký nhận email ưu đãi du lịch (Button xanh `#0284C7`), Social icons (Facebook, Instagram, Youtube, Zalo).
- **Dòng Copyright:** `© 2026 TravelTrail. Tất cả quyền được bảo lưu. Phát triển với mô hình Full-stack React & Node.js Express.`

---

## 4. Toast Notifications & Components Phụ Dùng Chung

- **Toast Notification (Góc trên phải màn hình):**
  - Toast Success: Viền xanh lá, Nền trắng, Icon check xanh.
  - Toast Error: Viền đỏ, Nền trắng, Icon cảnh báo.
- **Skeleton Screen Loaders:** Khung xương tải trang màu xám xanh nhạt mượt màng khi chờ API Node.js Express.
