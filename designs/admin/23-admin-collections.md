# Màn hình 23: Admin - Quản lý Bộ sưu tập (Admin Collections Management)

## 1. Tổng quan màn hình
- **Tên file:** `23-admin-collections.md`
- **Mục đích:** Cung cấp cho Quản trị viên (Admin) giao diện quản lý danh mục các Bộ sưu tập điểm đến theo chủ đề hoặc theo mùa (Seasonal & Thematic Collections), thực hiện các thao tác CRUD (Tạo mới, Xem chi tiết, Chỉnh sửa, Xóa) bộ sưu tập, đồng thời quản lý danh sách các Điểm đến (`destinations`) nằm trong từng bộ sưu tập (thêm điểm đến mới nếu chưa thuộc bộ sưu tập khác, gỡ bỏ điểm đến khỏi bộ sưu tập).
- **Quyền truy cập:** Chỉ Quản trị viên (`admin` role required).

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

Giao diện quản trị tuân thủ thiết kế hiện đại tông **Xanh - Trắng** (`#0284C7` & `#FFFFFF`), nền xám băng nhạt `#F8FAFC`, kết hợp hệ thống Sidebar quản trị cố định bên trái (`#0F172A`).

### 2.1. Header & Thanh Thao tác (Action Bar)
- **Tiêu đề trang:** *"Quản Lý Bộ Sưu Tập Điểm Đến"* kèm mô tả *"Gom nhóm và phân loại các điểm đến theo mùa, kỳ nghỉ và chủ đề trải nghiệm"*.
- **Search Bar:** Ô tìm kiếm tên bộ sưu tập hoặc từ khóa trong phần mô tả.
- **Nút "Tạo Bộ Sưu Tập Mới" (Primary Button):** Nút màu Xanh Biển nổi bật với icon `add_photo_alternate`, khi nhấp sẽ kích hoạt Modal Form tạo bộ sưu tập mới.

### 2.2. Lưới Danh sách Các Bộ Sưu Tập (Collections Grid / Table View)
Hỗ trợ hiển thị dạng Lưới thẻ (Cards Grid) hoặc Bảng dữ liệu (Data Table) linh hoạt:
- **Ảnh đại diện / Bìa bộ sưu tập (Cover Image):** Lấy hình ảnh của các điểm đến đầu tiên trong bộ sưu tập hoặc hình đại diện riêng.
- **Tên Bộ Sưu Tập (`name`):** Tiêu đề bộ sưu tập (ví dụ: *"Biển xanh hè 2026"*, *"Điểm đến Di sản Mộc mạc"*, *"Weekend Escapes"*).
- **Đường dẫn thân thiện (`slug`):** Hiển thị badge slug URL (ví dụ: `/collections/bien-xanh-he-2026`).
- **Mô tả ngắn (`description`):** Tóm tắt ý tưởng, thông điệp và cảm hứng du lịch của bộ sưu tập.
- **Số lượng Điểm đến trực thuộc (`destinations` count):** Badge màu Xanh Lam hiển thị số địa danh đang có trong bộ sưu tập (ví dụ: `8 điểm đến`).
- **Cột Thao tác (Actions):**
  - **Nút "Quản lý Điểm đến" (Manage Destinations Icon):** Mở Modal chi tiết để xem danh sách điểm đến và thực hiện thêm/xóa địa danh thuộc bộ sưu tập.
  - **Nút "Chỉnh sửa" (Edit Icon):** Mở Modal Form cập nhật tên, slug và mô tả của bộ sưu tập.
  - **Nút "Xóa" (Delete Icon):** Mở Modal cảnh báo xác nhận xóa bộ sưu tập khỏi MongoDB.

### 2.3. Modal / Form Thêm & Chỉnh sửa Bộ sưu tập (Collection Form Modal)
Form nhập liệu bao gồm các trường:
- **Tên Bộ sưu tập (`name`):** Bắt buộc nhập, tự động sinh slug URL (ví dụ: *"Thiên đường Mùa Thu"* -> `thien-duong-mua-thu`).
- **Đường dẫn Slug (`slug`):** Bắt buộc, duy nhất trong hệ thống, cho phép Admin chỉnh sửa thủ công nếu cần.
- **Mô tả Bộ sưu tập (`description`):** Bắt buộc nhập, văn bản giới thiệu ý nghĩa và đối tượng du khách của bộ sưu tập.
- **Chọn Điểm đến ban đầu (`destinations`):**
  - Danh sách điểm đến trong hệ thống để chọn gán vào bộ sưu tập.
  - **Quy tắc nghiệp vụ (`analyst.md` mục 3.16):** Đánh dấu hoặc lọc loại bỏ các điểm đến đã nằm trong bộ sưu tập khác để tránh trùng lặp dữ liệu bộ sưu tập.

### 2.4. Modal Chi tiết Bộ sưu tập & Quản lý Điểm đến (Collection Detail Modal)
Giao diện quản lý chuyên sâu danh sách các địa danh trực thuộc bộ sưu tập:
- **Khối Thông tin Tổng quan Bộ sưu tập:**
  - Tên bộ sưu tập, Đường dẫn Slug công khai (`/collections/:slug`).
  - Toàn bộ nội dung mô tả bộ sưu tập.
  - Tổng số lượng điểm đến hiện có.
- **Khối Danh sách Điểm đến Hiện tại (Current Destinations):**
  - Hiển thị danh sách dạng lưới thẻ các điểm đến (ảnh thumbnail, tên địa danh, vùng miền, chủ đề du lịch).
  - **Nút "Gỡ bỏ khỏi Bộ sưu tập" (Remove Icon):** Nút icon thùng rác nhỏ trên góc từng thẻ để gỡ bỏ điểm đến khỏi bộ sưu tập (`DELETE /api/v1/collections/:id/destinations/:destinationId`).
  - Empty State nếu bộ sưu tập chưa có điểm đến nào.
- **Khối Thêm Điểm đến vào Bộ sưu tập (Add Destinations to Collection):**
  - Dropdown/Multi-select danh sách các điểm đến khả dụng trong hệ thống:
    - Áp dụng logic kiểm tra: chỉ hiển thị các điểm đến chưa thuộc bộ sưu tập này và chưa nằm trong bộ sưu tập khác.
  - Nút **"Thêm vào Bộ Sưu Tập" (Primary Button):** Gửi yêu cầu gán danh sách điểm đến đã chọn vào bộ sưu tập (`POST /api/v1/collections/:id/destinations`).

### 2.5. Modal Xác nhận Xóa Bộ sưu tập (Collection Delete Modal)
- Cảnh báo bảo mật: *"Bạn có chắc chắn muốn xóa bộ sưu tập [Tên Bộ Sưu Tập] không? Việc xóa bộ sưu tập sẽ không làm mất các điểm đến liên quan trong hệ thống."*
- Nút "Hủy bỏ" và Nút "Xác nhận xóa" (Danger Button).

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

Màn hình kết nối trực tiếp với cụm API `/api/v1/collections` của Backend:

- **Fetch Danh sách Bộ sưu tập:** `GET /api/v1/collections`
- **Fetch Chi tiết Bộ sưu tập:** `GET /api/v1/collections/:idOrSlug`
  - Trả về thông tin chi tiết bộ sưu tập kèm mảng `destinations` đã populate đầy đủ dữ liệu địa danh (tên, hình ảnh, vùng miền, chủ đề).
- **Fetch Danh sách Điểm đến thuộc Bộ sưu tập:** `GET /api/v1/collections/:idOrSlug/destinations`
- **Tạo mới Bộ sưu tập:** `POST /api/v1/collections`
  - Headers: `Authorization: Bearer <JWT_ADMIN_TOKEN>`
  - Payload:
    ```json
    {
      "name": "Biển Xanh Hè 2026",
      "slug": "bien-xanh-he-2026",
      "description": "Tuyển tập những bãi biển trong xanh và quyến rũ nhất Việt Nam cho kỳ nghỉ hè tràn đầy năng lượng.",
      "destinations": ["653a1f8b...", "653a1f8c..."]
    }
    ```
- **Cập nhật Bộ sưu tập:** `PUT /api/v1/collections/:id`
  - Headers: `Authorization: Bearer <JWT_ADMIN_TOKEN>`
- **Xóa Bộ sưu tập:** `DELETE /api/v1/collections/:id`
  - Headers: `Authorization: Bearer <JWT_ADMIN_TOKEN>`
- **Thêm Danh sách Điểm đến vào Bộ sưu tập:** `POST /api/v1/collections/:id/destinations`
  - Headers: `Authorization: Bearer <JWT_ADMIN_TOKEN>`
  - Payload: `{ "destinationIds": ["653a1f8d...", "653a1f8e..."] }`
- **Gỡ 1 Điểm đến khỏi Bộ sưu tập:** `DELETE /api/v1/collections/:id/destinations/:destinationId`
  - Headers: `Authorization: Bearer <JWT_ADMIN_TOKEN>`
- **Gỡ Nhiều Điểm đến khỏi Bộ sưu tập:** `DELETE /api/v1/collections/:id/destinations`
  - Headers: `Authorization: Bearer <JWT_ADMIN_TOKEN>`
  - Payload: `{ "destinationIds": ["653a1f8d..."] }`

---

## 4. Xử lý Trạng thái & Trải nghiệm Người dùng (UX/UI & Responsive)

- **Ràng buộc nghiệp vụ Tránh Trùng lặp (Business Rule Validation):** Phía giao diện hiển thị ghi chú và lọc tự động các điểm đến đã thuộc bộ sưu tập khác, ngăn chặn việc gán trùng lặp gây xung đột phân loại theo đúng yêu cầu `analyst.md`.
- **Toast Notifications:** Phản hồi thông báo trực quan ngay góc màn hình khi thêm mới, sửa, xóa hoặc cập nhật danh sách địa danh trong bộ sưu tập.
- **Empty State Thân thiện:** Hiển thị nút *"Thêm điểm đến ngay"* khi bộ sưu tập mới được tạo và chưa có địa danh nào.
- **Responsive Design:**
  - Trên màn hình lớn: Bố cục Grid 3 cột cho các thẻ Bộ sưu tập, bảng dữ liệu chi tiết rõ ràng.
  - Trên màn hình di động: Co dãn thành 1 cột thẻ duy nhất, các thao tác quản lý điểm đến chuyển thành danh sách cuộn dọc tối ưu cảm ứng.
