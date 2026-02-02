# Hướng dẫn Chạy Test - LLM Hub

Tài liệu này hướng dẫn cách chạy các script kiểm thử (test) cho cả Backend và Frontend của dự án LLM Hub.

## 🚀 Backend Testing

Các bài kiểm thử Backend chủ yếu là các script Python độc lập. Để chạy chúng, bạn cần cài đặt các thư viện cần thiết trong thư mục `backend/`.

### 1. Setup Backend

- `cd backend`
- `pip install -r requirements.txt`
- `python server.py` (Default port: 8000)

### 2. Setup Frontend

- `cd frontend`
- `pnpm install`
- `pnpm dev` (Default port: 5173)

### 3. Registration (First User)

- Navigate to `http://localhost:5173`
- Click **"Register here"**
- The first user registered will automatically be assigned the **admin** role.
- Once registered, you will be redirected to the login page.

### 4. Các loại Test

#### A. Unit Test / Logic Test

Những bài test này kiểm tra logic tính toán hoặc cấu trúc dữ liệu mà không cần server đang chạy.

- **Kiểm tra Model & Security:**
  ```bash
  python backend/tests/test_model.py
  ```

#### B. Integration Test (Yêu cầu Server đang chạy)

Những bài test này yêu cầu Backend Server phải đang hoạt động để gửi request qua HTTP.

1. **Khởi động Server:**

   ```bash
   cd backend
   python server.py
   ```

   _(Server mặc định chạy tại http://localhost:8000)_

2. **Chạy các script test trong một terminal mới:**
   - **Test Authentication (Đăng ký/Đăng nhập):**
     ```bash
     python backend/tests/test_auth.py
     ```
   - **Test Chat API:**
     ```bash
     python tests/test_chat.py
     ```

---

## 💻 Frontend Testing

Hiện tại, Frontend sử dụng **Vite**, **ESLint** và **pnpm** để quản lý dependency và kiểm tra code.

### 1. Kiểm tra Lỗi Code (Linting)

```bash
cd frontend
pnpm run lint
```

### 2. Kiểm tra Build

Để đảm bảo code có thể đóng gói mà không gặp lỗi TypeScript:

```bash
cd frontend
pnpm run build
```

---

## 🛠 Phân cấu trúc thư mục Test

- `backend/tests/`: Các script test liên quan đến DB, Auth và logic backend.
- `tests/`: Các script test tích hợp hệ thống (ví dụ: test luồng chat từ client).
