# UI Redesign Design

**Tanggal:** 8 Maret 2026

**Tujuan:** Mendesain ulang antarmuka temp mail agar terasa modern, premium, smooth, dan responsif di desktop maupun mobile tanpa mengubah arsitektur aplikasi.

## Latar Belakang

UI saat ini sudah fungsional, tetapi identitas visualnya masih generik. Komponen utama seperti hero, inbox, dan email detail telah tersusun dengan baik, namun tampilan keseluruhannya masih terasa sebagai panel gelap standar dengan aksen violet yang belum cukup kuat untuk membedakan produk.

User menginginkan UI yang lebih modern, animasi yang smooth, dan pengalaman yang tetap nyaman di desktop serta mobile.

## Arah Visual

Dipilih arah visual **Futuristic Premium**.

Karakter utama:

1. Permukaan gelap dengan kedalaman yang lebih meyakinkan.
2. Aksen cyan-electric dan amber signal untuk menggantikan dominasi violet yang monoton.
3. Tipografi yang lebih karakterful, dengan heading yang tegas dan monospace yang lebih terasa seperti secure console.
4. Motion yang lembut, atmosferik, dan konsisten, bukan animasi berat yang boros.

## Pilihan Pendekatan

### Opsi 1: Futuristic Premium

- Background berlapis dengan radial light, grid halus, dan drift pelan.
- Card seperti panel kontrol modern.
- Status, badge, dan CTA dibuat lebih tactile.

**Kelebihan:** Paling cocok untuk produk temp mail, memberi kesan secure, cepat, dan premium.

**Kekurangan:** Perubahan visual cukup besar dan perlu perhatian pada performa agar tetap ringan.

### Opsi 2: Minimal Clean SaaS

- Banyak ruang putih visual, panel tipis, dan motion minimal.

**Kelebihan:** Aman dan profesional.

**Kekurangan:** Lebih mudah terasa generik dan kurang memorable.

### Opsi 3: Cyber Tech Bold

- Layer glow, grid kuat, aksen visual lebih agresif.

**Kelebihan:** Sangat standout.

**Kekurangan:** Mudah terasa berlebihan, terutama di mobile.

## Keputusan

Dipilih **Opsi 1: Futuristic Premium**.

## Desain Komponen

### Background

Background di `src/components/Background.jsx` akan diubah dari orb statis menjadi panggung visual yang lebih kaya:

1. Multi-layer gradient dengan depth berbeda.
2. Grid halus untuk nuansa sistem/console.
3. Beberapa radial highlight yang bergerak sangat lambat.
4. Noise/pattern tipis agar permukaan tidak datar.

Efek visual harus tetap ringan dan ramah mobile.

### Header

Header di `src/components/Header.jsx` akan dibuat lebih premium:

1. Logo dan brand memiliki treatment yang lebih tajam.
2. Status koneksi lebih hidup secara visual.
3. Tinggi header tetap efisien agar ruang konten terjaga di mobile.

### Hero Section

Hero di `src/components/HeroSection.jsx` menjadi pusat identitas halaman:

1. Email address tampil seperti secure identity capsule.
2. CTA `Copy`, `Refresh`, dan `New identity` dibuat lebih tactile dan jelas prioritasnya.
3. Link mailbox tetap tersedia tetapi ditempatkan lebih rapi.
4. Badge fitur lebih terasa sebagai sistem status, bukan dekorasi biasa.

### Inbox List

Inbox di `src/components/InboxList.jsx` akan dibuat lebih cepat dipindai:

1. Header panel lebih informatif.
2. Item email punya hierarchy yang lebih jelas antara sender, subject, preview, dan timestamp.
3. Hover dan selected state lebih hidup dengan lift ringan dan accent glow.
4. Empty state tetap menarik secara visual tanpa mengganggu fokus.

### Email Detail

Panel detail di `src/components/EmailDetail.jsx` akan dibuat lebih fokus:

1. Toolbar lebih bersih dan modern.
2. Metadata email disusun lebih premium.
3. Konten email mendapat ruang baca yang lebih nyaman.
4. Mode mobile terasa seperti native full-screen sheet.

## Responsiveness

### Desktop

1. Hero tampil besar dan kuat.
2. Layout inbox/detail tetap dua kolom dengan proporsi lebih nyaman.
3. Jarak antar panel dan padding lebih konsisten.

### Mobile

1. Hero dipadatkan namun tetap punya identitas visual.
2. Area aksi tetap mudah disentuh.
3. Inbox item tetap padat namun readable.
4. Detail email tampil penuh dan tidak terasa seperti layout desktop yang dipaksa mengecil.

## Motion

Motion akan dibatasi pada efek yang memberi kualitas tanpa membebani:

1. Page reveal ringan.
2. Background drift lambat.
3. Hover lift kecil pada card dan button.
4. Pulse/shimmer halus pada elemen penting.
5. Semua motion menghormati `prefers-reduced-motion`.

Tidak akan dipakai blur besar atau animasi yang mendorong GPU secara agresif.

## Teknis Implementasi

Perubahan akan difokuskan pada:

1. `src/index.css` untuk token visual, font, keyframes, dan utility kelas custom.
2. `src/App.jsx` untuk struktur wrapper dan spacing global bila diperlukan.
3. `src/components/Background.jsx`
4. `src/components/Header.jsx`
5. `src/components/HeroSection.jsx`
6. `src/components/InboxList.jsx`
7. `src/components/EmailDetail.jsx`

Struktur data aplikasi, koneksi socket, dan logika inbox tidak akan diubah kecuali dibutuhkan untuk kebutuhan presentasi visual.

## Kriteria Sukses

1. UI terasa modern dan memiliki identitas visual yang kuat.
2. Desktop dan mobile sama-sama nyaman dipakai.
3. Motion terlihat halus tetapi tidak berat.
4. Build tetap ringan dan tidak menambah dependency animasi yang tidak perlu.
5. Tidak ada regresi pada alur utama: generate email, lihat inbox, buka detail email, refresh, dan create identity baru.

## Verifikasi

1. Jalankan lint frontend.
2. Jalankan build frontend.
3. Verifikasi manual desktop dan mobile:
   - hero section
   - inbox list
   - detail email
   - status koneksi
   - empty state
4. Pastikan tidak ada overflow horizontal di mobile.

