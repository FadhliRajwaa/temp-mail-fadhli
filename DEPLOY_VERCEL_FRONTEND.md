# 🚀 DEPLOY FRONTEND KE VERCEL

## ✅ VERCEL UNTUK FRONTEND - PERFECT!

---

## 🚀 STEP-BY-STEP (10 MENIT)

### STEP 1: Buat Akun Vercel
1. Buka: https://vercel.com
2. Sign Up dengan GitHub
3. Authorize Vercel

### STEP 2: Import Project
1. Dashboard → **"Add New..."** → **"Project"**
2. Import Git Repository
3. Pilih repo: `my-temp-mail`
4. Klik **"Import"**

### STEP 3: Configure Project
```
Framework Preset: Vite (auto-detect)
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Root Directory: (kosongkan jika frontend di root)
```

### STEP 4: Environment Variables
Tambahkan 2 variables:

```
VITE_BACKEND_URL = https://xxxx.railway.app
(ganti dengan URL backend Anda)

VITE_EMAIL_DOMAIN = mail.fadhlirajwaa.my.id
```

### STEP 5: Deploy
1. Klik **"Deploy"**
2. Tunggu 1-2 menit
3. Dapat URL: `https://my-temp-mail.vercel.app`

### STEP 6: Custom Domain
1. **Settings** → **Domains** → **Add Domain**
2. Masukkan: `temp-mail.fadhlirajwaa.my.id`

Di Domainesia, tambahkan:
```
Type: CNAME
Hostname: temp-mail
Value: cname.vercel-dns.com
TTL: 3600
```

Save → Tunggu 5 menit → SSL auto-generate!

---

## 📊 DNS RECORDS FINAL (di Domainesia)

```
# SendGrid (3 CNAME + 1 MX)
CNAME | em944.mail           | u52573218.wl219.sendgrid.net
CNAME | s1._domainkey.mail   | s1.domainkey.u52573218...
CNAME | s2._domainkey.mail   | s2.domainkey.u52573218...
MX    | mail                 | mx.sendgrid.net (Priority 10)

# Frontend Vercel
CNAME | temp-mail            | cname.vercel-dns.com
```

---

## ✅ CHECKLIST DEPLOYMENT

- [ ] Backend deployed (Railway/Render)
- [ ] Frontend deployed (Vercel)
- [ ] Environment variables set
- [ ] Custom domain added
- [ ] DNS configured
- [ ] SSL active (auto dari Vercel)
- [ ] Test email receiving

---

## 🎯 FINAL URLs

```
Frontend: https://temp-mail.fadhlirajwaa.my.id
Backend:  https://xxxx.railway.app
Email:    anything@mail.fadhlirajwaa.my.id
```

---

## 🚨 TROUBLESHOOTING

### Frontend tidak connect ke backend?
**Fix**: 
1. Cek `VITE_BACKEND_URL` di Vercel environment variables
2. Pastikan backend online (akses `/api/stats`)
3. Redeploy frontend: Vercel → Deployments → Redeploy

### SSL tidak active?
**Fix**: Tunggu 5-10 menit untuk SSL certificate generation

### Domain tidak resolve?
**Fix**: 
```bash
nslookup temp-mail.fadhlirajwaa.my.id
# Harus return IP Vercel
```

---

**Status:** Ready to Deploy! 🚀
