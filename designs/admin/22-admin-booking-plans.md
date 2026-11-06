# Màn hình 22: Admin - Quản lý Đoàn khởi hành (Admin Booking Plans & Departure Management)

## 1. Tổng quan màn hình
- **Tên file:** `22-admin-booking-plans.md`
- **Mục đích:** Cung cấp cho Quản trị viên và Điều hành Tour công cụ quản lý các đợt khởi hành thực tế của từng Tour theo từng ngày cụ thể (`BookingPlans`). Gom tự động toàn bộ hành khách từ các đơn `Booking` khác nhau khởi hành cùng 1 ngày vào chung 1 danh sách đoàn, hỗ trợ phân công Hướng dẫn viên (`Guide`) và xuất danh sách điểm danh.
- **Quyền truy cập:** Chỉ Quản trị viên (`admin` role).

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

### 2.1. Header & Bộ lọc Đợt khởi hành
- **Tiêu đề:** *"Quản Lý Đoàn Khởi Hành Theo Chuyến"*
- **Bộ lọc đa tiêu chí:**
  - Dropdown **Chọn Tour du lịch** (`All Tours` hoặc Tour cụ thể).
  - Date Picker **Ngày khởi hành** (Lọc các chuyến đi trong khoảng thời gian/ngày cụ thể).
  - Dropdown **Trạng thái đoàn:** `Tất cả`, `Đã lên lịch (Scheduled)`, `Đang diễn ra (In Progress)`, `Hoàn thành (Completed)`, `Đã hủy (Cancelled)`.

### 2.2. Bảng Danh sách Các Chuyến Khởi hành (Departure Plans List Table)
Bảng tổng hợp các đợt khởi hành:
- **Tên Tour du lịch:** Tên gói tour được khởi hành.
- **Ngày đi - Ngày về (Departure & End Date):** `departureDate` và `endDate` (tự động tính dựa theo độ dài tour).
- **Tổng số khách (Total Passengers):** Tổng số hành khách thực tế của chuyến (Ví dụ: `15 khách`).
- **Hướng dẫn viên (Assigned Guide):** Hiển thị tên HDV được phân công (hoặc Badge *"Chưa phân công"* màu cam).
- **Trạng thái đoàn (Status):** Badge trạng thái chuyến đi.
- **Thao tác (Actions):** 
  - Nút *"Xem Danh sách Đoàn & Điểm danh"*.
  - Nút *"Phân công HDV"*.

### 2.3. Modal/Drawer Xem Danh sách Đoàn đi cùng ngày (Passengers List Modal)
Hiển thị danh sách tập trung toàn bộ hành khách của chuyến khởi hành:
- **Thông tin tóm tắt:** Tên Tour, Ngày đi - Ngày về, Tổng số lượng khách.
- **Bảng Danh sách Hành khách (`passengersList`):**
  - STT, Họ và tên hành khách, Giới tính, Ngày sinh, Số CCCD/Passport, Số điện thoại.
  - **Mã đơn đặt tour liên quan (`bookingId`):** Click để mở nhanh chi tiết hóa đơn đặt chỗ của khách đó.
- **Tính năng mở rộng:**
  - Nút *"Phân công Hướng dẫn viên"* (Dropdown chọn HDV từ danh sách `guides`).
  - Nút *"Xuất danh sách đoàn ra Excel / PDF"* (In danh sách cho HDV mang đi).

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

- **Fetch Danh sách Đoàn khởi hành:** `GET /api/admin/booking-plans?tourId={tourId}&date={departureDate}&status={status}`
- **Fetch Chi tiết 1 Đoàn khởi hành:** `GET /api/admin/booking-plans/:id`
- **Phân công Hướng dẫn viên cho Đoàn:** `PUT /api/admin/booking-plans/:id/assign-guide`
  Payload: `{ guideId: "GUIDE_OBJECT_ID" }`
- **Cập nhật Trạng thái Chuyến đi:** `PUT /api/admin/booking-plans/:id/status`
  Payload: `{ status: "in_progress" }`

---

## 4. Xử lý Trạng thái & Responsive

- **Auto-grouping Indicator:** Badge thể hiện số lượng đơn `Booking` đã gom chung vào đoàn này.
- **Kiểm tra trùng lịch HDV:** Nếu Hướng dẫn viên được phân công đã có lịch dẫn đoàn khác trong khoảng thời gian (`departureDate` -> `endDate`), hiển thị ngay thông báo lỗi Toast Warning.
- **Responsive View:** Trên Tablet/Mobile hiển thị dạng thẻ Chuyến đi (Trip Card) cùng nút xem nhanh danh sách đoàn gọn gàng.
