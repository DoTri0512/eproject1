# TravelTrail Backend RESTful API

Hệ thống Backend RESTful API cho dự án **TravelTrail - Full-stack Travel & Tour Booking System**, được xây dựng dựa trên kiến trúc **Modular Architecture 4 Layers** với Node.js, Express.js và MongoDB (Mongoose ODM).

---

## 1. Yêu cầu môi trường & Cài đặt

- **Node.js**: phiên bản >= 18.x
- **MongoDB**: Đang chạy cục bộ (MongoDB Compass / Local Daemon) hoặc MongoDB Atlas connection string.

### Cài đặt dependencies:
```bash
npm install
```

### Thiết lập biến môi trường:
Tạo file `.env` tại thư mục gốc `backend/` (tham khảo `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/traveltrail
JWT_SECRET=traveltrail_super_secret_jwt_key_2026_dev
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

---

## 2. Khởi chạy ứng dụng

- Chế độ phát triển (Development với Nodemon hot-reload):
```bash
npm run dev
```

- Chế độ sản xuất (Production):
```bash
npm start
```

Kiểm tra trạng thái server:
`GET http://localhost:5000/api/v1/health`

---

## 3. Cấu trúc thư mục (Modular Architecture)

```text
backend/
├── src/
│   ├── config/              # Cấu hình Database & Biến môi trường
│   │   ├── database.js
│   │   └── env.js
│   │
│   ├── middlewares/         # Middlewares toàn cục (Auth, Error, RBAC)
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── modules/             # Các module nghiệp vụ (4 layers: Model, Route, Controller, Service, Validation)
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── booking/
│   │   ├── bookingPlan/
│   │   ├── collection/
│   │   ├── contact/
│   │   ├── customer/
│   │   ├── destination/
│   │   ├── favourite/
│   │   ├── guide/
│   │   └── tour/
│   │
│   ├── routes/              # Tập hợp các router con thành router chính
│   │   └── index.js
│   │
│   ├── utils/               # Tiện ích chung (Response, Pagination, Token)
│   │   ├── pagination.js
│   │   ├── response.js
│   │   └── token.js
│   │
│   ├── app.js               # Khởi tạo Express app & gắn middleware
│   └── server.js            # Khởi động server & kết nối Database
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 4. Danh sách API Endpoints (`/api/v1`)

### 4.1. Authentication (`/api/v1/auth`)
| Phương thức | Endpoint | Phân quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Đăng ký tài khoản mới |
| `POST` | `/api/v1/auth/login` | Public | Đăng nhập hệ thống (Cấp JWT token & HttpOnly Cookie) |
| `POST` | `/api/v1/auth/logout` | Public | Đăng xuất (xóa Cookie) |
| `GET` | `/api/v1/auth/me` | Authenticated | Lấy thông tin cá nhân hiện tại |
| `PUT` | `/api/v1/auth/me` | Authenticated | Cập nhật thông tin cá nhân |
| `PUT` | `/api/v1/auth/change-password` | Authenticated | Đổi mật khẩu |

### 4.2. Customer Profile (`/api/v1/customers`)
| Phương thức | Endpoint | Phân quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/customers/me` | Authenticated | Lấy thông tin thanh toán của tài khoản đăng nhập |
| `POST` | `/api/v1/customers/me` | Authenticated | Lưu/Cập nhật thông tin thanh toán cá nhân |
| `GET` | `/api/v1/customers` | Admin | Lấy danh sách khách hàng (phân trang, tìm kiếm) |
| `GET` | `/api/v1/customers/:id` | Admin | Chi tiết khách hàng |
| `PUT` | `/api/v1/customers/:id` | Admin | Cập nhật thông tin khách hàng |

### 4.3. Destinations (`/api/v1/destinations`)
| Phương thức | Endpoint | Phân quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/destinations` | Public | Lấy danh sách điểm đến (tìm kiếm, lọc vùng miền, theme, giá, mùa) |
| `GET` | `/api/v1/destinations/:idOrSlug` | Public | Chi tiết điểm đến theo ID hoặc Slug thân thiện |
| `POST` | `/api/v1/destinations` | Admin | Thêm mới điểm đến |
| `PUT` | `/api/v1/destinations/:id` | Admin | Cập nhật thông tin điểm đến |
| `DELETE` | `/api/v1/destinations/:id` | Admin | Xóa điểm đến |

### 4.4. Tours (`/api/v1/tours`)
| Phương thức | Endpoint | Phân quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/tours` | Public | Lấy danh sách tour du lịch (tìm kiếm, lọc giá, phân trang) |
| `GET` | `/api/v1/tours/destination/:destinationId` | Public | Danh sách các tour thuộc một điểm đến |
| `GET` | `/api/v1/tours/:idOrSlug` | Public | Chi tiết tour du lịch theo ID hoặc Slug |
| `POST` | `/api/v1/tours` | Admin | Tạo tour mới |
| `PUT` | `/api/v1/tours/:id` | Admin | Cập nhật tour |
| `DELETE` | `/api/v1/tours/:id` | Admin | Xóa tour |

### 4.5. Bookings (`/api/v1/bookings`)
| Phương thức | Endpoint | Phân quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/bookings` | Authenticated | Đặt tour du lịch mới (tính endDate tự động) |
| `GET` | `/api/v1/bookings/my-bookings` | Authenticated | Xem lịch sử đặt tour cá nhân |
| `GET` | `/api/v1/bookings/:id` | Authenticated/Owner | Chi tiết đơn đặt tour |
| `PUT` | `/api/v1/bookings/:id/cancel` | Authenticated/Owner | Hủy đơn đặt tour (khi ở trạng thái Pending) |
| `GET` | `/api/v1/bookings` | Admin | Xem toàn bộ đơn đặt tour hệ thống |
| `PUT` | `/api/v1/bookings/:id/status` | Admin | Cập nhật trạng thái đơn đặt tour và thanh toán |
| `DELETE` | `/api/v1/bookings/:id` | Admin | Xóa đơn đặt tour |

### 4.6. Booking Plans (`/api/v1/booking-plans`)
| Phương thức | Endpoint | Phân quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/booking-plans` | Admin | Danh sách các đoàn khởi hành theo ngày |
| `POST` | `/api/v1/booking-plans` | Admin | Khởi tạo đoàn khởi hành cho tour |
| `GET` | `/api/v1/booking-plans/:id` | Admin | Chi tiết đoàn khởi hành |
| `PUT` | `/api/v1/booking-plans/:id/assign-guide` | Admin | Phân công Hướng dẫn viên cho đoàn |
| `PUT` | `/api/v1/booking-plans/:id/status` | Admin | Cập nhật tiến độ đoàn (scheduled, in_progress, completed, cancelled) |
| `POST` | `/api/v1/booking-plans/:id/passengers` | Admin | Thêm hành khách vào danh sách điểm danh đoàn |
| `DELETE` | `/api/v1/booking-plans/:id` | Admin | Xóa bản ghi đoàn khởi hành |

### 4.7. Guides (`/api/v1/guides`)
| Phương thức | Endpoint | Phân quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/guides` | Public | Lấy danh sách hồ sơ Hướng dẫn viên du lịch |
| `GET` | `/api/v1/guides/:idOrSlug` | Public | Chi tiết hồ sơ Hướng dẫn viên theo ID hoặc Slug |
| `POST` | `/api/v1/guides` | Admin | Tạo mới hồ sơ Hướng dẫn viên |
| `PUT` | `/api/v1/guides/:id` | Admin | Cập nhật hồ sơ Hướng dẫn viên |
| `DELETE` | `/api/v1/guides/:id` | Admin | Xóa Hướng dẫn viên |

### 4.8. Favourites (`/api/v1/favourites`)
| Phương thức | Endpoint | Phân quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/favourites` | Authenticated | Danh sách điểm đến yêu thích của user |
| `POST` | `/api/v1/favourites` | Authenticated | Lưu điểm đến vào mục yêu thích |
| `POST` | `/api/v1/favourites/sync` | Authenticated | Đồng bộ danh sách yêu thích từ LocalStorage khi login |
| `GET` | `/api/v1/favourites/check/:destinationId` | Authenticated | Kiểm tra trạng thái đã yêu thích hay chưa |
| `DELETE` | `/api/v1/favourites/:destinationId` | Authenticated | Xóa điểm đến khỏi mục yêu thích |

### 4.9. Collections (`/api/v1/collections`)
| Phương thức | Endpoint | Phân quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/collections` | Public | Danh sách bộ sưu tập điểm đến theo mùa / chủ đề |
| `GET` | `/api/v1/collections/:idOrSlug` | Public | Chi tiết bộ sưu tập kèm danh sách địa điểm |
| `POST` | `/api/v1/collections` | Admin | Tạo bộ sưu tập mới |
| `PUT` | `/api/v1/collections/:id` | Admin | Cập nhật bộ sưu tập |
| `DELETE` | `/api/v1/collections/:id` | Admin | Xóa bộ sưu tập |

### 4.10. Contacts (`/api/v1/contacts`)
| Phương thức | Endpoint | Phân quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/contacts` | Public | Gửi liên hệ / phản hồi từ khách hàng |
| `GET` | `/api/v1/contacts` | Admin | Xem danh sách tin nhắn liên hệ |
| `PUT` | `/api/v1/contacts/:id/status` | Admin | Cập nhật trạng thái liên hệ (new, read, resolved) |
| `DELETE` | `/api/v1/contacts/:id` | Admin | Xóa tin nhắn liên hệ |

### 4.11. Admin Dashboard (`/api/v1/admin`)
| Phương thức | Endpoint | Phân quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/admin/dashboard` | Admin | Thống kê KPI tổng quan (Số user, destination, tour, booking, tổng doanh thu) |
| `GET` | `/api/v1/admin/users` | Admin | Quản lý danh sách người dùng hệ thống |
| `PUT` | `/api/v1/admin/users/:id/role` | Admin | Thay đổi quyền tài khoản (`user` <-> `admin`) |
| `DELETE` | `/api/v1/admin/users/:id` | Admin | Xóa tài khoản người dùng |

### 4.12. Image Upload (`/api/v1/upload`)
| Phương thức | Endpoint | Phân quyền | Mô tả |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/upload/single` | Authenticated | Upload 1 ảnh (`multipart/form-data`, field: `image`) |
| `POST` | `/api/v1/upload/multiple` | Authenticated | Upload tối đa 10 ảnh (`multipart/form-data`, field: `images`) |
| `DELETE` | `/api/v1/upload/:filename` | Admin | Xóa file ảnh khỏi server |
| `GET` | `/uploads/:filename` | Public | Xem file tĩnh trực tiếp từ trình duyệt |

