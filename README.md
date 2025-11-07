# 📧 Temp Mail - Email Sementara

Aplikasi email sementara (disposable email) yang fungsional penuh dengan real-time updates menggunakan Socket.io. Email yang masuk akan muncul secara otomatis dan terhapus setelah 15 menit.

## 🎯 Fitur Utama

- ✅ **Email Instan**: Dapatkan alamat email acak secara otomatis
- ✅ **Real-time Updates**: Email masuk muncul langsung tanpa refresh
- ✅ **Auto-Delete**: Email terhapus otomatis setelah 15 menit (MongoDB TTL Index)
- ✅ **Modern UI**: Desain modern dengan Tailwind CSS
- ✅ **Responsive**: Tampil sempurna di desktop dan mobile
- ✅ **Browser Notifications**: Notifikasi saat email baru masuk

## 🏗️ Arsitektur

```
Frontend (React + Vite + Tailwind)
    ↕️ Socket.io
Backend (Node.js + Express + Socket.io)
    ↕️
MongoDB Atlas (dengan TTL Index 15 menit)
    ↕️
Mailgun (Email Receiver + Webhook)
```

## 📁 Struktur Proyek

```
my-temp-mail/
├── backend/                    # Backend Server
│   ├── config/
│   │   └── database.js        # MongoDB Connection
│   ├── models/
│   │   └── Email.js           # Email Schema dengan TTL Index
│   ├── server.js              # Main Server File
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── src/                        # Frontend React
│   ├── App.jsx                # Main Component dengan Socket.io
│   └── App.css                # Styling
├── package.json
├── .env.example
└── README.md
```

## 🚀 Instalasi & Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd my-temp-mail
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` di folder `backend/`:

```env
MONGODB_URI=mongodb+srv://rajwaarahmana45:123abc789@cluster0.cp7fh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
FRONTEND_URL=http://localhost:5173
EMAIL_DOMAIN=domain-saya.my.id
NODE_ENV=development
```

### 3. Setup Frontend

```bash
cd ..  # kembali ke root
npm install
```

Buat file `.env` di root folder:

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_EMAIL_DOMAIN=domain-saya.my.id
```

### 4. Jalankan Aplikasi

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# atau untuk development dengan auto-reload:
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Buka browser di `http://localhost:5173`

## 🔧 Konfigurasi Mailgun

### 1. Daftar di Mailgun
- Buat akun di [mailgun.com](https://www.mailgun.com/)
- Verifikasi domain Anda (domain-saya.my.id)

### 2. Setup DNS Records
Tambahkan MX records di DNS domain Anda:

```
Type: MX
Priority: 10
Value: mxa.mailgun.org

Type: MX
Priority: 10
Value: mxb.mailgun.org
```

Tambahkan juga TXT records untuk SPF dan DKIM (akan diberikan oleh Mailgun)

### 3. Setup Mailgun Route (Catch All)
Di Dashboard Mailgun, buat Route baru:

**Expression Type:** Match Recipient
**Recipient:** `*@domain-saya.my.id`

**Actions:**
- Forward to Webhook: `https://your-backend-url.onrender.com/webhook-mailgun`
- Store message: No (optional)

**Priority:** 0

### 4. Test Webhook
Kirim test email ke alamat apa saja di domain Anda (contoh: test@domain-saya.my.id) dan pastikan webhook terpanggil.

## 🌐 Deployment

### Backend - Deploy ke Render

1. Push kode ke GitHub
2. Buat akun di [render.com](https://render.com/)
3. Create New Web Service
4. Connect repository
5. Build Command: `npm install`
6. Start Command: `node server.js`
7. Root Directory: `backend`
8. Environment Variables:
   - `MONGODB_URI`: Connection string MongoDB Anda
   - `FRONTEND_URL`: URL frontend Anda (misal: https://your-app.vercel.app)
   - `EMAIL_DOMAIN`: domain-saya.my.id
   - `NODE_ENV`: production

### Frontend - Deploy ke Vercel

```bash
npm install -g vercel
vercel
```

Atau:
1. Push kode ke GitHub
2. Buat akun di [vercel.com](https://vercel.com/)
3. Import repository
4. Framework Preset: Vite
5. Environment Variables:
   - `VITE_BACKEND_URL`: URL backend Anda (misal: https://your-backend.onrender.com)
   - `VITE_EMAIL_DOMAIN`: domain-saya.my.id
6. Deploy

## 📊 MongoDB TTL Index

Email Schema menggunakan TTL (Time-To-Live) Index untuk auto-delete:

```javascript
createdAt: {
  type: Date,
  default: Date.now,
  expires: 900  // 900 detik = 15 menit
}
```

MongoDB akan otomatis menghapus dokumen setelah 15 menit dari `createdAt`.

## 🔌 Alur Data Real-time

1. **User buka website** → Frontend generate email acak
2. **Frontend connect Socket.io** → `socket.emit('join-room', email)`
3. **Backend create room** → Socket join ke room email tersebut
4. **Email masuk ke Mailgun** → Mailgun tangkap email
5. **Mailgun kirim webhook** → POST ke `/webhook-mailgun`
6. **Backend simpan ke MongoDB** → Dengan TTL 15 menit
7. **Backend emit ke room** → `io.to(email).emit('new-email', data)`
8. **Frontend receive** → Update UI secara real-time

## 🛠️ API Endpoints

### Backend Endpoints

```
GET  /                          # Health check
GET  /api/emails/:emailAddress  # Get email history
POST /webhook-mailgun           # Mailgun webhook (receive emails)
DELETE /api/emails/:emailId     # Delete specific email
GET  /api/stats                 # Server statistics
```

### Socket.io Events

**Client → Server:**
- `join-room`: Join room untuk email tertentu
- `leave-room`: Leave room

**Server → Client:**
- `email-history`: History email saat join room
- `new-email`: Email baru masuk (real-time)
- `error`: Error message

## 🧪 Testing

### Test Webhook Lokal
Gunakan ngrok untuk expose localhost:

```bash
ngrok http 5000
```

Gunakan URL ngrok sebagai webhook URL di Mailgun.

### Test Email
Kirim email ke alamat yang dihasilkan aplikasi:

```bash
echo "Test email body" | mail -s "Test Subject" user-abc@domain-saya.my.id
```

## 📝 Environment Variables

### Backend (.env)
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Port server (default: 5000)
- `FRONTEND_URL`: Frontend URL untuk CORS
- `EMAIL_DOMAIN`: Domain email Anda
- `NODE_ENV`: development/production

### Frontend (.env)
- `VITE_BACKEND_URL`: Backend API URL
- `VITE_EMAIL_DOMAIN`: Domain email Anda

## 🔒 Security Notes

- Jangan commit file `.env` ke repository
- Gunakan HTTPS untuk production
- Validasi webhook signature dari Mailgun (optional)
- Implement rate limiting untuk prevent spam

## 🐛 Troubleshooting

### Backend tidak connect ke MongoDB
- Check connection string di `.env`
- Pastikan IP whitelist di MongoDB Atlas (0.0.0.0/0 untuk allow all)

### Socket.io tidak connect
- Check CORS configuration
- Pastikan FRONTEND_URL benar di backend `.env`
- Check firewall/network

### Email tidak masuk
- Check MX records di DNS
- Check Mailgun Route configuration
- Check webhook URL accessible dari internet
- Check backend logs untuk error

## 👨‍💻 Dibuat Oleh

**Jarvis untuk Tuan Fadhli**

## 📄 License

MIT License
