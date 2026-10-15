# Màn hình 04: Hướng dẫn viên (Travel Guides Page)

## 1. Tổng quan màn hình
- **Tên file:** `04-travel-guides.md`
- **Mục đích:** Hiển thị danh sách các hướng dẫn viên du lịch chuyên nghiệp của TravelTrail, giúp người dùng tìm hiểu thông tin chuyên môn, kinh nghiệm, ngôn ngữ và danh sách các điểm đến / tour mà hướng dẫn viên phụ trách.
- **Quyền truy cập:** Tất cả (Public).

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

### 2.1. Hero Section
- **Header Banner:** Tiêu đề *"Đội Ngũ Hướng Dẫn Viên Đồng Hành"*.
- **Mô tả ngắn:** Giới thiệu uy tín, chuyên nghiệp và sự tận tâm của đội ngũ guide địa phương.

### 2.2. Thanh Tìm kiếm & Bộ Lọc Guide
- **Search input:** Tìm kiếm hướng dẫn viên theo tên hoặc theo vùng miền chuyên trách.
- **Filter theo Ngôn ngữ (Languages):** Tiếng Việt, Tiếng Anh, Tiếng Pháp, Tiếng Nhật...
- **Filter theo Chuyên môn (Specialisation):** Du lịch di sản, Trekking mạo hiểm, Khám phá ẩm thực, Nhiếp ảnh cảnh quan...

### 2.3. Danh sách Thẻ Hướng dẫn viên (Guide Cards Grid)
- Layout 3-4 cột (Desktop), 2 cột (Tablet), 1 cột (Mobile).
- **Cấu trúc Thẻ Guide Card:**
  - Ảnh chân dung (Avatar tròn hoặc tỉ lệ 1:1).
  - Tên Hướng dẫn viên (H3).
  - Thẻ Chuyên môn (Specialisation Tag).
  - Nền tảng & Kinh nghiệm (Background, năm kinh nghiệm).
  - Các ngôn ngữ sử dụng (Badge ngôn ngữ).
  - Danh sách Vùng miền / Điểm đến chuyên trách.
  - Nút bấm *"Xem hồ sơ chi tiết"* (Mở Modal xem tiểu sử Biography & các chuyến đi phụ trách).

### 2.4. Modal Hồ sơ Chi tiết Hướng dẫn viên (Guide Detail Modal)
- **Tiểu sử (Biography):** Câu chuyện nghề nghiệp, triết lý đồng hành.
- **Các tour/chuyến du lịch sắp khởi hành có Guide này đồng hành.**
- Nút *"Gửi tin nhắn liên hệ"* hoặc *"Đặt Tour cùng HDV này"*.

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

- **Fetch Danh sách Guides:** `GET /api/guides`
- **Fetch Chi tiết Guide:** `GET /api/guides/:id`
- **Fetch các Tour liên quan đến Guide:** `GET /api/tours?guideId=:id`

---

## 4. Xử lý Trạng thái & Responsive

- **Empty State:** Hiển thị khi không tìm thấy Guide khớp với ngôn ngữ/chuyên môn được lọc.
- **Responsive:** Modal chi tiết tự động chuyển sang dạng Full-screen Sheet trên thiết bị mobile.
