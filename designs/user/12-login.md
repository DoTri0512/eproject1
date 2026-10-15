# Màn hình 13: Trang Đăng Nhập (Login Page)

## 1. Tổng quan màn hình
- **Tên file:** `13-login.md`
- **Mục đích:** Cung cấp giao diện đăng nhập cho người dùng đã có tài khoản trên TravelTrail. Xác thực qua Backend REST API Node.js Express, kiểm tra mật khẩu đã băm bằng `bcryptjs` và lưu trữ JSON Web Token (JWT) để duy trì phiên làm việc.
- **Quyền truy cập:** Khách chưa đăng nhập (Guest).

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

### 2.1. Container & Hero Visual
- Layout chia 2 phần (Desktop):
  - **Bên trái:** Hình ảnh du lịch mượt mà kèm thông điệp truyền cảm hứng *"Đồng hành cùng TravelTrail trên mọi hành trình du lịch mơ ước"*.
  - **Bên phải:** Form Card Đăng nhập chuyên nghiệp.

### 2.2. Form Đăng nhập (Login Form)
- **Tiêu đề (H2):** *"Đăng Nhập Tài Khoản"*
- **Mô tả ngắn:** *"Nhập email và mật khẩu của bạn để truy cập hệ thống"*
- **Các trường dữ liệu (Input Fields):**
  1. **Email đăng nhập:**
     - Label: `Email`
     - Placeholder: `nguyenvana@gmail.com`
     - Type: `email` (Required, Auto format validation)
  2. **Mật khẩu (Password):**
     - Label: `Mật khẩu`
     - Placeholder: `••••••••`
     - Type: `password` với icon Con mắt (Toggle show/hide password).
  3. **Ghi nhớ đăng nhập & Quên mật khẩu:**
     - Checkbox: `Ghi nhớ tôi trên thiết bị này`
     - Link: `Quên mật khẩu?` (Mở Modal nhập email nhận link khôi phục).
- **Nút bấm Đăng nhập (Submit Button):**
  - Text: *"Đăng Nhập"*
  - Trạng thái `Loading`: Hiển thị Spinner và vô hiệu hóa nút khi đang chờ API response.
- **Tùy chọn đăng nhập nhanh (Social Login):**
  - Nút *"Đăng nhập với Google"* và *"Đăng nhập với Facebook"*.
- **Chuyển sang trang Đăng ký:**
  - Văn bản: *"Chưa có tài khoản?"* -> Link bấm *"Đăng ký tài khoản mới"* chuyển sang `14-register.md`.

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

- **Endpoint:** `POST /api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "userpassword123"
  }
  ```
- **Xử lý Response:**
  - **Thành công (200 OK):**
    - Nhận token JWT & thông tin User: `{ "success": true, "token": "eyJhbGci...", "user": { "id": "...", "name": "...", "email": "...", "role": "user" } }`
    - Lưu `token` vào HTTP-only Cookie hoặc LocalStorage.
    - Cập nhật Auth Context toàn ứng dụng.
    - Hiển thị Toast Success: *"Đăng nhập thành công!"*.
    - Chuyển hướng người dùng về trang đang thao tác trước đó (hoặc Trang chủ `01-home.md`).
  - **Thất bại (401 Unauthorized / 400 Bad Request):**
    - Trả về thông báo lỗi: *"Email hoặc mật khẩu không chính xác"*.
    - Hiển thị Alert Banner màu đỏ ngay phía trên Form.

---

## 4. Xử lý Trạng thái & Responsive

- **Inline Validation:** Kiểm tra Email hợp lệ ngay khi out focus khỏi ô input.
- **Mobile Responsive:** Trên thiết bị di động, phần hình ảnh bên trái tự động ẩn, Form Card mở rộng full-width giúp thao tác dễ dàng trên màn hình cảm ứng.
