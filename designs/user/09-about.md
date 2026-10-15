# Màn hình 10: Giới thiệu dự án (About Us Page)

## 1. Tổng quan màn hình
- **Tên file:** `10-about.md`
- **Mục đích:** Giới thiệu tầm nhìn, sứ mệnh, mô hình kiến trúc Full-stack của dự án TravelTrail và cam kết trải nghiệm tuyệt vời cho khách hàng du lịch.
- **Quyền truy cập:** Tất cả (Public).

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

### 2.1. Hero Section
- **Header Banner:** Tiêu đề *"Về TravelTrail - Người Đồng Hành Du Lịch Tin Cậy"*.
- **Background:** Hình ảnh thiên nhiên hùng vĩ mượt mà.

### 2.2. Sứ mệnh & Tầm nhìn (Mission & Vision)
- **Sứ mệnh (Our Mission):** Kết nối du khách tới những vẻ đẹp ẩn giấu của thiên nhiên và văn hóa Việt Nam thông qua nền tảng công nghệ du lịch hiện đại, minh bạch và tiện lợi.
- **Tầm nhìn (Our Vision):** Trở thành ứng dụng đặt tour và khám phá điểm đến hàng đầu, cung cấp các hành trình cá nhân hóa chất lượng cao.

### 2.3. Mô hình Công nghệ & Đổi mới (Tech Stack & Architecture)
- Giới thiệu kiến trúc Full-stack hiện đại:
  - **Frontend:** React SPA mượt mà, tối ưu hóa giao diện đa nền tảng.
  - **Backend:** Node.js Express RESTful API mạnh mẽ, bảo mật JWT.
  - **Database:** MongoDB quản lý dữ liệu tour và đơn đặt linh hoạt.

### 2.4. Core Values (Giá trị cốt lõi)
- 4 thẻ giá trị: *Minh bạch giá cả, Chất lượng dịch vụ vượt trội, Hỗ trợ tận tâm 24/7, Đổi mới trải nghiệm số*.

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

- Màn hình hiển thị nội dung thông tin giới thiệu tĩnh (Static content) kết hợp fetch số liệu thống kê thực từ API Backend:
  `GET /api/stats/summary` (Trả về tổng số Destination, Tour đã phục vụ, và lượt đặt thành công).

---

## 4. Xử lý Trạng thái & Responsive

- Layout đẹp mắt, chuẩn tỉ lệ đọc trên cả Desktop, Tablet và Mobile.
