# 🌐 PANDUAN SETUP DOMAIN MAILGUN - fadhlirajwaa.my.id

## 📋 Overview
Domain: **fadhlirajwaa.my.id**
Provider: **Domainesia**
Email Service: **Mailgun** (Free tier - 5,000 emails/bulan)

---

## 🎯 STEP 1: SETUP MAILGUN ACCOUNT

### 1.1 Daftar Mailgun
1. Buka: https://signup.mailgun.com/new/signup
2. Pilih **Free Trial** (tidak perlu kartu kredit untuk receiving)
3. Verifikasi email

### 1.2 Add Domain di Mailgun
1. Login ke Mailgun Dashboard
2. Klik **"Sending"** → **"Domains"**
3. Klik **"Add New Domain"**
4. Masukkan: `mail.fadhlirajwaa.my.id` (subdomain untuk email)
5. Region: **EU** (lebih stabil) atau **US**
6. Klik **"Add Domain"**

### 1.3 Dapatkan DNS Records
Setelah add domain, Mailgun akan memberikan **DNS Records** yang harus ditambahkan:

```
TXT Records (untuk verifikasi & SPF):
- Hostname: mail.fadhlirajwaa.my.id
- Value: v=spf1 include:mailgun.org ~all

TXT Records (untuk DKIM):
- Hostname: k1._domainkey.mail.fadhlirajwaa.my.id
- Value: k=rsa; p=MIGfMA0G... (panjang, copy dari Mailgun)

MX Records (untuk receive email):
- Priority: 10
- Hostname: mail.fadhlirajwaa.my.id
- Value: mxa.mailgun.org

- Priority: 10
- Hostname: mail.fadhlirajwaa.my.id
- Value: mxb.mailgun.org

CNAME Record (untuk tracking):
- Hostname: email.mail.fadhlirajwaa.my.id
- Value: mailgun.org
```

---

## 🔧 STEP 2: KONFIGURASI DNS DI DOMAINESIA

### 2.1 Login ke Domainesia
1. Buka: https://www.domainesia.com/clientarea.php
2. Login dengan akun Anda
3. Klik **"Services"** → **"My Services"**
4. Pilih domain **fadhlirajwaa.my.id**
5. Klik **"Manage Domain"**

### 2.2 Tambahkan DNS Records
Masuk ke **"DNS Management"** atau **"Manage DNS"**, lalu tambahkan:

#### A. TXT Record (SPF)
```
Type: TXT
Hostname: mail
Value: v=spf1 include:mailgun.org ~all
TTL: 3600
```

#### B. TXT Record (DKIM)
```
Type: TXT
Hostname: k1._domainkey.mail
Value: [COPY DARI MAILGUN - panjang sekali]
TTL: 3600
```

#### C. MX Record #1
```
Type: MX
Hostname: mail
Priority: 10
Value: mxa.mailgun.org
TTL: 3600
```

#### D. MX Record #2
```
Type: MX
Hostname: mail
Priority: 10
Value: mxb.mailgun.org
TTL: 3600
```

#### E. CNAME Record (Optional - untuk tracking)
```
Type: CNAME
Hostname: email.mail
Value: mailgun.org
TTL: 3600
```

### 2.3 Tunggu Propagasi DNS
- DNS propagasi biasanya **15 menit - 48 jam**
- Cek status: https://dnschecker.org
- Masukkan: `mail.fadhlirajwaa.my.id`

---

## 🔑 STEP 3: DAPATKAN API CREDENTIALS

### 3.1 Mailgun API Key
1. Di Mailgun Dashboard, klik **"Settings"** → **"API Keys"**
2. Copy **"Private API key"** (mulai dengan `key-...`)
3. Simpan di tempat aman

### 3.2 Webhook Signing Key
1. Di Mailgun Dashboard, klik **"Settings"** → **"Webhooks"**
2. Copy **"HTTP webhook signing key"**
3. Simpan di tempat aman

---

## 📦 STEP 4: UPDATE ENVIRONMENT VARIABLES

### 4.1 Backend (.env)
Update file `backend/.env`:

```env
# MongoDB
MONGODB_URI=mongodb+srv://rajwaarahmana45:123abc789@cluster0.cp7fh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Server
PORT=5000
NODE_ENV=production

# Frontend URL (update setelah deploy)
FRONTEND_URL=https://temp-mail.fadhlirajwaa.my.id

# Email Domain
EMAIL_DOMAIN=mail.fadhlirajwaa.my.id

# Mailgun Credentials
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=mail.fadhlirajwaa.my.id
MAILGUN_WEBHOOK_SIGNING_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4.2 Frontend (.env)
Update file `.env`:

```env
# Backend API URL (update setelah deploy backend)
VITE_BACKEND_URL=https://api.fadhlirajwaa.my.id

# Email Domain
VITE_EMAIL_DOMAIN=mail.fadhlirajwaa.my.id
```

---

## 🎯 STEP 5: SETUP MAILGUN WEBHOOK

### 5.1 Deploy Backend Dulu
Sebelum setup webhook, backend harus sudah online dengan URL public.

**Option 1: Deploy ke Railway.app (GRATIS)**
1. Buka: https://railway.app
2. Login dengan GitHub
3. **New Project** → **Deploy from GitHub**
4. Pilih repo backend
5. Add environment variables dari `backend/.env`
6. Deploy!
7. Railway akan generate URL: `https://xxxxx.railway.app`

**Option 2: Deploy ke Render.com (GRATIS)**
1. Buka: https://render.com
2. **New Web Service**
3. Connect GitHub repo
4. Environment: Node
5. Build Command: `npm install`
6. Start Command: `node server.js`
7. Add environment variables
8. Deploy!

### 5.2 Setup Webhook di Mailgun
1. Buka Mailgun Dashboard
2. Klik **"Sending"** → **"Webhooks"**
3. Pilih domain: `mail.fadhlirajwaa.my.id`
4. Klik **"Add webhook"**
5. Event Type: **"Permanent Failure"**, **"Delivered"**, **"Opened"** (tidak perlu semua)
6. Yang PENTING: **"Incoming Messages"** atau **"Stored Messages"**
7. URL: `https://xxxxx.railway.app/api/mailgun/webhook`
   (ganti dengan URL backend Anda)
8. Klik **"Create Webhook"**

### 5.3 Test Webhook
```bash
curl -X POST https://xxxxx.railway.app/api/mailgun/webhook \
  -d "recipient=test@mail.fadhlirajwaa.my.id" \
  -d "sender=example@gmail.com" \
  -d "subject=Test Email" \
  -d "body-plain=This is a test"
```

---

## 🔒 STEP 6: VERIFIKASI DOMAIN DI MAILGUN

### 6.1 Cek Status Verifikasi
1. Buka Mailgun Dashboard
2. Klik **"Sending"** → **"Domains"**
3. Pilih `mail.fadhlirajwaa.my.id`
4. Klik **"Verify DNS Settings"**

Harus muncul **"All records verified"** dengan centang hijau ✅

### 6.2 Jika Ada Error
- **TXT Record not found**: Cek lagi di Domainesia, pastikan `Hostname: mail`
- **MX Record not found**: Tunggu DNS propagasi (bisa sampai 24 jam)
- **DKIM failed**: Copy ulang DKIM value dari Mailgun, pastikan tidak ada spasi

---

## 📧 STEP 7: TEST EMAIL RECEIVING

### 7.1 Send Test Email
Kirim email ke: `anything@mail.fadhlirajwaa.my.id`

Dari Gmail/Yahoo/Outlook, kirim email ke alamat random:
- `test123@mail.fadhlirajwaa.my.id`
- `hello@mail.fadhlirajwaa.my.id`

### 7.2 Cek di Mailgun Logs
1. Buka Mailgun Dashboard
2. Klik **"Logs"** di sidebar
3. Harus muncul email yang masuk

### 7.3 Cek di Backend
Email akan otomatis dikirim ke backend via webhook dan disimpan di MongoDB.

---

## 🚀 STEP 8: DEPLOY FRONTEND

### 8.1 Deploy ke Netlify (GRATIS + Auto SSL)
1. Buka: https://netlify.com
2. Login dengan GitHub
3. **"Add new site"** → **"Import existing project"**
4. Connect GitHub repo
5. Build settings:
   - Base directory: (kosongkan)
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Environment variables** (klik "Show advanced"):
   ```
   VITE_BACKEND_URL=https://xxxxx.railway.app
   VITE_EMAIL_DOMAIN=mail.fadhlirajwaa.my.id
   ```
7. **Deploy site**

### 8.2 Custom Domain di Netlify
1. Setelah deploy, klik **"Domain settings"**
2. Klik **"Add custom domain"**
3. Masukkan: `temp-mail.fadhlirajwaa.my.id` (subdomain untuk frontend)
4. Netlify akan kasih instruksi DNS

### 8.3 Update DNS di Domainesia (untuk Frontend)
```
Type: CNAME
Hostname: temp-mail
Value: [netlify-generated-url].netlify.app
TTL: 3600
```

Atau jika ingin root domain:
```
Type: A
Hostname: @
Value: 75.2.60.5 (Netlify Load Balancer IP)
TTL: 3600
```

---

## ✅ CHECKLIST FINAL

### DNS Records (di Domainesia)
- [ ] TXT record untuk SPF (`mail` → `v=spf1 include:mailgun.org ~all`)
- [ ] TXT record untuk DKIM (`k1._domainkey.mail` → value dari Mailgun)
- [ ] MX record #1 (`mail` → `mxa.mailgun.org` priority 10)
- [ ] MX record #2 (`mail` → `mxb.mailgun.org` priority 10)
- [ ] CNAME untuk frontend (`temp-mail` → Netlify URL)

### Mailgun Setup
- [ ] Domain `mail.fadhlirajwaa.my.id` ter-verifikasi
- [ ] Webhook configured untuk incoming messages
- [ ] API key tersimpan di backend `.env`

### Backend Deployment
- [ ] Deploy di Railway/Render
- [ ] Environment variables configured
- [ ] Endpoint `/api/mailgun/webhook` accessible
- [ ] MongoDB connected

### Frontend Deployment
- [ ] Deploy di Netlify
- [ ] Environment variables configured
- [ ] Custom domain `temp-mail.fadhlirajwaa.my.id` active
- [ ] SSL certificate active (auto dari Netlify)

### Testing
- [ ] Kirim test email ke `test@mail.fadhlirajwaa.my.id`
- [ ] Email muncul di Mailgun Logs
- [ ] Email muncul di frontend (via Socket.io)
- [ ] Email tersimpan di MongoDB
- [ ] Auto-delete setelah 15 menit (cek MongoDB TTL index)

---

## 🆘 TROUBLESHOOTING

### Email Tidak Masuk
1. Cek Mailgun Logs (apakah email diterima Mailgun?)
2. Cek webhook logs (apakah webhook terpanggil?)
3. Cek backend logs (apakah ada error?)
4. Cek MongoDB (apakah email tersimpan?)

### DNS Tidak Propagate
```bash
# Cek MX record
nslookup -type=MX mail.fadhlirajwaa.my.id

# Cek TXT record
nslookup -type=TXT mail.fadhlirajwaa.my.id

# Cek dengan Google DNS
nslookup -type=MX mail.fadhlirajwaa.my.id 8.8.8.8
```

### Mailgun Domain Not Verified
- Tunggu 24-48 jam untuk DNS propagasi
- Clear DNS cache: `ipconfig /flushdns` (Windows)
- Cek typo di DNS records

---

## 💡 TIPS

1. **Gunakan subdomain** `mail.fadhlirajwaa.my.id` untuk email (lebih clean)
2. **Mailgun Free Tier** cukup untuk testing (5,000 emails/bulan)
3. **Railway.app** untuk backend (500 jam gratis/bulan)
4. **Netlify** untuk frontend (unlimited gratis + auto SSL)
5. **Monitor logs** di Mailgun & Railway untuk debug
6. **Backup MongoDB** secara berkala

---

## 📞 SUPPORT

Jika ada masalah:
1. Cek Mailgun Documentation: https://documentation.mailgun.com
2. Cek Railway Documentation: https://docs.railway.app
3. Domainesia Support: https://www.domainesia.com/contact

---

**Status:** Ready to Deploy! 🚀
