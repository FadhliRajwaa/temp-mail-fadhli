# ✅ QUICK SETUP CHECKLIST - fadhlirajwaa.my.id

## 🎯 LANGKAH CEPAT (30 MENIT)

### ✅ STEP 1: SETUP MAILGUN (10 menit)
1. **Daftar Mailgun**: https://signup.mailgun.com
2. **Add Domain**: `mail.fadhlirajwaa.my.id`
3. **Catat DNS Records** yang diberikan Mailgun:
   - TXT (SPF)
   - TXT (DKIM) 
   - MX (2 records)
   - CNAME (tracking)

---

### ✅ STEP 2: KONFIGURASI DNS DI DOMAINESIA (10 menit)
1. Login: https://www.domainesia.com/clientarea.php
2. Pilih domain: **fadhlirajwaa.my.id**
3. **DNS Management**, tambahkan records dari Mailgun:

```
TXT | mail | v=spf1 include:mailgun.org ~all
TXT | k1._domainkey.mail | [COPY DARI MAILGUN]
MX  | mail | mxa.mailgun.org (priority 10)
MX  | mail | mxb.mailgun.org (priority 10)
```

4. **Tunggu 15-30 menit** untuk propagasi

---

### ✅ STEP 3: VERIFY DOMAIN DI MAILGUN (5 menit)
1. Kembali ke Mailgun Dashboard
2. **Domains** → pilih `mail.fadhlirajwaa.my.id`
3. Klik **"Verify DNS Settings"**
4. Harus muncul **✅ All records verified**

---

### ✅ STEP 4: DAPATKAN API CREDENTIALS (2 menit)
1. **API Key**: Settings → API Keys → Copy "Private API key"
2. **Webhook Key**: Settings → Webhooks → Copy "Signing key"

Update `backend/.env`:
```env
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxx
MAILGUN_WEBHOOK_SIGNING_KEY=xxxxxxxxxxxxxxxxxxxxx
```

---

### ✅ STEP 5: DEPLOY BACKEND (5 menit)

**Option A: Railway.app (RECOMMENDED)**
1. Buka: https://railway.app
2. Login dengan GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Pilih folder `backend`
5. **Add Variables** (copy dari `backend/.env`):
   ```
   MONGODB_URI=mongodb+srv://...
   PORT=5000
   EMAIL_DOMAIN=mail.fadhlirajwaa.my.id
   MAILGUN_API_KEY=key-xxx
   MAILGUN_DOMAIN=mail.fadhlirajwaa.my.id
   MAILGUN_WEBHOOK_SIGNING_KEY=xxx
   FRONTEND_URL=https://temp-mail.fadhlirajwaa.my.id
   ```
6. Deploy → Dapatkan URL: `https://xxxx.railway.app`

**Option B: Render.com**
1. Buka: https://render.com
2. **New Web Service** → Connect GitHub
3. Environment: **Node**
4. Build: `npm install`
5. Start: `node server.js`
6. Add environment variables (sama seperti Railway)

---

### ✅ STEP 6: SETUP WEBHOOK DI MAILGUN (2 menit)
1. Mailgun Dashboard → **Webhooks**
2. Domain: `mail.fadhlirajwaa.my.id`
3. **Add Webhook**:
   - Event: **Permanent Failure** (optional)
   - URL: `https://xxxx.railway.app/api/mailgun/webhook`
   (ganti dengan URL backend Anda)

---

### ✅ STEP 7: DEPLOY FRONTEND (5 menit)

**Netlify (RECOMMENDED - Auto SSL)**
1. Buka: https://netlify.com
2. **Add new site** → **Import from Git**
3. Connect GitHub → Pilih repo
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Environment variables**:
   ```
   VITE_BACKEND_URL=https://xxxx.railway.app
   VITE_EMAIL_DOMAIN=mail.fadhlirajwaa.my.id
   ```
6. Deploy!

---

### ✅ STEP 8: CUSTOM DOMAIN DI NETLIFY (5 menit)
1. Netlify Dashboard → **Domain settings**
2. **Add custom domain**: `temp-mail.fadhlirajwaa.my.id`
3. Netlify akan kasih instruksi DNS

Di Domainesia, tambahkan:
```
CNAME | temp-mail | [netlify-url].netlify.app
```

Atau untuk root domain:
```
A | @ | 75.2.60.5
```

---

### ✅ STEP 9: TEST (2 menit)
1. Buka: `https://temp-mail.fadhlirajwaa.my.id`
2. Klik **"Buat Baru"** untuk generate email
3. Kirim test email dari Gmail ke: `[generated]@mail.fadhlirajwaa.my.id`
4. Email harus muncul di UI dalam beberapa detik!

---

## 🚨 TROUBLESHOOTING CEPAT

### ❌ Email tidak masuk?
```bash
# Cek DNS propagation
nslookup -type=MX mail.fadhlirajwaa.my.id

# Cek Mailgun logs
Mailgun Dashboard → Logs
```

### ❌ Webhook error?
- Cek backend logs di Railway/Render
- Pastikan URL webhook benar
- Pastikan `MAILGUN_WEBHOOK_SIGNING_KEY` sudah diisi

### ❌ Frontend tidak connect ke backend?
- Cek `VITE_BACKEND_URL` di Netlify environment variables
- Pastikan backend URL bisa diakses (buka di browser)
- Cek CORS: `FRONTEND_URL` di backend harus sesuai dengan URL Netlify

---

## 📊 ARCHITECTURE

```
┌──────────────────────────────────────────────┐
│  USER kirim email ke:                        │
│  anything@mail.fadhlirajwaa.my.id           │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│  MAILGUN (Email Service)                     │
│  - Receive email                             │
│  - Trigger webhook                           │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│  BACKEND (Railway/Render)                    │
│  https://xxxx.railway.app                    │
│  - Receive webhook from Mailgun              │
│  - Save email to MongoDB                     │
│  - Send to Frontend via Socket.io            │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│  MONGODB ATLAS                               │
│  - Store emails (auto-delete 15 min)        │
└──────────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────┐
│  FRONTEND (Netlify)                          │
│  https://temp-mail.fadhlirajwaa.my.id       │
│  - Display emails real-time                  │
│  - Generate random email addresses           │
└──────────────────────────────────────────────┘
```

---

## 💰 BIAYA

| Service | Plan | Cost | Limit |
|---------|------|------|-------|
| **Domain** | Domainesia | ~Rp 150.000/tahun | - |
| **Mailgun** | Free Tier | $0 | 5,000 emails/bulan |
| **Railway** | Free Tier | $0 | 500 jam/bulan |
| **Netlify** | Free Tier | $0 | Unlimited |
| **MongoDB** | Free Tier | $0 | 512MB storage |
| **TOTAL** | | **Rp 150.000/tahun** | |

---

## 📞 NEXT STEPS

Setelah semua setup:
1. ✅ Monitor logs di Railway/Render
2. ✅ Monitor Mailgun usage (jangan sampai over limit)
3. ✅ Backup MongoDB secara berkala
4. ✅ Test email receiving tiap hari
5. ✅ Add custom branding/logo

---

**🎉 SELAMAT! TEMP MAIL SUDAH LIVE!**

URL: https://temp-mail.fadhlirajwaa.my.id
Email: anything@mail.fadhlirajwaa.my.id
