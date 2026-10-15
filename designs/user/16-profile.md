# Màn hình 16: Hồ Sơ Cá Nhân (My Profile Page)

## 1. Tổng quan màn hình
- **Tên file:** `16-my-profile.md`
- **Mục đích:** Cho phép người dùng đã đăng nhập xem, chỉnh sửa thông tin cá nhân (tên hiển thị, avatar), cập nhật hồ sơ khách hàng chi tiết (số điện thoại, địa chỉ, CCCD) và đổi mật khẩu tài khoản một cách an toàn.
- **Quyền truy cập:** Người dùng đã đăng nhập (Registered User).
- **URL:** `/my-profile`

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

### 2.1. Header Banner – Profile Hero
- Dải banner gradient đậm (`from-slate-900 via-sky-950 to-slate-900`) chiều cao vừa phải.
- Hiển thị **Avatar tròn lớn** của user (lấy từ `user.avatar`), có nút bút chì overlay để đổi ảnh URL.
- Tên hiển thị (`user.name`) – font bold lớn màu trắng.
- Email tài khoản (`user.email`) – màu `sky-300` nhỏ.
- Badge vai trò (`Admin` / `Thành viên`) màu sky/emerald.

### 2.2. Tabs Điều hướng (Profile Nav Tabs)
Ba tab ngang đặt ngay bên dưới hero banner:
- **`Thông tin cá nhân`** – Tab chứa form cập nhật tên & avatar (User model).
- **`Hồ sơ khách hàng`** – Tab chứa form cập nhật thông tin liên hệ chi tiết (Customer model: phone, address, city, country, idCardNumber).
- **`Đổi mật khẩu`** – Tab chứa form 3 trường: mật khẩu hiện tại, mật khẩu mới, xác nhận mật khẩu mới.

### 2.3. Tab 1 – Form Thông tin cá nhân
Các trường:
- **Tên hiển thị** (`name`): Input text, required.
- **URL Avatar** (`avatar`): Input text với preview hình tròn realtime bên cạnh.
- **Email** (`email`): Input text disabled (chỉ xem, không thể sửa).
- **Ngày tham gia**: Hiển thị readonly từ `user.createdAt`.
- Nút **`Lưu thay đổi`** → `PUT /api/auth/me` payload `{ name, avatar }`.

### 2.4. Tab 2 – Form Hồ sơ khách hàng
Các trường:
- **Họ và tên đầy đủ** (`fullName`): Input text, required.
- **Email liên hệ** (`email`): Input text, required (có thể khác với email tài khoản).
- **Số điện thoại** (`phone`): Input tel, required.
- **Địa chỉ cụ thể** (`address`): Input text.
- **Thành phố / Tỉnh** (`city`): Input text.
- **Quốc gia** (`country`): Input text, default `Việt Nam`.
- **Số CCCD / Hộ chiếu** (`idCardNumber`): Input text.
- Nút **`Lưu hồ sơ`** → `POST /api/customers/me` (upsert).

### 2.5. Tab 3 – Form Đổi mật khẩu
Các trường:
- **Mật khẩu hiện tại** (`currentPassword`): Input password với toggle show/hide.
- **Mật khẩu mới** (`newPassword`): Input password với toggle show/hide + Password strength indicator.
- **Xác nhận mật khẩu mới** (`confirmPassword`): Input password với toggle show/hide.
- Validate frontend: `newPassword === confirmPassword`, độ dài tối thiểu 6 ký tự.
- Nút **`Đổi mật khẩu`** → `PUT /api/auth/change-password` payload `{ currentPassword, newPassword }`.

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

| Action | Method | Endpoint | Payload |
|---|---|---|---|
| Lấy thông tin user hiện tại | `GET` | `/api/auth/me` | – (JWT Header) |
| Lấy hồ sơ khách hàng | `GET` | `/api/customers/me` | – (JWT Header) |
| Cập nhật tên & avatar | `PUT` | `/api/auth/me` | `{ name, avatar }` |
| Lưu hồ sơ khách hàng | `POST` | `/api/customers/me` | `{ fullName, email, phone, address, city, country, idCardNumber }` |
| Đổi mật khẩu | `PUT` | `/api/auth/change-password` | `{ currentPassword, newPassword }` |

---

## 4. Xử lý Trạng thái & Responsive

- **Loading State:** Skeleton loader cho avatar và form fields khi đang fetch API.
- **Success Toast:** Thông báo xanh lá góc trên phải khi lưu thành công.
- **Error Toast / Inline Error:** Hiển thị lỗi từ API (ví dụ: mật khẩu hiện tại sai).
- **Unauthenticated Guard:** Nếu chưa đăng nhập, hiển thị card yêu cầu đăng nhập với nút redirect `/login`.
- **Responsive:** Layout 1 cột trên Mobile, layout 2 cột (sidebar avatar + form content) trên Desktop (>=768px).
- **Tab URL Sync:** Tab active được lưu vào query string (`?tab=password`) để bookmark được.
