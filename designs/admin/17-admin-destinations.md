# Màn hình 18: Admin - Quản lý Điểm đến (Admin Destinations Management)

## 1. Tổng quan màn hình
- **Tên file:** `18-admin-destinations.md`
- **Mục đích:** Cung cấp giao diện quản trị cho phép Admin thực hiện đầy đủ các thao tác CRUD (Thêm, Xem, Sửa, Xóa) danh mục các điểm đến du lịch lưu trong MongoDB.
- **Quyền truy cập:** Chỉ Quản trị viên (`admin` role).

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

### 2.1. Header & Thanh Thao tác (Action Bar)
- **Tiêu đề:** *"Quản Lý Danh Mục Điểm Đến"*.
- **Search Bar:** Ô tìm kiếm tên điểm đến theo từ khóa.
- **Dropdown Filter:** Lọc điểm đến theo Vùng miền (Region).
- **Nút bấm *"Thêm Điểm Đến Mới"* (Primary Button):** Mở Modal/Drawer Form Thêm mới.

### 2.2. Bảng Danh sách Điểm đến (Destinations Management Data Table)
Bảng dữ liệu bao gồm các cột:
- **Hình ảnh:** Thumbnail điểm đến.
- **Tên điểm đến:** Tên địa danh (H4).
- **Vùng miền (Region):** Bắc, Trung, Nam, Tây Nguyên...
- **Chủ đề (Theme):** Biển đảo, Di sản, Núi rừng...
- **Ngân sách (Budget):** Tiết kiệm, Trung bình, Cao cấp.
- **Mùa lý tưởng:** Xuân, Hè, Thu, Đông.
- **Cột Thao tác (Actions):**
  - Icon `Sửa` (Edit Icon) -> Mở Modal chỉnh sửa thông tin.
  - Icon `Xóa` (Delete Icon) -> Mở Modal xác nhận xóa điểm đến khỏi MongoDB.

### 2.3. Modal / Form Thêm & Chỉnh sửa Điểm đến (Destination Modal Form)
Form nhập liệu bao gồm các trường:
- Tên điểm đến (Name)
- Vùng miền (Region) & Chủ đề (Theme)
- Đường dẫn / File ảnh đại diện (Image URL)
- Vị trí địa lý (Location) & Khí hậu (Climate)
- Mô tả tổng quan (Overview)
- Danh thắng nổi bật (Attractions - mảng từ khóa/dòng)
- Hoạt động gợi ý (Activities)
- Mùa đẹp nhất (Best Season) & Thời gian đi đề xuất (Visit Duration)
- Phân khúc giá (Budget Band) & Hướng dẫn di chuyển (Transport)

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

- **Fetch Danh sách Điểm đến Admin:** `GET /api/destinations`
- **Thêm Điểm đến Mới:** `POST /api/destinations`
  Payload: `{ name, region, theme, image, location, climate, overview, attractions, activities, bestSeason, visitDuration, budgetBand, transport }`
- **Cập nhật Điểm đến:** `PUT /api/destinations/:id`
- **Xóa Điểm đến:** `DELETE /api/destinations/:id`

---

## 4. Xử lý Trạng thái & Responsive

- Confirm Dialog: Hiển thị cảnh báo xác nhận *"Bạn có chắc chắn muốn xóa điểm đến này khỏi MongoDB không?"*.
- Responsive Data Table: Hỗ trợ cuộn ngang linh hoạt trên giao diện màn hình nhỏ.
