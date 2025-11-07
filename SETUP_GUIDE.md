# 📘 Panduan Setup Lengkap - Temp Mail

Panduan step-by-step untuk setup aplikasi Temp Mail dari awal hingga deployment.

## 📋 Prerequisites

- Node.js v18+ installed
- MongoDB Atlas account (free tier)
- Mailgun account (free tier)
- Domain sendiri (.my.id atau lainnya)
- Git installed
- Text editor (VS Code recommended)

---

## 🎯 TAHAP 1: Setup Lokal

### 1.1 Clone & Install Dependencies

```bash
# Clone repository
git clone <repository-url>
cd my-temp-mail

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 1.2 Setup MongoDB Atlas

1. **Buat Akun MongoDB Atlas**
   - Kunjungi https://www.mongodb.com/cloud/atlas
   - Sign up dengan email
   - Pilih "Build a Database" → "M0 FREE"
   - Pilih region terdekat (Singapore recommended untuk Indonesia)

2. **Setup Database**
   - Database Name: `temp_mail`
   - Buat user dengan username & password
   - Simpan credentials ini!

3. **Network Access**
   - Klik "Network Access" di sidebar
   - "Add IP Address"
   - Pilih "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

4. **Dapatkan Connection String**
   - Kembali ke "Database"
   - Klik "Connect" pada cluster Anda
   - Pilih "Connect your application"
   - Copy connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 1.3 Setup Environment Variables

**Frontend (.env di root folder):**
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_EMAIL_DOMAIN=domain-saya.my.id
```

**Backend (.env di folder backend/):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
FRONTEND_URL=http://localhost:5173
EMAIL_DOMAIN=domain-saya.my.id
NODE_ENV=development
```

⚠️ **Ganti:**
- `username:password` dengan credentials MongoDB Anda
- `domain-saya.my.id` dengan domain Anda yang sebenarnya

### 1.4 Test Run Lokal

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

Anda harus melihat:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

Buka browser: `http://localhost:5173`

Anda harus melihat halaman Temp Mail dengan alamat email yang sudah ter-generate.

---

## 🌐 TAHAP 2: Setup Domain & Mailgun

### 2.1 Setup Mailgun Account

1. **Daftar Mailgun**
   - Kunjungi https://www.mailgun.com/
   - Sign up (free plan - 5,000 email/bulan)
   - Verifikasi email

2. **Add Domain**
   - Dashboard → "Sending" → "Domains"
   - "Add New Domain"
   - Masukkan domain Anda: `domain-saya.my.id`
   - Submit

3. **Verify Domain**
   Mailgun akan memberikan DNS records yang harus ditambahkan:

### 2.2 Setup DNS Records

Login ke provider domain Anda (Cloudflare, Namecheap, dll) dan tambahkan:

**MX Records:**
```
Type: MX
Name: @ (atau domain-saya.my.id)
Priority: 10
Value: mxa.mailgun.org

Type: MX
Name: @ (atau domain-saya.my.id)
Priority: 10
Value: mxb.mailgun.org
```

**TXT Records (SPF):**
```
Type: TXT
Name: @
Value: v=spf1 include:mailgun.org ~all
```

**TXT Records (DKIM):**
Mailgun akan memberikan nilai seperti ini:
```
Type: TXT
Name: smtp._domainkey
Value: k=rsa; p=MIGfMA0GCSqGSI... (panjang)
```

**CNAME Records (Tracking):**
```
Type: CNAME
Name: email
Value: mailgun.org
```

⏰ **Tunggu 10-60 menit** untuk DNS propagation.

### 2.3 Verify Domain di Mailgun

- Kembali ke Mailgun Dashboard
- Klik "Verify DNS Settings"
- Pastikan semua ✅ hijau

---

## 🔌 TAHAP 3: Setup Mailgun Webhook (LOKAL)

### 3.1 Install ngrok

```bash
# Download ngrok dari https://ngrok.com/
# Atau install via:
npm install -g ngrok

# Buat account di ngrok.com dan dapatkan authtoken
ngrok config add-authtoken <your-authtoken>
```

### 3.2 Expose Backend Lokal

```bash
# Jalankan backend di terminal 1
cd backend
npm start

# Di terminal lain, jalankan ngrok
ngrok http 5000
```

Anda akan mendapat URL seperti:
```
Forwarding: https://abc123.ngrok.io -> http://localhost:5000
```

**Simpan URL ini!** (misal: `https://abc123.ngrok.io`)

### 3.3 Setup Mailgun Route

1. **Mailgun Dashboard** → "Sending" → "Routes"
2. **Create Route**:
   - **Expression Type**: Match Recipient
   - **Recipient**: `*@domain-saya.my.id` (wildcard = catch all)
   - **Actions**: 
     - ✅ Forward to Webhook
     - URL: `https://abc123.ngrok.io/webhook-mailgun`
   - **Priority**: 0
   - **Description**: Temp Mail Webhook
3. **Create Route**

### 3.4 Test Email

Kirim test email ke alamat yang dihasilkan aplikasi:

**Option 1: Gmail**
- Login Gmail
- Compose email
- To: `test@domain-saya.my.id`
- Subject: Test Email
- Body: Isi apa saja
- Send

**Option 2: Command Line (Linux/Mac)**
```bash
echo "This is test email body" | mail -s "Test Subject" test@domain-saya.my.id
```

**Check:**
- Backend logs harus menampilkan "📬 NEW EMAIL RECEIVED"
- Frontend harus menampilkan email baru secara real-time
- MongoDB harus ada dokumen baru di collection `emails`

---

## 🚀 TAHAP 4: Deployment

### 4.1 Deploy Backend ke Render

1. **Push code ke GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Buat akun Render**
   - Kunjungi https://render.com/
   - Sign up dengan GitHub

3. **Create Web Service**
   - Dashboard → "New" → "Web Service"
   - Connect GitHub repository
   - Settings:
     - **Name**: `temp-mail-backend`
     - **Root Directory**: `backend`
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
     - **Plan**: Free

4. **Environment Variables**
   Di "Environment" tab, tambahkan:
   ```
   MONGODB_URI = mongodb+srv://...
   FRONTEND_URL = https://your-app.vercel.app
   EMAIL_DOMAIN = domain-saya.my.id
   NODE_ENV = production
   ```

5. **Deploy**
   - Klik "Create Web Service"
   - Tunggu build selesai (~5 menit)
   - Dapatkan URL: `https://temp-mail-backend-xxxx.onrender.com`

⚠️ **PENTING**: Free tier Render akan sleep setelah 15 menit inactivity. First request akan butuh ~30 detik untuk wake up.

### 4.2 Deploy Frontend ke Vercel

1. **Update .env**
   Ganti VITE_BACKEND_URL dengan URL Render:
   ```env
   VITE_BACKEND_URL=https://temp-mail-backend-xxxx.onrender.com
   VITE_EMAIL_DOMAIN=domain-saya.my.id
   ```

2. **Deploy ke Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

   Atau via Dashboard:
   - Kunjungi https://vercel.com/
   - Import GitHub repository
   - Framework Preset: **Vite**
   - Root Directory: `./` (root)
   - Environment Variables:
     ```
     VITE_BACKEND_URL = https://temp-mail-backend-xxxx.onrender.com
     VITE_EMAIL_DOMAIN = domain-saya.my.id
     ```
   - Deploy

3. **Dapatkan URL**: `https://your-app.vercel.app`

### 4.3 Update Backend Environment

Kembali ke Render, update `FRONTEND_URL`:
```
FRONTEND_URL = https://your-app.vercel.app
```

Redeploy backend.

### 4.4 Update Mailgun Route

Ganti webhook URL dari ngrok ke URL Render:
```
https://temp-mail-backend-xxxx.onrender.com/webhook-mailgun
```

---

## ✅ TAHAP 5: Testing Production

### 5.1 Test Full Flow

1. Buka `https://your-app.vercel.app`
2. Copy email address yang dihasilkan (misal: `happy-cat-123@domain-saya.my.id`)
3. Kirim email ke alamat tersebut dari Gmail/provider lain
4. Email harus muncul di website dalam beberapa detik
5. Tunggu 15 menit, email harus terhapus otomatis

### 5.2 Monitoring

**Backend Logs (Render):**
- Dashboard → Your Service → "Logs" tab
- Watch untuk "NEW EMAIL RECEIVED"

**MongoDB:**
- MongoDB Atlas → Database → Browse Collections
- Collection: `emails`
- Harus terlihat email yang masuk
- Setelah 15 menit, dokumen akan terhapus otomatis

---

## 🐛 Troubleshooting

### Email Tidak Masuk

**Check 1: DNS Records**
```bash
# Test MX records
nslookup -type=MX domain-saya.my.id

# Harus menampilkan:
mxa.mailgun.org
mxb.mailgun.org
```

**Check 2: Mailgun Domain Verified**
- Dashboard Mailgun → Domains
- Status harus "Active" dengan ✅

**Check 3: Mailgun Logs**
- Mailgun Dashboard → "Sending" → "Logs"
- Cari email yang dikirim
- Check status dan error messages

**Check 4: Backend Webhook**
- Test webhook URL di browser:
  ```
  https://temp-mail-backend-xxxx.onrender.com/
  ```
- Harus return JSON: `{"status": "ok", ...}`

**Check 5: Backend Logs**
- Render Dashboard → Logs
- Cari error messages

### Socket.io Tidak Connect

**Check CORS:**
- Backend `.env`: `FRONTEND_URL` harus sesuai dengan URL Vercel
- Redeploy backend setelah update

**Check Browser Console:**
- Open DevTools (F12)
- Console tab
- Cari error "Socket.io" atau "CORS"

### MongoDB Connection Error

**Check IP Whitelist:**
- MongoDB Atlas → Network Access
- Harus ada entry: `0.0.0.0/0` (Allow from anywhere)

**Check Connection String:**
- `.env` di backend
- Pastikan tidak ada spasi atau karakter aneh
- Username & password harus di-encode jika ada karakter spesial

---

## 📊 Monitoring & Maintenance

### Daily Checks

1. **Render Dashboard**: Pastikan backend running
2. **Vercel Dashboard**: Pastikan frontend deployed
3. **MongoDB Atlas**: Check storage usage (free tier: 512MB)
4. **Mailgun Dashboard**: Check email quota (free: 5000/bulan)

### Monthly Maintenance

- Review MongoDB storage usage
- Review Mailgun email count
- Update dependencies:
  ```bash
  npm update
  cd backend && npm update
  ```

---

## 🎓 Next Steps

### Improvements

1. **Add Authentication** (optional)
   - User accounts
   - Saved email addresses
   - Email history per user

2. **Add Email Attachments**
   - Parse attachments dari Mailgun
   - Store di S3/Cloudinary
   - Display di frontend

3. **Add Email Forwarding**
   - Forward email ke email pribadi
   - Setup di Mailgun

4. **Custom Domain for Frontend**
   - Beli domain custom
   - Setup di Vercel
   - SSL auto-handled oleh Vercel

5. **Rate Limiting**
   - Prevent spam/abuse
   - Limit email per IP
   - Limit requests per minute

---

## 📞 Support

Jika ada masalah, check:
1. README.md di root folder
2. Backend README.md di `/backend/README.md`
3. Logs di Render & Vercel dashboards
4. MongoDB Atlas logs
5. Mailgun logs

---

## 🎉 Selamat!

Aplikasi Temp Mail Anda sudah live dan siap digunakan!

**URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://temp-mail-backend-xxxx.onrender.com`
- Email: `*@domain-saya.my.id`

Dibuat dengan ❤️ oleh **Jarvis untuk Tuan Fadhli**
