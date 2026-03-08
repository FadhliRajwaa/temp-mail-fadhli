# UI Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Mendesain ulang UI temp mail menjadi lebih modern, premium, smooth, dan responsif tanpa mengubah alur aplikasi.

**Architecture:** Perubahan difokuskan pada lapisan presentasi. Token visual, animasi, dan layout utama dibangun lewat CSS dan kelas utilitas Tailwind, sementara komponen React tetap mempertahankan struktur logika yang ada. Motion dibuat ringan agar desktop dan mobile tetap halus.

**Tech Stack:** React, Vite, Tailwind CSS v4, Lucide React

---

### Task 1: Siapkan visual tokens, typography, dan motion primitives

**Files:**
- Modify: `src/index.css`
- Modify: `src/App.css`

**Step 1: Write the failing check**

Tidak ada test visual otomatis di repo. Gunakan lint dan build sebagai safety net, lalu verifikasi manual hasil styling.

**Step 2: Write minimal implementation**

Tambahkan di `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root {
  --bg-base: #07111f;
  --bg-elevated: rgba(10, 19, 35, 0.78);
  --panel-border: rgba(125, 211, 252, 0.14);
  --accent-cyan: #67e8f9;
  --accent-amber: #fbbf24;
  --text-primary: #f8fbff;
  --text-muted: #8fa6bf;
}

@keyframes driftSlow { ... }
@keyframes panelReveal { ... }
@keyframes signalPulse { ... }
```

Tambahkan utility class untuk glass panel, gradient text, dan animation wrapper.

**Step 3: Run verification**

Run: `npm run lint`
Expected: PASS

**Step 4: Commit**

```bash
git add src/index.css src/App.css
git commit -m "style: add premium design tokens"
```

### Task 2: Redesign background dan shell layout

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/Background.jsx`

**Step 1: Write the failing check**

Tidak ada test UI integration. Gunakan build sebagai validation utama.

**Step 2: Write minimal implementation**

Perbarui wrapper global di `src/App.jsx` agar spacing, width, dan section rhythm lebih tegas.

Perbarui `src/components/Background.jsx`:

```jsx
return (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-[var(--bg-base)]">
    <div className="aurora aurora-one" />
    <div className="aurora aurora-two" />
    <div className="mesh-grid" />
    <div className="noise-overlay" />
  </div>
);
```

**Step 3: Run verification**

Run: `npm run build`
Expected: PASS

**Step 4: Commit**

```bash
git add src/App.jsx src/components/Background.jsx
git commit -m "feat: refresh visual shell layout"
```

### Task 3: Redesign header dan hero section

**Files:**
- Modify: `src/components/Header.jsx`
- Modify: `src/components/HeroSection.jsx`

**Step 1: Write the failing check**

Lakukan manual check pada breakpoint mobile dan desktop setelah implementasi.

**Step 2: Write minimal implementation**

Header:
- treatment brand lebih tegas
- badge status koneksi lebih premium
- spacing lebih efisien di mobile

Hero:
- email capsule lebih mencolok
- CTA primer dan sekunder lebih tactile
- badge fitur lebih sistematis
- copy feedback lebih halus

Contoh struktur:

```jsx
<section className="glass-panel hero-shell">
  <div className="hero-eyebrow">Secure relay</div>
  <h1>Disposable identity built for speed</h1>
  <div className="identity-console">...</div>
</section>
```

**Step 3: Run verification**

Run: `npm run build`
Expected: PASS

**Step 4: Commit**

```bash
git add src/components/Header.jsx src/components/HeroSection.jsx
git commit -m "feat: redesign header and hero"
```

### Task 4: Redesign inbox list dan email detail

**Files:**
- Modify: `src/components/InboxList.jsx`
- Modify: `src/components/EmailDetail.jsx`

**Step 1: Write the failing check**

Tidak ada test komponen. Fokus pada build + verifikasi manual perilaku mobile sheet dan desktop panel.

**Step 2: Write minimal implementation**

Inbox list:
- panel lebih hidup
- selected state lebih jelas
- sender/time hierarchy lebih kuat
- empty state lebih intentional

Email detail:
- toolbar lebih rapi
- metadata lebih premium
- content area lebih nyaman dibaca
- mobile full-screen feel lebih matang

**Step 3: Run verification**

Run: `npm run build`
Expected: PASS

**Step 4: Commit**

```bash
git add src/components/InboxList.jsx src/components/EmailDetail.jsx
git commit -m "feat: redesign inbox and email detail"
```

### Task 5: Final verification

**Files:**
- Inspect only

**Step 1: Run frontend lint**

Run: `npm run lint`
Expected: PASS

**Step 2: Run frontend build**

Run: `npm run build`
Expected: PASS

**Step 3: Manual verification**

1. Buka layout desktop.
2. Buka layout mobile responsive.
3. Pastikan tidak ada overflow horizontal.
4. Pastikan tombol copy, refresh, create identity, pilih inbox, dan buka detail email tetap bekerja.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: deliver premium responsive ui redesign"
```

Plan complete and saved to `docs/plans/2026-03-08-ui-redesign.md`. Dua opsi eksekusi:

1. `Subagent-Driven (sesi ini)` - saya eksekusi langsung task demi task di sesi ini
2. `Parallel Session (terpisah)` - buka sesi lain khusus eksekusi plan

Dengan asumsi Anda ingin lanjut sekarang, saya akan pakai pendekatan `Subagent-Driven (sesi ini)` dan mulai implementasi langsung.

