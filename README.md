# 🎓 EduSphere Frontend - E-Learning Platform UI

[![React Version](https://img.shields.io/badge/React-19.x-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![License: UNLICENSED](https://img.shields.io/badge/License-UNLICENSED-yellow.svg)]()

> **EduSphere Frontend** là giao diện người dùng (Single Page Application - SPA) cho nền tảng học trực tuyến E-learning thế hệ mới. Giao diện được xây dựng bằng **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, tích hợp **Socket.io WebSockets**, **Stripe Checkout Gateway**, **Cloudinary Media Upload** và **Trợ lý AI Gemini 2.0**.

---

## 📌 Mục lục

- [🎓 EduSphere Frontend - E-Learning Platform UI](#-edusphere-frontend---e-learning-platform-ui)
  - [📌 Mục lục](#-mục-lục)
  - [📖 Mô tả Giao diện Phân hệ](#-mô-tả-giao-diện-phân-hệ)
  - [✨ Tính năng Nổi bật](#-tính-năng-nổi-bật)
  - [📦 Công nghệ \& Thư viện (Dependencies \& Tech Stack)](#-công-nghệ--thư-viện-dependencies--tech-stack)
  - [⚙️ Hướng dẫn Cài đặt \& Thiết lập (Installation \& Setup)](#️-hướng-dẫn-cài-đặt--thiết-lập-installation--setup)
  - [📁 Cấu trúc Thư mục (Project Architecture)](#-cấu-trúc-thư-mục-project-architecture)
  - [🔒 Phân quyền Tuyến đường (Role Guards \& Routing)](#-phân-quyền-tuyến-đường-role-guards--routing)
  - [📜 Lịch sử Thay đổi (Changelog)](#-lịch-sử-thay-đổi-changelog)
  - [📄 Giấy phép (License)](#-giấy-phép-license)

---

## 📖 Mô tả Giao diện Phân hệ

Hệ thống Frontend được chia làm **3 Phân hệ chính (Subsystems)** độc lập, chuyên nghiệp:

1. **Phân hệ Học viên (Student Portal)**:
   - Trang chủ Landing Page, Lọc danh mục động, Tìm kiếm khóa học 100% từ Database.
   - Trang Chi tiết Khóa học, Mua ngay qua Stripe Gateway & Thêm vào giỏ hàng.
   - Không gian Học bài (`/learn/:id`), Video Player, tính % tiến độ & Nhận chứng chỉ.
   - Widget Chat thời gian thực với Giảng viên & Cửa sổ Trợ lý AI Gemini 2.0.

2. **Phân hệ Giảng viên (Instructor Studio - `/instructor`)**:
   - Dashboard Báo cáo Doanh thu & Thống kê học viên.
   - Quản lý Khóa học, Thêm Chương/Bài giảng, Upload ảnh thumbnail trực tiếp lên **Cloudinary CDN**.
   - Chấm điểm Bài tập nộp của Học viên & Kênh Chat 1-1.

3. **Phân hệ Quản trị viên (Admin Portal - `/admin`)**:
   - Dashboard Báo cáo tổng quan toàn hệ thống.
   - Quản lý Người dùng, Phân quyền Role (`STUDENT`, `INSTRUCTOR`, `ADMIN`), Khóa/Mở khóa tài khoản.
   - Duyệt xuất bản Khóa học (`PUBLISHED` / `REJECTED`).
   - Quản lý Danh mục khóa học CRUD 100% với PostgreSQL Database.
   - Báo cáo Doanh thu & Lịch sử Giao dịch chi tiết (`/admin/finance`).

---

## ✨ Tính năng Nổi bật

- 🎨 **Rich Aesthetics & Persistence Theme:** Hỗ trợ Light / Dark mode chuẩn Tailwind HSL Tailored, lưu trữ tự động vào `localStorage` duy trì 100% khi F5.
- ⚡ **100% Dynamic Data (No Mockdata):** Kết nối 100% với NestJS Backend REST API qua Axios Interceptors (xử lý Token rotation & Refresh token).
- 💬 **Real-time WebSockets Chat & Notifications:** Tương tác nhắn tin và nhận thông báo thời gian thực qua Socket.io Client.
- 🤖 **Trợ lý AI Gemini 2.0 Flash:** Nhúng Cửa sổ AI Drawer hỗ trợ Markdown & Code Highlighting tự động giải đáp bài giảng.
- 🚫 **Trang 404 Not Found Bắt lỗi Đường dẫn:** Tự động bắt mọi đường dẫn không hợp lệ (VD: `/abcxyz` hoặc `#abcxyz`).

---

## 📦 Công nghệ & Thư viện (Dependencies & Tech Stack)

### Core Libraries
- **UI Framework:** React `^19.2.8` + React DOM
- **Build Tool & Bundler:** Vite `^8.2.0`
- **Ngôn ngữ:** TypeScript `~6.0.2`
- **Routing:** React Router DOM `^7.18.2`
- **CSS Styling:** Tailwind CSS `^3.4.17` + PostCSS + Autoprefixer
- **Icons:** Lucide React `^1.32.0`

### External Integrations & State
- **HTTP Client:** Axios `^1.19.0`
- **Real-time Engine:** Socket.io Client `^4.8.3`
- **Markdown & Code Renderer:** React Markdown `^10.1.0` + React Syntax Highlighter `^16.1.1`
- **Notifications:** React Hot Toast `^2.6.0`
- **Rich Text Editor:** TinyMCE React `^6.3.0`

---

## ⚙️ Hướng dẫn Cài đặt & Thiết lập (Installation & Setup)

### 1. Yêu cầu hệ thống
- **Node.js:** `>= 18.x` (Khuyến nghị LTS 20.x hoặc 22.x)
- **npm:** `>= 9.x`

### 2. Tải về và Cài đặt Packages

```bash
# Clone dự án Frontend
git clone https://github.com/your-username/edusphere-frontend.git
cd edusphere-frontend

# Cài đặt tất cả phụ thuộc
npm install
```

### 3. Cấu hình Biến môi trường (.env)

Tạo file `.env` tại thư mục gốc dự án:

```env
# URL Kết nối tới NestJS Backend API
VITE_API_BASE_URL=http://localhost:3000

# TinyMCE Rich Text Editor API Key
VITE_TINYMCE_API_KEY=your_tinymce_key
```

### 4. Chạy ứng dụng

```bash
# Chạy môi trường Development (Vite Dev Server)
npm run dev

# Kiểm tra lỗi TypeScript & Build Production Bundle
npm run build

# Xem thử phiên bản Build Production
npm run preview
```

Ứng dụng Frontend sẽ chạy tại: `http://localhost:5173`

---

## 📁 Cấu trúc Thư mục (Project Architecture)

```
edusphere-frontend/
├── public/
├── src/
│   ├── api/                    # Axios REST Client & Low-level API Helpers
│   ├── components/             # Common UI Components (Navbar, Footer, Modals, Chat Widget, Notifications)
│   ├── context/                # Global React Contexts (AuthContext, CartContext)
│   ├── features/               # Feature-based Subsystems Architectural Pattern
│   │   ├── admin/              # Admin Portal (Layout, Pages: Dashboard, Users, Courses, Categories, Finance)
│   │   ├── auth/               # Auth Modals & RoleGuard
│   │   ├── instructor/         # Instructor Studio (Layout, Pages: Dashboard, Courses, Assignments, Chat)
│   │   └── settings/           # User Settings Page
│   ├── pages/                  # Student Pages (HomePage, CourseDetailPage, MyCoursesPage, CourseLearnPage, NotFoundPage)
│   ├── routes/                 # AppRoutes.tsx Routing Registry
│   ├── services/               # Feature Service API Wrappers (adminService, courseService, chatService...)
│   └── types/                  # Shared TypeScript Interfaces & Models
├── .env
├── package.json
└── README.md
```

---

## 🔒 Phân quyền Tuyến đường (Role Guards & Routing)

- **Student Public Routes:** `/` (Trang chủ), `#course/:id`, `#cart`, `/payment/success`
- **Student Protected Routes:** `#my-courses`, `#learn/:id`, `#settings` (Yêu cầu Đăng nhập)
- **Instructor Protected Subsystem (`/instructor/*`):** Bảo vệ bởi `<RoleGuard allowedRole="INSTRUCTOR">`
- **Admin Protected Subsystem (`/admin/*`):** Bảo vệ bởi `<RoleGuard allowedRole="ADMIN">`

---

## 📜 Lịch sử Thay đổi (Changelog)

### Version `0.0.1` (2026-08-24) - **Production Ready Release**
- 🛡️ **Phân hệ Admin Portal (`/admin`):** Xây dựng hoàn chỉnh Dashboard, Quản lý User/Role, Duyệt khóa học, CRUD Danh mục & Báo cáo Tài chính.
- 🎨 **UX Persistence Theme:** Lưu chế độ Dark/Light Mode vào `localStorage` ('edusphere_theme').
- 💬 **Socket.io WebSockets Chat:** Ràng buộc học viên chỉ chat với Giảng viên khóa học đã mua.
- 🤖 **Trợ lý AI Gemini 2.0:** Kết nối Cửa sổ Chatbot AI trực tiếp trong bài giảng.
- 🚫 **Trang 404 Not Found:** Bắt các đường dẫn sai như `/abcxyz`.

---

## 📄 Giấy phép (License)

Dự án này là mã nguồn nội bộ độc quyền (UNLICENSED). Vui lòng không sao chép hoặc phân phối lại khi chưa có sự đồng ý của quản trị viên.
