# ANALYST.md – Phân tích yêu cầu dự án TravelTrail

## 1. Tổng quan dự án

**Tên dự án:** TravelTrail

**Loại dự án:** Full-stack Web Application (React Frontend SPA + Node.js Express RESTful API Backend + MongoDB Database)

**Mục tiêu:** Xây dựng website/ứng dụng du lịch toàn diện giúp người dùng khám phá điểm đến, tìm kiếm thông tin, trò chuyện với Trợ lý ảo AI (AI Chatbot) để được tư vấn lịch trình và tour du lịch cá nhân hóa, quản lý tài khoản cá nhân (đăng ký/đăng nhập), thực hiện đặt các chuyến du lịch (Tour Booking), lưu địa điểm yêu thích và lập kế hoạch chuyến đi.

**Phạm vi:** Full-stack Web App bao gồm Frontend React SPA, Backend Node.js Express RESTful API, Cơ sở dữ liệu MongoDB lưu trữ dữ liệu Người dùng, Khách hàng thanh toán (Customers), Điểm đến (Destinations), Tour du lịch (Tours), Yêu thích (Favourites), Kế hoạch chuyến đi (Trip Plans), Đặt chỗ (Bookings), và Lịch sử hội thoại Chatbot AI (Chat Sessions). Tích hợp Authentication & Authorization (JWT), Phân quyền User/Admin, Tour Booking, và Trợ lý ảo AI tư vấn du lịch (AI Travel Assistant).

**Ngoài phạm vi:** Tích hợp trực tiếp cổng thanh toán ngân hàng thực tế (sử dụng mô phỏng/mock status thanh toán), Live GPS Real-time Transport Tracking, Dịch vụ gửi Email tự động thực tế.

---

## 2. Người dùng

Phân loại các đối tượng người dùng chính trong hệ thống:

### 2.1. Khách truy cập (Guest)

- Khám phá điểm đến du lịch, xem các bộ sưu tập và thông tin hướng dẫn viên.
- Tìm kiếm, lọc địa điểm và xem chi tiết các chuyến du lịch/tour hiện có.
- Trò chuyện với Chatbot AI để hỏi đáp nhanh về kinh nghiệm du lịch, điểm đến gợi ý và tour nổi bật theo nhu cầu.
- Đăng ký tài khoản mới và đăng nhập vào hệ thống.

### 2.2. Khách hàng đã đăng ký (Registered User / Customer)

- Đăng nhập, quản lý thông tin cá nhân (Profile).
- Sử dụng Chatbot AI tư vấn du lịch thông minh: nhận đề xuất lịch trình cá nhân hóa theo ngân sách và thời gian, hỏi đáp chi tiết về các tour/điểm đến, lưu lại lịch sử hội thoại tư vấn và dễ dàng chuyển tiếp sang đặt tour trực tiếp.
- Đặt chuyến du lịch (Tour Booking) trực tuyến: Lựa chọn gói thời lượng (Duration: ví dụ 2N1Đ, 3N2Đ, 4N3Đ) phù hợp với nhu cầu, chủ động chọn ngày khởi hành linh hoạt (Flexible Departure Date) bằng Date Picker và xem lịch trình chi tiết tương ứng.
- Quản lý lịch sử đặt chuyến (Booking History), xem thông tin vé và trạng thái đơn đặt (Pending, Confirmed, Completed, Cancelled).
- Lưu địa điểm yêu thích (Favourites) được đồng bộ với MongoDB qua REST API.
- Trip Planner: Khách hàng (Customer) xem thông tin chi tiết tour đã đặt và xem thông tin lịch trình chuyến đi trong tour đó.

### 2.3. Quản trị viên (Admin)

- Đăng nhập trang quản trị Admin.
- Quản lý điểm đến (Destinations): Thêm, sửa, xóa thông tin điểm đến.
- Quản lý chuyến du lịch (Tours): Thêm, sửa, xóa chuyến du lịch; thiết lập các gói thời lượng (Duration Packages), lịch trình từng ngày theo gói, bảng giá tương ứng và khung thời gian mở bán/khả dụng.
- Quản lý đơn đặt tour (Bookings): Phê duyệt, cập nhật trạng thái đơn đặt tour của khách hàng.
- Quản lý người dùng (Users): Xem danh sách người dùng, cập nhật phân quyền tài khoản.

---

## 3. Chức năng chính

### 3.1. Home

- Giới thiệu TravelTrail.
- Hiển thị destination nổi bật và các tour hot.
- Hiển thị các collection.
- Thanh tìm kiếm nhanh destination / tour.
- Truy cập nhanh đến các nhóm nội dung chính.

### 3.2. Destinations

- Hiển thị danh sách destination dạng card.
- Hiển thị tên, region, travel theme và hình ảnh.
- Cho phép mở trang chi tiết destination.
- Danh sách destination được lấy từ MongoDB Database qua REST API.

### 3.3. Search & Filter

- Tìm kiếm theo tên, keyword hoặc region.
- Không phân biệt chữ hoa/chữ thường.
- Lọc theo:
  - Travel theme
  - Region
  - Budget band
  - Best season
- Kết hợp search và filter phía Backend/Frontend.
- Có nút Clear All.
- Hiển thị số lượng kết quả và thông báo khi không có kết quả.

### 3.4. Destination Details

Hiển thị:

- Tên destination, hình ảnh, location, climate.
- Overview, Attractions, Suggested activities.
- Best season, Visit duration, Budget band, Transport information.
- Danh sách các Tour du lịch thuộc Destination này.
- Related destinations.
- Cho phép lưu destination vào danh sách chuyến đi / yêu thích.

### 3.5. Travel Guides

- Hiển thị thông tin đội ngũ hướng dẫn viên.
- Background, Specialisation, Biography, Languages, Interests.
- Danh sách destination hoặc tour liên quan.

### 3.6. Destination Gallery

- Hiển thị gallery ảnh các địa điểm.
- Preview / Lightbox xem ảnh lớn.
- Previous / Next navigation.
- Đóng bằng keyboard.
- Alt text, caption và image credit.

### 3.7. Region Explorer

- Hiển thị danh sách các vùng miền/region.
- Chọn region để lọc và xem danh sách destination tương ứng.
- Hiển thị trạng thái region đang chọn.

### 3.8. Seasonal Collections

- Các bộ sưu tập theo mùa (Weekend Escapes, Heritage Visits, Nature Trips, Seasonal Highlights).
- Cho phép mở destination detail từ collection.

### 3.9. Favourites

- Save / Unsave destination.
- Lưu trữ và đồng bộ với cơ sở dữ liệu MongoDB cho người dùng đã đăng nhập.
- Tạm lưu Local Storage cho khách truy cập chưa đăng nhập (tự động đồng bộ sau khi login).
- Không cho phép lưu trùng destination.
- Trạng thái danh sách rỗng (Empty state).

### 3.10. About

- Giới thiệu sứ mệnh TravelTrail.
- Hướng dẫn cách sử dụng và dịch vụ.
- Thông tin đội ngũ phát triển và nguồn tài nguyên.

### 3.11. Contact

- Form liên hệ gồm: Họ và tên, Email, Số điện thoại, Chủ đề (Subject), Nội dung tin nhắn (Message).
- Validate required fields (Tên, Email, Nội dung bắt buộc) và định dạng email.
- Gửi yêu cầu liên hệ về Backend REST API (`POST /api/v1/contacts`) để lưu vào MongoDB collection `contacts`.
- Hiển thị thông báo xác nhận gửi thành công (Toast / Success Message) sau khi gửi.
- Hiển thị thông tin liên hệ trực tiếp (địa chỉ, email hỗ trợ, số điện thoại hotline, giờ làm việc).
- Hiển thị bản đồ hoặc thông tin vị trí văn phòng.
- Trạng thái loading trong lúc gửi, disable form khi đang submit.
- Reset form sau khi gửi thành công.

### 3.12. Trip Planner

- Khách hàng (Customer) xem thông tin chi tiết tour đã đặt.
- Trong giao diện xem chi tiết:
  - Hiển thị thông tin lịch trình chuyến đi trong tour đó (lịch trình chi tiết theo từng ngày, thời gian và các hoạt động trải nghiệm).
  - Hiển thị đầy đủ thông tin chuyến đi đã đặt: Tên tour, gói thời lượng (số ngày / số đêm), ngày khởi hành, ngày kết thúc, số lượng hành khách, phương thức thanh toán và trạng thái đơn đặt tour.

### 3.13. Common UI & Modern Design System

- **Tông màu chủ đạo:** Xanh - Trắng hiện đại (Primary Ocean Blue `#0284C7`, Sapphire Blue `#0F52BA`, Pure White `#FFFFFF`, Soft Ice Blue `#F0F6FA`).
- **Phong cách thiết kế:** Hiện đại mượt mà (Glassmorphism mờ kính, bo góc 12px, bóng đổ dịu nhẹ elevation shadow, typography sans-serif sắc nét).
- **Header đồng bộ (`<UnifiedHeader />`):** Cố định trên đỉnh (Sticky Top), hiển thị nhất quán trên tất cả các trang Client. Tự động chuyển đổi trạng thái Auth (Nút Đăng nhập/Đăng ký khi là Guest; Avatar, số lượng Favourites, Trip Planner, Đơn đặt tour khi đã Login).
- **Footer đồng bộ (`<UnifiedFooter />`):** Nhúng đồng bộ 100% ở cuối tất cả các trang, thiết kế tông Xanh-Đen `#0F172A` chuẩn 4 cột thông tin (Thương hiệu, Quick Links, Hỗ trợ/Chính sách, Đăng ký tin tức).
- **Mobile Navigation Drawer:** Menu trượt cảm ứng mượt màng từ bên phải màn hình.
- **Phản hồi UI:** Toast Notification tông Xanh-Trắng, Skeleton screen loading khi tải dữ liệu từ MongoDB REST API.

### 3.14. Authentication & Authorization (Xác thực & Phân quyền)

- **Đăng ký tài khoản (Register):**
  - Form đăng ký: Full Name, Email, Password, Confirm Password, Phone.
  - Client-side & Server-side validation (Email duy nhất, độ dài mật khẩu).
  - Mã hóa mật khẩu an toàn với `bcryptjs`.
  - Tạo tài khoản mới lưu vào MongoDB với role mặc định là `user`.
- **Đăng nhập (Login):**
  - Form đăng nhập: Email, Password.
  - Xác thực thông tin qua Backend REST API.
  - Cấp phát JSON Web Token (JWT) khi đăng nhập thành công.
  - Lưu JWT Token ở Client (HTTP-only Cookie) để duy trì phiên làm việc.
- **Đăng xuất (Logout):**
  - Xóa JWT Token phía Client và reset trạng thái authentication.
- **Quản lý Thông tin cá nhân (User Profile):**
  - Xem thông tin tài khoản (Tên, Email, Số điện thoại, Avatar, Ngày tham gia).
  - Cập nhật thông tin cá nhân và đổi mật khẩu.
- **Phân quyền người dùng (Role-Based Access Control - RBAC):**
  - Role `user`: Quyền truy cập các tính năng cá nhân (Đặt tour, xem lịch sử booking, yêu thích, trip plan).
  - Role `admin`: Quyền truy cập Dashboard quản trị và các API Admin để quản lý dữ liệu toàn hệ thống.

### 3.15. Tour & Travel Booking (Đặt chuyến du lịch)

- **Danh sách Tour & Chi tiết Tour:**
  - Xem danh sách các tour du lịch có sẵn.
  - Chi tiết thông tin tour: Tiêu đề, danh sách các tùy chọn thời lượng có sẵn (`durationOptions`: ví dụ 2N1Đ - 3.000.000đ, 3N2Đ - 4.500.000đ, 4N3Đ - 6.000.000đ), lịch trình chi tiết theo từng ngày (itinerary), khung thời gian mở phục vụ, các dịch vụ bao gồm/không bao gồm.
  - Khách hàng có thể chuyển đổi giữa các tùy chọn trong `durationOptions` để xem mức giá và lịch trình hiển thị tương ứng theo số ngày của option đó.
- **Form Đặt chuyến (Booking Form):**
  - Khách hàng lựa chọn tùy chọn thời lượng mong muốn từ danh sách `durationOptions` (ví dụ: 2N1Đ, 3N2Đ hoặc 4N3Đ).
  - Khách hàng chủ động chọn ngày khởi hành (Departure Date) theo lịch cá nhân bằng bộ chọn ngày (Date Picker) trong khung thời gian mở phục vụ.
  - Hệ thống tự động tính ngày kết thúc (End Date) dựa trên ngày khởi hành và số ngày của option đã chọn (`endDate = departureDate + (selectedDuration.days - 1)`).
  - Nhập số lượng khách (Người lớn, Trẻ em). Hệ thống kiểm tra số khách không được vượt quá số chỗ còn trống (`availableSeats`). Logic xác định: ban đầu khi chưa có ai đặt thì `availableSeats = maxPassengers`, khi đã có khách đặt thì `availableSeats = maxPassengers - [số lượng người đã đặt trong tour đó]`.
  - Tự động tính tổng số tiền (Total Price) tương ứng với giá của option đã chọn và số lượng khách (`selectedDuration.price * số lượng khách`).
  - Điền thông tin người đặt & danh sách khách đi cùng.
  - Điền ghi chú bổ sung (yêu cầu ăn uống, phòng đơn, v.v.).
  - Gửi đơn đặt chuyến lên Backend (tạo đơn Booking mới với trạng thái mặc định `Pending`).
- **Quản lý đơn đặt tour cá nhân (My Bookings):**
  - Hiển thị danh sách tất cả các đơn đặt tour của người dùng đang đăng nhập (kèm gói thời lượng, ngày đi, ngày về, tổng tiền và trạng thái).
  - Hiển thị trạng thái đơn:
    - `Pending`: Chờ quản trị viên xác nhận.
    - `Confirmed`: Đã được phê duyệt / xác nhận thành công.
    - `Completed`: Chuyến đi đã hoàn thành.
    - `Cancelled`: Đã bị hủy.
  - Cho phép người dùng hủy đơn đặt tour (`Cancel Booking`) khi đơn đang ở trạng thái `Pending`.

### 3.16. Admin Dashboard & Management (Quản trị hệ thống)

- **Thống kê (Dashboard Analytics):**
  - Hiển thị tổng số Destination, Tour, Booking và User.
  - Biểu đồ/Thống kê doanh thu và trạng thái các đơn đặt tour.
- **Quản lý Destinations (Destinations Management):**
  - Xem danh sách, tìm kiếm điểm đến.
  - Thêm mới, Chỉnh sửa thông tin điểm đến, Xóa điểm đến.
- **Quản lý Tours (Tours Management):**
  - Xem danh sách các Tour du lịch.
  - Tạo Tour mới gán với Destination.
  - Thiết lập/cập nhật các gói thời lượng (Duration Packages: số ngày, số đêm, lịch trình chi tiết từng ngày, giá vé theo gói), số chỗ tối đa, khung thời gian mở nhận khách (Available Date Range / Quanh năm).
  - Đóng/Mở trạng thái tour (`active` / `inactive`).
- **Quản lý Bookings (Bookings Management):**
  - Xem tất cả đơn đặt tour của mọi khách hàng trong hệ thống.
  - Lọc đơn theo trạng thái (`Pending`, `Confirmed`, `Completed`, `Cancelled`).
  - Phê duyệt đơn (`Pending` -> `Confirmed`), cập nhật đơn hủy hoặc hoàn tất.
- **Quản lý Contacts (Contacts Management):**
  - Xem danh sách liên hệ từ form liên hệ.
  - Cập nhật trạng thái liên hệ (`new`, `read`, `resolved`).
  - Xem chi tiết thông tin liên hệ.
- **Quản lý Guides (Guides Management):**
  - Xem danh sách guide.
  - Xem chi tiết thông tin guide
  - Thêm mới, Chỉnh sửa thông tin guide, Xóa guide.
  - Trong phần xem chi tiết guide, thêm danh sách điểm đến guide phụ trách
- **Quản lý bookingplans (Booking Plans Management):**
  - Xem danh sách các gói thời gian của tour.
  - Xem thông tin chi tiết của booking plan.
- **Quản lý collection:**
  - Xem danh sách các collection.
  - Xem thông tin các điểm đến trong collection.
  - Thêm danh sách điểm đến vào collection (nếu chưa có trong collection khác).
  - Xóa điểm đến khỏi collection.

### 3.17. AI Travel Assistant (Trợ lý Chatbot AI Tư vấn Du lịch)

- **Mục tiêu tính năng:**
  - Cung cấp trợ lý ảo AI thông minh hoạt động 24/7 giúp giải đáp thắc mắc, tư vấn điểm đến, gợi ý tour du lịch theo ngân sách và sở thích cá nhân, đồng thời lên lịch trình du lịch tùy chỉnh cho du khách.
- **Giao diện & Trải nghiệm người dùng (UI/UX):**
  - **Floating Action Button (Widget nổi):** Nút tròn biểu tượng Chatbot AI cố định ở góc dưới bên phải màn hình (Bottom-Right), có hiệu ứng animation thu hút sự chú ý và badge thông báo sẵn sàng hỗ trợ.
  - **Cửa sổ Chatbox thông minh (Chat Window / Drawer):**
    - Mở/đóng mượt mà khi người dùng tương tác.
    - Header hiển thị tên trợ lý "TravelTrail AI Assistant", trạng thái trực tuyến ("Online"), nút xóa lịch sử để bắt đầu cuộc trò chuyện mới (`New Chat`), và nút đóng/thu nhỏ.
    - Khung tin nhắn cuộn tự động (Auto-scroll), phân biệt rõ ràng tin nhắn của người dùng (User Message) và phản hồi từ AI (Assistant Message).
    - Hiệu ứng phản hồi đang nhập liệu (Typing / Loading indicator) sinh động trong lúc AI xử lý.
  - **Gợi ý câu hỏi nhanh (Quick Suggestion Chips / Prompts):**
    - Hiển thị danh sách câu hỏi mẫu phổ biến khi người dùng mới mở chatbox:
      - _"Gợi ý tour biển 3 ngày 2 đêm dưới 5 triệu"_
      - _"Mùa này nên đi du lịch ở đâu đẹp nhất?"_
      - _"Lên lịch trình khám phá Đà Nẵng 4N3Đ cho gia đình có trẻ nhỏ"_
      - _"Có tour trekking mạo hiểm nào dành cho người mới không?"_
    - Người dùng chỉ cần click vào chip gợi ý để gửi câu hỏi ngay lập tức.
  - **Thẻ Tour & Điểm đến tương tác nhúng trực tiếp (Rich Cards UI):**
    - Khi AI tư vấn về các tour hoặc điểm đến có sẵn trong hệ thống, tin nhắn phản hồi sẽ hiển thị kèm thẻ tương tác (Card) có ảnh đại diện, tên tour/điểm đến, giá tham khảo, thời lượng và nút bấm:
      - Nút _"Xem chi tiết"_: Điều hướng trực tiếp đến trang `/tours/:slug` hoặc `/destinations/:slug`.
      - Nút _"Đặt ngay"_: Mở trực tiếp form đặt tour với thông tin được điền sẵn.
- **Khả năng tư vấn & Kịch bản thông minh:**
  - **Tư vấn theo ngân sách (Budget-based Consultation):** Tiếp nhận mức kinh phí của khách hàng (ví dụ: 3 triệu, 5 triệu, 10 triệu/người) và đề xuất các tour hoặc điểm đến phù hợp nhất với túi tiền.
  - **Tư vấn theo thời gian & mùa (Seasonal & Duration Advice):** Đưa ra lời khuyên về thời điểm lý tưởng để ghé thăm từng vùng miền (mùa lúa chín Tây Bắc, mùa biển hè Miền Trung, mùa hoa tam giác mạch Hà Giang,...), đồng thời khớp với số ngày rảnh rỗi của khách (2N1Đ, 3N2Đ, 4N3Đ).
  - **Lập lịch trình du lịch thông minh (Smart Itinerary Planner):** Tự động xây dựng lịch trình chi tiết theo từng ngày (Sáng - Trưa - Chiều - Tối) bao gồm điểm tham quan, hoạt động trải nghiệm, quán ăn đặc sản địa phương và lưu ý di chuyển.
  - **Kết nối dữ liệu thực tế hệ thống (Context-aware / RAG):** Kết nối dữ liệu các Tours và Destinations hiện có trong cơ sở dữ liệu MongoDB để tư vấn thông tin chính xác, cập nhật về giá vé, lịch trình và trạng thái còn chỗ, giảm thiểu hiện tượng đưa ra thông tin không có thực.
  - **Xử lý ngôn ngữ tự nhiên:** Hỗ trợ tương tác bằng Tiếng Việt mượt mà, thân thiện, có khả năng nhớ ngữ cảnh các câu hỏi trước đó trong cùng phiên hội thoại.
- **Lưu trữ & Quản lý phiên hội thoại:**
  - Khách vãng lai (Guest): Lưu trữ lịch sử đoạn hội thoại tạm thời trong bộ nhớ trình duyệt (`sessionStorage` / `localStorage`).
  - Khách hàng đã đăng nhập (User): Lưu trữ phiên hội thoại vào cơ sở dữ liệu MongoDB (`ChatSession`), cho phép người dùng mở lại lịch sử tư vấn bất cứ lúc nào trên mọi thiết bị.
  - Tích hợp kiểm soát tần suất gửi tin (Rate Limiting) để bảo vệ tài nguyên hệ thống và tối ưu chi phí API.

---

## 4. Dữ liệu chính (Database Models / Schemas)

Hệ thống sử dụng MongoDB với các Collection chính sau:

### 4.1. User Schema (Tài khoản người dùng)

Lưu trữ thông tin tài khoản dùng để đăng nhập, xác thực và phân quyền trên hệ thống.

- `_id`: ObjectId – Khóa chính, mã định danh duy nhất của người dùng trong cơ sở dữ liệu.
- `name`: String (Required) – Họ và tên đầy đủ hiển thị của người dùng.
- `email`: String (Required, Unique) – Địa chỉ email tài khoản, dùng làm tên đăng nhập và nhận thông báo.
- `password`: String (Required, Hashed) – Mật khẩu tài khoản đã được băm an toàn bằng thuật toán `bcryptjs`.
- `role`: String (Enum: `'user'`, `'admin'`, Default: `'user'`) – Vai trò/quyền hạn (`user`: khách hàng, `admin`: quản trị viên).
- `avatar`: String – Đường dẫn URL hình ảnh đại diện (avatar) của tài khoản.
- `createdAt`: Date – Thời điểm tài khoản được khởi tạo trên hệ thống.
- `updatedAt`: Date – Thời điểm thông tin tài khoản được cập nhật lần cuối.

### 4.2. Customer Schema (Thông tin khách hàng thanh toán)

Lưu trữ thông tin cá nhân và chi tiết liên hệ của khách hàng khi điền thông tin thực hiện giao dịch thanh toán hóa đơn / đặt tour du lịch.

- `_id`: ObjectId – Khóa chính, mã định danh duy nhất của bản ghi khách hàng thanh toán.
- `userId`: ObjectId (Ref: User, Optional) – Mã người dùng liên kết (nếu khách hàng đã đăng nhập tài khoản).
- `fullName`: String (Required) – Họ và tên người thanh toán / người đại diện thanh toán đơn hàng.
- `email`: String (Required) – Địa chỉ email nhận hóa đơn xác nhận và vé du lịch điện tử.
- `phone`: String (Required) – Số điện thoại chính dùng để liên hệ xác minh và hỗ trợ thanh toán.
- `address`: String – Địa chỉ chi tiết của khách hàng (để liên hệ hoặc xuất hóa đơn).
- `city`: String – Tỉnh/Thành phố sinh sống của khách hàng.
- `country`: String – Quốc gia của khách hàng (Mặc định: `'Việt Nam'`).
- `idCardNumber`: String – Số CMND/CCCD hoặc Hộ chiếu của người đại diện thanh toán.
- `createdAt`: Date – Thời điểm tạo thông tin khách hàng thanh toán.
- `updatedAt`: Date – Thời điểm cập nhật thông tin khách hàng thanh toán lần cuối.

### 4.3. Destination Schema (Địa điểm du lịch)

Lưu trữ thông tin chi tiết về các địa danh, danh lam thắng cảnh và điểm đến du lịch.

- `_id`: ObjectId – Khóa chính, mã định danh duy nhất của điểm đến.
- `name`: String (Required) – Tên địa điểm du lịch (ví dụ: "Vịnh Hạ Long", "Đà Nẵng").
- `slug`: String (Required, Unique) – Chuỗi định danh thân thiện URL, tự động sinh từ `name` (ví dụ: `"vinh-ha-long"`, `"da-nang"`). Dùng để xây dựng đường dẫn trang chi tiết `/destinations/:slug`.
- `region`: String (Required) – Vùng miền địa lý (ví dụ: "Miền Bắc", "Miền Trung", "Miền Nam").
- `theme`: String – Chủ đề du lịch (ví dụ: "Biển đảo", "Văn hóa", "Nghỉ dưỡng", "Sinh thái").
- `image`: String – Đường dẫn URL ảnh đại diện chính của điểm đến.
- `location`: String – Vị trí chi tiết (Tỉnh/Thành phố, Quốc gia).
- `climate`: String – Thông tin về đặc điểm thời tiết và khí hậu tại điểm đến.
- `overview`: String – Bài viết tổng quan giới thiệu chi tiết về điểm đến.
- `attractions`: Array of Strings – Danh sách các điểm tham quan nổi tiếng tại địa điểm.
- `activities`: Array of Strings – Danh sách các hoạt động trải nghiệm đề xuất (ví dụ: lặn biển, đi cáp treo).
- `bestSeason`: String – Thời điểm/mùa đẹp nhất trong năm nên ghé thăm.
- `visitDuration`: String – Thời gian gợi ý lưu trú lý tưởng (ví dụ: "3 ngày 2 đêm").
- `budgetBand`: String – Mức chi phí ước tính (ví dụ: "Tiết kiệm", "Phổ thông", "Cao cấp").
- `transport`: String – Thông tin phương tiện di chuyển phổ biến đến điểm du lịch.
- `gallery`: Array of Objects `{ url: String, caption: String, alt: String, credit: String }` – Bộ sưu tập hình ảnh chất lượng cao về điểm đến.
- `relatedDestinations`: Array of ObjectIds (Ref: Destination) – Danh sách mã các điểm đến liên quan/gợi ý kèm theo.
- `createdAt`: Date – Thời điểm tạo thông tin điểm đến trên hệ thống.

### 4.4. Tour Schema (Chuyến du lịch / Tour)

Lưu trữ thông tin các gói tour du lịch được thiết kế và mở bán cho khách hàng. Hệ thống hỗ trợ danh sách các tùy chọn thời lượng (`durationOptions`) khác nhau trong cùng một Tour để khách hàng chủ động chọn thời lượng, xem lịch trình tương ứng và chọn ngày khởi hành linh hoạt.

- `_id`: ObjectId – Khóa chính, mã định danh duy nhất của gói tour du lịch.
- `destinationId`: ObjectId (Ref: Destination, Required) – Mã điểm đến tương ứng mà tour này khai thác.
- `title`: String (Required) – Tiêu đề/Tên gói tour (ví dụ: "Tour khám phá Vịnh Hạ Long").
- `slug`: String (Required, Unique) – Chuỗi định danh thân thiện URL, tự động sinh từ `title` (ví dụ: `"tour-kham-pha-vinh-ha-long"`). Dùng để xây dựng đường dẫn trang chi tiết `/tours/:slug`.
- `overview`: String – Giới thiệu tổng quan về hành trình và điểm đặc sắc của tour.
- `durationOptions`: Array of Objects (Required) – Danh sách các tùy chọn thời lượng và mức giá tương ứng để khách hàng lựa chọn:

  ```json
  "durationOptions": [
    {
      "days": 2,
      "nights": 1,
      "price": 3000000
    },
    {
      "days": 3,
      "nights": 2,
      "price": 4500000
    },
    {
      "days": 4,
      "nights": 3,
      "price": 6000000
    }
  ]
  ```

  - `days`: Number (Required) – Số ngày của chuyến đi (ví dụ: 2, 3, 4).
  - `nights`: Number (Required) – Số đêm của chuyến đi (ví dụ: 1, 2, 3).
  - `price`: Number (Required) – Mức giá vé niêm yết cho 1 khách hàng áp dụng cho thời lượng này (đơn vị: VNĐ).

- `departureDates`: Array of Dates – Danh sách các ngày khởi hành dự kiến mở bán của tour để khách hàng tự do lựa chọn khi đặt tour (hoặc chọn ngày phù hợp).
- `itinerary`: Array of Objects `{ day: Number, title: String, description: String }` – Lịch trình chi tiết các hoạt động diễn ra theo từng ngày (Day 1, Day 2, Day 3,...). Khi khách hàng chọn tùy chọn trong `durationOptions` (ví dụ: 2 ngày 1 đêm), hệ thống sẽ hiển thị lịch trình tương ứng trong số ngày của duration đó (Day 1 đến Day 2).
- `maxPassengers`: Number (Required) – Số lượng hành khách tối đa nhận phục vụ trong một đợt khởi hành (sức chứa của tour).
- `availableSeats`: Number – Số chỗ còn trống khả dụng của tour:
  - Khi ban đầu chưa có ai đặt tour: `availableSeats = maxPassengers`.
  - Khi khách hàng đã đặt tour: `availableSeats = maxPassengers - [số lượng người đã đặt trong tour đó]`.
  - Khi `availableSeats = 0`: Tour ở trạng thái hết chỗ (Sold Out), hệ thống chặn không cho phép đặt thêm vượt quá số chỗ còn trống.
- `includes`: Array of Strings – Danh sách các dịch vụ bao gồm trong giá tour (khách sạn, xe đưa đón, ăn uống,...).
- `excludes`: Array of Strings – Danh sách các chi phí không bao gồm trong giá tour (chi phí cá nhân, tiền tip,...).
- `status`: String (Enum: `'active'`, `'inactive'`, Default: `'active'`) – Trạng thái hoạt động (`active`: đang mở bán, `inactive`: tạm ngưng).
- `createdAt`: Date – Thời điểm đăng tải tour lên hệ thống.

### 4.5. Booking Schema (Đơn đặt chuyến du lịch)

Quản lý thông tin đơn đặt tour và trạng thái giao dịch đặt chỗ của khách hàng với tùy chọn thời lượng (`selectedDuration`) và ngày khởi hành linh hoạt do khách tự chọn.

- `_id`: ObjectId – Khóa chính, mã định danh duy nhất của đơn đặt tour.
- `userId`: ObjectId (Ref: User, Required) – Mã tài khoản người dùng thực hiện thao tác đặt tour.
- `customerId`: ObjectId (Ref: Customer, Optional) – Mã thông tin khách hàng thanh toán tương ứng cho đơn hàng này.
- `tourId`: ObjectId (Ref: Tour, Required) – Mã tour du lịch được lựa chọn đặt chỗ.
- `selectedDuration`: Object (Required) – Tùy chọn thời lượng mà khách hàng đã lựa chọn từ `durationOptions` của tour:
  - `days`: Number (Required) – Số ngày của chuyến đi (ví dụ: 3).
  - `nights`: Number (Required) – Số đêm của chuyến đi (ví dụ: 2).
  - `price`: Number (Required) – Đơn giá áp dụng cho 1 khách hàng tại thời điểm đặt (ví dụ: 4500000).
- `bookingDate`: Date (Default: Now) – Ngày giờ hệ thống ghi nhận đơn đặt tour.
- `departureDate`: Date (Required) – Ngày khởi hành chuyến đi do khách hàng tự do chọn từ danh sách ngày khởi hành của tour hoặc Date Picker (nằm trong khung thời gian khả dụng của tour).
- `endDate`: Date – Ngày kết thúc chuyến đi (tự động tính toán: `departureDate + (selectedDuration.days - 1)` ngày).
- `numberOfGuests`: Object `{ adults: Number, children: Number }` – Số lượng hành khách tham gia (phân định Người lớn và Trẻ em).
- `totalAmount`: Number (Required) – Tổng số tiền hóa đơn cần thanh toán (tự động tính: `selectedDuration.price * số lượng khách`, đơn vị: VNĐ).
- `paymentMethod`: String (Enum: `'cash'`, `'credit_card'`, `'bank_transfer'`, `'e_wallet'`, Default: `'cash'`) – Phương thức thanh toán khách hàng lựa chọn khi thực hiện đặt tour này (`cash`: thanh toán tiền mặt trực tiếp tại quầy, `credit_card`: thanh toán qua thẻ tín dụng/ghi nợ, `bank_transfer`: chuyển khoản ngân hàng, `e_wallet`: thanh toán qua ví điện tử như MoMo, ZaloPay, VNPay).
- `paymentStatus`: String (Enum: `'pending'`, `'confirmed'`, `'completed'`, Default: `'pending'`) – Trạng thái thanh toán hóa đơn (`pending`: chờ duyệt, `confirmed`: đã xác nhận, `completed`: hoàn thành).
- `bookingStatus`: String (Enum: `'pending'`, `'confirmed'`, `'completed'`, `'cancelled'`, Default: `'pending'`) – Trạng thái xử lý đơn hàng (`pending`: chờ duyệt, `confirmed`: đã xác nhận, `completed`: hoàn thành, `cancelled`: đã hủy).
- `notes`: String – Ghi chú thêm của khách hàng khi đặt chỗ (ví dụ: ăn chay, phòng tầng cao).
- `guide_id`: ObjectId (Ref: Guide, Optional) – Mã hướng dẫn viên mà khách hàng mong muốn được phục vụ cho chuyến đi này (nếu có).
- `createdAt`: Date – Thời điểm tạo bản ghi đơn đặt tour.
- `updatedAt`: Date – Thời điểm cập nhật trạng thái đơn hàng gần nhất.

### 4.6. BookingPlan Schema (Danh sách đoàn khởi hành theo ngày)

Quản lý thông tin danh sách toàn bộ các thành viên/hành khách tham gia chung một đợt khởi hành của một Tour du lịch cụ thể theo ngày đi và thời lượng.

- `_id`: ObjectId – Khóa chính, mã định danh duy nhất của bản ghi đoàn khởi hành.
- `tourId`: ObjectId (Ref: Tour, Required) – Mã tour du lịch được khởi hành.
- `duration`: Object `{ days: Number, nights: Number }` (Optional) – Thời lượng chuyến đi của đoàn tương ứng.
- `departureDate`: Date (Required) – Ngày khởi hành thực tế cụ thể của đoàn khách.
- `endDate`: Date – Ngày kết thúc chuyến đi.
- `guideId`: ObjectId (Ref: Guide, Optional) – Mã hướng dẫn viên được phân công phụ trách đoàn.
- `totalPassengers`: Number – Tổng số lượng hành khách thực tế tham gia chuyến khởi hành này.
- `bookings`: Array of ObjectIds (Ref: Booking) – Danh sách mã các đơn hàng booking tham gia vào chuyến đi này.
- `passengersList`: Array of Objects `{ bookingId: ObjectId, fullName: String, gender: String, dob: Date, idCardNumber: String, passengerType: String, phone: String }` – Danh sách tổng hợp toàn bộ hành khách khởi hành cùng đợt để quản lý đoàn, điểm danh và điều hành tour.
- `status`: String (Enum: `'scheduled'`, `'in_progress'`, `'completed'`, `'cancelled'`, Default: `'scheduled'`) – Trạng thái chuyến đi (`scheduled`: đã lên lịch, `in_progress`: đang diễn ra, `completed`: hoàn thành, `cancelled`: đã hủy).
- `createdAt`: Date – Thời điểm khởi tạo danh sách đoàn.
- `updatedAt`: Date – Thời điểm cập nhật thông tin đoàn.

### 4.7. Favourite Schema (Địa điểm yêu thích)

Lưu trữ thông tin các địa điểm du lịch được người dùng đánh dấu lưu vào danh sách yêu thích.

- `_id`: ObjectId – Khóa chính, mã định danh duy nhất của bản ghi yêu thích.
- `userId`: ObjectId (Ref: User, Required) – Mã người dùng thực hiện thao tác lưu địa điểm.
- `destinationId`: ObjectId (Ref: Destination, Required) – Mã điểm đến du lịch được đánh dấu yêu thích.
- `createdAt`: Date – Thời điểm người dùng nhấn nút lưu yêu thích.

### 4.8. Guide Schema (Hướng dẫn viên du lịch)

Lưu trữ thông tin hồ sơ của các hướng dẫn viên du lịch đồng hành cùng du khách.

- `_id`: ObjectId – Khóa chính, mã định danh duy nhất của hướng dẫn viên.
- `name`: String – Họ và tên của hướng dẫn viên.
- `slug`: String (Required, Unique) – Chuỗi định danh thân thiện URL, tự động sinh từ `name` (ví dụ: `"tran-minh-khoa"`). Dùng để xây dựng đường dẫn trang hồ sơ `/guides/:slug`.
- `background`: String – Tóm tắt quá trình học tập, làm việc và kinh nghiệm tích lũy.
- `specialisation`: String – Lĩnh vực hướng dẫn chuyên sâu (ví dụ: "Chuyên tour mạo hiểm", "Chuyên tour văn hóa lịch sử").
- `biography`: String – Bài giới thiệu tiểu sử cá nhân và phong cách dẫn đoàn.
- `languages`: Array of Strings – Danh sách các ngôn ngữ có thể sử dụng giao tiếp (ví dụ: `["Tiếng Việt", "Tiếng Anh"]`).
- `destinations`: Array of ObjectIds (Ref: Destination) – Danh sách các điểm đến mà hướng dẫn viên phụ trách chính.

### 4.9. Collection Schema (Bộ sưu tập điểm đến)

Gom nhóm các địa điểm du lịch theo chủ đề nổi bật hoặc bộ sưu tập theo mùa.

- `_id`: ObjectId – Khóa chính, mã định danh duy nhất của bộ sưu tập.
- `name`: String – Tên bộ sưu tập (ví dụ: "Biển xanh hè 2026", "Điểm đến Di sản Mộc mạc").
- `slug`: String (Required, Unique) – Chuỗi định danh thân thiện URL, tự động sinh từ `name` (ví dụ: `"bien-xanh-he-2026"`). Dùng để xây dựng đường dẫn trang bộ sưu tập `/collections/:slug`.
- `description`: String – Đoạn văn mô tả nội dung và thông điệp của bộ sưu tập.
- `destinations`: Array of ObjectIds (Ref: Destination) – Danh sách mã các điểm đến thuộc bộ sưu tập.

### 4.10. ChatSession Schema (Lịch sử hội thoại Chatbot AI)

Lưu trữ các phiên hội thoại tư vấn du lịch giữa người dùng và Trợ lý ảo AI, hỗ trợ duy trì ngữ cảnh và cho phép người dùng xem lại lịch sử tư vấn.

- `_id`: ObjectId – Khóa chính, mã định danh duy nhất của phiên trò chuyện.
- `userId`: ObjectId (Ref: User, Optional) – Mã tài khoản người dùng đã đăng nhập (để trống nếu là khách vãng lai).
- `sessionId`: String (Required, Indexed) – Chuỗi định danh phiên làm việc (UUID/Session Token) để nhận diện khách truy cập.
- `title`: String – Tiêu đề tóm tắt chủ đề tư vấn (tự động trích xuất từ câu hỏi đầu tiên, ví dụ: "Tư vấn tour Đà Nẵng 3N2Đ hè").
- `messages`: Array of Objects – Danh sách các lượt tin nhắn trong phiên:
  - `sender`: String (Enum: `'user'`, `'assistant'`, `'system'`, Required) – Đối tượng gửi tin.
  - `content`: String (Required) – Nội dung văn bản trao đổi (hỗ trợ Markdown).
  - `suggestedTours`: Array of ObjectIds (Ref: Tour) – Danh sách các tour được AI đề xuất trong phản hồi này (nếu có).
  - `suggestedDestinations`: Array of ObjectIds (Ref: Destination) – Danh sách điểm đến được AI đề xuất (nếu có).
  - `timestamp`: Date (Default: Now) – Thời điểm phát sinh tin nhắn.
- `context`: Object – Thông tin ngữ cảnh nhu cầu du khách do AI nhận diện và trích xuất:
  - `budget`: Number – Mức ngân sách dự kiến (VNĐ).
  - `durationDays`: Number – Số ngày mong muốn đi du lịch.
  - `travelTheme`: String – Chủ đề yêu thích (biển đảo, sinh thái, khám phá văn hóa,...).
  - `targetRegion`: String – Vùng miền quan tâm (Miền Bắc, Miền Trung, Miền Nam).
- `status`: String (Enum: `'active'`, `'archived'`, Default: `'active'`) – Trạng thái của phiên hội thoại.
- `createdAt`: Date – Thời điểm khởi tạo cuộc trò chuyện.
- `updatedAt`: Date – Thời điểm gửi tin nhắn gần nhất.

### 4.11. Contact Schema (Yêu cầu liên hệ)

Lưu trữ các yêu cầu liên hệ do người dùng/khách truy cập gửi qua form liên hệ trên website.

- `_id`: ObjectId – Khóa chính, mã định danh duy nhất của yêu cầu liên hệ.
- `name`: String (Required) – Họ và tên người gửi yêu cầu liên hệ.
- `email`: String (Required) – Địa chỉ email để nhận phản hồi, phải đúng định dạng email hợp lệ.
- `phone`: String (Optional) – Số điện thoại liên hệ (không bắt buộc).
- `subject`: String (Optional) – Chủ đề / tiêu đề của yêu cầu liên hệ (ví dụ: "Hỏi về tour Đà Lạt", "Báo lỗi hệ thống").
- `message`: String (Required) – Nội dung chi tiết của tin nhắn liên hệ.
- `status`: String (Enum: `'new'`, `'read'`, `'resolved'`, Default: `'new'`) – Trạng thái xử lý yêu cầu (`new`: chưa đọc, `read`: đã đọc, `resolved`: đã giải quyết).
- `createdAt`: Date – Thời điểm gửi yêu cầu liên hệ.
- `updatedAt`: Date – Thời điểm cập nhật trạng thái xử lý gần nhất.

**API Endpoints (Contact):**

- `POST /api/v1/contacts` – Gửi yêu cầu liên hệ mới (Public, không cần xác thực).
- `GET /api/v1/contacts` – Xem danh sách yêu cầu liên hệ (Admin only, hỗ trợ filter theo `status`, tìm kiếm `search`, phân trang).
- `PUT /api/v1/contacts/:id/status` – Cập nhật trạng thái xử lý yêu cầu liên hệ (Admin only).
- `DELETE /api/v1/contacts/:id` – Xóa yêu cầu liên hệ (Admin only).

---

## 5. Lưu trữ dữ liệu & Cơ sở dữ liệu (Storage & Database)

- **Cơ sở dữ liệu tập trung (MongoDB Backend):**
  - Lưu trữ toàn bộ dữ liệu chính của hệ thống bao gồm Người dùng, Khách hàng thanh toán, Điểm đến, Tour du lịch, Đơn đặt tour, Địa điểm yêu thích và Lịch sử hội thoại Chatbot AI.
  - Sử dụng Mongoose ODM trong Node.js Express để định nghĩa Schema, Validate dữ liệu và truy vấn dữ liệu hiệu quả.

- **Browser Local Storage & Client Session:**
  - Lưu trữ JWT Token (`accessToken`) để duy trì trạng thái đăng nhập phía Client.
  - Tạm lưu trạng thái UI (Bộ lọc, Theme, Tạm lưu Favourites đối với Guest chưa đăng nhập trước khi sync lên server).
  - Tạm lưu `sessionId` và tin nhắn Chatbot AI tạm thời đối với khách truy cập chưa đăng nhập.

---

## 6. Responsive và Accessibility

Website hoạt động tối ưu trên:

- Desktop (1200px trở lên)
- Tablet (768px - 1199px)
- Mobile (dưới 768px)

Yêu cầu kĩ thuật:

- Không có hiện tượng tràn khung ngang (horizontal overflow).
- Hỗ trợ điều hướng bằng bàn phím (Keyboard navigation).
- Hiển thị rõ trạng thái con trỏ/focus (Visible focus states).
- Hình ảnh có đầy đủ thuộc tính `alt` tương ứng.
- Menu mobile co dãn mượt mà, tiện lợi cho thao tác cảm ứng.

---

## 7. Công nghệ (Tech Stack)

### 7.1. Front-end

- **Framework/Library:** React 18.x (SPA), TailwindCSS
- **Language & Styles:** HTML5, CSS3, JavaScript ES6+
- **Routing:** React Router DOM (Single Page Navigation)
- **HTTP Client:** Axios / Fetch API (kết nối REST API Backend)
- **AI Chatbot UI:** Floating Action Widget, Markdown Message Renderer, Typing Animation, Card Carousel/Rich Cards

### 7.2. Back-end

- **Runtime Environment:** Node.js
- **Framework:** Express.js (Xây dựng RESTful APIs)
- **Authentication & Security:** JSON Web Token (JWT), HttpOnly Cookie, `bcryptjs` (băm mật khẩu), CORS middleware
- **AI / LLM Integration:** Tích hợp AI API (Google Gemini API / OpenAI API), Prompt Engineering kết hợp RAG (Retrieval-Augmented Generation) lấy dữ liệu điểm đến & tour trực tiếp từ MongoDB

### 7.3. Database

- **Database Server:** MongoDB (MongoDB Atlas hoặc Local Server)
- **Object Data Modeling (ODM):** Mongoose

### 7.4. Tools & Environment

- **IDE:** Visual Studio Code / Antigravity IDE
- **API Testing:** Postman / Thunder Client
- **Design & UI Assistant:** Stitch AI

---

## 8. Phạm vi triển khai

### 8.1. Có (In Scope)

- Full-stack Web Application (React SPA + Node.js Express Backend API + MongoDB).
- Hệ thống Xác thực & Phân quyền (Đăng ký, Đăng nhập, JWT Authorization, User Profile, Đổi mật khẩu, Role User/Admin).
- Chức năng Đặt chuyến du lịch (Tour & Travel Booking) cho khách hàng.
- Chatbot AI Tư vấn Du lịch (AI Travel Assistant): Gợi ý điểm đến, đề xuất tour theo ngân sách, lập lịch trình tự động và hỗ trợ giải đáp 24/7.
- Trang Quản trị Admin (Dashboard thống kê, CRUD Destinations, CRUD Tours, Quản lý đơn Bookings, Quản lý Tour của Guide).
- Tìm kiếm & Lọc nâng cao (Destinations & Tours).
- Chi tiết điểm đến (Destination Details) & Chi tiết tour (Tour Details).
- Bộ sưu tập (Collections), Bộ ảnh (Gallery), Hướng dẫn viên (Travel Guides).
- Yêu thích (Favourites) đồng bộ MongoDB REST API.
- Xem chi tiết tour đã đặt & lịch trình chuyến đi (Trip Planner).
- Trang Contact & About.
- Responsive UI hoàn chỉnh trên Desktop, Tablet, Mobile.
- Quản lý phiên làm việc Client với Cookie & JWT Token.

### 8.2. Không có (Out of Scope)

- Tích hợp cổng thanh toán trực tuyến thực tế kết nối ngân hàng/thẻ quốc tế (chỉ sử dụng mô phỏng trạng thái thanh toán).
- Định vị vị trí thời gian thực (Live GPS Real-time Transport Tracking).
- Dịch vụ gửi Email tự động thực tế (dùng log / notification mô phỏng).
