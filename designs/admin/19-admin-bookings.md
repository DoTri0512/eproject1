# Màn hình 20: Admin - Quản lý Đơn đặt tour (Admin Bookings Management)

## 1. Tổng quan màn hình
- **Tên file:** `20-admin-bookings.md`
- **Mục đích:** Cung cấp cho Quản trị viên công cụ tiếp nhận, duyệt đơn, cập nhật trạng thái (`Pending`, `Confirmed`, `Completed`, `Cancelled`) và quản lý toàn bộ các đơn đặt tour của tất cả khách hàng trong hệ thống.
- **Quyền truy cập:** Chỉ Quản trị viên (`admin` role).

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

### 2.1. Header & Bộ lọc Đơn đặt tour
- **Tiêu đề:** *"Quản Lý Đơn Đặt Chuyến Du Lịch"*.
- **Search Bar:** Ô tìm kiếm theo Mã đơn booking (`#BK-...`), Tên khách hàng hoặc SĐT.
- **Filter Tabs:**
  - `Tất cả đơn`
  - `Chờ phê duyệt` (Pending - Badge Nổi bật)
  - `Đã xác nhận` (Confirmed)
  - `Đã hoàn thành` (Completed)
  - `Đã hủy` (Cancelled)

### 2.2. Bảng Danh sách Đơn Đặt Tour (Bookings Management Data Table)
Bảng dữ liệu hiển thị các thông tin:
- **Mã đơn (Booking ID):** Mã mã hóa ngắn (Ví dụ: `#BK-98214`).
- **Khách hàng (Customer):** Họ tên, Email, Số điện thoại.
- **Tour du lịch (Tour Name):** Tên tour & Ngày khởi hành.
- **Số lượng khách:** Số người lớn & số trẻ em.
- **Tổng tiền (Total Amount):** Giá trị đơn đặt (VNĐ).
- **Trạng thái Thanh toán (Payment Status):** Badge `Unpaid`, `Paid` hoặc `Refunded`.
- **Trạng thái Đơn (Booking Status):** Dropdown thay đổi trạng thái trực tiếp:
  - `Pending` (Vàng)
  - `Confirmed` (Xanh lá)
  - `Completed` (Xanh dương)
  - `Cancelled` (Đỏ)
- **Thao tác (Actions):** Nút *"Xem chi tiết đơn"*, Nút *"In hóa đơn/vé"*.

### 2.3. Modal Chi tiết Đơn hàng & Phê duyệt (Booking Action Modal)
- Hiển thị đầy đủ danh sách hành khách đi cùng, yêu cầu đặc biệt và lịch sử thay đổi trạng thái đơn.
- Ghi chú từ phía Admin.
- Nút bấm *"Phê duyệt Đơn"* (`Pending` -> `Confirmed`).
- Nút bấm *"Hủy Đơn & Hoàn tiền"*.

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

- **Fetch Tất cả Bookings Admin:** `GET /api/admin/bookings?status={status}&search={keyword}`
- **Cập nhật Trạng thái Booking:** `PUT /api/admin/bookings/:id/status`
  Payload: `{ bookingStatus: "confirmed", paymentStatus: "paid", adminNotes: "Đã nhận tiền cọc" }`

---

## 4. Xử lý Trạng thái & Responsive

- Toast Notification: Thông báo ngay khi phê duyệt thành công.
- Export Data: Nút *"Xuất danh sách đơn ra Excel / CSV"*.
