# Màn hình 22: Admin - Quản lý Yêu cầu Liên hệ (Admin Contacts Management)

## 1. Tổng quan màn hình
- **Tên file:** `22-admin-contacts.md`
- **Mục đích:** Cung cấp cho Quản trị viên (Admin) giao diện tiếp nhận, theo dõi, phân loại trạng thái xử lý (`new`, `read`, `resolved`) và quản lý toàn bộ các phản hồi, thắc mắc, yêu cầu tư vấn được khách hàng gửi về thông qua Form Liên hệ (`/contact`) trên hệ thống TravelTrail.
- **Quyền truy cập:** Chỉ Quản trị viên (`admin` role required).

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

Giao diện quản trị đồng bộ theo tông màu **Xanh - Trắng** hiện đại, kết hợp hiệu ứng bo góc mượt mà `rounded-2xl`, bóng đổ tinh tế `shadow-soft` và Sidebar quản trị cố định bên trái (`#0F172A`).

### 2.1. Header & Thẻ Thống kê Nhanh (KPI Stats & Action Bar)
- **Tiêu đề trang:** *"Quản Lý Yêu Cầu Liên Hệ & Hỗ Trợ"* kèm mô tả *"Theo dõi phản hồi, giải đáp thắc mắc và chăm sóc khách hàng"*.
- **Cụm Nút Thao tác Phụ:**
  - **Nút "Xuất CSV" (Export CSV Button):** Cho phép Admin xuất danh sách toàn bộ liên hệ ra file CSV để làm việc với CRM hoặc lưu trữ nội bộ.
  - **Nút "Làm mới" (Refresh Button):** Tải lại danh sách mới nhất từ MongoDB REST API.
- **Cụm 4 Thẻ Thống kê Trạng thái (KPI Summary Badges / Tabs):**
  1. **Tất cả liên hệ (`All`):** Tổng số yêu cầu đã nhận trong hệ thống.
  2. **Chưa đọc (`New`):** Hiển thị số lượng tin nhắn mới chưa được xem, có Badge Đỏ/Cam nổi bật cùng hiệu ứng chớp sáng nhẹ (Pulse) để Admin chú ý xử lý ngay.
  3. **Đã đọc / Đang xử lý (`Read`):** Số yêu cầu đã được mở xem nhưng chưa hoàn tất giải quyết.
  4. **Đã giải quyết (`Resolved`):** Số yêu cầu đã được hỗ trợ hoặc phản hồi thành công.

### 2.2. Thanh Tìm kiếm & Lọc Dữ liệu (Search & Filter Bar)
- **Search Bar:** Ô tìm kiếm tức thì theo: Họ và tên người gửi, Địa chỉ Email, Số điện thoại, Tiêu đề (Subject) hoặc Từ khóa trong nội dung tin nhắn.
- **Filter Tabs:** Tab chuyển nhanh giữa các bộ lọc trạng thái: `Tất cả liên hệ`, `Chưa đọc (New)`, `Đã đọc (Read)`, `Đã giải quyết (Resolved)`.
- **Bộ đếm kết quả:** Hiển thị số lượng liên hệ tìm thấy (ví dụ: *"Hiển thị 10 trên tổng số 42 yêu cầu"*).

### 2.3. Bảng Dữ liệu Yêu cầu Liên hệ (Contacts Management Data Table)
Bảng hiển thị chi tiết các yêu cầu liên hệ:
- **Thông tin Người gửi (Sender Info):**
  - Khối Avatar ký tự viết tắt (Initials Badge, ví dụ: "NK" cho "Nguyễn Khoa") với màu nền ngẫu nhiên trang nhã.
  - Họ và tên người gửi (Font Bold, màu `#0F172A`).
  - Địa chỉ Email (kèm liên kết nhấp chuột mở trình soạn mail) và Số điện thoại (nếu có).
- **Tiêu đề Yêu cầu (Subject):** Hiển thị chủ đề khách hàng quan tâm (ví dụ: *"Tư vấn tour Phú Quốc 3N2Đ"*, *"Hỏi về chính sách hủy tour"*).
- **Trích đoạn Tin nhắn (Message Preview):** Đoạn ngắn 1-2 dòng đầu tiên của nội dung liên hệ, có cắt bớt `truncate` và hỗ trợ hover tooltip xem nhanh toàn văn.
- **Thời gian gửi (Date & Time):**
  - Hiển thị ngày giờ gửi chuẩn định dạng `dd/MM/yyyy HH:mm`.
  - Hiển thị thời gian tương đối (ví dụ: *"10 phút trước"*, *"Hôm qua"*).
- **Trạng thái Xử lý (Status Badge):**
  - `Mới (New)`: Badge màu Đỏ/Rose với chấm tròn pulse animation.
  - `Đã đọc (Read)`: Badge màu Xanh Lam (`#0284C7`).
  - `Đã giải quyết (Resolved)`: Badge màu Xanh Lá Cây (`#10B981`) với biểu tượng `check_circle`.
- **Cột Thao tác (Actions Column):**
  - **Nút "Xem chi tiết" (View Detail Icon):** Mở Modal chi tiết nội dung tin nhắn; hệ thống tự động cập nhật trạng thái từ `new` thành `read`.
  - **Dropdown Đổi trạng thái nhanh:** Cho phép Admin chuyển nhanh trạng thái trực tiếp ngay trên bảng mà không cần mở modal.
  - **Nút "Gửi Email" (Quick Email Action):** Mở ứng dụng email với địa chỉ người nhận và tiêu đề đã được điền sẵn (`mailto:...`).
  - **Nút "Xóa" (Delete Action):** Mở Modal cảnh báo xác nhận xóa yêu cầu liên hệ khỏi MongoDB.

### 2.4. Modal Xem Chi tiết Tin nhắn Liên hệ (Contact Detail Modal)
Giao diện xem toàn diện một yêu cầu liên hệ khách hàng:
- **Header Modal:**
  - Mã định danh yêu cầu liên hệ (`_id`).
  - Trạng thái hiện tại kèm Dropdown cập nhật trạng thái trực tiếp.
  - Nút Đóng (Close button).
- **Khối Thông tin Khách hàng:**
  - Họ tên đầy đủ, Avatar chữ viết tắt.
  - Email (kèm nút "Sao chép email").
  - Số điện thoại (kèm nút "Gọi ngay" trên thiết bị di động).
  - Thời điểm gửi tin nhắn chính xác.
- **Khối Nội dung Tin nhắn (Message Content):**
  - Tiêu đề chủ đề (Subject).
  - Khung văn bản hiển thị toàn văn tin nhắn của khách với typography sắc nét, dễ đọc.
- **Khối Hành động Xử lý (Action Footer):**
  - Nút **"Phản hồi qua Email" (Primary Button):** Mở ứng dụng mail với mẫu thư trả lời hỗ trợ khách hàng.
  - Nút **"Đánh dấu Đã giải quyết" (Success Button):** Chuyển trạng thái sang `resolved` và cập nhật dữ liệu tức thì.
  - Nút **"Xóa yêu cầu" (Danger Button):** Mở dialog xác nhận xóa nếu là thư rác (spam).

### 2.5. Modal Xác nhận Xóa Yêu cầu (Delete Confirm Modal)
- Thông báo xác nhận: *"Bạn có chắc chắn muốn xóa vĩnh viễn yêu cầu liên hệ từ khách hàng [Tên Khách Hàng] không? Hành động này không thể hoàn tác."*
- Nút "Hủy bỏ" và Nút "Xóa vĩnh viễn".

### 2.6. Thanh Phân trang (Pagination Bar)
- Nằm ở cuối bảng dữ liệu, hiển thị:
  - Thông tin số dòng: *"Hiển thị 1 đến 10 trong 42 kết quả"*.
  - Các nút chuyển trang: First, Previous, Danh sách số trang (1, 2, 3...), Next, Last.

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

Màn hình tương tác trực tiếp với cụm API `/api/v1/contacts` của Backend:

- **Fetch Danh sách Yêu cầu Liên hệ:** `GET /api/v1/contacts`
  - Query parameters hỗ trợ:
    - `page`: Số trang hiện tại (mặc định: `1`).
    - `limit`: Số bản ghi trên mỗi trang (mặc định: `10`).
    - `status`: Lọc theo trạng thái (`new`, `read`, `resolved`).
    - `search`: Từ khóa tìm kiếm (tên, email, phone, subject, message).
  - Headers: `Authorization: Bearer <JWT_ADMIN_TOKEN>`
  - Response mẫu:
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "662a5b12...",
          "name": "Nguyễn Văn An",
          "email": "an.nguyen@example.com",
          "phone": "0912345678",
          "subject": "Tư vấn tour gia đình Đà Nẵng",
          "message": "Tôi muốn đặt tour cho gia đình 4 người vào tháng 7 tới, nhờ admin tư vấn lịch trình phù hợp...",
          "status": "new",
          "createdAt": "2026-10-25T14:30:00.000Z"
        }
      ],
      "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalItems": 42
      },
      "stats": {
        "total": 42,
        "newCount": 8,
        "readCount": 14,
        "resolvedCount": 20
      }
    }
    ```
- **Cập nhật Trạng thái Xử lý:** `PUT /api/v1/contacts/:id/status`
  - Headers: `Authorization: Bearer <JWT_ADMIN_TOKEN>`
  - Payload: `{ "status": "resolved" }` (hoặc `"read"`, `"new"`)
- **Xóa Yêu cầu Liên hệ:** `DELETE /api/v1/contacts/:id`
  - Headers: `Authorization: Bearer <JWT_ADMIN_TOKEN>`

---

## 4. Xử lý Trạng thái & Trải nghiệm Người dùng (UX/UI & Responsive)

- **Tự động chuyển trạng thái `new` -> `read`:** Khi Admin click vào nút xem chi tiết của một tin nhắn có trạng thái `new`, hệ thống tự động phát lời gọi API cập nhật thành `read` và giảm ngay số lượng badge thông báo tin mới trên thanh tab.
- **Toast Notifications:** Thông báo xác nhận thành công ngay khi cập nhật trạng thái liên hệ hoặc xóa bản ghi.
- **Tùy biến trên Di động (Mobile View):**
  - Chuyển đổi Data Table sang dạng danh sách Thẻ liên hệ (Contact Cards) xếp dọc.
  - Các thao tác xem chi tiết, đổi trạng thái và gọi điện/gửi email được tích hợp thành các nút bấm kích thước lớn tiện lợi cho ngón tay chạm trên màn hình cảm ứng.
