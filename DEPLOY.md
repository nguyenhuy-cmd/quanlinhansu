# 🚀 Hướng dẫn Deploy Website

## 📋 Mục lục
1. [Push code lên GitHub](#1-push-code-lên-github)
2. [Deploy lên Hosting miễn phí](#2-deploy-lên-hosting-miễn-phí)

---

## 1️⃣ Push code lên GitHub

### Bước 1: Tạo Repository trên GitHub

1. Truy cập [https://github.com](https://github.com)
2. Đăng nhập tài khoản GitHub (hoặc đăng ký nếu chưa có)
3. Click nút **"+"** ở góc trên bên phải → chọn **"New repository"**
4. Điền thông tin:
   - **Repository name:** `hrm-system` (hoặc tên bạn muốn)
   - **Description:** `Hệ thống quản lý nhân sự - Bài tập`
   - Chọn **Public**
   - ✅ KHÔNG tick "Add a README file" (vì đã có rồi)
5. Click **"Create repository"**

### Bước 2: Push code từ máy tính lên GitHub

Mở **PowerShell** hoặc **Command Prompt** tại thư mục project và chạy các lệnh sau:

```bash
# Khởi tạo Git repository (nếu chưa có)
git init

# Thêm tất cả file vào staging
git add .

# Commit với message
git commit -m "Initial commit: HRM System"

# Thêm remote repository (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/hrm-system.git

# Push code lên GitHub
git branch -M main
git push -u origin main
```

### Bước 3: Xác nhận

- Truy cập `https://github.com/YOUR_USERNAME/hrm-system`
- Kiểm tra code đã được push lên thành công

---

## 2️⃣ Deploy lên Hosting miễn phí

### Tùy chọn A: GitHub Pages (Khuyên dùng - Dễ nhất)

#### Cách 1: Qua Settings
1. Vào repository của bạn trên GitHub
2. Click tab **"Settings"**
3. Scroll xuống phần **"Pages"** ở menu bên trái
4. Tại phần **"Source"**:
   - Branch: chọn `main`
   - Folder: chọn `/ (root)`
5. Click **"Save"**
6. Đợi vài phút, website sẽ được deploy tại:
   ```
   https://YOUR_USERNAME.github.io/hrm-system/
   ```

#### Cách 2: Qua GitHub Actions (Tự động)
File cấu hình đã sẵn trong project. Chỉ cần:
1. Vào **Settings** → **Pages**
2. Source: chọn **GitHub Actions**
3. Mỗi lần push code, website tự động deploy

### Tùy chọn B: Netlify

1. Truy cập [https://www.netlify.com](https://www.netlify.com)
2. Đăng ký/Đăng nhập (có thể dùng tài khoản GitHub)
3. Click **"Add new site"** → **"Import an existing project"**
4. Chọn **"Deploy with GitHub"**
5. Chọn repository `hrm-system`
6. Cấu hình build:
   - **Build command:** để trống
   - **Publish directory:** `.` (dấu chấm)
7. Click **"Deploy site"**
8. Website sẽ có địa chỉ: `https://random-name.netlify.app`
9. Có thể đổi tên miễn phí trong **Site settings**

### Tùy chọn C: Vercel

1. Truy cập [https://vercel.com](https://vercel.com)
2. Đăng ký/Đăng nhập bằng GitHub
3. Click **"Add New"** → **"Project"**
4. Import repository `hrm-system`
5. Cấu hình:
   - **Framework Preset:** Other
   - **Build Command:** để trống
   - **Output Directory:** `.`
6. Click **"Deploy"**
7. Website sẽ có địa chỉ: `https://hrm-system.vercel.app`

### Tùy chọn D: Render

1. Truy cập [https://render.com](https://render.com)
2. Đăng ký/Đăng nhập
3. Click **"New"** → **"Static Site"**
4. Connect GitHub repository
5. Cấu hình:
   - **Build Command:** để trống
   - **Publish directory:** `.`
6. Click **"Create Static Site"**
7. Website sẽ được deploy

---

## 📝 Checklist Nộp bài

- [ ] ✅ Code đã được push lên GitHub
- [ ] ✅ Repository để ở chế độ Public
- [ ] ✅ File README.md có đầy đủ thông tin
- [ ] ✅ Website đã được deploy thành công
- [ ] ✅ Link GitHub repository
- [ ] ✅ Link demo website

---

## 🎯 Nộp bài

### Link cần nộp:

1. **Link GitHub Repository:**
   ```
   https://github.com/YOUR_USERNAME/hrm-system
   ```

2. **Link Demo Website:** (chọn 1 trong các hosting trên)
   ```
   https://YOUR_USERNAME.github.io/hrm-system/
   hoặc
   https://your-site.netlify.app
   hoặc
   https://hrm-system.vercel.app
   ```

---

## 🔧 Xử lý sự cố

### Lỗi khi push lên GitHub

```bash
# Nếu bị lỗi authentication
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Website không hoạt động sau khi deploy

1. Kiểm tra tất cả đường dẫn file phải tương đối (relative path)
2. Đảm bảo không có lỗi trong Console của trình duyệt
3. Kiểm tra LocalStorage có hoạt động không

### Cập nhật code sau khi deploy

```bash
# Sau khi sửa code
git add .
git commit -m "Update: mô tả thay đổi"
git push origin main
```

Website sẽ tự động cập nhật (đặc biệt với GitHub Pages, Netlify, Vercel)

---

## 💡 Tips

- Đặt tên commit rõ ràng: "Fix bug", "Add feature", "Update UI"...
- Kiểm tra kỹ trước khi nộp bài
- Đảm bảo website chạy mượt trên cả mobile
- Có thể tạo branch mới để test trước khi merge vào main

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, tham khảo:
- [GitHub Docs](https://docs.github.com)
- [Netlify Docs](https://docs.netlify.com)
- [Vercel Docs](https://vercel.com/docs)

---

**Chúc bạn thành công! 🎉**
