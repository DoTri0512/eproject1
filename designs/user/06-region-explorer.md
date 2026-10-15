# Màn hình 06: Khám phá Vùng miền (Region Explorer Page)

## 1. Tổng quan màn hình
- **Tên file:** `06-region-explorer.md`
- **Mục đích:** Giúp người dùng dễ dàng khám phá du lịch theo đặc trưng địa lý và vùng miền (Miền Bắc, Miền Trung, Miền Nam, Tây Nguyên...), hiểu rõ khí hậu, văn hóa và danh sách điểm đến nổi bật của từng vùng.
- **Quyền truy cập:** Tất cả (Public).

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

### 2.1. Hero Section & Selector Vùng Miền (Region Selector Bar)
- **Header:** Tiêu đề *"Khám Phá Vùng Miền Việt Nam"*.
- **Thanh Chọn Vùng Miền (Tabs / Interactive Map Switcher):**
  - Miền Bắc (Hà Nội, Hạ Long, Sa Pa, Ninh Bình...)
  - Miền Trung (Đà Nẵng, Hội An, Huế, Nha Trang, Phong Nha...)
  - Tây Nguyên (Đà Lạt, Măng Đen, Buôn Ma Thuột...)
  - Miền Nam (TP. Hồ Chí Minh, Phú Quốc, Miền Tây sông nước...)

### 2.2. Khối Tổng quan Đặc trưng Vùng Miền (Region Overview Card)
Khi người dùng chọn một vùng miền:
- Hình ảnh đại diện cho khí hậu / văn hóa tiêu biểu của vùng đó.
- Bài viết tóm tắt: Nét văn hóa, ẩm thực đặc sắc, thời điểm đẹp nhất trong năm để ghé thăm.
- Thống kê nhanh: Số lượng điểm đến, Số lượng Tour hiện có.

### 2.3. Danh sách Điểm đến theo Vùng miền (Region Destinations Grid)
- Hiển thị danh sách các Destination thuộc Vùng miền đang được chọn.
- Mỗi Card hiển thị ảnh, tên địa danh, mảng hoạt động nổi bật, nút xem chi tiết điểm đến và nút thả tim lưu yêu thích.

### 2.4. Danh sách Tour thuộc Vùng miền (Region Tours Slider)
- Carousel / Slider các Tour du lịch đang mở bán thuộc Vùng miền đó kèm giá vé và nút bấm *"Đặt Tour"*.

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

- **Fetch Destinations theo Region:** `GET /api/destinations?region=:regionName`
- **Fetch Tours theo Region:** `GET /api/tours?region=:regionName`

---

## 4. Xử lý Trạng thái & Responsive

- **State Active Indicator:** Làm nổi bật Tab/Vùng miền đang chọn.
- **Responsive:** Dễ dàng vuốt ngang chọn Tab vùng miền trên thiết bị mobile.
