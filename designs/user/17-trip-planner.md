# Màn hình 17: Chi tiết Chuyến đi Đã Đặt – Kế hoạch Chuyến đi (Trip Planner / Booked Tour Details)

## 1. Tổng quan màn hình
- **Tên file:** `17-trip-planner.md`
- **Mục đích:** Cung cấp cho khách hàng (Customer) giao diện trực quan, toàn diện để theo dõi thông tin chi tiết tour du lịch đã đặt và kế hoạch chuyến đi (Trip Planner). Trang tổng hợp đầy đủ các thông số booking (Tên tour, gói thời lượng số ngày/số đêm, ngày khởi hành, ngày kết thúc, số lượng hành khách, phương thức thanh toán, trạng thái đơn) cùng **Lịch trình chuyến đi chi tiết theo từng ngày** (thời gian, địa điểm, các hoạt động trải nghiệm thực tế) khớp chính xác với gói thời lượng mà khách hàng đã lựa chọn khi đặt tour.
- **Quyền truy cập:** Khách hàng đã đăng nhập (`user` role) và là chủ sở hữu của đơn đặt tour đó (hoặc `admin` tra cứu).
- **Đường dẫn (URL):** `/trip-planner/:bookingId` (hoặc `/my-bookings/:bookingId`)

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

Giao diện áp dụng phong cách thiết kế hiện đại tông **Xanh - Trắng** (Primary Ocean Blue `#0284C7`, Sapphire Blue `#0F52BA`, Pure White `#FFFFFF`, Soft Ice Blue `#F0F6FA`), kết hợp hiệu ứng kính mờ (Glassmorphism), bo góc mềm mại `rounded-2xl` và bóng đổ dịu nhẹ `shadow-soft`.

Header đồng bộ `<UnifiedHeader />` cố định ở trên cùng và Footer `<UnifiedFooter />` ở cuối trang.

### 2.1. Thanh Điều Hướng (Breadcrumb) & Trip Hero Banner
- **Breadcrumb:** `Trang chủ` > `Đơn đặt tour của tôi` > `Chi tiết chuyến đi (Trip Planner)`.
- **Banner Chuyến đi (Trip Hero Card):**
  - Hình ảnh bìa chất lượng cao của Điểm đến / Tour du lịch với lớp phủ gradient tối (`from-slate-950/80 via-slate-900/60 to-transparent`).
  - **Tên Tour du lịch (`title`):** Font chữ tiêu đề lớn H1 (ví dụ: *"Tour Khám Phá Di Sản Miền Trung: Đà Nẵng - Hội An - Huế"*).
  - **Mã đơn đặt tour (Booking Code):** Badge nổi bật (ví dụ: `#BK-20261028-7821`) kèm nút bấm *"Sao chép mã đơn"*.
  - **Nhóm Badge Trạng thái & Gói thời lượng:**
    - **Trạng thái Đơn (`bookingStatus`):**
      - `Chờ xác nhận (Pending)` - Badge Vàng cam `#F59E0B`.
      - `Đã xác nhận (Confirmed)` - Badge Xanh ngọc `#10B981` kèm icon check.
      - `Đang diễn ra (In Progress)` - Badge Xanh biển `#0284C7`.
      - `Đã hoàn thành (Completed)` - Badge Sapphire `#0F52BA`.
      - `Đã hủy (Cancelled)` - Badge Đỏ `#EF4444`.
    - **Trạng thái Thanh toán (`paymentStatus`):** Badge `Chờ thanh toán` hoặc `Đã thanh toán`.
    - **Gói thời lượng đã chọn (`selectedDuration`):** Badge hiển thị số ngày số đêm (ví dụ: `3 Ngày 2 Đêm` hoặc `4 Ngày 3 Đêm`).
  - **Cụm Nút Hành Động Nhanh (Hero Action Bar):**
    - **Nút "Tải / In Vé Điện Tử (E-Voucher PDF)":** Cho phép khách hàng lưu hoặc in vé xác nhận chuyến đi kèm mã QR.
    - **Nút "Hỏi Trợ Lý AI về Chuyến Đi":** Mở Chatbot AI với ngữ cảnh chuyến đi đã đặt để được gợi ý chuẩn bị hành lý, trang phục, mẹo thời tiết địa phương.
    - **Nút "Hủy Đơn Đặt Tour":** Chỉ hiển thị khi trạng thái đơn là `Pending`, mở Modal xác nhận hủy tour kèm lý do.

---

### 2.2. Khối Thông Tin Chi Tiết Chuyến Đi Đã Đặt (Booked Trip Specifications Card)
Thẻ tóm tắt thông số chuyến đi được trình bày dạng lưới 4 cột (Desktop) / 2 cột (Tablet) / 1 cột (Mobile) với icon minh họa trực quan:

1. **Thời gian Khởi hành & Kết thúc (Departure & End Date):**
   - **Ngày khởi hành (`departureDate`):** Hiển thị rõ thứ, ngày, tháng, năm (ví dụ: *Thứ Bảy, 18/07/2026*).
   - **Ngày kết thúc (`endDate`):** Tự động tính toán theo công thức `departureDate + (selectedDuration.days - 1)` (ví dụ: *Thứ Hai, 20/07/2026*).
   - **Hộp đếm ngược (Trip Countdown):** Ví dụ: *"Còn 6 ngày nữa đến ngày khởi hành!"*.
2. **Gói Thời lượng & Địa danh (Duration & Destination):**
   - Số ngày & số đêm: Ví dụ: `3 ngày / 2 đêm`.
   - Điểm đến chính: Liên kết xem lại trang giới thiệu điểm đến `/destinations/:slug`.
3. **Số lượng Hành khách tham gia (`numberOfGuests`):**
   - Tổng số khách: Ví dụ: `3 hành khách`.
   - Chi tiết: `2 Người lớn`, `1 Trẻ em` (kèm đơn giá áp dụng của gói).
4. **Thông tin Thanh toán & Chi phí (Payment Details):**
   - **Phương thức thanh toán (`paymentMethod`):**
     - Tiền mặt tại quầy (`cash`)
     - Chuyển khoản ngân hàng (`bank_transfer`)
     - Thẻ tín dụng/ghi nợ quốc tế (`credit_card`)
     - Ví điện tử MoMo/ZaloPay (`e_wallet`)
   - **Tổng tiền thanh toán (`totalAmount`):** Chữ số lớn nổi bật màu Xanh Biển (ví dụ: `13.500.000 đ`).
5. **Hướng dẫn viên Phụ trách (Assigned Guide):**
   - Hiển thị Avatar tròn, Họ và tên hướng dẫn viên, Số điện thoại liên hệ khẩn cấp, Ngôn ngữ giao tiếp (nếu đã phân công, hoặc badge *"Hệ thống đang sắp xếp HDV"*).
6. **Thông tin Người đại diện đặt tour:**
   - Họ tên, Email nhận vé điện tử, Số điện thoại chính.
7. **Danh sách Hành khách trong đoàn (Passenger Roster):**
   - Danh sách chi tiết họ tên, ngày sinh, số CCCD/Passport của từng khách đi cùng.
8. **Ghi chú đặc biệt (`notes`):**
   - Các yêu cầu riêng của khách (ví dụ: *"Gia đình có 1 người ăn chay", "Yêu cầu phòng ngủ tầng cao view biển"*).

---

### 2.3. Khối Kế Hoạch Lịch Trình Chi Tiết Từng Ngày (Day-by-Day Trip Itinerary Planner)
Đây là khu vực trọng tâm của tính năng **Trip Planner** theo đúng yêu cầu phân tích nghiệp vụ (`analyst.md` mục 3.12):

#### A. Thanh Chuyển Ngày Lịch Trình (Day Selection Tabs)
- Các nút tab ngang dạng viên thuốc (Pills):
  - `Tất cả các ngày`
  - `Ngày 1: Đón khách & Khởi hành`
  - `Ngày 2: Trải nghiệm & Khám phá`
  - `Ngày 3: Mua sắm & Tạm biệt`
  - ... (Hiển thị số ngày tương ứng chính xác theo gói `selectedDuration.days`).

#### B. Dòng Thời Gian Lịch Trình Tương Tác (Vertical Interactive Timeline)
Mỗi ngày hiển thị một thẻ lịch trình chi tiết (Day Plan Card) gồm các thành phần:
- **Cột Mốc Ngày (Day Badge & Date):**
  - Vòng tròn đánh số ngày (Day 1, Day 2...) với nền Xanh Biển `#0284C7`.
  - Ngày cụ thể theo lịch thực tế của khách hàng (ví dụ: *Thứ Bảy, 18/07/2026*).
- **Tiêu đề Chặng Đi (`title`):**
  - Tên hoạt động chủ đạo trong ngày (ví dụ: *"Ngày 1: Đón đoàn tại sân bay – Bán đảo Sơn Trà – Khám phá Phố cổ Hội An về đêm"*).
- **Phân Khúc Thời Gian & Hoạt Động Chi Tiết (Time-slot Breakdown):**
  - **Buổi Sáng (Morning - 08:00 đến 11:30):**
    - Đón khách tại điểm hẹn / sân bay, xe đưa đón chuyên dụng.
    - Điểm tham quan đầu tiên, hoạt động chụp ảnh ngắm cảnh.
  - **Buổi Trưa (Noon - 11:30 đến 13:30):**
    - Dùng bữa trưa tại nhà hàng đặc sản địa phương (mô tả thực đơn tiêu biểu).
    - Về khách sạn nhận phòng, nghỉ ngơi.
  - **Buổi Chiều (Afternoon - 14:00 đến 18:00):**
    - Trải nghiệm danh lam thắng cảnh chính, hoạt động giải trí (chèo kayak, lặn biển, đi cáp treo...).
  - **Buổi Tối (Evening - 18:30 đến 21:30):**
    - Bữa tối ẩm thực địa phương, dạo chợ đêm hoặc thời gian tự do khám phá.
- **Nội dung Mô tả Trải nghiệm (`description`):** Toàn văn đoạn văn hướng dẫn chi tiết về chặng đi, phương tiện di chuyển, văn hóa điểm đến.
- **Lưu ý Quan trọng trong Ngày (Important Tips):**
  - Badge nhắc nhở: trang phục phù hợp (áo dài, giày thể thao), kem chống nắng, vé vào cổng đã bao gồm.
- **Hình ảnh Danh thắng Minh họa (Attraction Snapshots):** Thư viện 2-3 hình ảnh thực tế của các danh thắng sẽ ghé thăm trong ngày đó.

---

### 2.4. Khối Dịch Vụ Đi Kèm (Includes & Excludes Checklist)
Hiển thị danh sách dịch vụ minh bạch để du khách an tâm chuẩn bị:
- **Dịch vụ Đã Bao Gồm (Includes - Icon Tích Xanh ✓):**
  - Xe ô tô du lịch đời mới máy lạnh đưa đón suốt tuyến.
  - Khách sạn tiêu chuẩn phòng đôi đầy đủ tiện nghi.
  - Các bữa ăn theo tiêu chuẩn chương trình.
  - Vé tham quan vào cổng các danh thắng trong lịch trình.
  - Hướng dẫn viên du lịch chuyên nghiệp, nhiệt tình.
  - Bảo hiểm du lịch trọn gói mức bồi thường cao.
  - Nước uống đóng chai, khăn lạnh mỗi ngày.
- **Chi Phí Không Bao Gồm (Excludes - Icon Gạch Đỏ ✕):**
  - Chi phí cá nhân: giặt ủi, điện thoại, thức uống ngoài thực đơn.
  - Vé tham quan các khu giải trí ngoài chương trình.
  - Tiền bồi dưỡng (Tip) cho lái xe và hướng dẫn viên.
  - Thuế VAT (nếu có yêu cầu xuất hóa đơn đỏ).

---

### 2.5. Khối Lưu Ý Chuyến Đi & Hỗ Trợ Khẩn Cấp (Travel Guidelines & Support)
- **Giấy tờ tùy thân:** Nhắc nhở mang theo CCCD/Hộ chiếu gốc còn hạn sử dụng.
- **Hành lý gợi ý:** Quần áo nhẹ mát mùa hè, đồ bơi, sạc dự phòng, thuốc men cá nhân.
- **Hotline Hỗ Trợ 24/7:**
  - Số điện thoại điều hành tour TravelTrail.
  - Tổng đài cứu hộ du lịch địa phương.

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

Màn hình giao tiếp với Backend Node.js Express RESTful API:

- **Lấy Thông tin Chi tiết Đơn đặt tour & Lịch trình:** `GET /api/v1/bookings/:id`
  - Headers: `Authorization: Bearer <JWT_USER_TOKEN>`
  - Phía Backend thực hiện Populate:
    - `tourId`: Tiêu đề tour, hình ảnh, slug, toàn bộ mảng `itinerary`, `includes`, `excludes`.
    - `destinationId`: Tên địa danh, vùng miền, thời tiết.
    - `guide_id`: Họ tên, số điện thoại, avatar, ngôn ngữ của hướng dẫn viên được phân công.
    - `customerId`: Họ tên, email, số điện thoại người thanh toán.
  - **Logic lọc lịch trình:** Phía Client/Backend chỉ hiển thị các ngày trong `itinerary` có `day <= selectedDuration.days` tương ứng đúng gói thời lượng khách đã đặt.
  - Response mẫu:
    ```json
    {
      "success": true,
      "data": {
        "_id": "662a98f1...",
        "bookingCode": "BK-20261028-7821",
        "bookingStatus": "confirmed",
        "paymentStatus": "completed",
        "paymentMethod": "bank_transfer",
        "departureDate": "2026-07-18T00:00:00.000Z",
        "endDate": "2026-07-20T00:00:00.000Z",
        "selectedDuration": {
          "days": 3,
          "nights": 2,
          "price": 4500000
        },
        "numberOfGuests": {
          "adults": 2,
          "children": 1
        },
        "totalAmount": 13500000,
        "notes": "Yêu cầu phòng ngủ view biển",
        "tour": {
          "_id": "661e89b2...",
          "title": "Tour Khám Phá Di Sản Miền Trung",
          "slug": "tour-kham-pha-di-san-mien-trung",
          "image": "https://images.unsplash.com/photo-...",
          "itinerary": [
            {
              "day": 1,
              "title": "Đón khách – Bán đảo Sơn Trà – Phố cổ Hội An",
              "description": "Xe và HDV đón quý khách tại sân bay Đà Nẵng..."
            },
            {
              "day": 2,
              "title": "KDL Bà Nà Hills – Cầu Vàng – Tắm biển Mỹ Khê",
              "description": "Khởi hành đi Bà Nà Hills, trải nghiệm cáp treo đạt 4 kỷ lục..."
            },
            {
              "day": 3,
              "title": "Cố đô Huế – Đại Nội – Chùa Thiên Mụ – Tiễn đoàn",
              "description": "Khởi hành xuyên hầm Hải Vân đến Huế, tham quan di sản..."
            }
          ],
          "includes": ["Xe đưa đón", "Khách sạn 4 sao", "Các bữa ăn"],
          "excludes": ["Chi phí cá nhân", "Tiền tip"]
        },
        "guide": {
          "_id": "661a33f4...",
          "name": "Trần Minh Khoa",
          "phone": "0987654321",
          "languages": ["Tiếng Việt", "Tiếng Anh"]
        }
      }
    }
    ```
- **Hủy Đơn Đặt Tour:** `PUT /api/v1/bookings/:id/cancel`
  - Headers: `Authorization: Bearer <JWT_USER_TOKEN>`
  - Payload: `{ "reason": "Có việc gia đình đột xuất" }`
  - Điều kiện: Chỉ cho phép hủy khi `bookingStatus === 'pending'`. Sau khi hủy thành công, trạng thái chuyển thành `cancelled` và hiển thị Toast thông báo.

---

## 4. Xử lý Trạng thái & Trải nghiệm Người dùng (UX/UI & Responsive)

- **Kiểm tra Quyền sở hữu (Authorization Check):**
  - Nếu người dùng truy cập một `bookingId` không thuộc tài khoản của họ và không phải Admin, hệ thống hiển thị thông báo lỗi 403 Forbidden kèm nút quay về trang `15-my-bookings.md`.
- **Hiệu ứng Tải Dữ liệu (Skeleton Loading):**
  - Hiển thị Skeleton shimmer xám nhạt cho Banner, Thẻ tóm tắt và Dòng thời gian Timeline trong thời gian chờ API phản hồi.
- **In / Xuất Vé Điện Tử (Print Styles):**
  - Hỗ trợ CSS Media `@media print` giúp ẩn toàn bộ Header, Footer, Nút bấm và tối ưu hiển thị trắng đen sắc nét để in ra giấy A4 hoặc lưu thành PDF.
- **Tối ưu Giao diện Đa Màn hình (Responsive):**
  - **Desktop (>= 1024px):** Bố cục 2 cột: Cột trái hiển thị Timeline Lịch trình chi tiết (65% width), Cột phải cố định Thẻ tóm tắt thông số chuyến đi & Hướng dẫn viên (Sticky Sidebar 35% width).
  - **Tablet (768px - 1023px):** Xếp dọc 1 cột mượt mà, Thẻ tóm tắt đưa lên trên, Timeline chi tiết bên dưới.
  - **Mobile (< 768px):** Thanh điều hướng các Ngày chuyển thành dạng cuộn ngang (Horizontal swipeable tabs), các mốc thời gian hiển thị thu gọn tiện lợi cho thao tác lướt bằng ngón cái.
