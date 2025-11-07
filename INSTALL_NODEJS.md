# 📦 Panduan Instalasi Node.js & npm

Node.js belum terinstall di sistem Anda. Ikuti langkah berikut untuk instalasi.

## 🔽 Download Node.js

### Windows

**Option 1: Download dari Website Resmi**
1. Kunjungi: https://nodejs.org/
2. Download versi **LTS** (Long Term Support) - Recommended
3. Pilih Windows Installer (.msi) - 64-bit
4. File size: ~30 MB

**Option 2: Download Direct Link**
- Link: https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi

## ⚙️ Instalasi

### Windows Installation Steps

1. **Run Installer**
   - Double-click file `.msi` yang sudah didownload
   - Klik "Next"

2. **Accept License**
   - Centang "I accept the terms in the License Agreement"
   - Klik "Next"

3. **Choose Install Location**
   - Default: `C:\Program Files\nodejs\`
   - Klik "Next"

4. **Custom Setup**
   - Pastikan semua checkbox tercentang:
     - ✅ Node.js runtime
     - ✅ npm package manager
     - ✅ Online documentation shortcuts
     - ✅ Add to PATH
   - Klik "Next"

5. **Tools for Native Modules** (Optional)
   - Centang jika ingin install tools tambahan
   - Atau skip (tidak wajib untuk project ini)
   - Klik "Next"

6. **Install**
   - Klik "Install"
   - Tunggu proses instalasi (~2-3 menit)
   - Klik "Finish"

## ✅ Verifikasi Instalasi

Setelah instalasi selesai:

1. **Restart Terminal/Command Prompt**
   - Tutup semua terminal yang sedang buka
   - Buka Command Prompt atau PowerShell baru

2. **Check Node.js Version**
   ```bash
   node --version
   ```
   Output yang diharapkan: `v20.10.0` (atau versi terbaru)

3. **Check npm Version**
   ```bash
   npm --version
   ```
   Output yang diharapkan: `10.2.3` (atau versi terbaru)

4. **Check Installation Path**
   ```bash
   where node
   where npm
   ```
   Harus menampilkan path ke Node.js

## 📦 Setelah Node.js Terinstall

### Install Dependencies Aplikasi

**Frontend:**
```bash
cd E:\my-temp-mail
npm install
```

**Backend:**
```bash
cd E:\my-temp-mail\backend
npm install
```

Proses install akan:
- Download semua package yang dibutuhkan
- Membuat folder `node_modules`
- Durasi: ~2-5 menit (tergantung koneksi internet)

## 🚀 Menjalankan Aplikasi

Setelah semua dependencies terinstall:

**Terminal 1 - Backend:**
```bash
cd E:\my-temp-mail\backend
npm start
```

Anda akan melihat:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

**Terminal 2 - Frontend:**
```bash
cd E:\my-temp-mail
npm run dev
```

Anda akan melihat:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

Buka browser: `http://localhost:5173`

## 🐛 Troubleshooting

### "node" tidak dikenali sebagai command

**Solusi:**
1. Restart terminal/command prompt
2. Jika masih error, restart komputer
3. Check PATH environment variable:
   - Windows: System Properties → Environment Variables
   - Cari "Path" di System Variables
   - Pastikan ada entry: `C:\Program Files\nodejs\`

### npm install error "EACCES" atau "Permission Denied"

**Solusi:**
1. Run Command Prompt/PowerShell as Administrator
2. Atau install Node.js dengan "Run as Administrator"

### npm install sangat lambat

**Solusi:**
1. Check koneksi internet
2. Atau gunakan npm registry mirror:
   ```bash
   npm config set registry https://registry.npmmirror.com
   ```

## 📚 Resource Tambahan

- **Node.js Official**: https://nodejs.org/
- **npm Documentation**: https://docs.npmjs.com/
- **Node.js Tutorial**: https://nodejs.dev/learn

## ✨ Setelah Instalasi Berhasil

Lanjutkan ke:
1. `README.md` - Panduan lengkap aplikasi
2. `SETUP_GUIDE.md` - Panduan setup detail
3. `DEPLOYMENT_CHECKLIST.md` - Checklist deployment

---

**Dibuat oleh Jarvis untuk Tuan Fadhli** 💻
