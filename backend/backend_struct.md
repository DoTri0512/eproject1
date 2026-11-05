
# CẤU TRÚC THƯ MỤC BACKEND NODE.JS EXPRESS (BACKEND STRUCTURE SPECIFICATION)
**Dự án:** TravelTrail - Full-stack Travel & Tour Booking System  
**Kiến trúc:** Modular Architecture (Node.js + Express.js + MongoDB)

---

## I. SƠ ĐỒ CẤU TRÚC THƯ MỤC (DIRECTORY TREE)

```text
backend/
├── src/
│   │
│   ├── config/
│   │   ├── database.js
│   │   └── env.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   ├── user.model.js
│   │   │   ├── auth.route.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.validation.js
│   │   │
│   │   ├── customer/
│   │   │   ├── customer.model.js
│   │   │   ├── customer.route.js
│   │   │   ├── customer.controller.js
│   │   │   ├── customer.service.js
│   │   │   └── customer.validation.js
│   │   │
│   │   ├── destination/
│   │   │   ├── destination.model.js
│   │   │   ├── destination.route.js
│   │   │   ├── destination.controller.js
│   │   │   ├── destination.service.js
│   │   │   └── destination.validation.js
│   │   │
│   │   ├── tour/
│   │   │   ├── tour.model.js
│   │   │   ├── tour.route.js
│   │   │   ├── tour.controller.js
│   │   │   ├── tour.service.js
│   │   │   └── tour.validation.js
│   │   │
│   │   ├── booking/
│   │   │   ├── booking.model.js
│   │   │   ├── booking.route.js
│   │   │   ├── booking.controller.js
│   │   │   ├── booking.service.js
│   │   │   └── booking.validation.js
│   │   │
│   │   ├── bookingPlan/
│   │   │   ├── bookingPlan.model.js
│   │   │   ├── bookingPlan.route.js
│   │   │   ├── bookingPlan.controller.js
│   │   │   ├── bookingPlan.service.js
│   │   │   └── bookingPlan.validation.js
│   │   │
│   │   ├── chatbot/
│   │   │   ├── chatSession.model.js
│   │   │   ├── chatbot.route.js
│   │   │   ├── chatbot.controller.js
│   │   │   ├── chatbot.service.js
│   │   │   └── chatbot.engine.js
│   │   │
│   │   ├── guide/
│   │   │   ├── guide.model.js
│   │   │   ├── guide.route.js
│   │   │   ├── guide.controller.js
│   │   │   ├── guide.service.js
│   │   │   └── guide.validation.js
│   │   │
│   │   ├── favourite/
│   │   │   ├── favourite.model.js
│   │   │   ├── favourite.route.js
│   │   │   ├── favourite.controller.js
│   │   │   ├── favourite.service.js
│   │   │   └── favourite.validation.js
│   │   │
│   │   ├── collection/
│   │   │   ├── collection.model.js
│   │   │   ├── collection.route.js
│   │   │   ├── collection.controller.js
│   │   │   ├── collection.service.js
│   │   │   └── collection.validation.js
│   │   │
│   │   ├── contact/
│   │   │   ├── contact.model.js
│   │   │   ├── contact.route.js
│   │   │   ├── contact.controller.js
│   │   │   ├── contact.service.js
│   │   │   └── contact.validation.js
│   │   │
│   │   ├── stats/
│   │   │   ├── stats.route.js
│   │   │   ├── stats.controller.js
│   │   │   └── stats.service.js
│   │   │
│   │   ├── upload/
│   │   │   ├── upload.middleware.js
│   │   │   ├── upload.route.js
│   │   │   └── upload.controller.js
│   │   │
│   │   └── admin/
│   │       ├── admin.route.js
│   │       ├── admin.controller.js
│   │       ├── admin.service.js
│   │       └── admin.validation.js
│   │
│   ├── routes/
│   │   └── index.js
│   │
│   ├── utils/
│   │   ├── response.js
│   │   ├── pagination.js
│   │   ├── token.js
│   │   ├── cleanBookings.js
│   │   └── seed.js
│   │
│   ├── app.js
│   └── server.js
│
├── uploads/                   # Thư mục lưu trữ file ảnh upload
├── .env
├── .env.example
├── .gitignore
├── backend_struct.md
├── package.json
└── README.md
```

---

## II. CHI TIẾT VAI TRÒ CÁC CẤU PHẦN

### 1. Thư mục Root Backend
- **`.env`**: Chứa các biến môi trường nhạy cảm (DB URI, JWT Secret, Port, v.v.). Không commit file này lên Git.
- **`.env.example`**: Bản mẫu cấu hình biến môi trường không chứa bí mật để developer khác tham khảo.
- **`.gitignore`**: Khai báo danh sách các file/folder bỏ qua không commit (`node_modules`, `.env`, build logs, v.v.).
- **`package.json`**: Quản lý thông tin dự án, danh sách các thư viện phụ thuộc (express, mongoose, dotenv, jsonwebtoken, v.v.) và scripts khởi chạy.
- **`README.md`**: Hướng dẫn cài đặt, khởi chạy dự án và danh sách API endpoints.

---

### 2. Thư mục `src/config/`
- **`database.js`**: Thiết lập kết nối đến cơ sở dữ liệu MongoDB thông qua Mongoose / MongoDB Native Driver.
- **`env.js`**: Tải và quản lý tập trung các biến môi trường từ `.env` với các giá trị mặc định fallback an toàn.

---

### 3. Thư mục `src/middlewares/`
- **`auth.middleware.js`**: Middleware xác thực JWT token (Authentication) và phân quyền người dùng theo vai trò User / Admin (Authorization).
- **`error.middleware.js`**: Middleware bắt lỗi tập trung (Global Error Handler) đảm bảo API luôn trả về định dạng lỗi chuẩn hóa.

---

### 4. Thư mục `src/modules/` (Kiến trúc theo Module Nghiệp vụ)

Tất cả các tính năng chính được đóng gói độc lập theo cấu trúc 4 layer chuẩn:
- **`*.route.js`**: Định nghĩa các API endpoints và gán middleware phù hợp.
- **`*.controller.js`**: Tiếp nhận request, gọi service xử lý và trả về response cho client.
- **`*.service.js`**: Chứa toàn bộ logic nghiệp vụ (Business Logic) và tương tác với Database.
- **`*.validation.js`**: Kiểm tra dữ liệu đầu vào (Input Validation) của client trước khi vào Controller.

#### Danh sách các Modules:
1. **`auth/`**: Xử lý đăng ký, đăng nhập, đăng xuất, lấy thông tin cá nhân (Profile) và cấp lại token. Chứa `user.model.js` định nghĩa schema người dùng.
2. **`customer/`**: Quản lý thông tin cá nhân khách hàng thanh toán (Họ tên, Email, SĐT, Địa chỉ, CMND/CCCD).
3. **`destination/`**: Xử lý xem danh sách điểm đến, chi tiết điểm đến, tìm kiếm, lọc theo Vùng miền (Region) và Chủ đề (Theme), CRUD điểm đến (Admin).
4. **`tour/`**: Quản lý danh sách các gói tour du lịch, bài giới thiệu tổng quan (`overview`), danh sách tùy chọn thời lượng và giá vé linh hoạt (`durationOptions`), danh sách ngày khởi hành tự chọn (`departureDates`), chi tiết lịch trình theo ngày, CRUD tour mở bán (Admin).
5. **`booking/`**: Xử lý đặt chuyến du lịch (Booking) với tùy chọn thời lượng (`selectedDuration`), ngày khởi hành tự chọn (`departureDate`), tự động tính ngày kết thúc (`endDate`) và tổng tiền (`totalAmount`), xem lịch sử đơn đặt tour cá nhân (`My Bookings`) và hủy đơn đặt tour đang chờ duyệt.
6. **`bookingPlan/`**: Quản lý danh sách đoàn khởi hành gom tất cả hành khách đặt tour đi cùng ngày (`departureDate`) và thời lượng (`duration`), phân công Hướng dẫn viên (`Guide`) phụ trách đoàn và quản lý danh sách hành khách (dành cho Admin).
7. **`chatbot/`**: Module AI Chatbot tư vấn du lịch thông minh tích hợp RAG (Retrieval-Augmented Generation). Bao gồm:
   - `chatSession.model.js`: Schema lưu trữ lịch sử hội thoại theo session.
   - `chatbot.engine.js`: Engine xử lý intent (ngân sách, thời lượng, chủ đề, địa điểm), truy vấn database (Tour, Destination) và gọi Gemini LLM API.
   - `chatbot.service.js`: Điều phối toàn bộ luồng xử lý: nhận message, gọi engine, lưu session, populate kết quả.
   - `chatbot.controller.js / chatbot.route.js`: Tiếp nhận request từ frontend và định nghĩa API endpoints.
8. **`guide/`**: Quản lý thông tin hồ sơ Hướng dẫn viên du lịch (Kinh nghiệm, Chuyên môn, Ngôn ngữ, Địa điểm chuyên trách).
9. **`favourite/`**: Quản lý danh sách địa điểm du lịch yêu thích của người dùng (Thêm, Xóa, Xem danh sách yêu thích và đồng bộ với MongoDB).
10. **`collection/`**: Quản lý các bộ sưu tập điểm đến theo mùa và theo chủ đề du lịch (Weekend Escapes, Heritage Visits, Nature Trips...).
11. **`contact/`**: Tiếp nhận thông tin từ form liên hệ và hỗ trợ của khách hàng (Validate Name, Email, Phone, Message và lưu DB).
12. **`stats/`**: Cung cấp dữ liệu thống kê nâng cao cho Dashboard Admin (doanh thu theo thời gian, tỉ lệ booking, top tour, top điểm đến...).
13. **`upload/`**: Xử lý upload file ảnh lên server (`multipart/form-data`), lưu vào thư mục `uploads/` và trả về URL tĩnh. Hỗ trợ upload đơn và upload nhiều ảnh cùng lúc (tối đa 10 ảnh).
14. **`admin/`**: Quản lý báo cáo thống kê KPI tổng quan (Số Destination, Tour, Booking, Tổng doanh thu) và duyệt/cập nhật trạng thái đơn đặt tour toàn hệ thống.

---

### 5. Thư mục `src/routes/`
- **`index.js`**: Điểm tập hợp và tổng hợp tất cả các router từ các modules (`auth`, `customer`, `destination`, `tour`, `booking`, `bookingPlan`, `chatbot`, `guide`, `favourite`, `collection`, `contact`, `stats`, `upload`, `admin`) thành một router chính cấp hệ thống (VD: `/api/v1/...`).

---

### 6. Thư mục `src/utils/`
- **`response.js`**: Hàm hỗ trợ định dạng phản hồi API nhất quán (VD: `{ success: true, data: ..., message: ... }`).
- **`pagination.js`**: Hàm hỗ trợ tính toán phân trang (page, limit, skip, totalPages, totalItems) cho các bảng dữ liệu.
- **`token.js`**: Utility hỗ trợ tạo (Sign) và kiểm tra (Verify) JWT Access Token / Refresh Token.
- **`cleanBookings.js`**: Utility dọn dẹp các booking hết hạn / đã bị cancel sau một khoảng thời gian nhất định.
- **`seed.js`**: Script khởi tạo dữ liệu mẫu (seed data) cho môi trường phát triển.

---

### 7. Thư mục Core (`src/`)
- **`app.js`**: Khởi tạo ứng dụng Express, cấu hình middleware toàn cục (CORS, Body Parser, Error Middleware) và mount API routes.
- **`server.js`**: Điểm khởi tạo dự án (Entry point), thực hiện kết nối Database và kích hoạt HTTP Server lắng nghe trên Port đã cấu hình.

---

### 8. Thư mục `uploads/`
- Lưu trữ các file ảnh được upload thông qua module `upload`. Được phục vụ dưới dạng file tĩnh (static files) qua Express (`/uploads/:filename`). Thư mục này chứa file `.gitkeep` để đảm bảo cấu trúc được commit vào Git nhưng bỏ qua các file ảnh thực tế.
