# Signal Control Room UI Design

**Tanggal:** 8 Maret 2026

**Tujuan:** Mengganti ulang tema antarmuka temp mail menjadi lebih modern, lebih khas, dan lebih product-oriented dengan arah visual `Signal Control Room`, sekaligus menambahkan aksi eksplisit untuk menyalin link mailbox.

## Latar Belakang

Redesign sebelumnya sudah membuat UI lebih premium, tetapi karakter visualnya masih berada di jalur dark-premium yang relatif familiar. User meminta hasil yang lebih modern lagi, tema baru yang berbeda, dan penambahan tombol `Copy link`.

Produk ini lebih cocok jika terasa seperti sistem relay aktif daripada landing page futuristik umum. Karena itu, visual baru harus bergerak ke arah yang lebih utilitarian, taktis, dan memorable.

## Konsep Utama

Dipilih konsep **Signal Control Room**.

Karakter visual:

1. Latar graphite gelap dengan nuansa teal-dingin.
2. Aksen lime sebagai sinyal aktif.
3. Amber sebagai penanda operasi dan status transisi.
4. Panel yang lebih mekanis, lebih tajam, dan lebih sistematis.
5. Motion yang terasa presisi, bukan melayang lembut seperti glassmorphism premium biasa.

## Pilihan Pendekatan

### Opsi 1: Signal Control Room

- Panel terlihat seperti sistem relay dan monitoring station.
- Hero menjadi pusat kontrol inbox.
- Inbox terasa seperti incoming signal feed.
- Viewer terasa seperti inspection terminal.

**Kelebihan:** Identitas produk lebih kuat, lebih memorable, dan lebih kontekstual untuk temp mail.

**Kekurangan:** Lebih berani dan kurang netral dibanding tema SaaS umum.

### Opsi 2: Soft Glass Premium

- Fokus pada kedalaman, blur, dan kemewahan visual.

**Kelebihan:** Aman, elegan.

**Kekurangan:** Mudah terasa mirip redesign sebelumnya dan kurang punya karakter produk yang tajam.

### Opsi 3: Neo Terminal Bright

- Gaya lebih dekat ke hacker terminal neon.

**Kelebihan:** Khas dan kuat.

**Kekurangan:** Lebih niche dan mudah terasa berlebihan.

## Keputusan

Dipilih **Opsi 1: Signal Control Room**.

## Arah Visual

### Warna

Token warna utama akan digeser dari cyan-premium ke kombinasi:

1. `graphite-black` untuk fondasi
2. `deep-teal` untuk panel dan layer
3. `signal-lime` untuk status hidup dan highlight aktif
4. `muted-amber` untuk refresh, operasi, dan reconnect state
5. `steel-gray` untuk teks sekunder dan elemen netral

### Tipografi

Tipografi akan bergerak ke rasa kontrol sistem:

1. Display font yang lebih teknikal dan padat
2. Body font yang tetap mudah dibaca
3. Monospace tetap dipakai untuk alamat inbox dan link mailbox

Fokus utamanya adalah keterbacaan sekaligus identitas.

### Motion

Motion akan tetap ringan, namun lebih “mekanis”:

1. Panel reveal lebih cepat dan presisi
2. Hover pada tombol terasa seperti sistem aktif
3. Background menggunakan drift minimal, scan texture, atau grid movement yang pelan
4. Tidak menggunakan efek blur atau glow berlebihan

## Desain Komponen

### Header

Header akan menjadi bar sistem aktif:

1. Branding lebih ringkas dan lebih utilitarian
2. Status koneksi tampak seperti indikator sistem
3. Informasi sekunder dibuat lebih mirip metadata operasi daripada tagline landing page

### Hero / Relay Console

Hero akan diubah menjadi panel kontrol utama:

1. Fokus utama pada alamat inbox aktif
2. Actions akan dibagi jelas:
   - `Copy address`
   - `Copy link`
   - `Refresh`
   - `New identity`
3. Copy feedback dibedakan antara address dan link
4. Informasi seperti TTL, sync state, dan relay mode disusun sebagai status block, bukan badge dekoratif biasa

### Inbox Feed

Inbox akan terasa seperti stream masuk:

1. Item email lebih rapat, lebih cepat dipindai
2. Selected state seperti sinyal aktif
3. Panel header lebih dekat ke monitoring feed daripada card list biasa
4. Empty state tetap hidup tetapi tidak terlalu ilustratif

### Email Viewer

Panel detail akan terasa seperti inspection terminal:

1. Toolbar lebih bersih dan lebih teknis
2. Metadata lebih sistematis
3. Konten email tetap nyaman dibaca
4. Mobile masih penuh layar, tetapi terasa seperti overlay sistem

## Responsiveness

### Desktop

1. Hero dan panel inbox/viewer memiliki hierarki yang jelas
2. Visual density boleh sedikit meningkat dibanding versi sebelumnya
3. Split layout tetap dipertahankan

### Mobile

1. Control actions tetap mudah dijangkau
2. Hero tidak boleh terlalu tinggi sebelum inbox terlihat
3. Tombol `Copy link` tetap harus hadir dan usable
4. Panel viewer tetap mudah ditutup dan tidak terasa sempit

## File Yang Akan Diubah

1. `src/index.css`
2. `src/App.jsx`
3. `src/components/Background.jsx`
4. `src/components/Header.jsx`
5. `src/components/HeroSection.jsx`
6. `src/components/InboxList.jsx`
7. `src/components/EmailDetail.jsx`

## Kriteria Sukses

1. Tema terlihat jelas berbeda dari redesign sebelumnya.
2. UI terasa lebih modern dan lebih khas.
3. Tombol `Copy link` tersedia dan mudah dipakai.
4. Desktop dan mobile tetap rapi.
5. Tidak ada regresi pada alur utama aplikasi.

## Referensi Ringkas

Sebagai pendukung arah dashboard/control-panel yang responsif dan modular, saya memakai referensi umum UI dashboard Tailwind melalui MCP untuk memvalidasi pola card density, responsive layout, dan interactive states, tetapi tetap mempertahankan eksekusi visual yang khas untuk produk ini.

