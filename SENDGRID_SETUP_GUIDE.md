# 📧 PANDUAN SETUP SENDGRID - fadhlirajwaa.my.id

## 📋 Overview
Domain: **fadhlirajwaa.my.id**
Provider: **Domainesia**
Email Service: **SendGrid** (Free tier - 100 emails/hari)

⚠️ **PENTING**: SendGrid free tier hanya untuk **SENDING**. Untuk **RECEIVING**, kita gunakan **Inbound Parse**.

---

## 🎯 STEP 1: SETUP SENDGRID ACCOUNT

### 1.1 Daftar SendGrid
1. Buka: https://signup.sendgrid.com
2. Pilih **Free Plan** (100 emails/hari)
3. Isi form registrasi
4. Verifikasi email
5. Lengkapi profile (SendGrid sangat strict dengan verifikasi)

### 1.2 Verifikasi Identity
SendGrid memerlukan verifikasi identity sebelum bisa kirim email:
1. Dashboard → **Settings** → **Sender Authentication**
2. Pilih **"Domain Authentication"**
3. Masukkan domain: `mail.fadhlirajwaa.my.id`

---

## 🔧 STEP 2: DOMAIN AUTHENTICATION (DKIM/SPF)

### 2.1 Setup Domain Authentication di SendGrid
1. **Settings** → **Sender Authentication**
2. Klik **"Authenticate Your Domain"**
3. DNS Host: **Other**
4. Domain: `mail.fadhlirajwaa.my.id`
5. Advanced Settings:
   - Use automated security: ✅
   - Use custom return path: ❌ (optional)

### 2.2 DNS Records yang Diberikan SendGrid
SendGrid akan memberikan 3 CNAME records:

```
CNAME Records (untuk DKIM):
Hostname: em1234._domainkey.mail
Value: em1234.dkim.u12345678.wl123.sendgrid.net

Hostname: s1._domainkey.mail
Value: s1.domainkey.u12345678.wl123.sendgrid.net

Hostname: s2._domainkey.mail
Value: s2.domainkey.u12345678.wl123.sendgrid.net
```

---

## 🌐 STEP 3: KONFIGURASI DNS DI DOMAINESIA

### 3.1 Login ke Domainesia
1. Buka: https://www.domainesia.com/clientarea.php
2. Login → **Services** → **My Services**
3. Pilih domain: **fadhlirajwaa.my.id**
4. Klik **"Manage Domain"** → **"DNS Management"**

### 3.2 Tambahkan DNS Records untuk DKIM
Copy 3 CNAME records dari SendGrid, tambahkan di Domainesia:

```
Type: CNAME
Hostname: em1234._domainkey.mail
Value: em1234.dkim.u12345678.wl123.sendgrid.net
TTL: 3600

Type: CNAME
Hostname: s1._domainkey.mail
Value: s1.domainkey.u12345678.wl123.sendgrid.net
TTL: 3600

Type: CNAME
Hostname: s2._domainkey.mail
Value: s2.domainkey.u12345678.wl123.sendgrid.net
TTL: 3600
```

⚠️ **PENTING**: Hostname harus **PERSIS** seperti yang diberikan SendGrid (termasuk angka-angka unik)

### 3.3 Tambahkan MX Records untuk Inbound Parse
Untuk **RECEIVE** email, tambahkan MX record:

```
Type: MX
Hostname: mail
Priority: 10
Value: mx.sendgrid.net
TTL: 3600
```

### 3.4 Tunggu DNS Propagation
- DNS propagasi: **15 menit - 48 jam**
- Cek: https://dnschecker.org
- Masukkan: `mail.fadhlirajwaa.my.id`

---

## 🔑 STEP 4: DAPATKAN API KEY

### 4.1 Create API Key
1. Dashboard → **Settings** → **API Keys**
2. Klik **"Create API Key"**
3. Name: `Temp Mail API Key`
4. API Key Permissions: **Full Access** (atau minimal "Mail Send")
5. Klik **"Create & View"**
6. **COPY API KEY** (hanya ditampilkan 1 kali!)
   - Format: `SG.xxxxxxxxxxxxxxxxxxxxx`

### 4.2 Simpan API Key
Simpan di tempat aman, kita akan pakai di backend `.env`

---

## 📥 STEP 5: SETUP INBOUND PARSE (RECEIVE EMAIL)

Ini adalah fitur SendGrid untuk **receive email**.

### 5.1 Enable Inbound Parse
1. Dashboard → **Settings** → **Inbound Parse**
2. Klik **"Add Host & URL"**

### 5.2 Konfigurasi Inbound Parse
```
Hostname: mail.fadhlirajwaa.my.id
URL: https://[BACKEND-URL]/api/sendgrid/webhook
   (ganti dengan URL backend Anda setelah deploy)

Check spam: ❌ (uncheck - kita terima semua email)
Send raw: ✅ (check - untuk dapat full email data)
```

3. Klik **"Add"**

⚠️ **PENTING**: URL webhook harus:
- HTTPS (bukan HTTP)
- Publicly accessible (tidak bisa localhost)
- Must return 200 OK response

---

## 💻 STEP 6: UPDATE BACKEND CODE

Backend perlu update untuk handle SendGrid Inbound Parse.

### 6.1 Install Dependencies
```bash
cd backend
npm install @sendgrid/mail multer
```

### 6.2 Update Backend Server
Tambahkan endpoint untuk Inbound Parse:

```javascript
// backend/server.js

const multer = require('multer');
const upload = multer();

// SendGrid Inbound Parse Webhook
app.post('/api/sendgrid/webhook', upload.none(), async (req, res) => {
  try {
    console.log('📧 Email received from SendGrid');
    
    const { 
      to,           // recipient email
      from,         // sender email
      subject,      // email subject
      text,         // plain text body
      html,         // html body
      envelope      // email envelope data
    } = req.body;

    // Parse recipient email
    const recipientEmail = to ? to.split('<')[1]?.replace('>', '') || to : '';
    
    // Pastikan email untuk domain kita
    if (!recipientEmail.includes('mail.fadhlirajwaa.my.id')) {
      console.log('Email bukan untuk domain kita, skip');
      return res.status(200).send('OK');
    }

    // Generate unique ID
    const emailId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Hitung expiry time (15 menit dari sekarang)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Simpan ke MongoDB
    const emailDoc = await Email.create({
      id: emailId,
      to: recipientEmail,
      from: from || 'Unknown',
      subject: subject || '(No Subject)',
      bodyText: text || '',
      bodyHtml: html || '',
      receivedAt: new Date(),
      expiresAt: expiresAt
    });

    // Broadcast via Socket.io ke frontend
    io.emit('newEmail', {
      id: emailDoc.id,
      to: emailDoc.to,
      from: emailDoc.from,
      subject: emailDoc.subject,
      bodyText: emailDoc.bodyText,
      bodyHtml: emailDoc.bodyHtml,
      receivedAt: emailDoc.receivedAt,
      expiresAt: emailDoc.expiresAt
    });

    console.log(`✅ Email saved: ${emailId}`);
    res.status(200).send('OK');

  } catch (error) {
    console.error('❌ SendGrid webhook error:', error);
    res.status(200).send('OK'); // Tetap return 200 agar SendGrid tidak retry
  }
});
```

---

## 📦 STEP 7: UPDATE ENVIRONMENT VARIABLES

### 7.1 Backend (.env)
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://rajwaarahmana45:123abc789@cluster0.cp7fh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Server
PORT=5000
NODE_ENV=production

# Frontend URL
FRONTEND_URL=https://temp-mail.fadhlirajwaa.my.id

# Email Domain
EMAIL_DOMAIN=mail.fadhlirajwaa.my.id

# SendGrid API Key
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 7.2 Frontend (.env)
```env
# Backend URL (update setelah deploy)
VITE_BACKEND_URL=https://api.fadhlirajwaa.my.id

# Email Domain
VITE_EMAIL_DOMAIN=mail.fadhlirajwaa.my.id
```

---

## 🚀 STEP 8: DEPLOYMENT

### 8.1 Deploy Backend (Railway.app)
1. Buka: https://railway.app
2. Login → **New Project** → **Deploy from GitHub**
3. Pilih folder `backend`
4. **Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://...
   PORT=5000
   EMAIL_DOMAIN=mail.fadhlirajwaa.my.id
   SENDGRID_API_KEY=SG.xxx...
   FRONTEND_URL=https://temp-mail.fadhlirajwaa.my.id
   ```
5. Deploy → Dapatkan URL: `https://xxxx.railway.app`

### 8.2 Update Inbound Parse URL
Setelah dapat URL backend:
1. Kembali ke SendGrid Dashboard
2. **Inbound Parse** → Edit host
3. Update URL: `https://xxxx.railway.app/api/sendgrid/webhook`
4. Save

### 8.3 Deploy Frontend (Netlify)
1. Buka: https://netlify.com
2. **New site** → Import from GitHub
3. Build settings:
   - Build: `npm run build`
   - Publish: `dist`
4. **Environment variables**:
   ```
   VITE_BACKEND_URL=https://xxxx.railway.app
   VITE_EMAIL_DOMAIN=mail.fadhlirajwaa.my.id
   ```
5. Deploy!

### 8.4 Custom Domain (Netlify)
1. **Domain settings** → **Add custom domain**
2. Masukkan: `temp-mail.fadhlirajwaa.my.id`

Di Domainesia, tambahkan:
```
Type: CNAME
Hostname: temp-mail
Value: [netlify-url].netlify.app
TTL: 3600
```

---

## ✅ STEP 9: VERIFY & TEST

### 9.1 Verify Domain Authentication
1. SendGrid Dashboard → **Sender Authentication**
2. Klik **"Verify"** di domain `mail.fadhlirajwaa.my.id`
3. Harus muncul **✅ Verified**

### 9.2 Test Inbound Parse
Kirim test email dari Gmail/Yahoo ke:
```
test@mail.fadhlirajwaa.my.id
```

### 9.3 Check Logs
**Backend logs (Railway):**
```
📧 Email received from SendGrid
✅ Email saved: 1699999999-abc123
```

**SendGrid logs:**
1. Dashboard → **Activity**
2. Filter: Inbound Parse
3. Harus ada log email masuk

---

## 🔍 TROUBLESHOOTING

### ❌ Email tidak masuk?

#### 1. Cek DNS Records
```bash
# Cek MX record
nslookup -type=MX mail.fadhlirajwaa.my.id

# Harus return: mx.sendgrid.net
```

#### 2. Cek Inbound Parse URL
- Pastikan URL: `https://...` (bukan `http://`)
- Cek backend logs, apakah webhook dipanggil?
- Test manual:
```bash
curl -X POST https://xxxx.railway.app/api/sendgrid/webhook \
  -F "to=test@mail.fadhlirajwaa.my.id" \
  -F "from=sender@gmail.com" \
  -F "subject=Test" \
  -F "text=Hello"
```

#### 3. Cek SendGrid Activity
- Dashboard → **Activity** → **Inbound Parse**
- Lihat error messages

### ❌ Domain not verified?
- Tunggu DNS propagation (24-48 jam)
- Cek CNAME records dengan `nslookup -type=CNAME em1234._domainkey.mail.fadhlirajwaa.my.id`
- Pastikan tidak ada typo

### ❌ Webhook return error?
- Backend harus return `200 OK`
- Cek error di Railway logs
- Pastikan MongoDB connected

---

## 📊 SENDGRID VS MAILGUN

| Feature | SendGrid | Mailgun |
|---------|----------|---------|
| **Free Tier** | 100 emails/hari | 5,000 emails/bulan |
| **Receiving** | Via Inbound Parse | Native support |
| **Setup** | ⚠️ Lebih kompleks | ✅ Lebih mudah |
| **Verification** | ⚠️ Strict | ✅ Relaxed |
| **Webhook** | Multipart form data | JSON |
| **Best For** | Sending emails | Receiving emails |

---

## 💡 TIPS SENDGRID

1. **Verifikasi Strict**: SendGrid sangat strict dengan verifikasi, pastikan domain sudah verified
2. **DNS Propagation**: Bisa sampai 48 jam, sabar!
3. **Inbound Parse**: Harus HTTPS, tidak bisa HTTP
4. **Multipart Data**: SendGrid kirim data sebagai `multipart/form-data`, bukan JSON
5. **Return 200**: Backend HARUS return 200 OK, jika tidak SendGrid akan terus retry
6. **Monitor Activity**: Cek SendGrid Activity untuk debug

---

## 🎯 FINAL CHECKLIST

### DNS Records (Domainesia)
- [ ] 3x CNAME untuk DKIM (dari SendGrid)
- [ ] MX record: `mx.sendgrid.net`
- [ ] CNAME untuk frontend: `temp-mail` → Netlify

### SendGrid Dashboard
- [ ] Domain verified ✅
- [ ] Inbound Parse configured
- [ ] Webhook URL: `https://[backend]/api/sendgrid/webhook`
- [ ] API Key created & saved

### Backend
- [ ] Deployed di Railway/Render
- [ ] Environment variables set
- [ ] Endpoint `/api/sendgrid/webhook` accessible
- [ ] MongoDB connected
- [ ] `multer` installed for multipart data

### Frontend
- [ ] Deployed di Netlify
- [ ] Custom domain active
- [ ] Environment variables set
- [ ] SSL certificate active

### Testing
- [ ] Domain verified di SendGrid
- [ ] Kirim test email
- [ ] Email muncul di frontend
- [ ] Email tersimpan di MongoDB
- [ ] Auto-delete 15 menit

---

## 📞 SUPPORT

- SendGrid Docs: https://docs.sendgrid.com
- Inbound Parse: https://docs.sendgrid.com/for-developers/parsing-email/setting-up-the-inbound-parse-webhook
- Railway Docs: https://docs.railway.app

---

**Status:** Ready to Deploy with SendGrid! 🚀
