# TravelTrail – Phân tích chi tiết các màn hình giao diện (Screen Specifications)

Tài liệu này tổng hợp toàn bộ phân tích giao diện và luồng tương tác của hệ thống **TravelTrail** - ứng dụng Full-stack du lịch (React SPA + Node.js Express RESTful API + MongoDB Database).

Các file phân tích chi tiết cho từng màn hình được tách biệt hoàn toàn thành 25 file độc lập dưới đây:

---

## Danh mục các file màn hình (25 Màn hình Chi tiết)

### 📌 Màn hình Khách hàng & Công khai (Public & User Screens)

| STT | File Màn hình                                                                         | Tên màn hình             | Quyền truy cập | Mô tả tóm tắt                                                                                          |
| :-: | :------------------------------------------------------------------------------------ | :----------------------- | :------------: | :----------------------------------------------------------------------------------------------------- |
|  1  | [`01-home.md`](file:///e:/eproject1/designs/01-home.md)                               | Trang chủ (Home)         |     Public     | Hero banner, Tìm kiếm nhanh, Featured Destinations, Hot Tours, Collections & CTA.                      |
|  2  | [`02-destinations.md`](file:///e:/eproject1/designs/02-destinations.md)               | Danh sách Điểm đến       |     Public     | Bộ lọc đa tiêu chí (Region, Theme, Budget), Tìm kiếm realtime, Card địa điểm.                          |
|  3  | [`03-destination-details.md`](file:///e:/eproject1/designs/03-destination-details.md) | Chi tiết Điểm đến        |     Public     | Overview, Danh thắng, Hoạt động, Danh sách Tour liên quan, Thêm yêu thích / Trip Plan.                 |
|  4  | [`04-travel-guides.md`](file:///e:/eproject1/designs/04-travel-guides.md)             | Hướng dẫn viên           |     Public     | Danh sách Guide, Kinh nghiệm, Chuyên môn, Ngôn ngữ, Địa điểm chuyên trách.                             |
|  5  | [`05-gallery.md`](file:///e:/eproject1/designs/05-gallery.md)                         | Bộ sưu tập ảnh           |     Public     | Thư viện ảnh địa điểm, Filter theo vùng miền, Lightbox xem ảnh toàn màn hình.                          |
|  6  | [`06-region-explorer.md`](file:///e:/eproject1/designs/06-region-explorer.md)         | Khám phá Vùng miền       |     Public     | Phân loại vùng miền (Bắc, Trung, Nam...), đặc trưng khí hậu & văn hóa, danh sách điểm đến.             |
|  7  | [`07-collections.md`](file:///e:/eproject1/designs/07-collections.md)                 | Bộ sưu tập chủ đề        |     Public     | Gợi ý du lịch theo mùa (Weekend Escapes, Heritage Visits, Nature Trips...).                            |
|  8  | [`08-favourites.md`](file:///e:/eproject1/designs/08-favourites.md)                   | Danh sách Yêu thích      |  User / Guest  | Lưu địa điểm yêu thích, đồng bộ MongoDB API khi đăng nhập (hoặc LocalStorage cho Guest).               |
|  9  | [`09-about.md`](file:///e:/eproject1/designs/09-about.md)                             | Giới thiệu dự án         |     Public     | Sứ mệnh TravelTrail, Mô hình Full-stack, Công nghệ React/Node.js/MongoDB.                              |
| 10  | [`10-contact.md`](file:///e:/eproject1/designs/10-contact.md)                         | Trang Liên hệ            |     Public     | Form gửi yêu cầu hỗ trợ, Validate thông tin, Gửi REST API lưu MongoDB.                                 |
| 11  | [`11-common-ui.md`](file:///e:/eproject1/designs/11-common-ui.md)                     | Thành phần UI dùng chung |      All       | Quy chuẩn tông màu Xanh-Trắng hiện đại, Header & Footer đồng bộ 100% giữa mọi trang.                   |
| 12  | [`12-login.md`](file:///e:/eproject1/designs/12-login.md)                             | Trang Đăng nhập          |     Guest      | Form Đăng nhập Email & Password, Ghi nhớ đăng nhập, Quên mật khẩu, Xác thực JWT.                       |
| 13  | [`13-register.md`](file:///e:/eproject1/designs/13-register.md)                       | Trang Đăng ký            |     Guest      | Form Đăng ký tài khoản mới, đo độ mạnh mật khẩu, mã hóa bcryptjs, lưu MongoDB.                         |
| 14  | [`14-tour-booking.md`](file:///e:/eproject1/designs/14-tour-booking.md)               | Đặt chuyến du lịch       |      User      | Chọn ngày đi, số lượng khách, tính tổng tiền, điền thông tin hành khách, gửi đơn Booking.              |
| 15  | [`15-my-bookings.md`](file:///e:/eproject1/designs/15-my-bookings.md)                 | Quản lý Đơn đặt tour     |      User      | Lịch sử đặt chuyến, trạng thái đơn (Pending, Confirmed, Cancelled), xem vé & Hủy tour.                 |
| 16  | [`16-profile.md`](file:///e:/eproject1/designs/16-profile.md)                         | Trang Hồ sơ Cá nhân                  |      User      | Xem thông tin cá nhân, thay đổi mật khẩu, xem lịch sử booking và yêu thích, quản lý thông tin liên hệ. |
| 17  | [`17-trip-planner.md`](file:///e:/eproject1/designs/user/17-trip-planner.md)         | Chi tiết Chuyến đi (Trip Planner)   |      User      | Xem thông tin tour đã đặt (gói thời lượng, ngày đi-về, thanh toán) và lịch trình chi tiết theo từng ngày. |

---

### 🛡️ Màn hình Quản trị Admin (Admin Management Screens)

| STT | File Màn hình                                                                         | Tên màn hình                 | Quyền truy cập | Mô tả tóm tắt                                                                                                                             |
| :-: | :------------------------------------------------------------------------------------ | :--------------------------- | :------------: | :---------------------------------------------------------------------------------------------------------------------------------------- |
| 17  | [`17-admin-dashboard.md`](file:///e:/eproject1/designs/admin/16-admin-dashboard.md)   | Admin Dashboard              |     Admin      | Thống kê tổng quan KPI (Số Destination, Tour, Booking, Tổng doanh thu) & Biểu đồ.                                                         |
| 18  | [`18-admin-destinations.md`](file:///e:/eproject1/designs/admin/17-admin-destinations.md) | Admin Quản lý Điểm đến   |     Admin      | Quản lý CRUD (Thêm, Xem, Sửa, Xóa) danh mục các điểm đến du lịch trong MongoDB.                                                           |
| 19  | [`19-admin-tours.md`](file:///e:/eproject1/designs/admin/18-admin-tours.md)           | Admin Quản lý Tours          |     Admin      | Quản lý CRUD các Tour du lịch, gán với Destination, cập nhật lịch trình, giá bán & ngày khởi hành.                                        |
| 20  | [`20-admin-bookings.md`](file:///e:/eproject1/designs/admin/19-admin-bookings.md)     | Admin Quản lý Đơn hàng       |     Admin      | Duyệt đơn booking khách hàng (`Pending` -> `Confirmed`), cập nhật thanh toán hoặc hủy đơn.                                                |
| 21  | [`22-admin-booking-plans.md`](file:///e:/eproject1/designs/admin/20-admin-booking-plans.md) | Admin Quản lý Đoàn khởi hành | Admin  | Quản lý danh sách hành khách gom chung theo từng chuyến khởi hành cùng ngày (`BookingPlans`), phân công Hướng dẫn viên và điểm danh đoàn. |
| 22  | [`21-admin-guides.md`](file:///e:/eproject1/designs/admin/21-admin-guides.md)         | Admin Quản lý Hướng dẫn viên |     Admin      | Quản lý hồ sơ HDV (CRUD), chuyên môn, ngôn ngữ và phân công danh sách điểm đến phụ trách chính.                                           |
| 23  | [`22-admin-contacts.md`](file:///e:/eproject1/designs/admin/22-admin-contacts.md)     | Admin Quản lý Liên hệ        |     Admin      | Tiếp nhận, xem nội dung, lọc trạng thái (`new`, `read`, `resolved`), gửi phản hồi email và xuất báo cáo CSV.                             |
| 24  | [`23-admin-collections.md`](file:///e:/eproject1/designs/admin/23-admin-collections.md) | Admin Quản lý Bộ sưu tập   |     Admin      | Quản lý các bộ sưu tập theo mùa (CRUD), thêm/gỡ điểm đến vào bộ sưu tập và kiểm tra tránh gán trùng lặp.                                 |

---

## Quy chuẩn chung cho thiết kế giao diện (Design Conventions)

### 1. Palette Màu Xanh - Trắng & Phong Cách Hiện Đại (Modern Blue & White Theme)

- **Primary Ocean Blue (Xanh Biển):** `#0284C7` (Sky Blue) & `#0F52BA` (Sapphire Blue) - Màu chủ đạo cho thương hiệu, buttons, thanh điều hướng và điểm nhấn chính.
- **Accent Cyan (Xanh Lam Tươi):** `#06B6D4` / `#38BDF8` - Điểm nhấn trạng thái, hover effects, icon highlights.
- **Pure Clean White (Trắng Tinh Khôi):** `#FFFFFF` - Nền chính của Cards, Form controls, Headers, Modals.
- **Soft Ice Blue (Xanh Băng Nhạt Nền):** `#F0F6FA` / `#F8FAFC` - Nền tổng thể trang web (Body Background).
- **Dark Slate Text (Chữ Xám Đen Đậm):** `#0F172A` - Giúp nét chữ rõ ràng, tương phản cao.
- **Phong cách Hiện đại:** Áp dụng hiệu ứng Kính mờ **Glassmorphism** (`backdrop-filter: blur(12px)`), Bo góc mềm mại (`border-radius: 12px`), và Bóng đổ dịu (`box-shadow: 0 4px 20px rgba(15, 82, 186, 0.08)`).

### 2. Thiết kế Đồng Bộ Header & Footer Tuyệt Đối giữa Các Trang

- **Unified Header (`<UnifiedHeader />`):** Nhúng cố định trên đỉnh tất cả các trang Client (`01-home.md` -> `16-my-bookings.md`). Hiển thị nhất quán Logo, Danh mục menu chính, Trạng thái Active tab, và Khối Xác thực (Nút Đăng nhập/Đăng ký khi chưa login; Avatar, Yêu thích count, Kế hoạch count, My Bookings link khi đã login).
- **Unified Footer (`<UnifiedFooter />`):** Nhúng đồng bộ ở cuối tất cả các trang Client. Nền xanh đen mịt mờ `#0F172A`, 4 cột thông tin chuẩn hóa (Thương hiệu, Quick Links, Chính sách & Hỗ trợ, Đăng ký bản tin ưu đãi).

### 3. Layout & Responsiveness

- **Client Site:** Container max-width 1200px. Grid 12 cột linh hoạt.
- **Admin Dashboard:** Sidebar cố định 260px tông Xanh-Đen + Main Content linh hoạt.
- **Mobile (< 768px):** Menu dạng trượt Off-canvas Drawer, giao diện xếp dọc 1 cột mượt mà.

### 4. Tương tác Dữ liệu API (Backend Node.js Express & MongoDB)

- **Header xác thực:** `Authorization: Bearer <JWT_TOKEN>` trong mọi protected route API.
- **Phản hồi:** Toast Notification tông Xanh-Trắng hiển thị tức thì khi người dùng tương tác thành công hoặc có lỗi.
