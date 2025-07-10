````markdown
# 📘 Edu Ecommerce

Dự án web hiển thị và bán khóa học, được xây dựng bằng:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- Google Gemini API (cho gợi ý AI)

---

## 🚀 Cài đặt và chạy dự án

### 1. Clone repo

```bash
git clone https://github.com/tran-thien-nhan/edu-ecom.git
cd your-repo
````

### 2. Cài đặt dependencies

```bash
npm install
# hoặc
yarn
```

### 3. Thêm biến môi trường

Tạo file `.env.local` ở thư mục gốc và thêm:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

> 🔑 Bạn cần một API key từ [Google AI Studio](https://makersuite.google.com/app) để sử dụng Gemini API.

### 4. Chạy ứng dụng ở môi trường phát triển

```bash
npm run dev
# hoặc
yarn dev
```

Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000)

---

## 🛠 Build để triển khai

```bash
npm run build
npm start
```

---

## 📁 Cấu trúc thư mục

```plaintext
.
├── pages/              # Routing của Next.js (dùng Pages Router)
├── public/             # Assets tĩnh (ảnh, font, v.v.)
├── styles/             # Tailwind CSS và các file style
├── _components/        # Các component UI tái sử dụng
├── _hooks/             # Các custom hooks
├── _context/           # React Context (giỏ hàng, lịch sử, v.v.)
├── _interface/         # TypeScript interfaces
├── _utils/             # Hàm tiện ích (format tiền tệ, gọi API...)
├── _data/              # Mock data (nếu có)
└── .env.local          # Biến môi trường (không commit lên Git)
```

---

## 📦 Tech stack

* ✅ Next.js (Pages Router)
* 🎨 Tailwind CSS
* 🤖 Gemini API (qua fetch)
* 💾 localStorage (giỏ hàng, yêu thích, lịch sử)
* 💡 React Context API (quản lý trạng thái toàn cục)

---

## ✅ Các tính năng chính

* [x] Hiển thị danh sách khóa học
* [x] Thêm vào giỏ hàng, xem chi tiết
* [x] Lưu khóa học yêu thích
* [x] Lịch sử đã xem
* [x] Gợi ý khóa học bằng AI (Gemini)