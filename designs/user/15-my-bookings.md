# Màn hình 16: Quản lý Đơn đặt tour cá nhân (My Bookings Page)

## 1. Tổng quan màn hình
- **Tên file:** `16-my-bookings.md`
- **Mục đích:** Cung cấp cho khách hàng trang tra cứu toàn bộ lịch sử các chuyến du lịch đã đặt, xem chi tiết trạng thái đơn booking (`Pending`, `Confirmed`, `Completed`, `Cancelled`), tải vé/voucher tour điện tử và thực hiện hủy tour khi cần.
- **Quyền truy cập:** Người dùng đã đăng nhập (Registered User).

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

### 2.1. Header Banner & Profile Navigation
- **Tiêu đề:** *"Đơn Đặt Chuyến Du Lịch Của Tôi"*.
- **Tabs lọc trạng thái đơn (Status Tabs Bar):**
  - `Tất cả`
  - `Chờ xác nhận` (Pending)
  - `Đã xác nhận` (Confirmed)
  - `Hoàn thành` (Completed)
  - `Đã hủy` (Cancelled)

### 2.2. Danh sách Đơn Booking (Booking Cards List)
Mỗi Đơn Booking hiển thị dạng Thẻ rộng (Card Row):
- **Header Thẻ:** Mã đơn booking (Ví dụ: `#BK-89421`), Ngày đặt đơn, Badge Trạng thái:
  - `Pending`: Badge Vàng.
  - `Confirmed`: Badge Xanh lá.
  - `Completed`: Badge Xanh dương.
  - `Cancelled`: Badge Đỏ/Xám.
- **Thân Thẻ:**
  - Hình ảnh thu nhỏ Tour du lịch.
  - Tên Tour du lịch (H3).
  - Ngày khởi hành (Departure Date).
  - Số hành khách (Adults & Children).
  - Tổng số tiền thanh toán (Hiển thị nổi bật theo VNĐ).
- **Chân Thẻ (Action Buttons):**
  - Nút *"Xem chi tiết vé / Voucher"* -> Mở Modal chi tiết đơn đặt tour.
  - Nút *"Hủy đơn đặt tour"* (Chỉ hiển thị khi trạng thái là `Pending`) -> Mở Modal xác nhận hủy.
  - Nút *"Đặt lại tour này"* (Chỉ hiển thị khi đơn đã `Completed` hoặc `Cancelled`).

### 2.3. Modal Chi tiết Vé / Voucher Điện tử (Booking Detail Modal)
- Mã vé QR Code tra cứu.
- Thông tin đầy đủ hành khách, ghi chú, điều khoản chuyến đi.
- Nút *"In vé / Tải PDF"*.

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

- **Fetch Danh sách Booking cá nhân:** `GET /api/bookings/my-bookings` (Header JWT Token).
- **Hủy Đơn Booking:** `PUT /api/bookings/:id/cancel` payload `{ reason }`.
  Backend kiểm tra nếu đơn thuộc về User đang login và trạng thái là `pending` -> Cập nhật `bookingStatus: "cancelled"`.

---

## 4. Xử lý Trạng thái & Responsive

- **Empty State:** Khi người dùng chưa đặt chuyến nào: Hiển thị hình minh họa vali du lịch, thông báo *"Bạn chưa có đơn đặt chuyến du lịch nào!"*, kèm nút bấm *"Khám phá Tour du lịch ngay"* -> Chuyển sang `02-destinations.md`.
- **Responsive:** Hiển thị dạng bảng (Table) trên Desktop và tự chuyển sang thẻ xếp dọc (Stacked Cards) trên Mobile.
