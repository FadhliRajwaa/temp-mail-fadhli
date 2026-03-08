# Connection Stability Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Membuat koneksi inbox realtime terasa jauh lebih stabil pada Render gratis dengan state koneksi yang akurat, heartbeat socket, dan fallback polling saat reconnect/offline.

**Architecture:** Frontend tetap memakai Socket.IO sebagai jalur realtime utama, tetapi status koneksi diubah menjadi state machine tiga tahap dan dibantu heartbeat aplikasi. Saat koneksi tidak sehat, frontend beralih ke polling inbox sementara hingga websocket pulih kembali. Backend hanya menambah dukungan heartbeat dan logging reason disconnect, tanpa mengubah arsitektur penyimpanan email.

**Tech Stack:** React, Vite, Socket.IO client/server, Express, MongoDB, Node.js test runner, ESLint

---

### Task 1: Ekstrak helper status koneksi frontend

**Files:**
- Create: `src/lib/connectionStatus.js`
- Create: `src/lib/connectionStatus.test.js`

**Step 1: Write the failing test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONNECTION_STATUS,
  getNextDisconnectStatus,
  getOfflineTransitionDelay,
} from './connectionStatus.js';

test('temporary disconnect enters reconnecting first', () => {
  assert.equal(
    getNextDisconnectStatus('transport close'),
    CONNECTION_STATUS.RECONNECTING
  );
});

test('offline transition delay is 15000ms', () => {
  assert.equal(getOfflineTransitionDelay(), 15000);
});
```

**Step 2: Run test to verify it fails**

Run: `node --test src/lib/connectionStatus.test.js`
Expected: FAIL because module does not exist yet.

**Step 3: Write minimal implementation**

```js
export const CONNECTION_STATUS = {
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting',
  OFFLINE: 'offline',
};

export function getNextDisconnectStatus() {
  return CONNECTION_STATUS.RECONNECTING;
}

export function getOfflineTransitionDelay() {
  return 15000;
}
```

**Step 4: Run test to verify it passes**

Run: `node --test src/lib/connectionStatus.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/connectionStatus.js src/lib/connectionStatus.test.js
git commit -m "test: add connection status helpers"
```

### Task 2: Implement state machine, heartbeat, dan fallback polling di frontend

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/Header.jsx`

**Step 1: Write the failing test**

Tidak ada test UI integration yang sudah tersedia di repo. Gunakan helper dari Task 1 sebagai safety net, lalu lakukan perubahan minimal di aplikasi dengan verifikasi manual terstruktur.

**Step 2: Implement minimal behavior**

Tambahkan logic berikut di `src/App.jsx`:

```js
const [connectionStatus, setConnectionStatus] = useState(CONNECTION_STATUS.RECONNECTING);

const offlineTimerRef = useRef(null);
const heartbeatIntervalRef = useRef(null);
const fallbackPollIntervalRef = useRef(null);
const lastPongAtRef = useRef(0);

function enterReconnectingState() {
  setConnectionStatus((current) => (
    current === CONNECTION_STATUS.OFFLINE ? current : CONNECTION_STATUS.RECONNECTING
  ));

  window.clearTimeout(offlineTimerRef.current);
  offlineTimerRef.current = window.setTimeout(() => {
    setConnectionStatus(CONNECTION_STATUS.OFFLINE);
  }, getOfflineTransitionDelay());
}

function markConnected() {
  lastPongAtRef.current = Date.now();
  window.clearTimeout(offlineTimerRef.current);
  setConnectionStatus(CONNECTION_STATUS.CONNECTED);
}
```

Tambahkan lifecycle socket:

```js
socket.on('connect', () => {
  markConnected();
  socket.emit('join-room', currentEmailRef.current);
  handleInitialFetch(currentEmailRef.current);
});

socket.on('disconnect', (reason) => {
  console.warn('Socket disconnected:', reason);
  enterReconnectingState();
});

socket.on('connect_error', (err) => {
  console.error('Socket connection error:', err);
  enterReconnectingState();
});

socket.on('server-pong', () => {
  markConnected();
});
```

Tambahkan heartbeat dan fallback polling:

```js
heartbeatIntervalRef.current = window.setInterval(() => {
  if (socket.connected) {
    socket.emit('client-ping', { sentAt: Date.now() });
  } else {
    enterReconnectingState();
  }
}, 25000);
```

```js
useEffect(() => {
  window.clearInterval(fallbackPollIntervalRef.current);

  if (connectionStatus === CONNECTION_STATUS.CONNECTED) {
    return undefined;
  }

  fallbackPollIntervalRef.current = window.setInterval(() => {
    handleInitialFetch(currentEmailRef.current);
  }, 10000);

  return () => window.clearInterval(fallbackPollIntervalRef.current);
}, [connectionStatus, handleInitialFetch]);
```

Ubah `Header` agar menerima `connectionStatus` dan merender tiga warna/status.

**Step 3: Run verification**

Run: `npm run build`
Expected: PASS

**Step 4: Manual verification**

1. Buka aplikasi dan pastikan header menunjukkan `Connected`.
2. Matikan backend sementara atau restart service.
3. Pastikan status berubah ke `Reconnecting`, bukan langsung `Offline`.
4. Setelah 15 detik tanpa koneksi, pastikan status berubah ke `Offline`.
5. Saat backend kembali, pastikan status kembali `Connected` dan inbox sinkron lagi.

**Step 5: Commit**

```bash
git add src/App.jsx src/components/Header.jsx
git commit -m "feat: improve frontend connection recovery"
```

### Task 3: Tambahkan heartbeat dan logging disconnect reason di backend

**Files:**
- Modify: `backend/server.js`

**Step 1: Write the failing test**

Tidak ada harness socket integration test di repo. Perubahan backend dijaga tetap kecil dan diverifikasi melalui lint serta uji manual koneksi.

**Step 2: Write minimal implementation**

Tambahkan handler berikut dalam `io.on('connection')`:

```js
socket.on('client-ping', (payload = {}) => {
  socket.emit('server-pong', {
    receivedAt: Date.now(),
    sentAt: payload.sentAt || null
  });
});
```

Perbarui log disconnect:

```js
socket.on('disconnect', (reason) => {
  console.log(`🔌 Client disconnected: ${socket.id} (${reason})`);
  // cleanup existing room tracking
});
```

**Step 3: Run verification**

Run: `npm run lint`
Workdir: `backend`
Expected: PASS

**Step 4: Manual verification**

1. Jalankan backend.
2. Buka frontend.
3. Cek log backend untuk koneksi, ping, dan disconnect reason.

**Step 5: Commit**

```bash
git add backend/server.js
git commit -m "feat: add socket heartbeat handling"
```

### Task 4: Verifikasi akhir dan sinkronisasi dokumentasi minimum

**Files:**
- Modify: `docs/plans/2026-03-08-connection-stability-design.md` (hanya jika implementasi menyimpang)

**Step 1: Run frontend tests**

Run: `node --test src/lib/connectionStatus.test.js`
Expected: PASS

**Step 2: Run frontend lint and build**

Run: `npm run lint`
Expected: PASS

Run: `npm run build`
Expected: PASS

**Step 3: Run backend lint**

Run: `npm run lint`
Workdir: `backend`
Expected: PASS

**Step 4: Inspect final diff**

Run: `git diff --stat HEAD~3..HEAD`
Expected: hanya file yang relevan terhadap stabilisasi koneksi.

**Step 5: Commit**

```bash
git add .
git commit -m "chore: finalize connection stability improvements"
```

Plan complete and saved to `docs/plans/2026-03-08-connection-stability.md`. Dua opsi eksekusi:

1. `Subagent-Driven (sesi ini)` - saya eksekusi langsung task demi task di sesi ini
2. `Parallel Session (terpisah)` - buka sesi lain khusus eksekusi plan

Dengan asumsi Anda ingin lanjut sekarang, saya akan pakai pendekatan `Subagent-Driven (sesi ini)` dan mulai implementasi langsung.

