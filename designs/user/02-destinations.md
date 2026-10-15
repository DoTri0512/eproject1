# Màn hình 02: Danh sách Điểm đến (Destinations Page)

## 1. Tổng quan màn hình
- **Tên file:** `02-destinations.md`
- **Mục đích:** Cung cấp giao diện tra cứu, tìm kiếm và lọc danh sách tất cả các điểm đến du lịch (Destinations) được quản lý trong cơ sở dữ liệu MongoDB.
- **Quyền truy cập:** Tất cả (Public).

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

### 2.1. Banner Trang & Thanh Tìm kiếm (Search Bar)
- **Header Banner:** Tiêu đề *"Danh Sách Điểm Đến Du Lịch"*.
- **Search Input:** Ô tìm kiếm từ khóa với icon kính lúp, hỗ trợ tìm theo tên địa danh, từ khóa hoặc vị trí.
- **Tự động lọc realtime (Debounce search input 300ms).**

### 2.2. Thanh Bộ Lọc Đa Tiêu Chí (Filter Sidebar / Topbar)
Cho phép người dùng kết hợp nhiều bộ lọc cùng lúc:
- **Lọc theo Vùng miền (Region):** Tất cả, Miền Bắc, Miền Trung, Miền Nam, Tây Nguyên...
- **Lọc theo Chủ đề (Travel Theme):** Tất cả, Biển đảo, Văn hóa di sản, Núi rừng thiên nhiên, Khám phá mạo hiểm, Nghỉ dưỡng...
- **Lọc theo Ngân sách (Budget Band):** Tiết kiệm, Trung bình, Cao cấp.
- **Lọc theo Mùa lý tưởng (Best Season):** Mùa Xuân, Mùa Hè, Mùa Thu, Mùa Đông, Quanh năm.
- **Nút "Xóa tất cả bộ lọc" (Clear All Filters):** Reset tất cả dropdown về giá trị mặc định.

### 2.3. Hiển thị Kết quả & Sắp xếp (Results Header)
- **Dòng thông tin kết quả:** Hiển thị tổng số lượng tìm thấy (Ví dụ: *"Hiển thị 18 điểm đến phù hợp"*).
- **Bộ sắp xếp (Sort by Dropdown):** Sắp xếp theo *Mới nhất*, *Tên A-Z*, *Được yêu thích nhất*.

### 2.4. Danh sách Thẻ Điểm đến (Destination Grid)
- **Grid Layout:** 3 cột (Desktop), 2 cột (Tablet), 1 cột (Mobile).
- **Cấu trúc Destination Card:**
  - Hình ảnh bìa điểm đến (Aspect ratio 16:9).
  - Nút biểu tượng Trái tim (Favourite Toggle Icon):
    - Đã lưu: Tô màu đỏ/Sunset.
    - Chưa lưu: Trái tim viền.
  - Thẻ Tag Region & Travel Theme.
  - Tên điểm đến (H3).
  - Vị trí địa lý (Location) & Thời gian đi đề xuất (Visit Duration).
  - Tóm tắt mô tả ngắn (Overview 2 dòng).
  - Nút bấm *"Khám phá chi tiết"* -> Chuyển sang `03-destination-details.md`.

### 2.5. Phân trang (Pagination) / Load More
- Phân trang dạng trang 1, 2, 3... hoặc nút *"Xem thêm điểm đến"*.

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

- **Fetch Danh sách Điểm đến (có Filter & Search):**
  `GET /api/destinations?search={keyword}&region={region}&theme={theme}&budget={budget}&season={season}&page={page}&limit=12`
- **Toggle Yêu thích (Sync Database):**
  `POST /api/favourites` hoặc `DELETE /api/favourites/:destinationId` (Cần JWT Token).

---

## 4. Xử lý Trạng thái & Responsive

- **Empty State:** Khi bộ lọc không tìm thấy điểm đến phù hợp: Hiển thị minh họa icon kính lúp, thông báo *"Không tìm thấy điểm đến phù hợp"*, kèm nút *"Xóa bộ lọc"*.
- **Mobile View:** Bộ lọc đưa vào dạng Drawer (Off-canvas Filter Sheet) có thể bấm mở/đóng tiện lợi.
