# Màn hình 08: Danh sách Yêu thích (Favourites Page)

## 1. Tổng quan màn hình
- **Tên file:** `08-favourites.md`
- **Mục đích:** Quản lý danh sách các điểm đến mà người dùng đã bấm lưu (thả tim). Dữ liệu được đồng bộ trực tiếp với MongoDB Backend qua REST API đối với người dùng đã đăng nhập, và tạm lưu LocalStorage nếu truy cập dưới dạng Khách chưa đăng nhập (tự động đồng bộ sau khi login).
- **Quyền truy cập:** Khách chưa đăng nhập & Khách hàng đã đăng nhập (Guest & Registered User).

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

### 2.1. Header Banner
- **Tiêu đề:** *"Danh Sách Điểm Đến Yêu Thích Của Bạn"*.
- **Counter Badge:** Hiển thị tổng số địa điểm đã lưu (Ví dụ: *"Đã lưu 5 địa điểm"*).
- **Thông báo đồng bộ (Sync Alert Banner):** Nếu người dùng là Khách chưa đăng nhập: Hiển thị banner dịu gợi ý *"Đăng nhập để tự động lưu và đồng bộ danh sách yêu thích trên mọi thiết bị!"* kèm nút bấm *"Đăng nhập"*.

### 2.2. Danh sách Điểm đến Đã lưu (Favourites Grid)
- **Grid Layout:** 3-4 cột (Desktop), 2 cột (Tablet), 1 cột (Mobile).
- **Thẻ Điểm đến Yêu thích (Favourite Item Card):**
  - Hình ảnh bìa sắc nét.
  - Thẻ Tag Region & Theme.
  - Tên điểm đến (H3).
  - Vị trí & Thời gian di chuyển đề xuất.
  - **Thao tác nhanh:**
    - Nút *"Bỏ yêu thích"* (Xóa khỏi danh sách): Icon Trái tim tô đậm kèm hiệu ứng bỏ tim.
    - Nút *"Xem chi tiết"* -> Chuyển sang `03-destination-details.md`.
    - Nút *"Đặt Tour cho địa điểm này"* -> Chuyển đến Form Đặt chỗ (`14-tour-booking.md`).

### 2.3. Thao tác Hàng loạt (Bulk Actions Bar)
- Nút *"Xóa tất cả danh sách yêu thích"* (Clear All Favourites) kèm Modal xác nhận.

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

- **Fetch Favourites (Đã Login):** `GET /api/favourites` (Yêu cầu JWT Token Auth Header). Backend tự động populate chi tiết thông tin Destination.
- **Thêm Favourites:** `POST /api/favourites` payload `{ destinationId }`.
- **Xóa Favourites:** `DELETE /api/favourites/:destinationId`.
- **Đồng bộ từ LocalStorage sang DB (Sau khi Login thành công):** Frontend đọc mảng `guestFavourites` từ LocalStorage -> Gọi API `POST /api/favourites/sync` payload `{ destinationIds: [...] }`.

---

## 4. Xử lý Trạng thái & Responsive

- **Empty State (Chưa lưu điểm đến nào):**
  - Hiển thị hình minh họa trái tim rỗng nét vẽ mượt mà.
  - Thông báo: *"Bạn chưa lưu điểm đến yêu thích nào!"*.
  - Nút *"Khám phá các điểm đến ngay"* -> Chuyển hướng sang `02-destinations.md`.
- **Toast Notification:** Thông báo nhanh *"Đã bỏ địa điểm khỏi danh sách yêu thích"* hoặc *"Đã lưu thành công"*.
