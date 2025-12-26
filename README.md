# Open World Image Sharing Platform - README

## 🚀 منصة مشاركة الصور للمصممين العرب

منصة حديثة لمشاركة واستكشاف الصور مشابهة لـ Pinterest، مبنية بتقنيات حديثة وتصميم عصري.

## 🛠️ التقنيات المستخدمة

### Backend
- **Node.js** + **Express** - Server framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Bcrypt** - Password hashing
- **Multer** - File uploads

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Zustand** - State management
- **Axios** - HTTP client
- **Global CSS** - Styling (no Tailwind)
- **React Masonry CSS** - Grid layout
- **React Infinite Scroll** - Pagination

## 📦 المميزات

✅ نظام مصادقة كامل (تسجيل / دخول)  
✅ رفع الصور إلى Cloudinary  
✅ عرض الصور بتصميم Masonry Grid  
✅ Infinite Scroll للصور  
✅ إعجاب وحفظ الصور  
✅ نظام التعليقات  
✅ إنشاء مجموعات (Collections/Boards)  
✅ البحث والفلترة بالوسوم  
✅ صفحات الملف الشخصي  
✅ لوحة تحكم للمدراء  
✅ تصميم متجاوب (Mobile + Desktop)  
✅ دعم اللغة العربية RTL

## 🔧 التثبيت والتشغيل

### 1. Backend Setup

```bash
cd server
npm install
```

**تعديل ملف `.env`:**
```env
MONGO_URI=mongodb+srv://yousseflachgar288_db_user:hw03dZmL5Zi35C4X@cluster0.xqadd9a.mongodb.net/openworld?appName=Cluster0
JWT_SECRET=your_super_strong_jwt_secret_key_change_this_in_production_2024

# احصل على هذه القيم من cloudinary.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

PORT=5000
NODE_ENV=development
```

**تشغيل السيرفر:**
```bash
npm run dev
```

السيرفر سيعمل على: `http://localhost:5000`

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

التطبيق سيعمل على: `http://localhost:3000`

## 📁 هيكل المشروع

```
Open World Image Sharing Platform/
├── server/                 # Backend
│   ├── config/            # Database & Cloudinary config
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth & upload middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── utils/            # Helper functions
│   ├── app.js            # Express app
│   └── server.js         # Server entry point
│
└── client/                # Frontend
    ├── src/
    │   ├── components/   # React components
    │   ├── pages/        # Page components
    │   ├── services/     # API services
    │   ├── store/        # Zustand stores
    │   ├── index.css     # Global CSS
    │   ├── App.jsx       # Main app
    │   └── main.jsx      # Entry point
    ├── index.html
    └── vite.config.js
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - الحصول على المستخدم الحالي

### Images
- `GET /api/images` - جلب جميع الصور
- `GET /api/images/:id` - جلب صورة محددة
- `POST /api/images/upload` - رفع صورة جديدة
- `PATCH /api/images/:id` - تعديل صورة
- `DELETE /api/images/:id` - حذف صورة
- `POST /api/images/:id/like` - إعجاب/إلغاء إعجاب
- `POST /api/images/:id/save` - حفظ/إلغاء حفظ
- `POST /api/images/:id/comments` - إضافة تعليق
- `DELETE /api/images/:id/comments/:commentId` - حذف تعليق

### Collections
- `GET /api/collections` - جلب المجموعات
- `GET /api/collections/:id` - جلب مجموعة محددة
- `POST /api/collections` - إنشاء مجموعة
- `PATCH /api/collections/:id` - تعديل مجموعة
- `DELETE /api/collections/:id` - حذف مجموعة
- `POST /api/collections/:id/images` - إضافة صورة للمجموعة
- `DELETE /api/collections/:id/images/:imageId` - إزالة صورة من المجموعة

### Users (Admin)
- `GET /api/users` - جلب جميع المستخدمين (مدير فقط)
- `GET /api/users/:id` - جلب مستخدم محدد
- `DELETE /api/users/:id` - حذف مستخدم (مدير فقط)
- `GET /api/users/:id/images` - جلب صور المستخدم
- `GET /api/users/:id/saved` - جلب الصور المحفوظة

## 🎨 التصميم

التطبيق يستخدم **Global CSS** مع:
- CSS Variables للألوان والمسافات
- تصميم متجاوب (Mobile-first)
- دعم Dark Mode (جاهز للتفعيل)
- Animations و Transitions سلسة
- دعم RTL للغة العربية
- خط Cairo من Google Fonts

## 👤 إنشاء حساب مدير

لإنشاء حساب مدير، قم بتسجيل حساب عادي ثم عدّل الدور في قاعدة البيانات:

```javascript
// في MongoDB
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## 🔐 Cloudinary Setup

1. اذهب إلى [cloudinary.com](https://cloudinary.com)
2. أنشئ حساب مجاني
3. من Dashboard، احصل على:
   - Cloud Name
   - API Key
   - API Secret
4. ضعها في ملف `.env`

## 📝 ملاحظات مهمة

- حجم الصورة الأقصى: **5MB**
- الصيغ المدعومة: JPG, PNG, GIF, WEBP
- عدد الوسوم الأقصى: **10**
- طول كلمة المرور الأدنى: **6 أحرف**

## 🚀 الإنتاج (Production)

### Backend
```bash
cd server
npm start
```

### Frontend
```bash
cd client
npm run build
npm run preview
```

## 📄 الترخيص

MIT License - مفتوح المصدر

---

**تم البناء بـ ❤️ للمصممين العرب**
