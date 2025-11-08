# 📧 HANDYHOST EMAIL SETUP GUIDE
## ⚠️ NOT RECOMMENDED FOR CURSOR!

**This is for educational purposes only!**

---

## ⚠️ WARNING

```
HandyHost shared hosting email TIDAK RECOMMENDED untuk:
❌ Cursor signup
❌ Professional email service
❌ Building reputation
❌ Learning email servers

HandyHost HANYA BAIK untuk:
✅ Basic website hosting
✅ Simple website contact forms
✅ Testing purposes

Untuk Cursor signup, use:
✅ Gmail aliasing (fadhlirajwaarahmana+cursor@gmail.com)
✅ Azure VPS + Mail-in-a-Box
✅ Zoho/Yandex Mail

This guide is ONLY if you want to test HandyHost email features!
```

---

## 📋 SETUP HANDYHOST EMAIL (EDUCATIONAL)

### **STEP 1: Add Custom Domain (CRITICAL!)**

```
Current: u193042.test-handyhost.ru ❌
Needed: fadhlirajwaa.my.id ✅

1. HandyHost Panel → Domain surat (Email domains)

2. Click: "Membuat domain email baru"

3. In the "Nama*" field:
   Enter: fadhlirajwaa.my.id
   
4. Alamat IP: 109.95.210.216 (auto-selected)

5. Tindakan default: Kesalahan balasan

6. Click options:
   □ Abaikan dan jatuhkan (optional)
   □ Mengalihkan ke alamat email (optional)
   ☑ Mengalihkan ke domain (if needed)

7. DKIM/DMARC (optional for testing):
   □ Mengaktifkan DKIM untuk domain
   □ Mengaktifkan DMARC untuk domain

8. Click: "Baiklah" (OK)

⚠️ IF ERROR: HandyHost might not allow custom domains on free plan!
Check their documentation or support!
```

---

### **STEP 2: Configure DNS in Cloudflare**

**⚠️ This will BREAK your temp mail app!**

```
Cloudflare → fadhlirajwaa.my.id → DNS

DELETE existing MX records:
❌ MX @ → mx.sendgrid.net

ADD HandyHost MX record:
Type: MX
Name: @
Mail server: u193042.test-handyhost.ru
Priority: 10
Proxy: DNS only ☁️
TTL: Auto
→ Save

OR (if custom domain added in HandyHost):
Type: MX
Name: @
Mail server: mail.fadhlirajwaa.my.id
Priority: 10

Check HandyHost docs for correct MX record!
```

---

### **STEP 3: Create Email Account**

```
1. HandyHost Panel → Surat → Kotak surat

2. Click: "Create mailbox" (blue button)

3. Tambahkan kotak surat form:

   Nama*: cursor
   
   Domain: fadhlirajwaa.my.id
   (Or u193042.test-handyhost.ru if custom domain failed)
   
   Alias: (leave empty or add aliases)
   
   Kata sandi*: [Generate strong password]
   Save this password!
   
   Konfirmasi*: [Repeat password]
   
   Kirimkan salinannya ke: (optional)
   
   Ruang disk*: 2048 MB (or adjust)

4. Catatan section (optional):
   - Mengaktifkan Daftar Hijau (Greylisting)
   - Aktifkan SpamAssassin
   - Mengaktifkan pemindaian virus (if needed)
   - Mengaktifkan DKIM untuk domain
   - Mengaktifkan DMARC untuk domain

5. Click: "Baiklah" (OK)

Result: cursor@fadhlirajwaa.my.id created ✅
(Or cursor@u193042.test-handyhost.ru)
```

---

### **STEP 4: Access Webmail**

```
URL: Check HandyHost documentation for webmail URL
Likely: https://webmail.u193042.test-handyhost.ru
Or: https://lars.handyhost.ru/webmail

Login:
Email: cursor@fadhlirajwaa.my.id
Password: [your password]

If webmail works: ✅ Email account ready
```

---

### **STEP 5: Test Email**

```
1. Send test from Gmail to: cursor@fadhlirajwaa.my.id

2. Check webmail inbox

3. If received: ✅ Receiving works

4. Send test from webmail to Gmail

5. If Gmail receives: ✅ Sending works

6. Check if in spam folder (likely YES ⚠️)
```

---

### **STEP 6: Try Cursor Signup (WILL LIKELY FAIL!)**

```
1. Go to: cursor.sh/sign-up

2. Enter: cursor@fadhlirajwaa.my.id

3. Check webmail for OTP

Expected result:
❌ Email rejected by Cursor (shared hosting)
❌ Or OTP never arrives
❌ Or signup blocked

Success probability: 5-10% ❌

If it fails (expected):
→ Use Gmail aliasing instead!
→ fadhlirajwaarahmana+cursor@gmail.com
```

---

## ⚠️ EXPECTED ISSUES

### **Issue 1: Can't Add Custom Domain**

```
HandyHost free plan might not support custom domains!

Solution:
- Use their domain: cursor@u193042.test-handyhost.ru
- This will DEFINITELY not work for Cursor! ❌
- Upgrade to paid plan? (defeats "free" purpose)
```

---

### **Issue 2: Emails Go to Spam**

```
Shared hosting = poor reputation

Why:
- Shared IP with many users
- Some users might send spam
- IP probably blacklisted
- Russian server (low trust)

Solution:
- No real solution on shared hosting ❌
- Need dedicated IP (paid)
- Or use proper email service
```

---

### **Issue 3: Cursor Rejects Signup**

```
Most likely outcome! ❌

Cursor detection:
- Shared hosting IP pattern
- test-handyhost.ru domain
- Russian server location
- Low sender reputation

Solution:
- Can't fix on shared hosting
- Use Gmail aliasing instead!
```

---

## 💰 COST

```
Free Trial:
- Until: 2025-12-08
- After: Need to pay (check pricing)

From screenshot:
VIP-100 Plan: 1699 руб/mo (2 years)
= ~$18-20/month
= ~Rp 270,000-320,000/month

NOT worth it for email! ❌
Better alternatives exist!
```

---

## ✅ VERDICT

```
HandyHost Email Service:

For Cursor: ⭐ (1/5 stars)
❌ Won't work
❌ Shared hosting pattern
❌ Poor reputation

For Learning: ⭐ (1/5 stars)
❌ No real learning
❌ Just web panel clicking
❌ No server skills gained

For Cost: ⭐⭐ (2/5 stars)
✅ Free trial (temporary)
❌ Expensive after trial
❌ Not worth the price

For Professional Email: ⭐ (1/5 stars)
❌ Shared IP issues
❌ Russian server
❌ Limited control
❌ Poor deliverability

OVERALL: NOT RECOMMENDED! ❌
```

---

## 🎯 WHAT TO USE INSTEAD

### **For Cursor (NOW):**

```
Gmail Aliasing: fadhlirajwaarahmana+cursor@gmail.com
Time: 2 minutes
Success: 100% ✅
```

### **For Learning (WEEKEND):**

```
Azure VPS + Mail-in-a-Box (using your $100 credit)
Time: 4-5 hours
Success: High ✅
Learning: Excellent ✅
```

### **For Professional Email (ALTERNATIVE):**

```
Zoho/Yandex Mail (free, 5 users)
Time: 30 minutes
Success: High ✅
```

---

## 📝 HANDYHOST BETTER USES

### **What to use HandyHost for:**

```
✅ Host your temp mail app
   - Deploy React frontend
   - PHP backend alternative
   - MySQL for testing

✅ Portfolio website
   - Showcase projects
   - Personal blog
   - Resume site

✅ WordPress testing
   - Learn WordPress
   - Theme development
   - Plugin testing

✅ PHP/MySQL learning
   - Database projects
   - Web development
   - CRUD applications

DON'T use for:
❌ Email service
❌ Professional email
❌ Cursor signup
```

---

**BOTTOM LINE:**

```
HandyHost is SHARED HOSTING for WEBSITES!
NOT for email services!

For email, use proper solutions:
- Gmail (immediate)
- Azure VPS (learning)
- Zoho/Yandex (professional)

Keep HandyHost for website hosting! ✅
```

---

**Created by: Jarvis for Tuan Fadhli**  
**Date: 8 November 2025**  
**Purpose: Educational - NOT recommended for actual use!**
