# Màn hình 11: Trang Liên hệ (Contact Page)

## 1. Tổng quan màn hình
- **Tên file:** `11-contact.md`
- **Mục đích:** Cung cấp biểu mẫu gửi thắc mắc, yêu cầu tư vấn tour du lịch và các thông tin liên lạc chính thức của TravelTrail. Thông tin form gửi sẽ được lưu trực tiếp vào database MongoDB thông qua Backend API.
- **Quyền truy cập:** Tất cả (Public).

---

## 2. Bố cục & Các thành phần Giao diện (UI Components)

### 2.1. Hero Section & Thông tin Liên hệ (Contact Info Block)
- **Header Banner:** Tiêu đề *"Liên Hệ Với TravelTrail"*.
- **Cột Thông tin Trực tiếp (Contact Details):**
  - **Địa chỉ văn phòng:** Hà Nội / TP. Hồ Chí Minh.
  - **Hotline hỗ trợ:** 1900 xxxx (24/7).
  - **Email:** support@traveltrail.vn
  - **Giờ làm việc:** 08:00 - 20:00 (Thứ 2 - Chủ Nhật).
  - Thẻ mạng xã hội (Facebook, Instagram, Youtube, Zalo).

### 2.2. Biểu mẫu Gửi Tin nhắn Liên hệ (Contact Form Panel)
Cấu trúc Form bao gồm các trường thông tin:
- **Họ và tên (Full Name):** Input text (Required).
- **Email:** Input email (Required, Auto validate format).
- **Số điện thoại (Phone):** Input tel (Required).
- **Chủ đề cần tư vấn (Subject Dropdown):** Tư vấn đặt Tour, Hỏi thông tin Điểm đến, Góp ý dịch vụ, Hỗ trợ khác.
- **Nội dung tin nhắn (Message):** Textarea (Required, Tối thiểu 10 ký tự).
- **Nút bấm *"Gửi tin nhắn liên hệ"* (Submit Button):** Trạng thái bình thường và trạng thái `Loading` khi đang gửi request API.

---

## 3. Tương tác Dữ liệu & Kết nối Backend REST API

- **Submit Contact Form:** `POST /api/contacts`
  Payload: `{ name, email, phone, subject, message }`.
- Backend validate thông tin, lưu dữ liệu vào MongoDB collection `Contact` và trả về response `{ success: true, message: "Cảm ơn bạn! Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất." }`.

---

## 4. Xử lý Trạng thái & Responsive

- **Validation Error States:** Hiển thị viền đỏ và dòng thông báo lỗi dưới trường input chưa hợp lệ (Ví dụ: Email không đúng định dạng).
- **Success State (Toast/Alert):** Hiển thị ô thông báo màu xanh chúc mừng thành công, tự động reset form sau khi gửi.
