# Màn hình 15: Đặt chuyến du lịch (Tour Booking Page)

## 1. Tổng quan màn hình
- **Tên file:** `15-tour-booking.md`
- **Mục đích:** Cung cấp biểu mẫu cho phép khách hàng chọn ngày khởi hành, chọn người hướng dẫn tour, nhập số lượng hành khách, điền thông tin chi tiết người đặt & khách đi cùng, tính toán tổng chi phí và gửi đơn đặt chỗ (Booking) lên Backend REST API lưu vào MongoDB database.
- **Quyền truy cập:** Người dùng đã đăng nhập (Registered User). Nếu Guest bấm Đặt tour -> Tự động chuyển sang `13-login.md` kèm redirect callback.

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

Layout chia làm 2 cột chính (Desktop):

### 2.1. Cột trái - Biểu mẫu Thông tin Đặt chỗ (Booking Form Steps)

#### Bước 1: Chọn Lịch khởi hành & Số lượng hành khách
- **Chọn Ngày khởi hành (Departure Date Selector):** Dropdown / Grid hiển thị các ngày mở bán tour kèm số lượng chỗ còn trống.
- **Chọn Số lượng hành khách:**
  - **Người lớn (Từ 12 tuổi trở lên):** Bộ tăng giảm số lượng (`-` `1` `+`) x Đơn giá vé người lớn.
  - **Trẻ em (Từ 5 đến 11 tuổi):** Bộ tăng giảm số lượng (`-` `0` `+`) x Đơn giá vé trẻ em (75% giá người lớn).
  - **Em bé (Dưới 5 tuổi):** Bộ tăng giảm số lượng (`-` `0` `+`) x Miễn phí / Phí dịch vụ nhỏ.

#### Bước 1b: Chọn Người Hướng Dẫn Tour (Tour Guide Selection)
- **Tiêu đề mục:** *"Chọn Người Hướng Dẫn"* (Required — phải chọn trước khi sang bước tiếp).
- **Danh sách thẻ hướng dẫn viên (Guide Cards):** Hiển thị dạng Grid (2 cột Desktop / 1 cột Mobile), mỗi thẻ gồm:
  - **Ảnh đại diện (Avatar):** Ảnh tròn của hướng dẫn viên.
  - **Tên hướng dẫn viên (H4):** Ví dụ: *"Trần Minh Khoa"*.
  - **Ngôn ngữ hỗ trợ:** Badge ví dụ: `🇻🇳 Tiếng Việt` · `🇬🇧 English`.
  - **Kinh nghiệm:** Ví dụ: `5 năm kinh nghiệm`.
  - **Đánh giá:** Sao (★★★★☆) kèm số lượt đánh giá, ví dụ: `4.8 (128 đánh giá)`.
  - **Chuyên môn / Khu vực:** Ví dụ: `Sa Pa · Fansipan · Tây Bắc`.
  - **Trạng thái:** Badge `Còn lịch` (xanh) hoặc `Đã kín lịch` (xám, disabled).
  - **Nút chọn:** Radio button ẩn; click vào thẻ để chọn — thẻ được chọn có viền highlight màu primary và dấu ✓ góc trên phải.
- **Tùy chọn "Không yêu cầu cụ thể":** Thẻ cuối danh sách cho phép hệ thống tự động phân công hướng dẫn viên phù hợp.
- **Link xem hồ sơ:** Nút nhỏ *"Xem chi tiết"* mở Modal/Drawer hiển thị đầy đủ hồ sơ hướng dẫn viên (ảnh, bio, lịch sử tour đã dẫn, chứng chỉ).

#### Bước 2: Thông tin Người liên hệ (Contact Information)
- **Họ và tên người đặt:** Input text (Tự động điền theo thông tin User đang login).
- **Email nhận vé/xác nhận:** Input email (Required).
- **Số điện thoại:** Input tel (Required).
- **Địa chỉ:** Input text.

#### Bước 3: Danh sách Hành khách đi cùng (Guest List Details)
- Danh sách form nhỏ cho từng hành khách:
  - Hành khách 1 (Trưởng đoàn): Họ tên, Ngày sinh/Số CMND.
  - Hành khách 2, 3...: Họ tên, Ngày sinh.

#### Bước 4: Yêu cầu đặc biệt & Phương thức Thanh toán
- **Ghi chú thêm (Special Requests):** Textarea (Yêu cầu ăn chay, phòng đơn, ghế ngồi...).
- **Phương thức thanh toán (Mockup Options):**
  - Chuyển khoản ngân hàng (Hiển thị mã QR ngân hàng).
  - Thanh toán tại văn phòng TravelTrail.
  - Thanh toán bằng thẻ ATM / VISA (Mô phỏng).

---

### 2.2. Cột phải - Tóm tắt Đơn hàng & Tổng chi phí (Booking Summary Card - Sticky)
- **Hình ảnh đại diện Tour du lịch.**
- **Tên Tour (H3):** (Ví dụ: *"Tour Hà Nội - Sa Pa - Fansipan 3 Ngày 2 Đêm"*).
- **Mã Tour:** (Ví dụ: `TOUR-SAPA-03`).
- **Ngày khởi hành đã chọn:** (Ví dụ: `15/10/2026`).
- **Người hướng dẫn đã chọn:** Hiển thị ảnh avatar nhỏ + Tên hướng dẫn viên (hoặc *"Hệ thống phân công"* nếu không chọn cụ thể).
- **Chi tiết chi phí:**
  - Vé người lớn: `2 x 3.500.000 VNĐ = 7.000.000 VNĐ`
  - Vé trẻ em: `1 x 2.625.000 VNĐ = 2.625.000 VNĐ`
  - Giảm giá / Voucher: `- 200.000 VNĐ`
  - **TỔNG CỘNG:** `9.425.000 VNĐ`
- **Nút bấm Xác nhận Đặt Tour (Submit Booking Button):**
  - Text: *"Xác Nhận Đặt Chuyến Du Lịch"*
  - Trạng thái `Loading`: Hiển thị Spinner khi gửi API request.

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

- **Fetch Thông tin Tour:** `GET /api/tours/:id`
- **Fetch Danh sách Hướng Dẫn Viên theo Tour:** `GET /api/tours/:id/guides` → Trả về mảng guides có `_id`, `fullName`, `avatarUrl`, `languages`, `rating`, `reviewCount`, `specialties`, `isAvailable`.
- **Fetch Hồ sơ chi tiết Hướng Dẫn Viên (Modal):** `GET /api/guides/:guideId`
- **Tạo Đơn Booking mới:** `POST /api/bookings`
- **Auth Header:** `Authorization: Bearer <JWT_TOKEN>`
- **Request Body Payload:**
  ```json
  {
    "tourId": "6581a...",
    "departureDate": "2026-10-15",
    "numberOfGuests": {
      "adults": 2,
      "children": 1
    },
    "guideId": "6581b...",
    "guestDetails": [
      { "fullName": "Nguyễn Văn A", "phone": "0912345678" },
      { "fullName": "Trần Thị B", "phone": "0987654321" }
    ],
    "totalAmount": 9425000,
    "paymentMethod": "bank_transfer",
    "notes": "Yêu cầu phòng hướng núi"
  }
  ```
- **Xử lý Response:**
  - **Thành công (201 Created):** Trả về Đơn Booking mới với `bookingStatus: "pending"`, `paymentStatus: "unpaid"`. Hiển thị Modal chúc mừng đặt tour thành công kèm Mã Đơn Booking, tự động chuyển hướng người dùng tới trang `16-my-bookings.md`.

---

## 4. Xử lý Trạng thái & Responsive

- **Sticky Summary Box:** Bảng tóm tắt tổng tiền cuộn dính mượt mà bên phải trên Desktop.
- **Mobile View:** Bảng tóm tắt thu gọn xuống dạng Sticky Bottom Bar hiển thị Tổng tiền và nút *"Tiếp tục Đặt Tour"*.
