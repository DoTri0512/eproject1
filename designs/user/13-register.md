# Màn hình 14: Trang Đăng Ký (Register Page)

## 1. Tổng quan màn hình
- **Tên file:** `14-register.md`
- **Mục đích:** Cho phép khách truy cập tạo tài khoản người dùng mới trên hệ thống TravelTrail. Dữ liệu tài khoản được kiểm tra tính hợp lệ phía Client & Server, mã hóa mật khẩu an toàn bằng `bcryptjs` và lưu trữ vào MongoDB database với phân quyền mặc định là `user`.
- **Quyền truy cập:** Khách chưa đăng nhập (Guest).

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

### 2.1. Container & Layout
- Layout chia 2 phần (Desktop):
  - **Bên trái:** Banner hình ảnh truyền cảm hứng du lịch cùng danh sách đặc quyền viên TravelTrail: *Lưu danh sách yêu thích, Lập kế hoạch cá nhân, Nhận ưu đãi giảm giá tour*.
  - **Bên phải:** Form Card Đăng ký tài khoản.

### 2.2. Form Đăng ký Tài khoản (Register Form)
- **Tiêu đề (H2):** *"Đăng Ký Tài Khoản Mới"*
- **Mô tả ngắn:** *"Trở thành thành viên của TravelTrail để nhận nhiều ưu đãi du lịch đặc biệt"*
- **Các trường dữ liệu (Input Fields):**
  1. **Họ và tên (Full Name):**
     - Label: `Họ và tên`
     - Placeholder: `Nguyễn Văn A`
     - Type: `text` (Required)
  2. **Email:**
     - Label: `Địa chỉ Email`
     - Placeholder: `nguyenvana@gmail.com`
     - Type: `email` (Required, Kiểm tra định dạng & trùng lặp trong DB)
  3. **Số điện thoại (Phone Number):**
     - Label: `Số điện thoại`
     - Placeholder: `0912345678`
     - Type: `tel` (Required)
  4. **Mật khẩu (Password):**
     - Label: `Mật khẩu`
     - Placeholder: `Tối thiểu 6 ký tự`
     - Type: `password` (Kèm thanh đo độ mạnh mật khẩu Password Strength Meter).
  5. **Xác nhận mật khẩu (Confirm Password):**
     - Label: `Xác nhận mật khẩu`
     - Placeholder: `Nhập lại mật khẩu`
     - Type: `password` (Validate trùng khớp realtime với ô Password).
  6. **Đồng ý điều khoản:**
     - Checkbox: `Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật` (Required).
- **Nút bấm Đăng ký (Submit Button):**
  - Text: *"Đăng Ký Tài Khoản"*
  - Trạng thái `Loading`: Hiển thị Spinner khi gửi dữ liệu lên Backend API.
- **Link chuyển sang trang Đăng nhập:**
  - Văn bản: *"Đã có tài khoản?"* -> Link bấm *"Đăng nhập ngay"* chuyển sang `13-login.md`.

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

- **Endpoint:** `POST /api/auth/register`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@gmail.com",
    "phone": "0912345678",
    "password": "securepassword123"
  }
  ```
- **Xử lý Response:**
  - **Thành công (201 Created):**
    - Trả về thông tin User mới được tạo trong MongoDB (role `'user'`).
    - Tự động đăng nhập (cấp token JWT) hoặc hiển thị thông báo chúc mừng thành công: *"Đăng ký tài khoản thành công! Vui lòng đăng nhập để tiếp tục."*.
    - Chuyển hướng đến `13-login.md` hoặc Trang chủ `01-home.md`.
  - **Thất bại (400 Bad Request / 409 Conflict):**
    - Email đã tồn tại: Báo lỗi *"Email này đã được sử dụng. Vui lòng chọn email khác hoặc đăng nhập."*.
    - Mật khẩu không đủ độ dài / Không khớp: Báo lỗi tương ứng dưới từng trường input.

---

## 4. Xử lý Trạng thái & Responsive

- **Password Strength Meter:** Hiển thị độ mạnh mật khẩu theo màu sắc (Đỏ: Yếu, Vàng: Trung bình, Xanh: Mạnh).
- **Mobile Responsive:** Layout tự động sắp xếp 1 cột dọc tiện lợi cho thao tác bằng một tay trên điện thoại.
