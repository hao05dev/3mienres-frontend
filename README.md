# 🦀 3Mien Restaurant - Frontend Client

Giao diện Web Khách hàng & Cổng Quản trị Nhà hàng 3 Miền, phát triển bằng **Vue 3** và **Vite**.

## 🚀 Tính năng nổi bật
- **Khách hàng**:
  - Khám phá menu món ăn đặc sản 3 miền, giỏ hàng, đặt bàn trực tuyến.
  - Tích hợp **AI Chatbot** tư vấn món ăn, chọn bàn thông minh.
  - Quét mã QR nhận bàn, theo dõi trạng thái món và thanh toán trực tuyến.
- **Quản trị & POS**:
  - Quản lý sơ đồ bàn trực quan theo khu vực, thời gian thực qua **Socket.io**.
  - Quản lý đơn gọi món, tách/gộp bàn, chuyển bàn.
  - Quản lý kho, công thức, thực đơn, khuyến mãi, nhân sự và phân quyền.
  - Báo cáo doanh thu đa chiều, xuất hóa đơn & Excel chuẩn kế toán.

---

## 🛠️ Hướng dẫn cài đặt và chạy

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Cấu hình biến môi trường
Tạo file `.env` từ file `.env.example`:
```bash
cp .env.example .env
```
Nội dung file `.env`:
```env
# URL Backend API & Socket.io Server
VITE_BACKEND_URL=http://localhost:3000
```

### 3. Chạy môi trường Development
```bash
npm run dev
```
Mặc định ứng dụng sẽ chạy tại: `http://localhost:5173`.

### 4. Build cho Production
```bash
npm run build
```
Thư mục sau khi build nằm tại `dist/`.
