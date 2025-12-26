# 🚀 Render.com Deployment Guide

## خطوات رفع Backend على Render

### 1️⃣ إنشاء حساب على Render
- اذهب إلى [render.com](https://render.com)
- سجل دخول باستخدام GitHub

### 2️⃣ إنشاء Web Service جديد
1. اضغط **"New +"** → **"Web Service"**
2. اختر **"Build and deploy from a Git repository"**
3. اضغط **"Connect account"** واختر GitHub
4. ابحث عن repository: **`Youssefel4/open-world`**
5. اضغط **"Connect"**

### 3️⃣ إعدادات Web Service

#### Basic Settings:
- **Name**: `open-world-api` (أو أي اسم تريده)
- **Region**: اختر الأقرب لك (مثلاً: Frankfurt)
- **Branch**: `main`
- **Root Directory**: `server`

#### Build Settings:
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

#### Instance Type:
- اختر **"Free"** (مجاني)

### 4️⃣ Environment Variables (مهم جداً!)

اضغط **"Advanced"** → **"Add Environment Variable"**

أضف هذه المتغيرات:

```
MONGO_URI = mongodb+srv://yousseflachgar288_db_user:hw03dZmL5Zi35C4X@cluster0.xqadd9a.mongodb.net/openworld?appName=Cluster0

JWT_SECRET = your_super_strong_jwt_secret_key_change_this_in_production_2024

CLOUDINARY_CLOUD_NAME = your_cloud_name_from_cloudinary
CLOUDINARY_API_KEY = your_api_key_from_cloudinary
CLOUDINARY_API_SECRET = your_api_secret_from_cloudinary

NODE_ENV = production
PORT = 5000

FRONTEND_URL = https://your-netlify-site.netlify.app
```

⚠️ **ملاحظة**: استبدل `your-netlify-site.netlify.app` برابط موقعك على Netlify

### 5️⃣ Deploy!
- اضغط **"Create Web Service"**
- انتظر 2-3 دقائق للـ build والـ deploy

### 6️⃣ احصل على رابط API
بعد Deploy ناجح، ستحصل على رابط مثل:
```
https://open-world-api.onrender.com
```

### 7️⃣ تحديث Frontend على Netlify

1. اذهب لـ Netlify Dashboard
2. اختر موقعك
3. **Site settings** → **Environment variables**
4. أضف:
   - Key: `VITE_API_URL`
   - Value: `https://open-world-api.onrender.com/api`
5. اضغط **"Trigger deploy"** لإعادة Deploy

---

## ✅ اختبار API

بعد Deploy، جرّب:
```
https://your-api-url.onrender.com/api/health
```

يجب أن ترى:
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## 🐛 حل المشاكل

### المشكلة: Build Failed
- تحقق من `Root Directory` = `server`
- تحقق من `Build Command` = `npm install`
- تحقق من `Start Command` = `npm start`

### المشكلة: Server Crashed
- تحقق من Environment Variables
- تحقق من MongoDB URI صحيح
- راجع Logs في Render Dashboard

### المشكلة: CORS Error
- تأكد من `FRONTEND_URL` صحيح في Environment Variables
- تأكد من رابط Netlify مضاف بدون `/` في النهاية

---

## 💡 نصائح

1. **Free Tier Limitations:**
   - يتوقف بعد 15 دقيقة من عدم الاستخدام
   - يستغرق 30-60 ثانية للتشغيل مرة أخرى

2. **Keep Alive:**
   - استخدم خدمة مثل [UptimeRobot](https://uptimerobot.com) لإبقاء API نشط

3. **Logs:**
   - راجع Logs في Render Dashboard لمتابعة الأخطاء

---

## 🎉 تم!

الآن لديك:
- ✅ Backend على Render
- ✅ Frontend على Netlify
- ✅ Database على MongoDB Atlas
- ✅ Images على Cloudinary

**المشروع كامل على الإنترنت! 🚀**
