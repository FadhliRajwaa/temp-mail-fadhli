# ✅ Deployment Checklist

Checklist ini untuk memastikan semua setup sudah benar sebelum deployment.

## 📋 Pre-Deployment Checklist

### Backend

- [ ] `backend/package.json` sudah ada
- [ ] `backend/server.js` sudah ada
- [ ] `backend/models/Email.js` dengan TTL Index sudah ada
- [ ] `backend/config/database.js` sudah ada
- [ ] `backend/.env` sudah dibuat dengan nilai yang benar:
  - [ ] MONGODB_URI diisi
  - [ ] PORT diisi (5000)
  - [ ] FRONTEND_URL diisi
  - [ ] EMAIL_DOMAIN diisi
  - [ ] NODE_ENV diisi
- [ ] Dependencies backend sudah terinstall (`npm install` di folder backend)
- [ ] Backend bisa jalan lokal (`npm start` di folder backend)
- [ ] Backend connect ke MongoDB (check logs)

### Frontend

- [ ] `package.json` sudah ada dengan dependencies socket.io-client
- [ ] `src/App.jsx` sudah dibuat dengan Socket.io integration
- [ ] `src/App.css` sudah diupdate
- [ ] `.env` sudah dibuat dengan nilai yang benar:
  - [ ] VITE_BACKEND_URL diisi
  - [ ] VITE_EMAIL_DOMAIN diisi
- [ ] Dependencies frontend sudah terinstall (`npm install` di root)
- [ ] Frontend bisa jalan lokal (`npm run dev` di root)
- [ ] Frontend connect ke backend (check browser console)

### MongoDB Atlas

- [ ] Account sudah dibuat
- [ ] Cluster sudah dibuat (M0 Free)
- [ ] Database `temp_mail` sudah ada
- [ ] User database sudah dibuat
- [ ] Network Access: 0.0.0.0/0 (Allow from anywhere)
- [ ] Connection string sudah dicopy ke backend/.env

### Domain & DNS

- [ ] Domain sudah dimiliki (misal: domain-saya.my.id)
- [ ] DNS Management accessible
- [ ] MX Records siap ditambahkan
- [ ] TXT Records siap ditambahkan

### Mailgun

- [ ] Account sudah dibuat (Free plan)
- [ ] Domain sudah ditambahkan di Mailgun
- [ ] DNS Records sudah ditambahkan:
  - [ ] MX Record 1: mxa.mailgun.org (priority 10)
  - [ ] MX Record 2: mxb.mailgun.org (priority 10)
  - [ ] SPF TXT Record
  - [ ] DKIM TXT Record (dari Mailgun)
- [ ] Domain status "Active" di Mailgun
- [ ] Route untuk catch-all siap dibuat

---

## 🚀 Deployment Steps

### Step 1: Deploy Backend ke Render

- [ ] Code sudah di-push ke GitHub
- [ ] Render account sudah dibuat
- [ ] Web Service sudah dibuat di Render
- [ ] Settings configured:
  - [ ] Root Directory: `backend`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `node server.js`
- [ ] Environment variables sudah diset di Render:
  - [ ] MONGODB_URI
  - [ ] FRONTEND_URL (temporary pakai localhost dulu)
  - [ ] EMAIL_DOMAIN
  - [ ] NODE_ENV=production
- [ ] Deploy berhasil (check logs)
- [ ] Backend URL dicopy (misal: https://xxx.onrender.com)
- [ ] Test backend URL di browser (harus return JSON)

### Step 2: Deploy Frontend ke Vercel

- [ ] Code sudah di-push ke GitHub
- [ ] Vercel account sudah dibuat
- [ ] Project sudah di-import ke Vercel
- [ ] Framework: Vite
- [ ] Root Directory: `./`
- [ ] Environment variables sudah diset di Vercel:
  - [ ] VITE_BACKEND_URL (URL dari Render)
  - [ ] VITE_EMAIL_DOMAIN
- [ ] Deploy berhasil
- [ ] Frontend URL dicopy (misal: https://xxx.vercel.app)
- [ ] Test frontend URL di browser

### Step 3: Update CORS

- [ ] Kembali ke Render
- [ ] Update environment variable `FRONTEND_URL` dengan URL Vercel
- [ ] Redeploy backend
- [ ] Test koneksi frontend-backend (check browser console)

### Step 4: Setup Mailgun Route

**Option A: Lokal Testing (ngrok)**
- [ ] ngrok installed
- [ ] Backend lokal running
- [ ] ngrok running: `ngrok http 5000`
- [ ] Mailgun Route created dengan URL ngrok

**Option B: Production (Render)**
- [ ] Mailgun Dashboard → Routes
- [ ] Route created:
  - [ ] Expression: `*@domain-saya.my.id`
  - [ ] Forward to Webhook: `https://xxx.onrender.com/webhook-mailgun`
  - [ ] Priority: 0

### Step 5: Testing

- [ ] Buka frontend URL
- [ ] Copy email address
- [ ] Kirim test email dari Gmail ke alamat tersebut
- [ ] Email muncul di frontend (real-time)
- [ ] Check backend logs (harus ada "NEW EMAIL RECEIVED")
- [ ] Check MongoDB (harus ada dokumen baru di collection emails)
- [ ] Tunggu 15 menit, email terhapus otomatis

---

## 🐛 Post-Deployment Troubleshooting

### Backend Issues

**Backend tidak bisa diakses:**
- [ ] Check Render logs
- [ ] Check environment variables
- [ ] Test URL: `curl https://xxx.onrender.com/`

**MongoDB connection error:**
- [ ] Check MONGODB_URI format
- [ ] Check Network Access di MongoDB Atlas
- [ ] Check database user credentials

### Frontend Issues

**Frontend tidak load:**
- [ ] Check Vercel logs
- [ ] Check build logs
- [ ] Check environment variables

**Socket.io tidak connect:**
- [ ] Check browser console
- [ ] Check CORS (FRONTEND_URL di backend)
- [ ] Check VITE_BACKEND_URL di frontend

### Email Issues

**Email tidak masuk:**
- [ ] Check MX Records: `nslookup -type=MX domain-saya.my.id`
- [ ] Check Mailgun domain status
- [ ] Check Mailgun Route configuration
- [ ] Check Mailgun logs
- [ ] Check backend webhook endpoint
- [ ] Check backend logs

---

## 📊 Monitoring

### Daily Checks

- [ ] Frontend accessible
- [ ] Backend accessible
- [ ] Email receiving working
- [ ] No errors in logs

### Weekly Checks

- [ ] Review Render logs
- [ ] Review Vercel logs
- [ ] Review Mailgun usage (max 5000/month)
- [ ] Review MongoDB storage (max 512MB)

---

## 🎉 Success Criteria

Semua ini harus berfungsi:

1. ✅ Frontend load tanpa error
2. ✅ Email address ter-generate otomatis
3. ✅ Socket.io connected (status "Terhubung")
4. ✅ Email dikirim ke alamat yang di-generate
5. ✅ Email muncul di inbox secara real-time (< 5 detik)
6. ✅ Email detail bisa dibuka
7. ✅ Email terhapus setelah 15 menit
8. ✅ Generate new email berfungsi
9. ✅ Copy to clipboard berfungsi
10. ✅ Responsive di mobile

---

## 📞 Need Help?

Jika stuck di salah satu step:

1. Check dokumentasi:
   - README.md
   - SETUP_GUIDE.md
   - backend/README.md

2. Check logs:
   - Render: Dashboard → Logs
   - Vercel: Dashboard → Deployments → Logs
   - MongoDB: Atlas → Database → Monitoring
   - Mailgun: Dashboard → Logs

3. Common issues:
   - CORS error → Check FRONTEND_URL
   - MongoDB error → Check Network Access
   - Email tidak masuk → Check DNS & Mailgun Route

---

**Dibuat oleh Jarvis untuk Tuan Fadhli** 🚀
