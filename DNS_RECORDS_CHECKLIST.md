# DNS RECORDS CHECKLIST - fadhlirajwaa.my.id

## YANG HARUS ADA DI DOMAINESIA DNS MANAGEMENT:

### 1. CNAME Records (untuk DKIM - WAJIB!)

```
Type: CNAME
Hostname: em6519.mail
Value: u52573218.wl219.sendgrid.net
TTL: 3600
```

```
Type: CNAME
Hostname: s1._domainkey.mail
Value: s1.domainkey.u52573218.wl219.sendgrid.net
TTL: 3600
```

```
Type: CNAME
Hostname: s2._domainkey.mail
Value: s2.domainkey.u52573218.wl219.sendgrid.net
TTL: 3600
```

### 2. TXT Record (DMARC - Sudah OK ✅)

```
Type: TXT
Hostname: _dmarc.mail
Value: v=DMARC1; p=quarantine; rua=mailto:abuse@my.id;
TTL: 3600
```

### 3. MX Record (untuk Receive - Sudah OK ✅)

```
Type: MX
Hostname: mail
Priority: 10
Value: mx.sendgrid.net
TTL: 3600
```

---

## CARA CEK DI DOMAINESIA:

1. Login: https://www.domainesia.com/clientarea.php
2. Services → My Services
3. Pilih domain: fadhlirajwaa.my.id
4. Manage Domain → DNS Management
5. **CEK APAKAH 3 CNAME ADA?**

---

## KEMUNGKINAN MASALAH:

### Masalah 1: CNAME Belum Ditambahkan
**Solusi:** Tambahkan 3 CNAME records di atas

### Masalah 2: Hostname Salah Format
**Contoh Salah:**
```
❌ em6519.mail.fadhlirajwaa.my.id (terlalu panjang)
✅ em6519.mail (benar - tanpa domain)
```

### Masalah 3: Value Salah
**Pastikan Value PERSIS seperti yang diberikan SendGrid!**
- Copy-paste langsung dari SendGrid
- Jangan ada spasi di awal/akhir
- Jangan ada typo

### Masalah 4: DNS Belum Propagate
**Solusi:** Tunggu 15 menit - 48 jam

---

## AFTER FIX:

Setelah tambahkan/fix CNAME records:
1. Tunggu 15-30 menit
2. Kembali ke SendGrid → Sender Authentication
3. Klik **"Verify DNS Settings"**
4. Harus berubah jadi ✅ Verified
5. Baru bisa terima email!
