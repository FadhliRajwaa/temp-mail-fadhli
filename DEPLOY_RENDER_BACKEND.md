# 🚀 DEPLOY BACKEND KE RENDER.COM

## ✅ RENDER - FREE TIER BACKEND

Render cocok untuk backend Node.js dengan Socket.io:
- ✅ **750 jam gratis/bulan**
- ✅ **Auto HTTPS**
- ✅ **Support WebSocket/Socket.io**
- ✅ **MongoDB connection**
- ⚠️ **Sleep setelah 15 menit idle** (cold start 30-60s)

---

## 🚀 STEP-BY-STEP DEPLOYMENT (10 MENIT)

### STEP 1: Buat Akun Render (2 menit)

1. **Buka**: https://render.com
2. **Sign Up** dengan GitHub
3. **Authorize** Render untuk akses repositories
4. Verifikasi email jika diminta

---

### STEP 2: New Web Service (1 menit)

1. **Dashboard** → Klik **"New +"** (pojok kanan atas)
2. Pilih **"Web Service"**
3. **Connect** GitHub repository: `my-temp-mail`
4. Jika belum connect, klik **"Configure account"** → pilih repo

---

### STEP 3: Configure Web Service (5 menit)

#### **Basic Settings:**
```
Name: temp-mail-backend
(atau nama lain yang Anda suka)

Region: Singapore
(paling dekat dengan Indonesia - paling cepat!)

Branch: main
(atau master, sesuai branch utama Anda)

Root Directory: backend
(PENTING! Karena backend ada di folder /backend)

Runtime: Node
(auto-detect dari package.json)
```

#### **Build & Start Commands:**
```
Build Command: npm install

Start Command: node server.js
```

⚠️ **PENTING**: Pastikan `server.js` ada di folder `backend/`!

#### **Instance Type:**
```
Instance Type: Free
($0/month - 750 jam gratis)
```

---

### STEP 4: Environment Variables (3 menit)

Scroll ke **"Environment Variables"**, klik **"Add Environment Variable"**

Tambahkan **SEMUA** variable ini:

```
Key: MONGODB_URI
Value: mongodb+srv://rajwaarahmana45:123abc789@cluster0.cp7fh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

Key: PORT
Value: 5000

Key: EMAIL_DOMAIN
Value: mail.fadhlirajwaa.my.id

Key: SENDGRID_API_KEY
Value: SG.your-sendgrid-api-key-here

Key: FRONTEND_URL
Value: https://temp-mail.fadhlirajwaa.my.id

Key: NODE_ENV
Value: production
```

⚠️ **PENTING SEKALI**: 
- `FRONTEND_URL` harus **PERSIS** dengan domain Vercel Anda!
- Untuk CORS berfungsi dengan benar

---

### STEP 5: Create Web Service (2 menit)

1. Scroll ke bawah
2. Klik **"Create Web Service"**
3. Render akan mulai:
   - Clone repo ✅
   - Install dependencies ✅
   - Start server ✅
4. **Tunggu 3-5 menit** (building...)

---

### STEP 6: Dapatkan Backend URL (1 menit)

Setelah deploy sukses, Render akan generate URL:

```
https://temp-mail-backend.onrender.com
```

**Copy URL ini!** Kita perlu untuk:
1. Update Vercel environment variables
2. Setup SendGrid Inbound Parse

---

## ✅ STEP 7: VERIFIKASI BACKEND

### Test 1: Health Check
Buka di browser:
```
https://temp-mail-backend.onrender.com/api/stats
```

**Expected response:**
```json
{
  "success": true,
  "stats": {
    "totalEmails": 0,
    "activeRooms": 0,
    "connectedClients": 0,
    "uptime": 123.456
  }
}
```

✅ Jika muncul JSON di atas, **BACKEND ONLINE!**

### Test 2: Cek Logs
1. Render Dashboard → Pilih service
2. Klik **"Logs"** (tab kiri)
3. Harus muncul:
```
🚀 Server running on port 5000
✅ Connected to MongoDB
Socket.IO server ready
```

---

## 🔧 STEP 8: UPDATE FRONTEND ENVIRONMENT

Backend sudah online, sekarang update frontend!

### Di Vercel Dashboard:
1. Pilih project: `my-temp-mail`
2. **Settings** → **Environment Variables**
3. **Edit** `VITE_BACKEND_URL`:
```
Old: https://xxxx.railway.app
New: https://temp-mail-backend.onrender.com
```
4. **Save**
5. **Redeploy**: Deployments → Latest → **Redeploy**

Tunggu 1 menit, frontend akan update!

---

## 📧 STEP 9: SETUP SENDGRID INBOUND PARSE

Sekarang backend sudah punya URL, setup webhook!

### Di SendGrid Dashboard:
1. **Settings** → **Inbound Parse**
2. Klik **"Add Host & URL"**
3. **Configure**:

```
Subdomain: mail
Domain: fadhlirajwaa.my.id
(akan jadi: mail.fadhlirajwaa.my.id)

URL: https://temp-mail-backend.onrender.com/api/sendgrid/webhook

POST the raw, full MIME message: ✅ CHECK

Check spam: ❌ UNCHECK
```

4. Klik **"Add"**

✅ **Webhook configured!**

---

## 🧪 STEP 10: TEST EMAIL RECEIVING!

### Test Lengkap:

1. **Buka frontend**: https://temp-mail.fadhlirajwaa.my.id
2. **Generate email** (klik "Buat Baru")
3. **Copy email** yang di-generate
4. **Kirim test email** dari Gmail/Yahoo:
   ```
   To: [email-yang-digenerate]@mail.fadhlirajwaa.my.id
   Subject: Test Email
   Body: Halo, ini test!
   ```
5. **Tunggu 5-10 detik**
6. **Email harus muncul** di UI! 🎉

---

## ⚠️ RENDER FREE TIER - COLD START

### Masalah:
Server **sleep** setelah 15 menit tidak ada traffic.
Saat ada request baru, butuh **30-60 detik** untuk wake up.

### Solusi:

#### **Option 1: Keep Alive dengan Cron Job (GRATIS)**

Gunakan **cron-job.org**:

1. Buka: https://cron-job.org/en/
2. Sign up gratis
3. **Create cronjob**:
```
Title: Render Keep Alive
URL: https://temp-mail-backend.onrender.com/api/stats
Schedule: */10 * * * * (every 10 minutes)
```
4. Save

Server akan di-ping setiap 10 menit, jadi tidak sleep!

#### **Option 2: Upgrade ke Paid ($7/bulan)**
- No sleep
- Always on
- Lebih cepat

---

## 📊 MONITORING

### Cek Backend Status:

**Render Dashboard:**
- **Logs**: Real-time logs
- **Metrics**: CPU, Memory usage
- **Events**: Deploy history

**Test Endpoints:**
```
GET  /api/stats          → Server stats
GET  /api/emails/:email  → List emails
POST /api/sendgrid/webhook → Receive email (dari SendGrid)
```

---

## 🚨 TROUBLESHOOTING

### Backend tidak start?
**Cek Logs di Render:**
- MongoDB connection error? → Cek `MONGODB_URI`
- Port error? → Pastikan `PORT=5000`
- Module not found? → Cek `package.json` di folder `backend/`

### Frontend tidak connect?
**Fix:**
1. Cek `VITE_BACKEND_URL` di Vercel
2. Redeploy frontend
3. Cek CORS: `FRONTEND_URL` harus match

### Email tidak masuk?
**Debug:**
1. Cek SendGrid Logs: Dashboard → Activity → Inbound Parse
2. Cek Render Logs: Apakah webhook dipanggil?
3. Test manual:
```bash
curl -X POST https://temp-mail-backend.onrender.com/api/sendgrid/webhook \
  -F "to=test@mail.fadhlirajwaa.my.id" \
  -F "from=sender@gmail.com" \
  -F "subject=Test" \
  -F "text=Hello World"
```

### Cold start terlalu lama?
**Fix:** Setup cron job (option 1 di atas)

---

## ✅ FINAL CHECKLIST

- [ ] Backend deployed ke Render
- [ ] URL backend: `https://temp-mail-backend.onrender.com`
- [ ] Environment variables configured
- [ ] Backend online (test `/api/stats`)
- [ ] Vercel frontend updated dengan backend URL
- [ ] SendGrid Inbound Parse configured
- [ ] DNS MX record added (mx.sendgrid.net)
- [ ] Test email receiving ✅
- [ ] (Optional) Cron job for keep alive

---

## 🎯 ARCHITECTURE FINAL

```
┌──────────────────────────────────────────┐
│  USER                                    │
│  https://temp-mail.fadhlirajwaa.my.id   │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│  VERCEL (Frontend)                       │
│  React + Vite + Tailwind                 │
└──────────────┬───────────────────────────┘
               │ WebSocket + API
               ▼
┌──────────────────────────────────────────┐
│  RENDER (Backend)                        │
│  temp-mail-backend.onrender.com          │
│  Node.js + Express + Socket.io           │
└──────────┬───────────┬───────────────────┘
           │           │
           │           └──────────────┐
           ▼                          ▼
┌──────────────────┐      ┌──────────────────┐
│  MongoDB Atlas   │      │  SendGrid        │
│  Database        │      │  Inbound Parse   │
└──────────────────┘      └──────────────────┘
```

---

## 💰 TOTAL COST

| Service | Cost |
|---------|------|
| **Render** (Backend) | $0 (Free tier 750 jam) |
| **Vercel** (Frontend) | $0 (Unlimited gratis) |
| **MongoDB Atlas** | $0 (Free tier 512MB) |
| **SendGrid** | $0 (100 emails/hari) |
| **Domain** | Rp 150.000/tahun |
| **TOTAL** | **Rp 150.000/tahun** |

---

**🎉 SELAMAT! TEMP MAIL SUDAH FULL DEPLOYED!**

Next: Test email receiving! 📧
