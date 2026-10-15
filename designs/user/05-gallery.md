# Màn hình 05: Bộ sưu tập ảnh (Destination Gallery Page)

## 1. Tổng quan màn hình
- **Tên file:** `05-gallery.md`
- **Mục đích:** Cung cấp trải nghiệm thị giác ấn tượng thông qua bộ sưu tập hình ảnh cảnh quan chất lượng cao, tích hợp bộ lọc theo vùng miền/chủ đề và trình xem ảnh toàn màn hình (Lightbox Preview).
- **Quyền truy cập:** Tất cả (Public).

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

### 2.1. Hero Section & Category Filter Tabs
- **Header:** Tiêu đề *"Bộ Sưu Tập Hình Ảnh Du Lịch"*.
- **Filter Tabs:** Tất cả, Miền Bắc, Miền Trung, Miền Nam, Tây Nguyên, Biển Đảo, Di Sản...
- **Counter:** Hiển thị tổng số hình ảnh khả dụng.

### 2.2. Lưới Ảnh Masonry Gallery Layout
- Lưới hiển thị ảnh kiểu Masonry mượt mà (3-4 cột).
- Mỗi item ảnh bao gồm:
  - Tấm ảnh tỉ lệ nét cao.
  - Overlay khi hover: Hiển thị Caption tên địa danh, Location, và Icon phóng to.
  - Image Credit (Tên nhiếp ảnh gia / nguồn tác giả).

### 2.3. Trình Xem Ảnh Phóng To (Lightbox Modal / Preview)
Khi click vào bất kỳ hình ảnh nào trong Gallery:
- Mở cửa sổ Modal nền tối phủ toàn màn hình (Dark Overlay backdrop).
- Hiển thị ảnh kích thước lớn sắc nét ở trung tâm.
- Thanh điều hướng:
  - Nút bấm `Previous` (<) và `Next` (>).
  - Nút Đóng (`X`) ở góc trên phải.
  - Phím tắt bàn phím: Mũi tên trái/phải để chuyển ảnh, phím `Esc` để đóng Modal.
- Vùng thông tin phía dưới ảnh: Caption mô tả chi tiết, Địa danh, Tác giả và Nút *"Khám phá điểm đến này"* -> Chuyển đến `03-destination-details.md`.

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

- **Fetch Danh sách Gallery:** `GET /api/gallery?region={region}&theme={theme}` hoặc tổng hợp dữ liệu ảnh từ API Destinations `GET /api/destinations`.

---

## 4. Xử lý Trạng thái & Responsive

- **Lazy Loading Image:** Áp dụng hiệu ứng Blur-up hoặc Progressive Image Loading khi tải danh sách ảnh lớn.
- **Mobile View:** Hỗ trợ cử chỉ vuốt tay (Swipe left / right) trên màn hình cảm ứng để chuyển ảnh trong Lightbox.
