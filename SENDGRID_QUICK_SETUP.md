# ✅ SENDGRID QUICK SETUP - 30 MENIT

## 🎯 LANGKAH CEPAT

### ✅ STEP 1: DAFTAR SENDGRID (5 menit)
1. **Buka**: https://signup.sendgrid.com
2. **Free Plan** (100 emails/hari)
3. Lengkapi profile & verifikasi email
4. ⚠️ **PENTING**: SendGrid sangat strict, lengkapi semua data dengan benar

---

### ✅ STEP 2: DOMAIN AUTHENTICATION (10 menit)
1. Dashboard → **Settings** → **Sender Authentication**
2. **"Authenticate Your Domain"**
3. DNS Host: **Other**
4. Domain: `mail.fadhlirajwaa.my.id`
5. SendGrid akan berikan **3 CNAME records**

Di Domainesia, tambahkan 3 CNAME:
```
CNAME | em1234._domainkey.mail | em1234.dkim...sendgrid.net
CNAME | s1._domainkey.mail     | s1.domainkey...sendgrid.net
CNAME | s2._domainkey.mail     | s2.domainkey...sendgrid.net
```

---

### ✅ STEP 3: MX RECORD UNTUK RECEIVE (2 menit)
Di Domainesia, tambahkan:
```
MX | mail | mx.sendgrid.net | Priority: 10
```

Tunggu DNS propagate (15-30 menit).

---

### ✅ STEP 4: API KEY (2 menit)
1. **Settings** → **API Keys** → **"Create API Key"**
2. Name: `Temp Mail API`
3. Permissions: **Full Access**
4. Copy API Key: `SG.xxxxxxxxxx...`

Update `backend/.env`:
```env
SENDGRID_API_KEY=SG.xxxxxxxxxx...
```

---

### ✅ STEP 5: DEPLOY BACKEND (5 menit)
**Railway.app:**
1. https://railway.app → Login → **New Project**
2. Deploy from GitHub (folder `backend`)
3. **Environment Variables**:
```
MONGODB_URI=mongodb+srv://rajwaarahmana45:...
PORT=5000
EMAIL_DOMAIN=mail.fadhlirajwaa.my.id
SENDGRID_API_KEY=SG.xxx...
FRONTEND_URL=https://temp-mail.fadhlirajwaa.my.id
```
4. Deploy → Dapat URL: `https://xxxx.railway.app`

---

### ✅ STEP 6: INBOUND PARSE (3 menit)
1. **Settings** → **Inbound Parse** → **"Add Host & URL"**
2. **Konfigurasi**:
```
Hostname: mail.fadhlirajwaa.my.id
URL: https://xxxx.railway.app/api/sendgrid/webhook
Check spam: ❌ (uncheck)
Send raw: ✅ (check)
```
3. **Add**

⚠️ **PENTING**: URL harus HTTPS!

---

### ✅ STEP 7: VERIFY DOMAIN (2 menit)
1. **Sender Authentication** → **Verify** domain
2. Harus muncul **✅ Verified**
3. Jika belum, tunggu DNS propagate (sampai 48 jam)

---

### ✅ STEP 8: DEPLOY FRONTEND (5 menit)
**Netlify:**
1. https://netlify.com → **New site** → Import GitHub
2. Build: `npm run build` | Publish: `dist`
3. **Environment**:
```
VITE_BACKEND_URL=https://xxxx.railway.app
VITE_EMAIL_DOMAIN=mail.fadhlirajwaa.my.id
```
4. Deploy → **Custom domain**: `temp-mail.fadhlirajwaa.my.id`

Di Domainesia:
```
CNAME | temp-mail | [netlify-url].netlify.app
```

---

### ✅ STEP 9: TEST (2 menit)
1. Buka: https://temp-mail.fadhlirajwaa.my.id
2. Kirim email dari Gmail ke: `test@mail.fadhlirajwaa.my.id`
3. Email harus muncul dalam 5-10 detik!

---

## 📊 DNS RECORDS SUMMARY

Di Domainesia, total 5 records:

```
# SendGrid DKIM (3 records)
CNAME | em1234._domainkey.mail | em1234.dkim.u12345.wl123.sendgrid.net
CNAME | s1._domainkey.mail     | s1.domainkey.u12345.wl123.sendgrid.net
CNAME | s2._domainkey.mail     | s2.domainkey.u12345.wl123.sendgrid.net

# MX untuk receive email
MX | mail | mx.sendgrid.net | Priority: 10

# Frontend custom domain
CNAME | temp-mail | [netlify-url].netlify.app
```

---

## 🚨 TROUBLESHOOTING CEPAT

### ❌ Domain not verified?
```bash
# Cek CNAME
nslookup -type=CNAME s1._domainkey.mail.fadhlirajwaa.my.id
```
**Fix**: Tunggu DNS propagate (sampai 48 jam)

### ❌ Email tidak masuk?
```bash
# Cek MX
nslookup -type=MX mail.fadhlirajwaa.my.id
# Harus return: mx.sendgrid.net
```
**Fix**:
1. Cek SendGrid **Activity** → Inbound Parse
2. Cek Railway logs untuk error
3. Test webhook manual:
```bash
curl -X POST https://xxxx.railway.app/api/sendgrid/webhook \
  -F "to=test@mail.fadhlirajwaa.my.id" \
  -F "from=sender@gmail.com" \
  -F "subject=Test" \
  -F "text=Hello World"
```

### ❌ Webhook error 500?
**Fix**: 
- Cek MongoDB connection
- Cek Railway logs
- Backend harus return `200 OK`

---

## 💡 TIPS

1. **DNS Propagation**: Bisa 15 menit - 48 jam, sabar!
2. **HTTPS Required**: Inbound Parse webhook HARUS HTTPS
3. **Return 200**: Backend wajib return 200 OK
4. **Monitor Activity**: SendGrid Activity untuk tracking email
5. **Free Limit**: 100 emails/hari, cukup untuk testing

---

## 📞 HELP

- SendGrid Docs: https://docs.sendgrid.com
- Inbound Parse: https://docs.sendgrid.com/for-developers/parsing-email/setting-up-the-inbound-parse-webhook
- Cek DNS: https://dnschecker.org

---

**🎉 SELAMAT! TEMP MAIL DENGAN SENDGRID READY!**

URL: https://temp-mail.fadhlirajwaa.my.id
Email: anything@mail.fadhlirajwaa.my.id
