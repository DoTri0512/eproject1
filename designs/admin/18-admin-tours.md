# Màn hình 19: Admin - Quản lý Chuyến du lịch (Admin Tours Management)

## 1. Tổng quan màn hình
- **Tên file:** `19-admin-tours.md`
- **Mục đích:** Cho phép Quản trị viên quản lý danh sách các Tour du lịch (Tours/Packages), tạo tour mới liên kết với Điểm đến (Destination), cập nhật lịch trình, giá bán, số chỗ tối đa và danh sách ngày khởi hành.
- **Quyền truy cập:** Chỉ Quản trị viên (`admin` role).

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

### 2.1. Header & Thanh Thao tác
- **Tiêu đề:** *"Quản Lý Danh Sách Tour Du Lịch"*.
- **Search Input:** Tìm kiếm Tour theo tên hoặc mã tour.
- **Select Filter:** Lọc Tour theo Điểm đến hoặc Trạng thái (Đang mở / Tạm đóng).
- **Nút bấm *"Thêm Tour Du Lịch Mới"*: ** Mở Form tạo tour.

### 2.2. Bảng Danh sách Tour (Tours Management Data Table)
Bảng dữ liệu bao gồm các cột:
- **Tên Tour du lịch:** Tiêu đề tour.
- **Điểm đến liên kết (Destination):** Tên địa danh thuộc về.
- **Thời lượng:** Số ngày đêm (Ví dụ: 3 ngày 2 đêm).
- **Giá vé (Price):** Giá tiền per person (VNĐ).
- **Số chỗ còn nhận / Tối đa:** (Ví dụ: `15 / 20 chỗ`).
- **Các ngày khởi hành:** Ngày mở bán gần nhất.
- **Trạng thái:** Badge `Hoạt động` (Active) hoặc `Tạm ngưng` (Inactive).
- **Cột Thao tác:** Nút Sửa tour, Nút Đóng/Mở trạng thái, Nút Xóa tour.

### 2.3. Form Thêm / Chỉnh sửa Tour (Tour Modal / Full-page Form)
Form quản lý thông tin chi tiết Tour bao gồm:
- **Điểm đến chính (Destination Selector):** Dropdown chọn điểm đến thuộc MongoDB.
- **Tiêu đề Tour (Title):** Tên tour du lịch.
- **Thời lượng (Duration):** Ví dụ "4 Ngày 3 Đêm".
- **Giá vé niêm yết (Price):** Giá người lớn, giá trẻ em.
- **Số lượng khách tối đa (Max Passengers):** Số chỗ mở bán.
- **Danh sách Ngày khởi hành (Departure Dates Picker):** Chọn các mốc ngày khởi hành mở bán.
- **Lịch trình chi tiết từng ngày (Itinerary Builder):**
  - Ngày 1: Tiêu đề & Mô tả hoạt động.
  - Ngày 2: Tiêu đề & Mô tả hoạt động...
- **Dịch vụ Bao gồm (Includes) & Không bao gồm (Excludes):** Text list.

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

- **Fetch Danh sách Tours Admin:** `GET /api/tours`
- **Thêm Tour Mới:** `POST /api/tours`
  Payload: `{ destinationId, title, duration, price, departureDates, maxPassengers, itinerary, includes, excludes, status }`
- **Cập nhật Tour:** `PUT /api/tours/:id`
- **Xóa Tour:** `DELETE /api/tours/:id`

---

## 4. Xử lý Trạng thái & Responsive

- Validation giá tiền phải > 0, số khách tối đa phải > 0.
- Modal xác nhận xóa hoặc tạm dừng bán tour.
