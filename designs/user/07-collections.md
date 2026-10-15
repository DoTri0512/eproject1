# Màn hình 07: Bộ sưu tập chủ đề (Seasonal Collections Page)

## 1. Tổng quan màn hình
- **Tên file:** `07-collections.md`
- **Mục đích:** Nhóm các điểm đến và tour du lịch theo các chủ đề truyền cảm hứng (Weekend Escapes, Heritage Visits, Nature Trips, Seasonal Highlights), hỗ trợ người dùng tìm ý tưởng chuyến đi nhanh chóng.
- **Quyền truy cập:** Tất cả (Public).

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

### 2.1. Hero Section
- **Header:** Tiêu đề *"Bộ Sưu Tập Du Lịch Theo Chủ Đề"*.
- **Mô tả ngắn:** Gợi ý hành trình phù hợp với từng sở thích, mùa trong năm và lịch trình cá nhân.

### 2.2. Danh sách Bộ sưu tập chính (Collection Cards Grid)
Hiển thị các nhóm bộ sưu tập mẫu:
1. **Weekend Escapes (Chuyến đi cuối tuần ngắn ngày):** Các điểm đến gần, dễ di chuyển 2 ngày 1 đêm.
2. **Heritage Visits (Khám phá Di sản & Văn hóa):** Các cố đô, phố cổ, làng nghề truyền thống.
3. **Nature Trips (Hành trình Thiên nhiên & Núi rừng):** Cảnh quan thiên nhiên vòm núi, hồ, vịnh đảo xanh tươi.
4. **Seasonal Highlights (Điểm đến đẹp nhất mùa này):** Gợi ý địa danh đang trong mùa lúa chín, mùa hoa nở, hoặc thời tiết đẹp nhất.

### 2.3. Chi tiết Bộ sưu tập được Chọn (Collection Detail View)
Khi click vào một Bộ sưu tập:
- Banner lớn truyền cảm hứng.
- Mô tả chi tiết ý nghĩa bộ sưu tập.
- Danh sách các Điểm đến (Destination Cards) và Tour gợi ý trực thuộc.
- Nút bấm xem chi tiết hoặc Đặt tour.

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

- **Fetch Danh sách Collections:** `GET /api/collections`
- **Fetch Chi tiết Collection:** `GET /api/collections/:id` hoặc `GET /api/destinations?collectionId=:id`

---

## 4. Xử lý Trạng thái & Responsive

- Layout linh hoạt thích ứng với các độ phân giải màn hình.
- Thẻ Collection có hiệu ứng Hover hiệu ứng thẻ mượt mà.
