# Connection Stability Design

**Tanggal:** 8 Maret 2026

**Tujuan:** Menstabilkan pengalaman koneksi realtime inbox pada deployment Render gratis tanpa mengubah provider backend.

## Latar Belakang

Aplikasi frontend saat ini menampilkan status koneksi berbasis boolean sederhana. Setiap event `disconnect` atau `connect_error` langsung mengubah UI menjadi `Offline`, meskipun Socket.IO masih berada dalam proses reconnect otomatis. Di sisi deployment, backend berjalan pada Render gratis yang tidak menjamin koneksi websocket selalu hidup karena instance dapat tidur, restart, atau terkena cold start.

Masalah yang dilihat user bukan hanya koneksi websocket sesekali putus, tetapi juga indikator UI yang terlalu agresif sehingga perubahan status terlihat sering dan menyesatkan.

## Root Cause

1. Frontend memakai satu state `isConnected` yang terlalu kasar untuk mewakili koneksi websocket.
2. Event `disconnect` langsung dianggap terminal, padahal dalam praktiknya banyak disconnect bersifat sementara.
3. Tidak ada heartbeat aplikasi yang memudahkan deteksi kesehatan koneksi secara aktif.
4. Tidak ada fallback polling berkala saat socket sedang reconnect.
5. Render gratis tidak bisa menjamin koneksi websocket selalu stabil sepanjang waktu.

## Batasan

1. Backend tetap berjalan di Render gratis.
2. Arsitektur utama tetap Socket.IO + MongoDB.
3. Realtime tetap dipertahankan sebagai jalur utama.
4. Solusi harus membuat koneksi terasa stabil, bukan menjanjikan always-on absolut yang tidak realistis di free tier.

## Pilihan Pendekatan

### Opsi 1: Stabilisasi di level aplikasi

- Tambah connection state machine di frontend: `connected`, `reconnecting`, `offline`.
- Terapkan grace period sebelum status benar-benar menjadi `offline`.
- Tambah heartbeat ringan antara frontend dan backend.
- Aktifkan polling fallback inbox saat socket sedang reconnect atau offline.

**Kelebihan:** Paling seimbang, tidak perlu ganti provider, langsung menjawab masalah UX dan resilience.

**Kekurangan:** Tidak bisa menghilangkan semua disconnect yang berasal dari provider.

### Opsi 2: Ubah indikator UI saja

- Biarkan arsitektur koneksi apa adanya.
- Ubah tampilan header agar tidak terlalu sering merah.

**Kelebihan:** Perubahan kecil.

**Kekurangan:** Root cause tetap ada, hanya menyamarkan masalah.

### Opsi 3: Jadikan polling sebagai jalur utama

- Inbox selalu di-refresh periodik.
- Socket hanya menjadi enhancement.

**Kelebihan:** Tahan terhadap free tier.

**Kekurangan:** Mengorbankan karakter realtime yang menjadi nilai utama aplikasi.

## Keputusan

Dipilih **Opsi 1**.

## Desain Teknis

### Frontend

Frontend di `src/App.jsx` akan mengganti state `isConnected` menjadi state koneksi yang lebih ekspresif. Event `disconnect` dan `connect_error` tidak lagi langsung dianggap `offline`, tetapi memicu state `reconnecting`. Sebuah timer grace period akan menentukan kapan state benar-benar berubah menjadi `offline`.

Frontend akan:

1. Menyimpan timestamp `lastPongAt` dari heartbeat backend.
2. Mengirim event `client-ping` secara periodik selama socket aktif.
3. Mengaktifkan polling `GET /api/emails/:emailAddress` saat status `reconnecting` atau `offline`.
4. Menghentikan polling fallback saat koneksi kembali sehat.
5. Tetap melakukan `join-room` ulang dan fetch history setelah reconnect agar tidak ada email yang hilang.

Komponen header di `src/components/Header.jsx` akan menerima `connectionStatus` dan memetakan tiga status visual: hijau, kuning, merah.

### Backend

Backend di `backend/server.js` akan:

1. Menambahkan event `client-ping` yang merespons `server-pong`.
2. Menambahkan alasan disconnect dalam log.
3. Tetap mempertahankan `join-room`, `new-email`, dan query history sebagai sumber kebenaran.

Tidak diperlukan perubahan skema database.

## Error Handling

1. Heartbeat yang gagal tidak langsung dianggap fatal.
2. Polling fallback dibatasi hanya saat koneksi tidak sehat agar beban backend tetap rendah.
3. Semua interval dan timeout harus dibersihkan saat unmount dan saat ganti inbox.
4. Fetch inbox tetap menjadi jalur pemulihan ketika websocket gagal total.

## Kriteria Sukses

1. Status UI tidak lagi sering beralih langsung dari hijau ke merah untuk gangguan singkat.
2. Saat backend transient restart atau cold start, frontend masuk ke `reconnecting` lebih dulu.
3. Email baru tetap muncul meskipun socket sempat reconnect, karena ada fetch history dan fallback polling.
4. Tidak ada memory leak dari interval heartbeat atau polling.

## Verifikasi

1. Jalankan lint frontend dan backend.
2. Jalankan build frontend.
3. Tambahkan test unit kecil untuk helper status koneksi bila diekstrak.
4. Verifikasi manual alur:
   - kondisi normal: status `Connected`
   - backend mati singkat: status `Reconnecting`
   - backend tetap tidak pulih setelah grace period: status `Offline`
   - backend pulih lagi: status kembali `Connected`

