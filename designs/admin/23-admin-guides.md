# Màn hình 21: Admin - Quản lý Hướng dẫn viên (Admin Guides Management)

## 1. Tổng quan màn hình
- **Tên file:** `21-admin-guides.md`
- **Mục đích:** Cung cấp giao diện quản trị cho phép Quản trị viên (Admin) xem danh sách, xem chi tiết hồ sơ hướng dẫn viên, thực hiện đầy đủ các thao tác CRUD (Thêm mới, Xem chi tiết, Chỉnh sửa, Xóa) hồ sơ Hướng dẫn viên du lịch trong MongoDB, đồng thời quản lý danh sách các Điểm đến (`destinations`) mà từng hướng dẫn viên phụ trách chính.
- **Quyền truy cập:** Chỉ Quản trị viên (`admin` role required).

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

Giao diện áp dụng bố cục Admin tiêu chuẩn với **Admin Navigation Sidebar** cố định bên trái (nền Xanh Đen `#0F172A`) và **Khối nội dung chính** bên phải (nền Xanh Băng Nhạt `#F8FAFC`).

### 2.1. Header & Thanh Thao tác (Action Bar)
- **Tiêu đề trang:** *"Quản Lý Đội Ngũ Hướng Dẫn Viên"* kèm phụ đề *"Quản lý hồ sơ, chuyên môn, ngôn ngữ và phân công điểm đến phụ trách"*.
- **Search Bar:** Ô tìm kiếm theo tên hướng dẫn viên, ngôn ngữ hoặc chuyên môn.
- **Bộ lọc Dropdown (Filters):**
  - **Lọc theo Chuyên môn (Specialisation):** `Tất cả`, `Văn hóa & Lịch sử`, `Khám phá & Trekking`, `Leo núi & Mạo hiểm`, `Sinh thái & Thiên nhiên`, `Nhiếp ảnh & Cảnh quan`, `Ẩm thực & Đời sống địa phương`.
  - **Lọc theo Ngôn ngữ (Language):** `Tất cả`, `Tiếng Việt`, `Tiếng Anh`, `Tiếng Pháp`, `Tiếng Trung`, `Tiếng Nhật`...
- **Nút "Thêm Hướng Dẫn Viên Mới" (Primary Button):** Nút màu Xanh Biển `#0284C7` với icon `person_add`, khi click sẽ mở Modal Form tạo mới hồ sơ HDV.

### 2.2. Bảng Danh sách Hướng dẫn viên (Guides Data Table)
Bảng hiển thị danh sách các Hướng dẫn viên với phong cách Card/Table bo góc 16px, hiệu ứng đổ bóng dịu `shadow-soft`:
- **Thông tin HDV (Avatar & Name):** Ảnh chân dung tròn (avatar), Họ tên đầy đủ (Font Semibold), và liên kết slug `/guides/:slug`.
- **Chuyên môn chính (Specialisation):** Badge màu Xanh Lam/Tím thể hiện lĩnh vực thế mạnh của HDV (ví dụ: `Văn hóa & Lịch sử`, `Leo núi & Mạo hiểm`).
- **Ngôn ngữ sử dụng (Languages):** Nhóm các Chip/Badge ngôn ngữ giao tiếp (VN, EN, FR...).
- **Điểm đến phụ trách (Assigned Destinations):** 
  - Hiển thị số lượng điểm đến đang phụ trách (ví dụ: `3 điểm đến`).
  - Badge đính kèm các điểm đến tiêu biểu (Hà Giang, Vịnh Hạ Long, Sapa...).
- **Tóm tắt tiểu sử (Background / Biography):** Hiển thị đoạn trích ngắn kinh nghiệm làm việc, hỗ trợ tooltip xem nhanh.
- **Cột Thao tác (Actions Column):**
  - **Nút "Chi tiết & Điểm đến" (View Details Icon):** Mở Modal xem toàn bộ hồ sơ chi tiết và quản lý thêm/xóa điểm đến phụ trách.
  - **Nút "Chỉnh sửa" (Edit Icon):** Mở Modal Form cập nhật thông tin cá nhân, kinh nghiệm, ngôn ngữ của HDV.
  - **Nút "Xóa" (Delete Icon):** Mở Modal xác nhận xóa hồ sơ HDV khỏi MongoDB.

### 2.3. Modal / Form Thêm & Chỉnh sửa Hướng dẫn viên (Guide Form Modal)
Form nhập liệu dạng Modal nổi bật với hiệu ứng kính mờ (Backdrop Blur), hỗ trợ validate các trường:
- **Họ và tên (`name`):** Bắt buộc nhập, tự động tạo slug thân thiện URL (ví dụ: `Trần Minh Khoa` -> `tran-minh-khoa`).
- **Đường dẫn Ảnh đại diện (`avatar`):** URL hình ảnh chân dung chất lượng cao của hướng dẫn viên.
- **Lĩnh vực Chuyên môn (`specialisation`):** Dropdown lựa chọn chuyên môn chính.
- **Ngôn ngữ giao tiếp (`languages`):** Multi-select hoặc Tag Input cho phép chọn nhiều ngôn ngữ (Tiếng Việt, Tiếng Anh, Tiếng Pháp, Tiếng Trung, Tiếng Nhật, v.v.).
- **Quá trình học tập & Kinh nghiệm (`background`):** Textarea mô tả quá trình đào tạo, chứng chỉ hành nghề và số năm kinh nghiệm dẫn tour.
- **Tiểu sử cá nhân & Phong cách dẫn đoàn (`biography`):** Textarea bài viết giới thiệu chi tiết về phong cách phục vụ, cá tính và niềm đam mê du lịch.
- **Điểm đến phụ trách ban đầu (`destinations`):** Multi-select chọn các điểm đến từ danh mục `destinations` trong MongoDB.

### 2.4. Modal Chi tiết Hướng dẫn viên & Quản lý Điểm đến Phụ trách (Guide Detail Modal)
Giao diện chuyên sâu phục vụ quản lý phân công điểm đến cho HDV theo đúng yêu cầu phân tích (`analyst.md` mục 3.16):
- **Khối Hồ sơ Tổng quan:**
  - Avatar lớn, Họ tên, Badge chuyên môn, danh sách Ngôn ngữ thành thạo.
  - Toàn văn Background và Biography của HDV.
- **Khối Quản lý Điểm đến Phụ trách (`destinations`):**
  - **Danh sách điểm đến hiện tại:** Hiển thị dạng danh sách thẻ nhỏ (Destination Cards) gồm hình ảnh thumbnail, tên địa danh, vùng miền (`region`).
  - **Nút "Xóa điểm đến" (Remove Button):** Nút icon thùng rác nhỏ trên từng thẻ điểm đến để gỡ bỏ điểm đến đó khỏi danh sách phụ trách của HDV (`DELETE /api/v1/guides/:id/destinations/:destinationId`).
  - **Khối "Thêm Điểm đến Phụ trách":**
    - Dropdown chọn từ danh sách điểm đến trong hệ thống chưa được HDV này phụ trách.
    - Nút bấm *"Thêm điểm đến"* (`POST /api/v1/guides/:id/destinations`).

### 2.5. Modal Xác nhận Xóa Hướng dẫn viên (Guide Delete Modal)
- Hộp thoại cảnh báo màu Đỏ/Rose: *"Bạn có chắc chắn muốn xóa hồ sơ hướng dẫn viên [Tên HDV] không? Hành động này sẽ xóa dữ liệu vĩnh viễn khỏi MongoDB và gỡ bỏ phân công khỏi các chuyến đi liên quan."*
- Nút "Hủy bỏ" và Nút "Xác nhận xóa" (Danger Button).

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

Màn hình kết nối trực tiếp với cụm API `/api/v1/guides` của Backend:

- **Fetch Danh sách Hướng dẫn viên:** `GET /api/v1/guides`
  - Query parameters hỗ trợ: `?search={keyword}&specialisation={spec}&language={lang}`.
- **Fetch Chi tiết Hồ sơ Hướng dẫn viên:** `GET /api/v1/guides/:idOrSlug`
  - Trả về dữ liệu chi tiết HDV cùng mảng `destinations` đã populate đầy đủ thông tin địa danh.
- **Fetch Danh sách Điểm đến HDV phụ trách:** `GET /api/v1/guides/:idOrSlug/destinations`
- **Tạo mới Hướng dẫn viên:** `POST /api/v1/guides`
  - Headers: `Authorization: Bearer <JWT_ADMIN_TOKEN>`
  - Payload:
    ```json
    {
      "name": "Trần Minh Khoa",
      "avatar": "https://images.unsplash.com/photo-...",
      "specialisation": "Khám phá & Trekking",
      "languages": ["Tiếng Việt", "Tiếng Anh"],
      "background": "Cử nhân Du lịch ĐH Hà Nội, 8 năm kinh nghiệm dẫn tour Tây Bắc",
      "biography": "Đam mê leo núi và văn hóa bản địa các dân tộc thiểu số...",
      "destinations": ["653a1f8b...", "653a1f8c..."]
    }
    ```
- **Cập nhật Thông tin Hướng dẫn viên:** `PUT /api/v1/guides/:id`
  - Headers: `Authorization: Bearer <JWT_ADMIN_TOKEN>`
- **Xóa Hướng dẫn viên:** `DELETE /api/v1/guides/:id`
  - Headers: `Authorization: Bearer <JWT_ADMIN_TOKEN>`
- **Thêm Điểm đến vào Danh sách Phụ trách của HDV:** `POST /api/v1/guides/:id/destinations`
  - Headers: `Authorization: Bearer <JWT_ADMIN_TOKEN>`
  - Payload: `{ "destinationIds": ["653a1f8d..."] }`
- **Gỡ Điểm đến khỏi Danh sách Phụ trách:** `DELETE /api/v1/guides/:id/destinations/:destinationId`
  - Headers: `Authorization: Bearer <JWT_ADMIN_TOKEN>`

---

## 4. Xử lý Trạng thái & Trải nghiệm Người dùng (UX/UI & Responsive)

- **Toast Notifications:** Hiển thị thông báo góc trên bên phải khi thực hiện thành công các thao tác Thêm, Sửa, Xóa hoặc Cập nhật điểm đến phụ trách.
- **Skeleton & Spinner Loading:** Hiển thị Skeleton loading mượt mà khi đang nạp danh sách HDV hoặc đang submit form API.
- **Empty State:** Khi không có dữ liệu phù hợp với từ khóa tìm kiếm hoặc bộ lọc, hiển thị minh họa trực quan kèm nút *"Xóa bộ lọc"*.
- **Responsive Layout:**
  - **Desktop (>= 1024px):** Hiển thị Data Table đầy đủ cột dữ liệu kèm Sidebar cố định 288px.
  - **Tablet & Mobile (< 1024px):** Tự động chuyển đổi bảng dữ liệu thành danh sách Thẻ HDV (Guide Cards) hiển thị dọc, các nút thao tác chạm (Touch-friendly buttons) thuận tiện.
