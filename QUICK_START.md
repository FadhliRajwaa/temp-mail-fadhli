# ⚡ Quick Start Guide

Panduan cepat untuk menjalankan aplikasi Temp Mail di lokal.

## 📋 Prerequisites Check

Sebelum mulai, pastikan sudah terinstall:

```bash
# Check Node.js (harus v18+)
node --version

# Check npm
npm --version
```

❌ **Jika belum terinstall:** Baca `INSTALL_NODEJS.md`

## 🚀 Langkah Cepat (5 Menit)

### 1. Install Dependencies

**Frontend:**
```bash
cd E:\my-temp-mail
npm install
```

Output yang diharapkan:
```
added XXX packages in XXs
```

**Backend:**
```bash
cd E:\my-temp-mail\backend
npm install
```

Output yang diharapkan:
```
added XX packages in XXs
```

### 2. Setup Environment Variables

**Frontend (.env di root):**
```bash
cd E:\my-temp-mail
copy .env.example .env
```

Edit `.env`:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_EMAIL_DOMAIN=domain-saya.my.id
```

**Backend (.env di folder backend):**
```bash
cd E:\my-temp-mail\backend
copy .env.example .env
```

Edit `backend\.env`:
```env
MONGODB_URI=mongodb+srv://rajwaarahmana45:123abc789@cluster0.cp7fh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
FRONTEND_URL=http://localhost:5173
EMAIL_DOMAIN=domain-saya.my.id
NODE_ENV=development
```

### 3. Jalankan Aplikasi

**Terminal 1 - Backend:**
```bash
cd E:\my-temp-mail\backend
npm start
```

✅ **Success jika melihat:**
```
✅ MongoDB Connected Successfully
📊 Database: temp_mail
🚀 Server running on port 5000
```

❌ **Jika error:**
- Check MongoDB connection string di `.env`
- Pastikan internet tersambung
- Check firewall

**Terminal 2 - Frontend:**
```bash
cd E:\my-temp-mail
npm run dev
```

✅ **Success jika melihat:**
```
VITE v5.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 4. Buka Browser

Kunjungi: **http://localhost:5173**

Anda akan melihat:
- ✅ Alamat email ter-generate otomatis
- ✅ Status "Terhubung" di header
- ✅ Inbox kosong (belum ada email)

## 🎉 Aplikasi Berjalan!

Sekarang Anda bisa:
1. **Copy alamat email** yang ter-generate
2. **Kirim test email** ke alamat tersebut dari Gmail/provider lain
3. **Lihat email muncul** secara real-time di website

## 🧪 Test Email (Opsional)

Untuk test tanpa Mailgun setup, Anda bisa simulate dengan curl:

```bash
curl -X POST http://localhost:5000/webhook-mailgun ^
  -F "recipient=test@domain-saya.my.id" ^
  -F "sender=tester@gmail.com" ^
  -F "subject=Test Email" ^
  -F "body-plain=This is test email body"
```

Email akan muncul di inbox jika:
- Backend running
- Frontend running
- Socket.io connected
- Email address match dengan yang di-generate

## 📝 Catatan Penting

### Port yang Digunakan
- **Backend**: 5000
- **Frontend**: 5173

Pastikan port ini tidak digunakan aplikasi lain.

### Check Port Usage (Windows)
```bash
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

### Kill Process di Port (jika bentrok)
```bash
# Find PID
netstat -ano | findstr :5000

# Kill process (ganti XXXX dengan PID)
taskkill /PID XXXX /F
```

## 🔧 Development Commands

### Frontend
```bash
npm run dev      # Run development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
npm start        # Run server
npm run dev      # Run with auto-reload (Node 18+)
npm run lint     # Run ESLint
```

## 🐛 Common Issues

### Frontend tidak bisa connect ke Backend

**Symptom:** Status "Terputus" di header

**Fix:**
1. Check backend running di terminal 1
2. Check VITE_BACKEND_URL di frontend `.env`
3. Check browser console untuk error CORS
4. Restart frontend

### Backend tidak connect ke MongoDB

**Symptom:** Error "MongoDB Connection Failed"

**Fix:**
1. Check MONGODB_URI di backend `.env`
2. Check internet connection
3. Check MongoDB Atlas Network Access (0.0.0.0/0)
4. Test connection string di MongoDB Compass

### Port sudah digunakan

**Symptom:** Error "Port 5000 already in use"

**Fix:**
1. Kill process di port tersebut
2. Atau ganti PORT di backend `.env`

## 📚 Next Steps

Setelah aplikasi berjalan di lokal:

1. **Setup Mailgun** → Baca `SETUP_GUIDE.md` bagian "Setup Mailgun"
2. **Test dengan Real Email** → Setup DNS & Mailgun webhook
3. **Deploy** → Baca `DEPLOYMENT_CHECKLIST.md`

## 📞 Need Help?

Check dokumentasi:
- `README.md` - Overview lengkap
- `SETUP_GUIDE.md` - Setup detail
- `backend/README.md` - Backend documentation
- `DEPLOYMENT_CHECKLIST.md` - Deployment guide

---

**Dibuat oleh Jarvis untuk Tuan Fadhli** ⚡
