# Màn hình 01: Trang chủ (Home Page)

## 1. Tổng quan màn hình
- **Tên file:** `01-home.md`
- **Mục đích:** Màn hình đầu tiên khi người dùng truy cập TravelTrail, giới thiệu tổng quan dịch vụ, tạo ấn tượng thị giác mạnh mẽ với hình ảnh du lịch thiên nhiên mượt mà, hỗ trợ tìm kiếm nhanh và truy cập các điểm đến / tour du lịch nổi bật.
- **Quyền truy cập:** Tất cả (Public - Guest & Registered Users).

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

### 2.1. Hero Banner & Quick Search Section
- **Hình ảnh/Video nền:** Slide hình ảnh chất lượng cao hiển thị cảnh quan thiên nhiên mượt mà với hiệu ứng overlay tối dịu.
- **Tiêu đề chính (H1):** *"Khám Phá Vẻ Đẹp Thế Giới Cùng TravelTrail"*
- **Thanh tìm kiếm nhanh (Quick Search Bar):**
  - Input chọn Điểm đến (Tên địa danh / Keyword).
  - Dropdown chọn Vùng miền (Region: Bắc, Trung, Nam, Tây Nguyên...).
  - Dropdown chọn Chủ đề du lịch (Theme: Biển đảo, Núi rừng, Di sản, Nghỉ dưỡng...).
  - Nút bấm *"Tìm kiếm ngay"* -> Chuyển hướng sang trang Destinations với query params tương ứng.

### 2.2. Featured Destinations (Điểm đến nổi bật)
- **Tiêu đề:** *"Điểm Đến Nổi Bật Được Yêu Thích"*
- **Danh sách Card (Grid 4 cột trên Desktop, 2 cột trên Tablet, 1 cột trên Mobile):**
  - Hình ảnh đại diện điểm đến (Hover zoom-in nhẹ).
  - Badge vùng miền (Region) và loại hình (Theme).
  - Tên điểm đến (H3).
  - Nút thả tim "Save Favourite" (gọi API / Sync state).
  - Nút *"Xem chi tiết"* -> Chuyển hướng đến Trang Chi tiết Điểm đến.

### 2.3. Top Selling / Hot Tours (Chuyến du lịch Hot)
- **Tiêu đề:** *"Chuyến Du Lịch Bán Chạy Nhất"*
- **Danh sách Tour Cards (Grid 3-4 cột):**
  - Ảnh đại diện tour.
  - Tên Tour du lịch.
  - Thời lượng (Ví dụ: 3 ngày 2 đêm).
  - Ngày khởi hành gần nhất.
  - Giá vé (Hiển thị nổi bật theo VNĐ).
  - Nút *"Đặt Tour ngay"* -> Chuyển hướng tới Form Đặt chuyến du lịch (`14-tour-booking.md`).

### 2.4. Seasonal Collections (Bộ sưu tập theo mùa)
- **Hiển thị 4 thẻ collection lớn:** Weekend Escapes, Heritage Visits, Nature Trips, Seasonal Highlights.
- Mỗi card có hình ảnh chủ đề, số lượng điểm đến và mô tả ngắn.

### 2.5. Why Choose Us & Customer Feedback
- Các biểu tượng lợi ích: *Dịch vụ uy tín, Hướng dẫn viên chuyên nghiệp, Đặt tour linh hoạt, Hỗ trợ 24/7*.
- Slider đánh giá của khách hàng trải nghiệm tour.

### 2.6. Call To Action (CTA Banner)
- Banner truyền cảm hứng du lịch.
- Nút bấm *"Đăng ký tài khoản ngay"* (Nếu chưa log in) hoặc *"Khám phá tất cả các Tour"*.

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

- **Fetch Featured Destinations:** `GET /api/destinations?featured=true`
- **Fetch Hot Tours:** `GET /api/tours?popular=true&limit=4`
- **Fetch Collections:** `GET /api/collections`
- **Lưu Yêu thích:** `POST /api/favourites` (Yêu cầu Header JWT Token nếu đã login).

---

## 4. Xử lý Trạng thái & Responsive

- **Loading State:** Hiển thị Skeleton Screen cho các phần Card danh mục và Tour khi đang gọi REST API.
- **Empty / Error State:** Nếu server MongoDB không kết nối được, hiển thị thông báo dịu kèm nút *"Tải lại trang"*.
- **Mobile View:** Quick Search Bar xếp dọc linh hoạt, slider vuốt cảm ứng mượt mà.
