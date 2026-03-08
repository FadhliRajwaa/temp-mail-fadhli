# Signal Control Room Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Mengganti tema antarmuka temp mail ke gaya `Signal Control Room` dan menambahkan tombol `Copy link` yang eksplisit tanpa mengubah flow aplikasi.

**Architecture:** Perubahan difokuskan ke lapisan presentasi. Token warna, tipografi, dan motion dibangun lewat CSS global, lalu komponen utama dirombak agar tampak seperti relay console dan inspection terminal. Logika aplikasi dan koneksi socket tetap dipertahankan.

**Tech Stack:** React, Vite, Tailwind CSS v4, Lucide React

---

### Task 1: Ganti token tema dan fondasi visual global

**Files:**
- Modify: `src/index.css`
- Modify: `src/App.css`

**Step 1: Write the failing check**

Tidak ada test visual otomatis. Gunakan lint/build sebagai safety net dan manual inspection untuk hasil styling.

**Step 2: Write minimal implementation**

Ganti token visual ke:

```css
:root {
  --bg-base: #060b10;
  --bg-surface: rgba(10, 22, 28, 0.88);
  --panel-border: rgba(125, 211, 252, 0.08);
  --signal-lime: #bef264;
  --signal-amber: #fbbf24;
  --signal-teal: #2dd4bf;
}
```

Tambahkan utility untuk:
- panel mekanis
- grid control-room
- subtle scan line
- hover state yang lebih taktis

**Step 3: Run verification**

Run: `npm run lint`
Expected: PASS

**Step 4: Commit**

```bash
git add src/index.css src/App.css
git commit -m "style: add signal control room theme tokens"
```

### Task 2: Redesign background dan shell halaman

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/Background.jsx`

**Step 1: Write the failing check**

Tidak ada integration test. Build akan menjadi guard utama.

**Step 2: Write minimal implementation**

Background menjadi lebih industrial:
- grid halus
- layer teal/green signal
- scan texture tipis

Shell halaman di `App.jsx` dirapikan agar hero tidak terlalu tinggi dan mobile lebih cepat memperlihatkan inbox.

**Step 3: Run verification**

Run: `npm run build`
Expected: PASS

**Step 4: Commit**

```bash
git add src/App.jsx src/components/Background.jsx
git commit -m "feat: refresh signal control shell"
```

### Task 3: Redesign header dan hero console, tambahkan Copy link

**Files:**
- Modify: `src/components/Header.jsx`
- Modify: `src/components/HeroSection.jsx`

**Step 1: Write the failing check**

Manual check:
- tombol copy address masih bekerja
- tombol copy link baru muncul dan bekerja

**Step 2: Write minimal implementation**

Header:
- gaya system bar
- metadata lebih teknis
- status koneksi selaras dengan tema lime/amber/rose

Hero:
- jadikan relay console
- tambahkan state terpisah untuk `copiedAddress` dan `copiedLink`
- actions:
  - copy address
  - copy link
  - refresh
  - new identity

**Step 3: Run verification**

Run: `npm run build`
Expected: PASS

**Step 4: Commit**

```bash
git add src/components/Header.jsx src/components/HeroSection.jsx
git commit -m "feat: redesign relay console actions"
```

### Task 4: Redesign inbox feed dan email viewer

**Files:**
- Modify: `src/components/InboxList.jsx`
- Modify: `src/components/EmailDetail.jsx`

**Step 1: Write the failing check**

Manual check:
- inbox list tetap selectable
- viewer tetap tampil benar untuk text dan html email

**Step 2: Write minimal implementation**

Inbox:
- item lebih seperti signal card
- selected state lebih tajam
- timestamps dan preview lebih padat

Viewer:
- inspection terminal look
- metadata lebih sistematis
- mobile overlay tetap enak dipakai

**Step 3: Run verification**

Run: `npm run build`
Expected: PASS

**Step 4: Commit**

```bash
git add src/components/InboxList.jsx src/components/EmailDetail.jsx
git commit -m "feat: redesign inbox feed and viewer"
```

### Task 5: Final verification

**Files:**
- Inspect only

**Step 1: Run lint**

Run: `npm run lint`
Expected: PASS

**Step 2: Run build**

Run: `npm run build`
Expected: PASS

**Step 3: Manual verification**

1. Buka desktop layout
2. Buka mobile responsive layout
3. Klik `Copy address`
4. Klik `Copy link`
5. Buka inbox dan email detail
6. Pastikan tidak ada overflow horizontal

**Step 4: Commit**

```bash
git add .
git commit -m "feat: deliver signal control room redesign"
```

Plan complete and saved to `docs/plans/2026-03-08-signal-control-room.md`. Dua opsi eksekusi:

1. `Subagent-Driven (sesi ini)` - saya eksekusi langsung task demi task di sesi ini
2. `Parallel Session (terpisah)` - buka sesi lain khusus eksekusi plan

Dengan asumsi Anda ingin lanjut sekarang, saya akan pakai pendekatan `Subagent-Driven (sesi ini)` dan mulai implementasi langsung.

