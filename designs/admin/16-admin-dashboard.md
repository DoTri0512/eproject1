# Màn hình 17: Admin - Thống kê Tổng quan (Admin Dashboard)

## 1. Tổng quan màn hình
- **Tên file:** `17-admin-dashboard.md`
- **Mục đích:** Cung cấp cho Quản trị viên (Admin) cái nhìn tổng thể về hoạt động của hệ thống TravelTrail: chỉ số tổng số Điểm đến, Tour, Đơn đặt tour, Doanh thu và Biểu đồ thống kê theo thời gian.
- **Quyền truy cập:** Chỉ Quản trị viên (`admin` role required).

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

Layout giao diện Admin bao gồm **Sidebar cố định bên trái** và **Khối nội dung chính bên phải**:

### 2.1. Admin Navigation Sidebar
- Logo TravelTrail Admin Panel.
- Danh mục Menu Admin:
  - `Tổng quan` (Dashboard - Active)
  - `Quản lý Điểm đến` (`18-admin-destinations.md`)
  - `Quản lý Tours` (`19-admin-tours.md`)
  - `Quản lý Đơn hàng` (`20-admin-bookings.md`)
  - `Quản lý Đoàn khởi hành` (`22-admin-booking-plans.md`)
  - `Về trang người dùng` (Client Site)
  - `Đăng xuất` (Admin Logout)

### 2.2. Khối Các chỉ số KPI chính (Stat Cards Grid)
Hiển thị 4 thẻ thông số quan trọng:
1. **Tổng số Điểm đến (Total Destinations):** Số lượng điểm đến đang quản lý trong MongoDB.
2. **Tổng số Tour du lịch (Total Active Tours):** Số tour đang mở bán.
3. **Tổng đơn Đặt Tour (Total Bookings):** Phân tích chi tiết số đơn `Pending` và `Confirmed`.
4. **Tổng Doanh thu dự kiến (Total Estimated Revenue):** Số tiền thanh toán (VNĐ).

### 2.3. Biểu đồ Thống kê Doanh thu & Booking (Analytics Charts)
- **Biểu đồ Cột/Đường (Line/Bar Chart):** Thống kê doanh thu và số lượng booking theo từng tháng trong năm.
- **Biểu đồ Tròn (Pie Chart):** Tỉ lệ phân bổ booking theo trạng thái (`Pending`, `Confirmed`, `Completed`, `Cancelled`).

### 2.4. Danh sách Đơn hàng Mới nhất (Recent Bookings Table)
- Bảng tóm tắt 5-10 đơn đặt tour gần nhất:
  - Mã đơn booking, Tên khách hàng, Tên Tour, Ngày khởi hành, Tổng tiền, Trạng thái.
  - Nút *"Xem chi tiết / Phê duyệt nhanh"*.

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

- **Fetch Admin Dashboard Stats:** `GET /api/admin/dashboard/stats`
- **Fetch Recent Bookings:** `GET /api/admin/bookings?limit=5`
- **Auth Header:** `Authorization: Bearer <ADMIN_JWT_TOKEN>`

---

## 4. Xử lý Trạng thái & Responsive

- Nút Toggle Sidebar co gọn menu trên các màn hình vừa và nhỏ.
- Kiểm tra quyền truy cập: Nếu user không có role `admin` -> Tự động redirect về trang chủ và thông báo lỗi.
