# Màn hình 03: Chi tiết Điểm đến (Destination Details Page)

## 1. Tổng quan màn hình
- **Tên file:** `03-destination-details.md`
- **Mục đích:** Hiển thị toàn bộ thông tin chuyên sâu của một điểm đến cụ thể bao gồm tổng quan, điểm tham quan, hoạt động, thông tin di chuyển, cùng danh sách các tour du lịch liên quan trực tiếp đến điểm đến đó.
- **Quyền truy cập:** Tất cả (Public).

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

### 2.1. Hero Banner & Nav Bar
- **Breadcrumb Navigation:** `Trang chủ` > `Điểm đến` > `[Tên điểm đến]`.
- **Banner ảnh lớn:** Ảnh đẹp đại diện độ phân giải cao.
- **Tiêu đề chính (H1):** Tên điểm đến (Ví dụ: *"Vịnh Hạ Long"*).
- **Thanh tác xạ nhanh (Action Bar):**
  - Vị trí địa lý (Location tag).
  - Khí hậu (Climate badge).
  - Mùa đẹp nhất (Best Season).
  - Nút *"Lưu Yêu thích"* (Thả tim sync MongoDB).
  - Nút *"Thêm vào Kế hoạch chuyến đi"* (Trip Planner).

### 2.2. Khối Thông tin Nổi bật (Quick Info Grid)
Hiển thị 4 thẻ thông tin nhỏ:
- **Thời lượng tham quan đề xuất:** (Ví dụ: 3 ngày 2 đêm).
- **Phân khúc chi phí (Budget Band):** (Ví dụ: Khá / Trung bình).
- **Mùa lý tưởng:** (Ví dụ: Mùa Thu / Mùa Xuân).
- **Phương tiện di chuyển:** (Ví dụ: Máy bay / Xe khách / Ô tô).

### 2.3. Nội dung Chi tiết (Tab Navigation / Section Blocks)
- **Tổng quan (Overview):** Bài viết mô tả chi tiết lịch sử, vẻ đẹp và trải nghiệm tổng thể.
- **Danh thắng nổi bật (Key Attractions):** Danh sách các điểm tham quan con dưới dạng thẻ kèm hình ảnh và mô tả.
- **Hoạt động gợi ý (Suggested Activities):** Các trải nghiệm không thể bỏ qua (Chèo thuyền Kayak, lặn biển, thưởng thức ẩm thực, ngắm bình minh...).
- **Thông tin Di chuyển (Transport Details):** Hướng dẫn di chuyển từ các thành phố lớn.

### 2.4. Danh sách Tour du lịch thuộc Điểm đến (Available Tours Section)
- **Tiêu đề:** *"Các Chuyến Du Lịch Đặt Nhiều Nhất Tại [Tên điểm đến]"*
- **Grid hiển thị các Tour Card:**
  - Tên Tour du lịch.
  - Số ngày đêm và lịch trình vắt tắt.
  - Giá tour per person.
  - Ngày khởi hành còn chỗ.
  - Nút bấm *"Đặt Tour Ngay"* -> Chuyển đến Form Đặt chỗ (`14-tour-booking.md`).

### 2.5. Điểm đến Liên quan (Related Destinations Slider)
- Slider hiển thị 3-4 điểm đến cùng khu vực miền hoặc cùng chủ đề du lịch để gợi ý cho người dùng.

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

- **Fetch Chi tiết Destination:** `GET /api/destinations/:id` (mongodb ObjectId).
- **Fetch Danh sách Tour thuộc Destination:** `GET /api/tours?destinationId=:id`
- **Toggle Save Favourite:** `POST /api/favourites` với payload `{ destinationId }`.
- **Add to Trip Planner:** `POST /api/tripplans/items` hoặc lưu vào State/LocalStorage.

---

## 4. Xử lý Trạng thái & Responsive

- **Sticky Bar:** Trên Desktop có thanh Action Bar hoặc Sticky Sidebar để người dùng dễ dàng bấm *"Đặt Tour"* hoặc *"Lưu Yêu thích"* khi cuộn trang xuống sâu.
- **Mobile View:** Tối ưu hóa các khối tab nội dung và danh sách tour hiển thị cuộn ngang hoặc accordion gọn gàng.
