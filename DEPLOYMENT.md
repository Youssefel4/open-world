# 🚀 Deployment Guide

## Frontend Deployment (Netlify)

### الطريقة 1: من GitHub (موصى بها)

1. **اذهب إلى [Netlify](https://netlify.com)**
2. **اضغط "New site from Git"**
3. **اختر GitHub وحدد repository: `Youssefel4/open-world`**
4. **إعدادات Build:**
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
5. **Environment Variables:**
   - أضف `VITE_API_URL` = رابط الـ backend API
6. **اضغط Deploy!**

### الطريقة 2: من Terminal

```bash
# 1. Build المشروع
cd client
npm run build

# 2. Install Netlify CLI
npm install -g netlify-cli

# 3. Login
netlify login

# 4. Deploy
netlify deploy --prod --dir=dist
```

---

## Backend Deployment (Render / Railway / Heroku)

### Render (مجاني)

1. **اذهب إلى [Render](https://render.com)**
2. **اضغط "New +" → "Web Service"**
3. **اختر GitHub repository**
4. **إعدادات:**
   - Name: `open-world-api`
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Environment Variables:**
   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   NODE_ENV=production
   ```
6. **اضغط Create Web Service**

### Railway (سهل)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Deploy
cd server
railway init
railway up
```

---

## 🔗 ربط Frontend بـ Backend

بعد deploy الـ backend، احصل على الـ URL (مثلاً: `https://open-world-api.onrender.com`)

### في Netlify:
1. اذهب لـ Site settings → Environment variables
2. أضف:
   - Key: `VITE_API_URL`
   - Value: `https://open-world-api.onrender.com/api`
3. Redeploy الموقع

---

## ✅ Checklist قبل Deploy

### Backend
- [ ] تأكد من `.env` محتوي على جميع المتغيرات
- [ ] MongoDB URI صحيح
- [ ] Cloudinary credentials صحيحة
- [ ] `NODE_ENV=production`
- [ ] تم تحديث CORS في `app.js` للسماح بـ frontend URL

### Frontend
- [ ] تم build المشروع (`npm run build`)
- [ ] `VITE_API_URL` يشير للـ backend الصحيح
- [ ] تم إضافة `netlify.toml`
- [ ] تم إضافة `_redirects` في `public/`

---

## 🐛 حل المشاكل الشائعة

### 1. MIME Type Error
✅ **تم الحل**: أضفنا `netlify.toml` و `_redirects`

### 2. 404 على الصفحات
✅ **تم الحل**: ملف `_redirects` يوجه كل الطلبات لـ `index.html`

### 3. API Errors
- تأكد من `VITE_API_URL` صحيح
- تأكد من CORS مفعّل في Backend
- تحقق من Backend logs

### 4. Images لا تظهر
- تأكد من Cloudinary credentials صحيحة
- تحقق من الـ uploads في Cloudinary dashboard

---

## 📝 ملاحظات

- **Frontend**: مجاني على Netlify
- **Backend**: مجاني على Render (مع limitations)
- **Database**: مجاني على MongoDB Atlas (512MB)
- **Images**: مجاني على Cloudinary (25 credits/month)

---

**🎉 بعد Deploy، شارك الرابط مع العالم!**
