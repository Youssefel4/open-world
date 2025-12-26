# 🎨 Open World - Image Sharing Platform

> منصة حديثة لمشاركة واستكشاف الصور للمصممين العرب - مشابهة لـ Pinterest

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ المميزات

- 🔐 نظام مصادقة كامل (JWT)
- 📸 رفع وإدارة الصور
- ❤️ إعجاب وحفظ الصور
- 💬 نظام التعليقات
- 📁 إنشاء مجموعات (Collections)
- 🔍 بحث وفلترة متقدمة
- ⬇️ تحميل الصور
- 👤 تعديل الملف الشخصي
- 👑 لوحة تحكم للمدراء
- 📱 تصميم متجاوب (Mobile + Desktop)
- 🌙 دعم اللغة العربية RTL

## 🛠️ التقنيات المستخدمة

### Backend
- **Node.js** + **Express** - Server framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Bcrypt** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Zustand** - State management
- **Axios** - HTTP client
- **Global CSS** - Styling
- **React Icons** - Icon library
- **React Masonry CSS** - Grid layout
- **React Infinite Scroll** - Pagination

## 🚀 التثبيت والتشغيل

### المتطلبات
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account (اختياري)

### 1. Clone المشروع
```bash
git clone https://github.com/Youssefel4/open-world.git
cd open-world
```

### 2. Backend Setup

```bash
cd server
npm install
```

**إنشاء ملف `.env`:**
```bash
cp .env.example .env
```

**تعديل `.env` وإضافة بياناتك:**
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
```

**تشغيل السيرفر:**
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

التطبيق سيعمل على: `http://localhost:3000`

## 📁 هيكل المشروع

```
open-world/
├── server/                 # Backend
│   ├── config/            # Database & Cloudinary config
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth & upload middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── utils/            # Helper functions
│
└── client/                # Frontend
    ├── src/
    │   ├── components/   # React components
    │   ├── pages/        # Page components
    │   ├── services/     # API services
    │   ├── store/        # Zustand stores
    │   └── index.css     # Global CSS
    └── public/
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - الحصول على المستخدم الحالي

### Images
- `GET /api/images` - جلب جميع الصور
- `POST /api/images/upload` - رفع صورة جديدة
- `GET /api/images/:id` - جلب صورة محددة
- `PATCH /api/images/:id` - تعديل صورة
- `DELETE /api/images/:id` - حذف صورة
- `POST /api/images/:id/like` - إعجاب/إلغاء إعجاب
- `POST /api/images/:id/save` - حفظ/إلغاء حفظ
- `POST /api/images/:id/comments` - إضافة تعليق

### Collections
- `GET /api/collections` - جلب المجموعات
- `POST /api/collections` - إنشاء مجموعة
- `GET /api/collections/:id` - جلب مجموعة محددة
- `PATCH /api/collections/:id` - تعديل مجموعة
- `DELETE /api/collections/:id` - حذف مجموعة

### Users
- `GET /api/users/:id` - جلب ملف المستخدم
- `PATCH /api/users/profile` - تعديل الملف الشخصي
- `POST /api/users/profile/image` - رفع صورة الملف الشخصي

## 🎨 المميزات الإضافية

### تعديل الملف الشخصي
- تغيير الصورة الشخصية
- تعديل الاسم
- إضافة نبذة عنك (Bio)

### تحميل الصور
- تحميل أي صورة بنقرة واحدة
- دعم جميع صيغ الصور

### البحث الذكي
- بحث في العناوين والوسوم
- فلترة بالوسوم
- نتائج فورية

## 👨‍💻 المساهمة

المساهمات مرحب بها! يرجى:
1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للـ branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت MIT License - انظر ملف [LICENSE](LICENSE) للتفاصيل

## 👤 المطور

**Youssef**
- GitHub: [@Youssefel4](https://github.com/Youssefel4)

## 🙏 شكر وتقدير

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [React Icons](https://react-icons.github.io/react-icons/)

---

**تم البناء بـ ❤️ للمصممين العرب**
